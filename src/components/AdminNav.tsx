"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { filterAdminNavGroups } from "@/lib/admin-permissions";

type AdminNavProps = {
  role?: string;
};

export function AdminNav({ role }: AdminNavProps) {
  const pathname = usePathname();
  const navGroups = useMemo(() => filterAdminNavGroups(role), [role]);
  const activeGroupLabel = useMemo(() => {
    return navGroups.find((group) => (
      group.items.some(({ href }) => (href === "/admin" ? pathname === href : pathname.startsWith(href)))
    ))?.label;
  }, [navGroups, pathname]);
  const [openGroups, setOpenGroups] = useState<string[]>(() => (
    Array.from(new Set(["Overview", activeGroupLabel].filter(Boolean) as string[]))
  ));

  useEffect(() => {
    if (!activeGroupLabel) return;
    setOpenGroups((current) => (
      current.includes(activeGroupLabel) ? current : [...current, activeGroupLabel]
    ));
  }, [activeGroupLabel]);

  function toggleGroup(label: string) {
    setOpenGroups((current) => (
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    ));
  }

  return (
    <nav aria-label="Admin navigation">
      {navGroups.map((group) => {
        const isOpen = openGroups.includes(group.label);

        return (
          <details className="adminNavGroup" key={group.label} open={isOpen}>
            <summary onClick={(event) => {
              event.preventDefault();
              toggleGroup(group.label);
            }}>
              <span>{group.label}</span>
            </summary>
            <div>
              {group.items.map(({ label, href }, index) => {
                const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);
                return (
                  <a className={isActive ? "active" : ""} href={href} key={href}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {label}
                  </a>
                );
              })}
            </div>
          </details>
        );
      })}
    </nav>
  );
}
