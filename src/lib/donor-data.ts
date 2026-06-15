import { hasDatabaseUrl } from "@/lib/api";
import { formatKes } from "@/lib/content";
import { db } from "@/lib/db";

export type DonorTimelineItem = {
  title: string;
  meta: string;
};

export type AdminDonorRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalGiving: number;
  giftCount: number;
  eventCount: number;
  sponsorshipCount: number;
  status: string;
  lastActivity: Date;
  timeline: DonorTimelineItem[];
};

export type DonorSegment = {
  name: string;
  count: string;
  note: string;
};

export type DonorDashboard = {
  segments: DonorSegment[];
  donors: AdminDonorRecord[];
  selectedDonor?: AdminDonorRecord;
};

const previewDonors: AdminDonorRecord[] = [
  {
    id: "preview-mary",
    name: "Mary A.",
    email: "mary@example.com",
    phone: "+254700000001",
    totalGiving: 85000,
    giftCount: 6,
    eventCount: 2,
    sponsorshipCount: 1,
    status: "High engagement",
    lastActivity: new Date(),
    timeline: [
      { title: "KES 10,000 donation", meta: "Fund 20 Heart Surgeries - today" },
      { title: "Heart Run registration", meta: "Family ticket - March 2026" },
      { title: "Opened sponsorship update", meta: "Joy Wambui - email engagement" }
    ]
  },
  {
    id: "preview-corporate",
    name: "Corporate Team Alpha",
    email: "csr@example.com",
    phone: "+254700000002",
    totalGiving: 250000,
    giftCount: 1,
    eventCount: 0,
    sponsorshipCount: 0,
    status: "Partner lead",
    lastActivity: new Date(),
    timeline: [
      { title: "KES 250,000 pledge", meta: "CSR Surgery Fund - pending reconciliation" }
    ]
  }
];

function daysSince(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / 86_400_000);
}

function donorStatus(donor: Pick<AdminDonorRecord, "giftCount" | "eventCount" | "totalGiving" | "lastActivity">) {
  if (donor.totalGiving >= 100000) return "Major donor";
  if (donor.giftCount >= 3 || donor.eventCount > 0) return "High engagement";
  if (daysSince(donor.lastActivity) > 180) return "Reactivation";
  return "Active";
}

function summarize(donors: AdminDonorRecord[]): DonorDashboard {
  const monthlyCount = donors.filter((donor) =>
    donor.timeline.some((item) => item.meta.toLowerCase().includes("monthly"))
  ).length;
  const eventCount = donors.filter((donor) => donor.eventCount > 0).length;
  const corporateCount = donors.filter((donor) => donor.status === "Major donor" || donor.name.toLowerCase().includes("team")).length;
  const lapsedCount = donors.filter((donor) => daysSince(donor.lastActivity) > 180).length;

  return {
    donors,
    selectedDonor: donors[0],
    segments: [
      { name: "All donors", count: String(donors.length), note: `${donors.length} in CRM` },
      { name: "Monthly donors", count: String(monthlyCount), note: "recurring gifts" },
      { name: "Event contacts", count: String(eventCount), note: "registrations or event gifts" },
      { name: "Major donors", count: String(corporateCount), note: "large gifts or partner leads" },
      { name: "Lapsed donors", count: String(lapsedCount), note: "no activity in 180 days" }
    ]
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-KE", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export async function getDonorDashboard(): Promise<DonorDashboard> {
  if (!hasDatabaseUrl()) return summarize(previewDonors);

  try {
    const donors = await db.donor.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: {
        donations: {
          orderBy: { createdAt: "desc" },
          include: {
            beneficiary: true,
            campaign: true,
            event: true
          }
        },
        registrations: {
          orderBy: { createdAt: "desc" },
          include: { event: true }
        }
      }
    });

    const records = donors.map((donor) => {
      const totalGiving = donor.donations.reduce((total, donation) => total + donation.amount, 0);
      const eventCount = donor.registrations.length + donor.donations.filter((donation) => donation.eventId).length;
      const sponsorshipCount = donor.donations.filter((donation) => donation.beneficiaryId).length;
      const latestDonationDate = donor.donations[0]?.createdAt;
      const latestRegistrationDate = donor.registrations[0]?.createdAt;
      const lastActivity =
        latestDonationDate && latestRegistrationDate
          ? latestDonationDate > latestRegistrationDate ? latestDonationDate : latestRegistrationDate
          : latestDonationDate || latestRegistrationDate || donor.updatedAt;
      const timeline: DonorTimelineItem[] = [
        ...donor.donations.slice(0, 3).map((donation) => ({
          title: `${formatKes(donation.amount)} ${donation.frequency === "monthly" ? "monthly gift" : "donation"}`,
          meta: `${donation.destinationLabel || donation.beneficiary?.publicName || donation.event?.title || donation.campaign?.title || "General giving"} - ${formatDate(donation.createdAt)}`
        })),
        ...donor.registrations.slice(0, 2).map((registration) => ({
          title: `${registration.ticketType} registration`,
          meta: `${registration.event.title} - ${formatDate(registration.createdAt)}`
        }))
      ].sort((a, b) => a.meta.localeCompare(b.meta)).slice(0, 5);

      const record: AdminDonorRecord = {
        id: donor.id,
        name: donor.isAnonymous ? "Anonymous donor" : donor.name,
        email: donor.email || "No email",
        phone: donor.phone || "No phone",
        totalGiving,
        giftCount: donor.donations.length,
        eventCount,
        sponsorshipCount,
        status: "Active",
        lastActivity,
        timeline
      };

      return { ...record, status: donorStatus(record) };
    });

    return summarize(records);
  } catch (error) {
    return summarize(previewDonors);
  }
}
