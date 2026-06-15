"use client";

import { FormEvent, useMemo, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string; detail: string }
  | { status: "error"; message: string };

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function CampaignBuilderForm() {
  const [title, setTitle] = useState("Fund 20 Heart Surgeries");
  const [summary, setSummary] = useState("Support open heart surgeries for children from underprivileged backgrounds.");
  const [goalAmount, setGoalAmount] = useState("10000000");
  const [status, setStatus] = useState("DRAFT");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const slug = useMemo(() => slugify(title), [title]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    const response = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, summary, goalAmount, status, slug })
    });
    const payload = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
      mode?: string;
      campaign?: { title?: string; slug?: string };
      nextAction?: string;
    } | null;

    if (!response.ok || !payload?.ok) {
      setState({ status: "error", message: payload?.message || "Campaign could not be saved." });
      return;
    }

    setState({
      status: "success",
      message: `${payload.campaign?.title || "Campaign"} saved in ${payload.mode || "preview"} mode.`,
      detail: payload.nextAction || `Public path: /campaigns/${payload.campaign?.slug || slug}`
    });
  }

  return (
    <form className="builderPreview" id="campaign-builder" onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label>
        Summary
        <input value={summary} onChange={(event) => setSummary(event.target.value)} />
      </label>
      <label>
        Goal
        <input inputMode="numeric" value={goalAmount} onChange={(event) => setGoalAmount(event.target.value)} />
      </label>
      <label>
        Status
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </label>
      <div className="summaryBox">
        <span>Slug</span>
        <strong>{slug || "campaign-slug"}</strong>
      </div>
      <button className="primaryAction" disabled={state.status === "submitting"} type="submit">
        {state.status === "submitting" ? "Saving..." : "Save campaign"}
      </button>
      {state.status === "success" ? (
        <div className="notice">
          <strong>{state.message}</strong>
          <small>{state.detail}</small>
        </div>
      ) : null}
      {state.status === "error" ? <div className="notice error">{state.message}</div> : null}
    </form>
  );
}
