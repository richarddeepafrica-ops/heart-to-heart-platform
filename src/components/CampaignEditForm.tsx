"use client";

import { FormEvent, useState } from "react";

type CampaignEditFormProps = {
  campaign: {
    slug: string;
    title: string;
    summary: string;
    goalAmount: number;
    status: string;
  };
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string; detail?: string }
  | { status: "error"; message: string };

export function CampaignEditForm({ campaign }: CampaignEditFormProps) {
  const [title, setTitle] = useState(campaign.title);
  const [summary, setSummary] = useState(campaign.summary);
  const [goalAmount, setGoalAmount] = useState(String(campaign.goalAmount));
  const [status, setStatus] = useState(campaign.status);
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submitUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    const response = await fetch(`/api/campaigns/${campaign.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, summary, goalAmount, status })
    });
    const payload = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
      mode?: string;
      nextAction?: string;
    } | null;

    if (!response.ok || !payload?.ok) {
      setState({ status: "error", message: payload?.message || "Campaign could not be updated." });
      return;
    }

    setState({
      status: "success",
      message: `Campaign updated in ${payload.mode || "preview"} mode.`,
      detail: payload.nextAction
    });
  }

  async function archiveCampaign() {
    setState({ status: "submitting" });
    const response = await fetch(`/api/campaigns/${campaign.slug}`, { method: "DELETE" });
    const payload = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
      mode?: string;
      nextAction?: string;
    } | null;

    if (!response.ok || !payload?.ok) {
      setState({ status: "error", message: payload?.message || "Campaign could not be archived." });
      return;
    }

    setState({
      status: "success",
      message: `Campaign archived in ${payload.mode || "preview"} mode.`,
      detail: payload.nextAction
    });
  }

  return (
    <form className="builderPreview" onSubmit={submitUpdate}>
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
          <option value="ARCHIVED">Archived</option>
        </select>
      </label>
      <div className="adminActions stackedActions">
        <button className="primaryAction" disabled={state.status === "submitting"} type="submit">
          {state.status === "submitting" ? "Saving..." : "Save changes"}
        </button>
        <button disabled={state.status === "submitting"} onClick={archiveCampaign} type="button">
          Archive campaign
        </button>
      </div>
      {state.status === "success" ? (
        <div className="notice">
          <strong>{state.message}</strong>
          {state.detail ? <small>{state.detail}</small> : null}
        </div>
      ) : null}
      {state.status === "error" ? <div className="notice error">{state.message}</div> : null}
    </form>
  );
}
