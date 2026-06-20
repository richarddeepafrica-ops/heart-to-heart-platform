import { cookies } from "next/headers";
import { AdminNav } from "@/components/AdminNav";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { adminSessionCookie, verifyAdminSession } from "@/lib/auth";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(adminSessionCookie)?.value);

  return (
    <main className="adminApp">
      <aside className="adminSidebar">
        <a className="workspaceMark" href="/admin" aria-label="Heart to Heart Foundation admin home">
          <img src="/assets/heart-to-heart-logo.svg" alt="Heart to Heart Foundation" />
          <span>Foundation operations</span>
        </a>
        <AdminNav role={session?.role} />
        <div className="sidebarCard">
          <span>Workspace</span>
          <strong>Live admin</strong>
          <small>Campaigns, gifts, events, finance, and reports are connected to the database.</small>
        </div>
        <AdminLogoutButton />
      </aside>
      <section className="adminWorkspace">{children}</section>
    </main>
  );
}
