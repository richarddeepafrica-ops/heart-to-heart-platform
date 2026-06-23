import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";
import { ensureDefaultEventTicketPackages, getEventTicketPackages } from "@/lib/event-ticket-data";

export type AdminEventRecord = {
  id: string;
  slug: string;
  title: string;
  dateLabel: string;
  venue: string;
  registrationCount: number;
  checkedInCount: number;
  revenue: number;
  status: string;
};

export type AdminRegistrationRecord = {
  id: string;
  eventTitle: string;
  donorName: string;
  donorContact: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  checkedInAt: Date | null;
  createdAt: Date;
};

export type AdminEventPackageRecord = {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  color: string;
  showInShop: boolean;
  sold: number;
  revenue: number;
  status: string;
};

export type EventDashboard = {
  events: AdminEventRecord[];
  packages: AdminEventPackageRecord[];
  registrations: AdminRegistrationRecord[];
  featuredEvent?: AdminEventRecord;
  totalRevenue: number;
  totalRegistrations: number;
  checkedInCount: number;
};

const previewEvents: AdminEventRecord[] = [
  {
    id: "preview-heart-run",
    slug: "heart-run",
    title: "Heart Run / Walk",
    dateLabel: "Mar 28, 2026",
    venue: "Nairobi",
    registrationCount: 684,
    checkedInCount: 0,
    revenue: 1560000,
    status: "Completed"
  },
  {
    id: "preview-goat-derby",
    slug: "goat-derby",
    title: "Goat Derby",
    dateLabel: "Aug 15, 2026",
    venue: "Nairobi",
    registrationCount: 0,
    checkedInCount: 0,
    revenue: 0,
    status: "Upcoming"
  }
];

const previewRegistrations: AdminRegistrationRecord[] = [
  {
    id: "preview-registration",
    eventTitle: "Heart Run / Walk",
    donorName: "Mary A.",
    donorContact: "+254700000001",
    ticketType: "Family",
    quantity: 1,
    totalAmount: 5000,
    paymentStatus: "CONFIRMED",
    checkedInAt: null,
    createdAt: new Date()
  }
];

function eventStatus(startsAt: Date) {
  const today = new Date();
  if (startsAt.toDateString() === today.toDateString()) return "Live today";
  if (startsAt < today) return "Completed";
  return "Upcoming";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-KE", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function summarize(
  events: AdminEventRecord[],
  registrations: AdminRegistrationRecord[],
  packages: AdminEventPackageRecord[]
): EventDashboard {
  return {
    events,
    registrations,
    packages,
    featuredEvent: events[0],
    totalRevenue: events.reduce((total, event) => total + event.revenue, 0),
    totalRegistrations: events.reduce((total, event) => total + event.registrationCount, 0),
    checkedInCount: events.reduce((total, event) => total + event.checkedInCount, 0)
  };
}

async function packageRows(registrations: AdminRegistrationRecord[]) {
  const tickets = await getEventTicketPackages({ admin: true });
  return tickets.map((ticket) => {
    const matchingRegistrations = registrations.filter((registration) => registration.ticketType === ticket.name);
    const sold = matchingRegistrations.reduce((total, registration) => total + registration.quantity, 0);
    const revenue = matchingRegistrations.reduce((total, registration) => total + registration.totalAmount, 0);

    return {
      id: ticket.id,
      eventId: ticket.eventId,
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
      capacity: ticket.capacity,
      color: ticket.color,
      showInShop: ticket.showInShop,
      sold,
      revenue,
      status: sold >= ticket.capacity && ticket.capacity > 0 ? "Sold out" : ticket.status === "ACTIVE" ? "Published" : ticket.status
    };
  });
}

export async function getEventDashboard(): Promise<EventDashboard> {
  if (!hasDatabaseUrl()) {
    return summarize(previewEvents, previewRegistrations, await packageRows(previewRegistrations));
  }

  try {
    await ensureDefaultEventTicketPackages();
    const [events, registrations] = await Promise.all([
      db.event.findMany({
        orderBy: { startsAt: "asc" },
        include: {
          registrations: true,
          donations: true
        }
      }),
      db.eventRegistration.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          donor: true,
          donation: true,
          event: true
        }
      })
    ]);

    const registrationRecords = registrations.map((registration) => ({
      id: registration.id,
      eventTitle: registration.event.title,
      donorName: registration.donor?.isAnonymous ? "Anonymous donor" : registration.donor?.name || "Unknown donor",
      donorContact: registration.donor?.phone || registration.donor?.email || "No contact",
      ticketType: registration.ticketType,
      quantity: registration.quantity,
      totalAmount: registration.totalAmount,
      paymentStatus: registration.donation?.status || "PENDING",
      checkedInAt: registration.checkedInAt,
      createdAt: registration.createdAt
    }));

    const eventRecords = events.map((event) => {
      const revenueFromRegistrations = event.registrations.reduce((total, registration) => total + registration.totalAmount, 0);
      const eventDonationRevenue = event.donations
        .filter((donation) => donation.destinationType !== "event-registration")
        .reduce((total, donation) => total + donation.amount, 0);

      return {
        id: event.id,
        slug: event.slug,
        title: event.title,
        dateLabel: formatDate(event.startsAt),
        venue: event.venue || "Venue TBC",
        registrationCount: event.registrations.reduce((total, registration) => total + registration.quantity, 0),
        checkedInCount: event.registrations.filter((registration) => registration.checkedInAt).length,
        revenue: revenueFromRegistrations + eventDonationRevenue,
        status: eventStatus(event.startsAt)
      };
    });

    return summarize(eventRecords, registrationRecords, await packageRows(registrationRecords));
  } catch (error) {
    return summarize(previewEvents, previewRegistrations, await packageRows(previewRegistrations));
  }
}
