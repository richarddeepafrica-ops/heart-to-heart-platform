import { AdminNav } from "@/components/AdminNav";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="adminApp">
      <aside className="adminSidebar">
        <a className="workspaceMark" href="/admin" aria-label="Heart to Heart Foundation admin home">
          <img src="/assets/heart-to-heart-logo.svg" alt="Heart to Heart Foundation" />
          <span>Foundation operations</span>
        </a>
        <AdminNav />
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
