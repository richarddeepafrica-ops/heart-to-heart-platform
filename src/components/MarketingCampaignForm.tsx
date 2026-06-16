"use client";

import { FormEvent, useState } from "react";

export function MarketingCampaignForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      objective: String(form.get("objective") || ""),
      audienceName: String(form.get("audienceName") || ""),
      channel: String(form.get("channel") || "MULTI_CHANNEL")
    };

    try {
      const response = await fetch("/api/marketing-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; mode?: string };

      if (!response.ok || !result.ok) {
        setMessage(result.message || "Broadcast draft could not be created.");
        return;
      }

      setMessage(result.mode === "preview" ? "Preview broadcast draft prepared." : "Broadcast draft prepared.");
    } catch (error) {
      setMessage("Broadcast draft could not be created right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="builderPreview" onSubmit={handleSubmit}>
      <label>Name<input name="name" defaultValue="Fund 20 Heart Surgeries update" /></label>
      <label>Objective<input name="objective" defaultValue="Raise donations and share surgery progress" /></label>
      <label>Audience<input name="audienceName" defaultValue="All donors" /></label>
      <label>
        Channel
        <select name="channel" defaultValue="MULTI_CHANNEL">
          <option value="MULTI_CHANNEL">Email, SMS, WhatsApp</option>
          <option value="EMAIL">Email</option>
          <option value="SMS">SMS</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="SOCIAL">Social</option>
        </select>
      </label>
      <button className="primaryAction" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Preparing..." : "Prepare broadcast"}
      </button>
      {message ? <small>{message}</small> : null}
    </form>
  );
}
