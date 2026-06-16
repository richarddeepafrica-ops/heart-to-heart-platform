"use client";

import { FormEvent, useState } from "react";

type FormState = {
  ok?: boolean;
  message: string;
};

export function OfflineDonationForm() {
  const [state, setState] = useState<FormState>({ message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setState({ message: "" });

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      organization: String(form.get("organization") || ""),
      amount: String(form.get("amount") || ""),
      method: String(form.get("method") || "BANK_TRANSFER"),
      status: String(form.get("status") || "PENDING"),
      destinationLabel: String(form.get("destinationLabel") || ""),
      providerRef: String(form.get("providerRef") || "")
    };

    try {
      const response = await fetch("/api/admin/donations/offline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; nextAction?: string };

      if (!response.ok || !result.ok) {
        setState({ ok: false, message: result.message || "Offline gift could not be recorded." });
        return;
      }

      event.currentTarget.reset();
      setState({ ok: true, message: result.nextAction || "Offline gift recorded." });
    } catch (error) {
      setState({ ok: false, message: "Offline gift could not be recorded right now." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="offlineDonationForm" onSubmit={handleSubmit}>
      <label>
        Donor name
        <input name="name" placeholder="Donor or organization name" required />
      </label>
      <label>
        Amount
        <input name="amount" min="100" placeholder="KES amount" required type="number" />
      </label>
      <label>
        Method
        <select name="method" defaultValue="BANK_TRANSFER">
          <option value="BANK_TRANSFER">Bank transfer</option>
          <option value="CASH">Cash</option>
        </select>
      </label>
      <label>
        Status
        <select name="status" defaultValue="PENDING">
          <option value="PENDING">Pending review</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="RECONCILED">Reconciled</option>
        </select>
      </label>
      <label>
        Email
        <input name="email" placeholder="Optional email" type="email" />
      </label>
      <label>
        Phone
        <input name="phone" placeholder="Optional phone" />
      </label>
      <label>
        Organization
        <input name="organization" placeholder="Optional organization" />
      </label>
      <label>
        Receipt/reference
        <input name="providerRef" placeholder="Bank slip, receipt, or note" />
      </label>
      <label className="wide">
        Destination
        <input name="destinationLabel" placeholder="General giving, campaign, event, or child name" required />
      </label>
      <div className="wide formSubmitRow">
        <button className="primaryAction" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Recording..." : "Record offline gift"}
        </button>
        {state.message ? <small className={state.ok ? "formSuccess" : "formError"}>{state.message}</small> : null}
      </div>
    </form>
  );
}
