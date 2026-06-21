"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type AdminSessionResponse = {
  ok?: boolean;
};

function adminHrefForPath(pathname: string) {
  if (pathname.startsWith("/gallery/albums/")) {
    const album = pathname.split("/").filter(Boolean).at(-1) || "";
    return album ? `/admin/content/gallery/${album}` : "/admin/content";
  }

  if (pathname.startsWith("/gallery") || pathname.startsWith("/news")) return "/admin/content";
  if (pathname.startsWith("/events")) return "/admin/events";
  if (pathname.startsWith("/campaigns")) return "/admin/campaigns";
  if (pathname.startsWith("/sponsor") || pathname.startsWith("/impact")) return "/admin/beneficiaries";
  if (pathname.startsWith("/partners")) return "/admin/partners";
  if (pathname.startsWith("/donate")) return "/admin/donations";
  if (pathname.startsWith("/apply")) return "/admin/applications";
  return "/admin";
}

export function AdminReturnButton() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  const adminHref = useMemo(() => adminHrefForPath(pathname), [pathname]);
  const isPublicPreview = !pathname.startsWith("/admin") && pathname !== "/admin/login";

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const result = (await response.json().catch(() => null)) as AdminSessionResponse | null;
        if (isMounted) setIsAdmin(response.ok && Boolean(result?.ok));
      } catch {
        if (isMounted) setIsAdmin(false);
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAdmin || !isPublicPreview) return null;

  return (
    <a className="adminReturnButton" href={adminHref}>
      <span aria-hidden="true" />
      <strong>Admin</strong>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </a>
  );
}
