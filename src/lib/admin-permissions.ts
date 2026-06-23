export type AdminRole =
  | "SUPER_ADMIN"
  | "FUNDRAISING_MANAGER"
  | "EVENTS_MANAGER"
  | "MARKETING_MANAGER"
  | "FINANCE_OFFICER"
  | "CONTENT_EDITOR"
  | "VOLUNTEER_COORDINATOR";

export const adminRoles: AdminRole[] = [
  "SUPER_ADMIN",
  "FUNDRAISING_MANAGER",
  "EVENTS_MANAGER",
  "MARKETING_MANAGER",
  "FINANCE_OFFICER",
  "CONTENT_EDITOR",
  "VOLUNTEER_COORDINATOR"
];

export type AdminNavItem = {
  label: string;
  href: string;
  roles: AdminRole[];
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

const allRoles = adminRoles;
const fundraisingRoles: AdminRole[] = ["SUPER_ADMIN", "FUNDRAISING_MANAGER", "FINANCE_OFFICER"];
const programmesRoles: AdminRole[] = ["SUPER_ADMIN", "VOLUNTEER_COORDINATOR"];
const contentRoles: AdminRole[] = ["SUPER_ADMIN", "CONTENT_EDITOR", "MARKETING_MANAGER"];

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", roles: allRoles },
      { label: "System", href: "/admin/system", roles: ["SUPER_ADMIN"] }
    ]
  },
  {
    label: "Fundraising",
    items: [
      { label: "Donations", href: "/admin/donations", roles: fundraisingRoles },
      { label: "Finance", href: "/admin/finance", roles: ["SUPER_ADMIN", "FINANCE_OFFICER"] },
      { label: "Campaigns", href: "/admin/campaigns", roles: ["SUPER_ADMIN", "FUNDRAISING_MANAGER"] },
      { label: "Shop", href: "/admin/merchandise", roles: ["SUPER_ADMIN", "FUNDRAISING_MANAGER"] },
      { label: "Donors", href: "/admin/donors", roles: fundraisingRoles },
      { label: "Reports", href: "/admin/reports", roles: ["SUPER_ADMIN", "FUNDRAISING_MANAGER", "FINANCE_OFFICER"] }
    ]
  },
  {
    label: "Programmes",
    items: [
      { label: "Applications", href: "/admin/applications", roles: programmesRoles },
      { label: "Beneficiaries", href: "/admin/beneficiaries", roles: programmesRoles },
      { label: "Partners", href: "/admin/partners", roles: ["SUPER_ADMIN", "FUNDRAISING_MANAGER", "VOLUNTEER_COORDINATOR"] }
    ]
  },
  {
    label: "Events",
    items: [
      { label: "Events", href: "/admin/events", roles: ["SUPER_ADMIN", "EVENTS_MANAGER"] }
    ]
  },
  {
    label: "Content",
    items: [
      { label: "Content studio", href: "/admin/content", roles: contentRoles },
      { label: "Marketing", href: "/admin/marketing", roles: ["SUPER_ADMIN", "MARKETING_MANAGER"] }
    ]
  },
  {
    label: "Administration",
    items: [
      { label: "Email queue", href: "/admin/emails", roles: ["SUPER_ADMIN", "CONTENT_EDITOR", "MARKETING_MANAGER", "EVENTS_MANAGER"] },
      { label: "Knowledge Base", href: "/admin/help", roles: allRoles },
      { label: "Staff", href: "/admin/staff", roles: ["SUPER_ADMIN"] }
    ]
  }
];

export function normalizeAdminRole(role?: string | null): AdminRole {
  return adminRoles.includes(role as AdminRole) ? (role as AdminRole) : "SUPER_ADMIN";
}

export function canAccessAdminPath(role: string | null | undefined, pathname: string) {
  const normalizedRole = normalizeAdminRole(role);
  if (normalizedRole === "SUPER_ADMIN") return true;
  if (pathname === "/admin") return true;

  const items = adminNavGroups.flatMap((group) => group.items);
  const item = items
    .filter((entry) => entry.href !== "/admin")
    .sort((a, b) => b.href.length - a.href.length)
    .find((entry) => pathname === entry.href || pathname.startsWith(`${entry.href}/`));

  return item ? item.roles.includes(normalizedRole) : false;
}

export function canAccessProtectedApi(role: string | null | undefined, pathname: string, method: string) {
  const normalizedRole = normalizeAdminRole(role);
  if (normalizedRole === "SUPER_ADMIN") return true;

  const isMutation = method !== "GET";
  if (pathname.startsWith("/api/admin/staff") || pathname.startsWith("/api/admin/partners/export")) return false;
  if (pathname.startsWith("/api/admin/donations") || pathname.startsWith("/api/finance") || pathname.startsWith("/api/reports")) {
    return ["FINANCE_OFFICER", "FUNDRAISING_MANAGER"].includes(normalizedRole);
  }
  if (pathname.startsWith("/api/admin/merchandise")) {
    return normalizedRole === "FUNDRAISING_MANAGER";
  }
  if (pathname.startsWith("/api/admin/blogs") || pathname.startsWith("/api/admin/galleries") || pathname.startsWith("/api/marketing-campaigns")) {
    return ["CONTENT_EDITOR", "MARKETING_MANAGER"].includes(normalizedRole);
  }
  if (pathname.startsWith("/api/admin/emails")) {
    return ["CONTENT_EDITOR", "MARKETING_MANAGER", "EVENTS_MANAGER"].includes(normalizedRole);
  }
  if (pathname.startsWith("/api/admin/events") || pathname.startsWith("/api/admin/complimentary-tickets") || pathname.startsWith("/api/event-registrations")) {
    return normalizedRole === "EVENTS_MANAGER";
  }
  if (pathname.startsWith("/api/admin/applications") || pathname.startsWith("/api/beneficiaries")) {
    return normalizedRole === "VOLUNTEER_COORDINATOR";
  }
  if (pathname.startsWith("/api/campaigns")) {
    return !isMutation || normalizedRole === "FUNDRAISING_MANAGER";
  }
  return false;
}

export function filterAdminNavGroups(role: string | null | undefined) {
  const normalizedRole = normalizeAdminRole(role);
  return adminNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(normalizedRole))
    }))
    .filter((group) => group.items.length > 0);
}
