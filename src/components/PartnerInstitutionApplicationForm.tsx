"use client";

import { FormEvent, useState } from "react";

type Result = { ok?: boolean; message?: string; nextAction?: string };

export function PartnerInstitutionApplicationForm() {
  const [result, setResult] = useState<Result>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult({});

    const form = new FormData(event.currentTarget);
    const payload = {
      organization: String(form.get("organization") || ""),
      institutionType: String(form.get("institutionType") || ""),
      contactName: String(form.get("contactName") || ""),
      contactEmail: String(form.get("contactEmail") || ""),
      contactPhone: String(form.get("contactPhone") || ""),
      county: String(form.get("county") || ""),
      website: String(form.get("website") || ""),
      proposal: String(form.get("proposal") || "")
    };

    try {
      const response = await fetch("/api/applications/partner-institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as Result;
      setResult({ ...data, ok: response.ok && data.ok });
      if (response.ok && data.ok) event.currentTarget.reset();
    } catch (error) {
      setResult({ ok: false, message: "Partner application could not be submitted right now." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="applicationForm" onSubmit={handleSubmit}>
      <label>Institution name<input name="organization" required /></label>
      <label>Institution type<select name="institutionType" required defaultValue=""><option value="" disabled>Select type</option><option>Hospital / clinic</option><option>School</option><option>Corporate partner</option><option>Community organization</option><option>Faith-based institution</option><option>Other institution</option></select></label>
      <label>Contact person<input name="contactName" required /></label>
      <label>Contact email<input name="contactEmail" required type="email" /></label>
      <label>Phone<input name="contactPhone" type="tel" /></label>
      <label>County / location<input name="county" /></label>
      <label className="wide">Website or social page<input name="website" placeholder="Optional" /></label>
      <label className="wide">How would you like to work with Heart to Heart?<textarea name="proposal" required rows={6} /></label>
      <div className="wide formSubmitRow">
        <button className="button primary" disabled={isSubmitting} type="submit">{isSubmitting ? "Submitting..." : "Submit institution application"}</button>
        {result.message || result.nextAction ? <small className={result.ok ? "formSuccess" : "formError"}>{result.nextAction || result.message}</small> : null}
      </div>
    </form>
  );
}
