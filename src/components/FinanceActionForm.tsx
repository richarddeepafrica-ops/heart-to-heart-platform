"use client";

import { useState, type FormEvent } from "react";

type FinanceActionFormProps = {
  donationId: string;
  initialStatus: string;
  initialProviderRef: string;
};

const actions = [
  { value: "CONFIRM", label: "Confirm" },
  { value: "RECONCILE", label: "Reconcile" },
  { value: "FAIL", label: "Fail" },
  { value: "REFUND", label: "Refund" }
];

export function FinanceActionForm({ donationId, initialStatus, initialProviderRef }: FinanceActionFormProps) {
  const [action, setAction] = useState(initialStatus === "CONFIRMED" ? "RECONCILE" : "CONFIRM");
  const [providerRef, setProviderRef] = useState(initialProviderRef === "No provider ref" ? "" : initialProviderRef);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function submitAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch(`/api/finance/donations/${donationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, providerRef })
    });
    const result = await response.json().catch(() => null) as { ok?: boolean; message?: string; donation?: { status?: string; receiptNumber?: string | null } } | null;

    setIsSaving(false);

    if (result?.ok) {
      setMessage(`${result.donation?.status || "Updated"}${result.donation?.receiptNumber ? ` - ${result.donation.receiptNumber}` : ""}`);
      return;
    }

    setMessage(result?.message || "Finance action could not be saved.");
  }

  return (
    <form className="inlineAdminForm financeActionForm" onSubmit={submitAction}>
      <select value={action} onChange={(event) => setAction(event.target.value)} aria-label="Finance action">
        {actions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <input value={providerRef} onChange={(event) => setProviderRef(event.target.value)} placeholder="Provider ref" aria-label="Provider reference" />
      <button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Apply"}</button>
      {message ? <small>{message}</small> : null}
    </form>
  );
}
