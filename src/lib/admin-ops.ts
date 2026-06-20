import { getAdminSystemStatus, getRecentAuditLogs } from "@/lib/admin-system";
import { getApplicationDashboard } from "@/lib/application-data";
import { getAdminCampaigns } from "@/lib/campaign-data";
import { formatKes } from "@/lib/content";
import { getDonationDashboard } from "@/lib/donation-data";
import { getDonorDashboard } from "@/lib/donor-data";
import { getEventDashboard } from "@/lib/event-data";
import { getFinanceDashboard } from "@/lib/finance-data";
import { getPartnerDashboard } from "@/lib/partner-data";
import { getBlogPosts, getGalleryItems } from "@/lib/publishing-data";
import { getReportDashboard } from "@/lib/report-data";

export type AdminTask = {
  area: string;
  title: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
  href: string;
  action: string;
};

export type AdminQuickAction = {
  label: string;
  href: string;
  detail: string;
};

export type AdminNotification = {
  title: string;
  detail: string;
  href: string;
  tone: "success" | "warning" | "info";
};

export type AdminRoleCapability = {
  role: string;
  focus: string;
  access: string[];
};

export async function getAdminOperationsDashboard() {
  const [
    donations,
    finance,
    applications,
    campaigns,
    events,
    partners,
    donors,
    posts,
    galleries,
    report,
    system,
    auditLogs
  ] = await Promise.all([
    getDonationDashboard(),
    getFinanceDashboard(),
    getApplicationDashboard(),
    getAdminCampaigns(),
    getEventDashboard(),
    getPartnerDashboard(),
    getDonorDashboard(),
    getBlogPosts({ admin: true }),
    getGalleryItems({ admin: true }),
    getReportDashboard(),
    getAdminSystemStatus(),
    getRecentAuditLogs(6)
  ]);

  const draftPosts = posts.filter((post) => post.status !== "PUBLISHED").length;
  const draftGalleryItems = galleries.filter((item) => item.status !== "PUBLISHED").length;
  const lowCampaigns = campaigns.filter((campaign) => campaign.goal > 0 && campaign.raised / campaign.goal < 0.5);
  const newPartnerApplications = applications.partnerApplications.filter((application) => application.status === "NEW").length;
  const newChildApplications = applications.childApplications.filter((application) => application.status === "NEW").length;
  const systemBlockers = system.checks.filter((check) => check.status === "blocked").length;

  const tasks: AdminTask[] = [
    {
      area: "Finance",
      title: `${finance.queue.filter((record) => ["PENDING", "FAILED"].includes(record.donationStatus)).length} payments need review`,
      detail: `${finance.bankTransferCount} bank transfers and ${finance.failedCount} failed payments are in the queue.`,
      priority: finance.failedCount || finance.bankTransferCount ? "High" : "Medium",
      href: "/admin/finance",
      action: "Open finance queue"
    },
    {
      area: "Applications",
      title: `${newChildApplications + newPartnerApplications} new applications`,
      detail: `${newChildApplications} child care requests and ${newPartnerApplications} partner institution requests await triage.`,
      priority: newChildApplications ? "High" : "Medium",
      href: "/admin/applications",
      action: "Review intake"
    },
    {
      area: "Content",
      title: `${draftPosts + draftGalleryItems} draft items`,
      detail: `${draftPosts} blogs and ${draftGalleryItems} gallery items are not published yet.`,
      priority: draftPosts + draftGalleryItems ? "Medium" : "Low",
      href: "/admin/content",
      action: "Open studio"
    },
    {
      area: "Campaigns",
      title: `${lowCampaigns.length} campaigns below 50%`,
      detail: lowCampaigns.length ? lowCampaigns.map((campaign) => campaign.title).join(", ") : "All tracked campaigns are above the early-warning threshold.",
      priority: lowCampaigns.length ? "Medium" : "Low",
      href: "/admin/campaigns",
      action: "Manage appeals"
    },
    {
      area: "System",
      title: `${systemBlockers} launch blockers`,
      detail: systemBlockers ? "Resolve offline integrations before launch." : "Core system checks are ready for review.",
      priority: systemBlockers ? "High" : "Low",
      href: "/admin/system",
      action: "View status"
    }
  ];

  const notifications: AdminNotification[] = [
    finance.pendingReceipts
      ? { title: "Receipt approval needed", detail: `${finance.pendingReceipts} confirmed gifts still need receipt numbers.`, href: "/admin/finance", tone: "warning" }
      : { title: "Receipt queue clear", detail: "No confirmed gifts are waiting for receipts.", href: "/admin/finance", tone: "success" },
    applications.reviewCount
      ? { title: "Applications under review", detail: `${applications.reviewCount} records are waiting on documents or internal review.`, href: "/admin/applications", tone: "info" }
      : { title: "Application triage is light", detail: "No records are currently sitting in review.", href: "/admin/applications", tone: "success" },
    partners.openProposalCount
      ? { title: "Partner follow-up", detail: `${partners.openProposalCount} partner conversations are still open.`, href: "/admin/partners", tone: "warning" }
      : { title: "Partner pipeline stable", detail: "No urgent proposal follow-ups detected.", href: "/admin/partners", tone: "success" }
  ];

  const quickActions: AdminQuickAction[] = [
    { label: "Create campaign", href: "/admin/campaigns#campaign-builder", detail: "Draft, preview, and publish appeals." },
    { label: "Record offline gift", href: "/admin/donations#record-offline-gift", detail: "Cash, cheque, bank, or pledge entry." },
    { label: "Publish blog", href: "/admin/content#new-blog", detail: "Create and publish a foundation story." },
    { label: "Review child applications", href: "/admin/applications", detail: "Move applications through intake." },
    { label: "Export board report", href: "/api/reports/fundraising", detail: "Download fundraising CSV." },
    { label: "Check event registrations", href: "/admin/events", detail: "Review tickets, revenue, and check-ins." }
  ];

  const roleCapabilities: AdminRoleCapability[] = [
    { role: "Admin", focus: "System owner", access: ["All modules", "User roles", "Audit logs", "Publishing"] },
    { role: "Finance", focus: "Money movement", access: ["Donations", "Receipts", "Reconciliation", "Reports"] },
    { role: "Content", focus: "Public storytelling", access: ["Blogs", "Gallery", "Stories", "Preview"] },
    { role: "Events", focus: "Registrations", access: ["Events", "Packages", "Check-in", "Attendee export"] },
    { role: "Reviewer", focus: "Care intake", access: ["Applications", "Beneficiaries", "Consent", "Internal notes"] }
  ];

  return {
    kpis: [
      { label: "Confirmed raised", value: formatKes(report.confirmedRaised), meta: "board-ready total", href: "/admin/reports" },
      { label: "Pending finance", value: String(finance.queue.filter((record) => record.donationStatus === "PENDING").length), meta: "payments to clear", href: "/admin/finance" },
      { label: "New applications", value: String(applications.newCount), meta: "parents and institutions", href: "/admin/applications" },
      { label: "Event registrations", value: String(events.totalRegistrations), meta: formatKes(events.totalRevenue), href: "/admin/events" },
      { label: "CRM donors", value: String(donors.donors.length), meta: "relationship records", href: "/admin/donors" },
      { label: "Published content", value: String(posts.filter((post) => post.status === "PUBLISHED").length + galleries.filter((item) => item.status === "PUBLISHED").length), meta: "blogs and photos", href: "/admin/content" }
    ],
    tasks,
    quickActions,
    notifications,
    roleCapabilities,
    campaigns,
    system,
    auditLogs
  };
}
