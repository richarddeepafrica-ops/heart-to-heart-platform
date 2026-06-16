"use client";

import { FormEvent, useState } from "react";

const partnershipOptions = [
  "Bronze sponsorship",
  "Silver sponsorship",
  "Gold sponsorship",
  "Platinum sponsorship",
  "Event partnership",
  "Surgery support",
  "Workplace giving",
  "Custom partnership"
];

export function PartnerInquiryForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      contactName: String(form.get("contactName") || ""),
      organization: String(form.get("organization") || ""),
      contactEmail: String(form.get("contactEmail") || ""),
      phone: String(form.get("phone") || ""),
      interest: String(form.get("interest") || ""),
      estimatedValue: String(form.get("estimatedValue") || ""),
      message: String(form.get("message") || "")
    };

    try {
      const response = await fetch("/api/partners/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; nextAction?: string };

      if (!response.ok || !result.ok) {
        setMessage(result.message || "Inquiry could not be sent.");
        return;
      }

      event.currentTarget.reset();
      setMessage(result.nextAction || "Inquiry sent. The team will contact you.");
    } catch (error) {
      setMessage("Inquiry could not be sent right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="partnerInquiryForm" onSubmit={handleSubmit}>
      <div className="sectionHeading compactHeading">
        <p className="eyebrow">Discuss partnership</p>
        <h2>Complete the form and our admin team will contact you.</h2>
      </div>
      <div className="partnerInquiryGrid">
        <label>
          Contact person
          <input name="contactName" placeholder="Your full name" required type="text" />
        </label>
        <label>
          Organization
          <input name="organization" placeholder="Company or institution" required type="text" />
        </label>
        <label>
          Email
          <input name="contactEmail" placeholder="you@example.com" required type="email" />
        </label>
        <label>
          Phone
          <input name="phone" placeholder="+254..." type="tel" />
        </label>
        <label>
          Partnership interest
          <select name="interest" defaultValue="" required>
            <option value="" disabled>Select an option</option>
            {partnershipOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Estimated budget
          <input name="estimatedValue" placeholder="KES amount" type="number" />
        </label>
        <label className="span2">
          Message
          <textarea
            name="message"
            placeholder="Tell us what you would like to support, timelines, visibility needs, or questions."
            rows={5}
          />
        </label>
      </div>
      <button className="button primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Sending..." : "Send inquiry"}
      </button>
      {message ? <p className="formNotice">{message}</p> : null}
    </form>
  );
}
