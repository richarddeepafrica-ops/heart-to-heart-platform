"use client";

import { usePathname } from "next/navigation";

const navGroups = [
  {
    label: "Overview",
    items: [
      ["Dashboard", "/admin"],
      ["System", "/admin/system"]
    ]
  },
  {
    label: "Fundraising",
    items: [
      ["Donations", "/admin/donations"],
      ["Finance", "/admin/finance"],
      ["Campaigns", "/admin/campaigns"],
      ["Donors", "/admin/donors"],
      ["Reports", "/admin/reports"]
    ]
  },
  {
    label: "Programmes",
    items: [
      ["Applications", "/admin/applications"],
      ["Beneficiaries", "/admin/beneficiaries"],
      ["Partners", "/admin/partners"]
    ]
  },
  {
    label: "Events",
    items: [
      ["Events", "/admin/events"]
    ]
  },
  {
    label: "Content",
    items: [
      ["Content studio", "/admin/content"],
      ["Marketing", "/admin/marketing"]
    ]
  },
  {
    label: "Administration",
    items: [
      ["Staff", "/admin/staff"]
    ]
  }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation">
      {navGroups.map((group) => (
        <section className="adminNavGroup" key={group.label}>
          <h2>{group.label}</h2>
          {group.items.map(([label, href], index) => {
            const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <a className={isActive ? "active" : ""} href={href} key={href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {label}
              </a>
            );
          })}
        </section>
      ))}
    </nav>
  );
}
