"use client";

import { useState } from "react";

export function AdminLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button className="sidebarLogout" disabled={isLoggingOut} onClick={logout} type="button">
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
