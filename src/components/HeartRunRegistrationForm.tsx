"use client";

import { useMemo, useState } from "react";
import { formatKes } from "@/lib/content";
import type { EventTicketPackageRecord } from "@/lib/event-ticket-data";

const addOns = [0, 1000, 2500, 5000, 10000];

function paymentHref({
  packageName,
  packagePrice,
  addOn,
  quantity,
  participantName,
  phone,
  email,
  teamName
}: {
  packageName: string;
  packagePrice: number;
  addOn: number;
  quantity: number;
  participantName: string;
  phone: string;
  email: string;
  teamName: string;
}) {
  const amount = packagePrice * quantity + addOn;
  const params = new URLSearchParams({
    type: "event-registration",
    eventSlug: "heart-run",
    eventName: "Heart Run / Walk",
    packageName,
    quantity: String(quantity),
    amount: String(amount)
  });

  if (addOn > 0) params.set("addOn", String(addOn));
  if (participantName.trim()) params.set("participantName", participantName.trim());
  if (phone.trim()) params.set("phone", phone.trim());
  if (email.trim()) params.set("email", email.trim());
  if (teamName.trim()) params.set("teamName", teamName.trim());
  return `/donate?${params.toString()}#give`;
}

type HeartRunRegistrationFormProps = {
  tickets: EventTicketPackageRecord[];
  initialPackage?: string;
};

export function HeartRunRegistrationForm({ tickets, initialPackage }: HeartRunRegistrationFormProps) {
  const defaultTicket = tickets.find((ticket) => ticket.name === initialPackage) || tickets[1] || tickets[0];
  const [packageName, setPackageName] = useState(defaultTicket?.name || "");
  const [quantity, setQuantity] = useState(1);
  const [addOn, setAddOn] = useState(2500);
  const [participantName, setParticipantName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const selectedPackage = tickets.find((ticket) => ticket.name === packageName) ?? defaultTicket;
  const packageTotal = selectedPackage.price * quantity;
  const total = packageTotal + addOn;
  const href = useMemo(() => paymentHref({
    packageName: selectedPackage?.name || "",
    packagePrice: selectedPackage?.price || 0,
    addOn,
    quantity,
    participantName,
    phone,
    email,
    teamName
  }), [addOn, email, participantName, phone, quantity, selectedPackage, teamName]);
  const canContinue = participantName.trim().length > 1 && phone.trim().length > 5;

  if (!selectedPackage) return null;

  return (
    <section className="eventFlowLayout">
      <form className="eventFlowForm">
        <div className="flowBlock" id="participant-details">
          <div className="blockTitle">
            <strong>Registration package</strong>
          </div>
          <div className="eventPackageChoices">
            {tickets.map((ticket) => (
              <label className={ticket.name === selectedPackage.name ? "selected" : ""} key={ticket.id}>
                <input
                  checked={ticket.name === selectedPackage.name}
                  name="package"
                  type="radio"
                  onChange={() => setPackageName(ticket.name)}
                />
                <span>
                  <strong>{ticket.name}</strong>
                  <small>{ticket.audience}</small>
                  <em>{ticket.description}</em>
                </span>
                <b>{formatKes(ticket.price)}</b>
                <ul>
                  {ticket.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                </ul>
              </label>
            ))}
          </div>
        </div>

        <div className="flowBlock compactFlowBlock">
          <div className="blockTitle">
            <strong>Order details</strong>
          </div>
          <div className="eventQuantityControl">
            <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button>
            <label>
              Quantity
              <input min="1" max="50" type="number" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} />
            </label>
            <button type="button" onClick={() => setQuantity((current) => Math.min(50, current + 1))}>+</button>
          </div>
        </div>

        <div className="flowBlock">
          <div className="blockTitle">
            <strong>Participant details</strong>
          </div>
          <div className="formGrid">
            <label>Name<input placeholder="Full name" value={participantName} onChange={(event) => setParticipantName(event.target.value)} /></label>
            <label>Phone<input placeholder="07..." value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
            <label>Email<input placeholder="you@example.com" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Team or organisation<input placeholder="Family, school, company, or club" value={teamName} onChange={(event) => setTeamName(event.target.value)} /></label>
          </div>
        </div>

        <div className="flowBlock">
          <div className="blockTitle">
            <strong>Optional add-on gift</strong>
            <span>Support children even beyond your registration</span>
          </div>
          <div className="addOnGift">
            {addOns.map((amount) => (
              <button className={amount === addOn ? "active" : ""} type="button" key={amount} onClick={() => setAddOn(amount)}>
                {amount === 0 ? "No add-on" : formatKes(amount)}
              </button>
            ))}
          </div>
        </div>
      </form>

      <aside className="eventFlowSummary">
        <span className="reservationBadge">Reserved for review</span>
        <p className="eyebrow">Registration summary</p>
        <h2>{selectedPackage.name}</h2>
        <small>{selectedPackage.audience}</small>
        <div className="summaryRows">
          <span>Package</span><strong>{formatKes(selectedPackage.price)}</strong>
          <span>Quantity</span><strong>{quantity}</strong>
          <span>Package total</span><strong>{formatKes(packageTotal)}</strong>
          <span>Add-on gift</span><strong>{formatKes(addOn)}</strong>
          <span>Total</span><strong>{formatKes(total)}</strong>
        </div>
        <div className="eventConfirmationPreview">
          <strong>Confirmation will show</strong>
          <span>{participantName || "Participant name"}</span>
          <span>{phone || "Phone number"}</span>
          {teamName ? <span>{teamName}</span> : null}
        </div>
        <a className={`button primary wide ${canContinue ? "" : "disabled"}`} aria-disabled={!canContinue} href={canContinue ? href : "#participant-details"}>Continue to payment</a>
        <a className="button secondary wide" href="/donate?type=event-donation&eventSlug=heart-run&eventName=Heart+Run+%2F+Walk&campaignSlug=heart-run-walk#give">Donate instead</a>
      </aside>
    </section>
  );
}
