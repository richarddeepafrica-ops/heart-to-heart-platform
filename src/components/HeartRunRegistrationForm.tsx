"use client";

import { useMemo, useState } from "react";
import { eventProducts, formatKes } from "@/lib/content";

const addOns = [0, 1000, 2500, 5000, 10000];

function paymentHref(packageName: string, packagePrice: number, addOn: number) {
  const params = new URLSearchParams({
    type: "event-registration",
    eventSlug: "heart-run",
    eventName: "Heart Run / Walk",
    packageName,
    amount: String(packagePrice + addOn)
  });

  if (addOn > 0) params.set("addOn", String(addOn));
  return `/donate?${params.toString()}#give`;
}

export function HeartRunRegistrationForm() {
  const [packageName, setPackageName] = useState(eventProducts[1].name);
  const [addOn, setAddOn] = useState(2500);
  const selectedPackage = eventProducts.find((ticket) => ticket.name === packageName) ?? eventProducts[1];
  const total = selectedPackage.price + addOn;
  const href = useMemo(() => paymentHref(selectedPackage.name, selectedPackage.price, addOn), [selectedPackage, addOn]);

  return (
    <section className="eventFlowLayout">
      <form className="eventFlowForm">
        <div className="flowBlock">
          <div className="blockTitle">
            <strong>Registration package</strong>
            <span>Choose one package</span>
          </div>
          <div className="eventPackageChoices">
            {eventProducts.map((ticket) => (
              <label className={ticket.name === selectedPackage.name ? "selected" : ""} key={ticket.name}>
                <input
                  checked={ticket.name === selectedPackage.name}
                  name="package"
                  type="radio"
                  onChange={() => setPackageName(ticket.name)}
                />
                <span>
                  <strong>{ticket.name}</strong>
                  <small>{ticket.description}</small>
                </span>
                <b>{formatKes(ticket.price)}</b>
              </label>
            ))}
          </div>
        </div>

        <div className="flowBlock">
          <div className="blockTitle">
            <strong>Participant details</strong>
            <span>Used for registration confirmation</span>
          </div>
          <div className="formGrid">
            <label>Name<input placeholder="Full name" /></label>
            <label>Phone<input placeholder="07..." /></label>
            <label>Email<input placeholder="you@example.com" type="email" /></label>
            <label>Team or organisation<input placeholder="Family, school, company, or club" /></label>
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
        <p className="eyebrow">Registration summary</p>
        <h2>{selectedPackage.name}</h2>
        <div className="summaryRows">
          <span>Package</span><strong>{formatKes(selectedPackage.price)}</strong>
          <span>Add-on gift</span><strong>{formatKes(addOn)}</strong>
          <span>Total</span><strong>{formatKes(total)}</strong>
        </div>
        <p>
          Payment confirmation will reserve the package and prepare a receipt
          for the participant or organisation.
        </p>
        <a className="button primary wide" href={href}>Continue to payment</a>
        <a className="button secondary wide" href="/donate?type=event-donation&eventSlug=heart-run&eventName=Heart+Run+%2F+Walk&campaignSlug=heart-run-walk#give">Donate instead</a>
      </aside>
    </section>
  );
}
