import { StaffMemberForm } from "@/components/StaffMemberForm";
import { getStaffDashboard, staffRoleProfiles } from "@/lib/staff-data";

export default async function StaffAdminPage() {
  const dashboard = await getStaffDashboard();

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Staff management</p>
          <h1>People, roles, and access</h1>
        </div>
        <div className="adminActions">
          <a href="/admin/system">Audit and system</a>
          <a className="primaryAction" href="#add-staff">Add staff</a>
        </div>
      </header>

      <section className="adminKpis">
        {[
          ["Staff accounts", String(dashboard.totalCount), "admin users"],
          ["Super admins", String(dashboard.superAdminCount), "full access"],
          ["Finance", String(dashboard.financeCount), "receipts and reports"],
          ["Operations", String(dashboard.operationsCount), "events, programmes, fundraising"],
          ["Content", String(dashboard.contentCount), "publishing team"]
        ].map(([label, value, meta]) => (
          <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span8">
          <div className="panelHeader">
            <div><p className="eyebrow">Directory</p><h2>Admin staff</h2></div>
            <span className="status success">Role mapped</span>
          </div>
          <div className="simpleTable staffTable">
            {dashboard.records.map((staff) => (
              <div key={staff.id}>
                <strong>{staff.name}</strong>
                <span>{staff.email}</span>
                <span>{staff.department}</span>
                <span>{staff.role.replace(/_/g, " ")}</span>
                <em>{staff.status}{staff.passwordResetRequired ? " / Reset required" : ""}</em>
              </div>
            ))}
          </div>
        </article>

        <article className="appPanel span4" id="add-staff">
          <div className="panelHeader">
            <div><p className="eyebrow">Access</p><h2>Add staff member</h2></div>
          </div>
          <StaffMemberForm />
        </article>

        <article className="appPanel span12">
          <div className="panelHeader">
            <div><p className="eyebrow">Permissions</p><h2>Role access matrix</h2></div>
          </div>
          <div className="staffRoleGrid">
            {Object.entries(staffRoleProfiles).map(([role, profile]) => (
              <article key={role}>
                <span>{profile.department}</span>
                <strong>{role.replace(/_/g, " ")}</strong>
                <small>{profile.access.join(" / ")}</small>
              </article>
            ))}
          </div>
        </article>

        <article className="appPanel span12">
          <div className="panelHeader">
            <div><p className="eyebrow">Production readiness</p><h2>Staff controls still to harden</h2></div>
          </div>
          <div className="eventPackageRules">
            <span><strong>Enforcement</strong>Admin routes, sidebar items, and protected API actions now use the staff role map before launch.<em>Active</em></span>
            <span><strong>Lifecycle</strong>Next migration adds active/inactive status, password reset requirement, and last-login tracking.<em>Migration ready</em></span>
            <span><strong>Accountability</strong>Finance, content, event, staff, and beneficiary admin actions continue writing audit logs.<em>Ongoing</em></span>
          </div>
        </article>
      </section>
    </>
  );
}
