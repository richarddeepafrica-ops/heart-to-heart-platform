import { AdminNav } from "@/components/AdminNav";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="adminApp">
      <aside className="adminSidebar">
        <a className="workspaceMark" href="/admin" aria-label="Heart to Heart Foundation admin home">
          <img src="/assets/heart-to-heart-logo.svg" alt="Heart to Heart Foundation" />
          <span>Foundation OS</span>
        </a>
        <AdminNav />
        <div className="sidebarCard">
          <span>Workspace</span>
          <strong>Admin preview</strong>
          <small>Each section now has its own dedicated route.</small>
        </div>
        <AdminLogoutButton />
      </aside>
      <section className="adminWorkspace">{children}</section>
    </main>
  );
}
