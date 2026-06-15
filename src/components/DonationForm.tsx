"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { campaigns, formatKes } from "@/lib/content";

type DonationState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
  reference?: string;
};

const amounts = [1000, 2500, 5000, 10000];

type DonationFormProps = {
  defaultCampaignSlug?: string;
  source?: string;
};

export function DonationForm({ defaultCampaignSlug, source = "website-donation-page" }: DonationFormProps) {
  const searchParams = useSearchParams();
  const contextType = searchParams.get("type") ?? "campaign";
  const queryAmount = Number(searchParams.get("amount"));
  const queryCampaignSlug = searchParams.get("campaignSlug");
  const childSlug = searchParams.get("childSlug");
  const eventSlug = searchParams.get("eventSlug");
  const eventName = searchParams.get("eventName");
  const packageName = searchParams.get("packageName");
  const addOn = Number(searchParams.get("addOn") ?? 0);
  const label = searchParams.get("label");
  const hasLockedDestination = ["child", "event-registration"].includes(contextType);
  const contextualSource = [
    source,
    contextType,
    childSlug,
    eventSlug,
    packageName
  ].filter(Boolean).join(":");

  const [amount, setAmount] = useState(Number.isFinite(queryAmount) && queryAmount > 0 ? queryAmount : 2500);
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [method, setMethod] = useState<"MPESA" | "CARD" | "BANK_TRANSFER">("MPESA");
  const [campaignSlug, setCampaignSlug] = useState(queryCampaignSlug ?? defaultCampaignSlug ?? campaigns[0].id);
  const [state, setState] = useState<DonationState>({ status: "idle", message: "" });
  const selectedCampaign = campaigns.find((campaign) => campaign.id === campaignSlug) ?? campaigns[0];
  const destinationTitle =
    contextType === "child"
      ? `Sponsor ${label ?? "a child"}`
      : contextType === "event-registration"
        ? `${eventName ?? "Event"} registration: ${packageName ?? "Selected package"}`
        : contextType === "event-donation"
          ? `${eventName ?? selectedCampaign.title} donation`
          : selectedCampaign.title;
  const destinationSummary =
    contextType === "child"
      ? "This gift is marked for the selected child's care journey."
      : contextType === "event-registration"
        ? addOn > 0
          ? `Includes registration plus ${formatKes(addOn)} add-on gift.`
          : "This payment is marked as an event registration."
        : contextType === "event-donation"
          ? "This gift is marked for the selected event fundraising effort."
          : selectedCampaign.summary;

  async function submitDonation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setState({ status: "submitting", message: "Preparing donation..." });

    const response = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        campaignSlug,
        method,
        frequency,
        destinationType: contextType,
        destinationLabel: destinationTitle,
        childSlug,
        eventSlug,
        packageName,
        source: contextualSource
      })
    });

    const result = (await response.json()) as {
      ok: boolean;
      message?: string;
      donation?: { id: string; status: string };
      nextAction?: string;
    };

    if (!response.ok || !result.ok) {
      setState({
        status: "error",
        message: result.message ?? "We could not start this donation. Please try again."
      });
      return;
    }

    setState({
      status: "success",
      message: result.nextAction ?? "Donation started successfully.",
      reference: result.donation?.id
    });
  }

  return (
    <form className="donationCheckout" onSubmit={submitDonation}>
      <aside className="checkoutRail" aria-label="Donation checkout steps">
        <div className="checkoutBrand">
          <span>Your gift</span>
          <strong>{formatKes(amount)}</strong>
        </div>
        {[
          ["1", "Gift", "Choose amount and cause"],
          ["2", "Details", "Receipt and updates"],
          ["3", "Payment", "M-Pesa, card, or bank"]
        ].map(([number, label, copy]) => (
          <div className="checkoutStepPill active" key={label}>
            <b>{number}</b>
            <span><strong>{label}</strong><small>{copy}</small></span>
          </div>
        ))}
        <div className="checkoutSecurity">
          <strong>Secure giving</strong>
          <span>Your receipt and impact updates will be connected to this gift.</span>
        </div>
      </aside>

      <section className="checkoutMain">
        <div className="checkoutHeader">
          <div>
            <p className="eyebrow">Secure giving</p>
            <h2>Complete your gift</h2>
          </div>
          <span className="checkoutBadge">KES</span>
        </div>

        <div className="checkoutBlock">
          <div className="blockTitle">
            <strong>Gift amount</strong>
            <span>{frequency === "monthly" ? "Monthly giving" : "One-time gift"}</span>
          </div>
          <div className="amountGrid" role="group" aria-label="Donation amount">
            {amounts.map((value) => (
              <button
                className={amount === value ? "amount active" : "amount"}
                key={value}
                type="button"
                onClick={() => setAmount(value)}
              >
                {formatKes(value)}
              </button>
            ))}
          </div>
          <div className="checkoutInline">
            <label>
              Custom amount
              <input
                min="100"
                name="amount"
                type="number"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
              />
            </label>
            <div className="segmentedControl" role="group" aria-label="Donation frequency">
              <button
                className={frequency === "one-time" ? "active" : ""}
                type="button"
                onClick={() => setFrequency("one-time")}
              >
                One-time
              </button>
              <button
                className={frequency === "monthly" ? "active" : ""}
                type="button"
                onClick={() => setFrequency("monthly")}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="checkoutBlock">
          <div className="blockTitle">
            <strong>Destination</strong>
            <span>Choose where to give</span>
          </div>
          {hasLockedDestination ? null : (
            <label>
              Campaign
              <select value={campaignSlug} onChange={(event) => setCampaignSlug(event.target.value)}>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="campaignMini">
            <strong>{destinationTitle}</strong>
            <span>{destinationSummary}</span>
          </div>
        </div>

        <div className="checkoutBlock">
          <div className="blockTitle">
            <strong>Receipt details</strong>
            <span>For confirmation and updates</span>
          </div>
          <div className="formGrid">
            <label>
              Name
              <input name="name" placeholder="Your name" />
            </label>
            <label>
              Phone
              <input name="phone" placeholder="07..." />
            </label>
          </div>
          <label>
            Email
            <input name="email" placeholder="you@example.com" type="email" />
          </label>
          <div className="consentGrid">
            <label><input name="anonymous" type="checkbox" /> Give anonymously publicly</label>
            <label><input name="updates" type="checkbox" defaultChecked /> Send impact updates</label>
          </div>
        </div>

        <div className="checkoutBlock">
          <div className="blockTitle">
            <strong>Payment method</strong>
            <span>{method === "MPESA" ? "STK push ready" : "Processor handoff"}</span>
          </div>
          <div className="paymentMethods" role="group" aria-label="Payment method">
            {[
              ["MPESA", "M-Pesa", "STK push"],
              ["CARD", "Card", "Visa / Mastercard"],
              ["BANK_TRANSFER", "Bank", "Manual review"]
            ].map(([value, label, copy]) => (
              <button
                className={method === value ? "active" : ""}
                key={value}
                type="button"
                onClick={() => setMethod(value as "MPESA" | "CARD" | "BANK_TRANSFER")}
              >
                <strong>{label}</strong>
                <span>{copy}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="button primary wide checkoutSubmit" disabled={state.status === "submitting"} type="submit">
          {state.status === "submitting" ? "Starting secure gift..." : `Donate ${formatKes(amount)}`}
        </button>

        {state.message ? (
          <div className={state.status === "error" ? "notice error" : "notice"}>
            <strong>{state.status === "success" ? "Donation ready" : "Status"}</strong>
            <span>{state.message}</span>
            {state.reference ? <small>Reference: {state.reference}</small> : null}
          </div>
        ) : null}
      </section>

      <aside className="checkoutSummary">
        <div className="summaryHeader">
          <span>Your gift</span>
          <strong>{formatKes(amount)}</strong>
        </div>
        <div className="summaryRows">
          <span>Frequency</span><strong>{frequency === "monthly" ? "Monthly" : "One-time"}</strong>
          <span>Destination</span><strong>{destinationTitle}</strong>
          {packageName ? <><span>Package</span><strong>{packageName}</strong></> : null}
          <span>Payment</span><strong>{method.replace("_", " ")}</strong>
          <span>Receipt</span><strong>Prepared after payment</strong>
        </div>
        <div className="impactPreview">
          <strong>What this can support</strong>
          <p>Screening, medication, transport, follow-up care, or surgery funding for children waiting for heart treatment.</p>
        </div>
        <div className="reconciliationPreview">
          <span><b>1</b> Choose your gift</span>
          <span><b>2</b> Confirm payment</span>
          <span><b>3</b> Receive receipt</span>
          <span><b>4</b> See impact updates</span>
        </div>
      </aside>
    </form>
  );
}
