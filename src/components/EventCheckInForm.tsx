"use client";

import { useState, type FormEvent } from "react";

type EventCheckInFormProps = {
  registrationId: string;
  initialCheckedIn: boolean;
};

export function EventCheckInForm({ registrationId, initialCheckedIn }: EventCheckInFormProps) {
  const [checkedIn, setCheckedIn] = useState(initialCheckedIn);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function updateCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch(`/api/event-registrations/${registrationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkedIn: !checkedIn })
    });
    const result = await response.json().catch(() => null) as { ok?: boolean; message?: string; registration?: { checkedInAt?: string | null } } | null;

    setIsSaving(false);

    if (result?.ok) {
      setCheckedIn(Boolean(result.registration?.checkedInAt));
      setMessage(result.registration?.checkedInAt ? "Checked in." : "Check-in cleared.");
      return;
    }

    setMessage(result?.message || "Check-in could not be saved.");
  }

  return (
    <form className="inlineAdminForm compact" onSubmit={updateCheckIn}>
      <button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : checkedIn ? "Undo" : "Check in"}</button>
      {message ? <small>{message}</small> : null}
    </form>
  );
}
