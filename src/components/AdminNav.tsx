"use client";

import { usePathname } from "next/navigation";

const navItems = [
  ["Overview", "/admin"],
  ["Donors", "/admin/donors"],
  ["Donations", "/admin/donations"],
  ["Campaigns", "/admin/campaigns"],
  ["Beneficiaries", "/admin/beneficiaries"],
  ["Applications", "/admin/applications"],
  ["Events", "/admin/events"],
  ["Finance", "/admin/finance"],
  ["Marketing", "/admin/marketing"],
  ["Partners", "/admin/partners"],
  ["Content", "/admin/content"],
  ["Reports", "/admin/reports"],
  ["System", "/admin/system"]
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation">
      {navItems.map(([label, href], index) => {
        const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <a className={isActive ? "active" : ""} href={href} key={href}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
          </a>
        );
      })}
    </nav>
  );
}
