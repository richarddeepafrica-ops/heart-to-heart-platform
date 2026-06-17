"use client";

import { FormEvent, useState } from "react";

type Result = { ok?: boolean; message?: string; nextAction?: string };

export function ChildCareApplicationForm() {
  const [result, setResult] = useState<Result>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult({});

    const form = new FormData(event.currentTarget);
    const payload = {
      childName: String(form.get("childName") || ""),
      childAge: String(form.get("childAge") || ""),
      guardianName: String(form.get("guardianName") || ""),
      guardianPhone: String(form.get("guardianPhone") || ""),
      guardianEmail: String(form.get("guardianEmail") || ""),
      county: String(form.get("county") || ""),
      diagnosis: String(form.get("diagnosis") || ""),
      hospital: String(form.get("hospital") || ""),
      estimatedNeed: String(form.get("estimatedNeed") || ""),
      story: String(form.get("story") || "")
    };

    try {
      const response = await fetch("/api/applications/child-care", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as Result;
      setResult({ ...data, ok: response.ok && data.ok });
      if (response.ok && data.ok) event.currentTarget.reset();
    } catch (error) {
      setResult({ ok: false, message: "Application could not be submitted right now." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="applicationForm" onSubmit={handleSubmit}>
      <label>Child name<input name="childName" required /></label>
      <label>Child age<input min="0" name="childAge" type="number" /></label>
      <label>Parent / guardian name<input name="guardianName" required /></label>
      <label>Parent / guardian phone<input name="guardianPhone" required type="tel" /></label>
      <label>Email<input name="guardianEmail" type="email" /></label>
      <label>County / town<input name="county" /></label>
      <label className="wide">Medical condition or diagnosis<input name="diagnosis" required /></label>
      <label>Hospital / referral facility<input name="hospital" /></label>
      <label>Estimated support needed<input min="0" name="estimatedNeed" placeholder="KES amount if known" type="number" /></label>
      <label className="wide">Tell us about the situation<textarea name="story" required rows={6} /></label>
      <div className="wide formSubmitRow">
        <button className="button primary" disabled={isSubmitting} type="submit">{isSubmitting ? "Submitting..." : "Submit application"}</button>
        {result.message || result.nextAction ? <small className={result.ok ? "formSuccess" : "formError"}>{result.nextAction || result.message}</small> : null}
      </div>
    </form>
  );
}
