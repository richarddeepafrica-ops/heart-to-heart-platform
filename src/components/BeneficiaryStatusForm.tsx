"use client";

import { useState, type FormEvent } from "react";

type BeneficiaryStatusFormProps = {
  slug: string;
  initialStatus: string;
};

const statusOptions = [
  "DRAFT",
  "GUARDIAN_PENDING",
  "MEDICAL_REVIEW",
  "APPROVED",
  "REJECTED",
  "ARCHIVED"
];

function labelFor(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function BeneficiaryStatusForm({ slug, initialStatus }: BeneficiaryStatusFormProps) {
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function updateStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch(`/api/beneficiaries/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consentStatus: status })
    });
    const result = await response.json().catch(() => null) as { ok?: boolean; message?: string; nextAction?: string } | null;

    setIsSaving(false);
    setMessage(result?.ok ? result.nextAction || "Status saved." : result?.message || "Status could not be saved.");
  }

  return (
    <form className="inlineAdminForm" onSubmit={updateStatus}>
      <label>
        <span className="srOnly">Consent status</span>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {statusOptions.map((option) => (
            <option key={option} value={option}>{labelFor(option)}</option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
      {message ? <small>{message}</small> : null}
    </form>
  );
}
