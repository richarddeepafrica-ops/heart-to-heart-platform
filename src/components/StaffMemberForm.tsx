"use client";

import { useState, type FormEvent } from "react";

const roles = [
  ["SUPER_ADMIN", "Super Admin"],
  ["FINANCE_OFFICER", "Finance Officer"],
  ["FUNDRAISING_MANAGER", "Fundraising Manager"],
  ["EVENTS_MANAGER", "Events Manager"],
  ["CONTENT_EDITOR", "Content Editor"],
  ["MARKETING_MANAGER", "Marketing Manager"],
  ["VOLUNTEER_COORDINATOR", "Volunteer Coordinator"]
];

type SubmitState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function StaffMemberForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "saving" });
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        role: String(form.get("role") || ""),
        password: String(form.get("password") || "")
      })
    });
    const payload = await response.json().catch(() => null) as { ok?: boolean; message?: string; staff?: { name?: string; email?: string } } | null;

    if (!response.ok || !payload?.ok) {
      setState({ status: "error", message: payload?.message || "Staff member could not be saved." });
      return;
    }

    event.currentTarget.reset();
    setState({ status: "success", message: `${payload.staff?.name || payload.staff?.email || "Staff member"} saved.` });
  }

  return (
    <form className="staffMemberForm" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" placeholder="Staff member name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="name@hearttoheart.org" required />
      </label>
      <label>
        Role
        <select name="role" defaultValue="FINANCE_OFFICER">
          {roles.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </label>
      <label>
        Temporary password
        <input name="password" type="password" minLength={8} placeholder="Minimum 8 characters" required />
      </label>
      <div className="formSubmitRow">
        <button className="primaryAction" disabled={state.status === "saving"} type="submit">
          {state.status === "saving" ? "Saving..." : "Add staff member"}
        </button>
        {state.status === "success" ? <span className="formSuccess">{state.message}</span> : null}
        {state.status === "error" ? <span className="formError">{state.message}</span> : null}
      </div>
    </form>
  );
}
