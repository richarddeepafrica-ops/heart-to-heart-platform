"use client";

import { FormEvent, useState } from "react";

type Props = {
  id: string;
  kind: "child-care" | "partner-institutions";
  initialStatus: string;
};

export function ApplicationStatusForm({ id, kind, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/admin/applications/${kind}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: String(form.get("status") || status),
          adminNotes: String(form.get("adminNotes") || "")
        })
      });
      const data = (await response.json()) as { ok?: boolean; message?: string; nextAction?: string; application?: { status?: string } };
      if (!response.ok || !data.ok) {
        setMessage(data.message || "Could not update application.");
        return;
      }
      if (data.application?.status) setStatus(data.application.status);
      setMessage(data.nextAction || "Application updated.");
    } catch (error) {
      setMessage("Could not update application right now.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="applicationActionForm" onSubmit={handleSubmit}>
      <select name="status" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="NEW">New</option>
        <option value="IN_REVIEW">In review</option>
        <option value="APPROVED">Approved</option>
        <option value="DECLINED">Declined</option>
      </select>
      <input name="adminNotes" placeholder="Admin note" />
      <button disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Apply"}</button>
      {message ? <small>{message}</small> : null}
    </form>
  );
}
