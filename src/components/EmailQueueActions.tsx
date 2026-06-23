"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EmailQueueActionsProps = {
  emailId: string;
  status: string;
};

export function EmailQueueActions({ emailId, status }: EmailQueueActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function update(action: "mark-sent" | "mark-failed" | "requeue") {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/emails/${emailId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const result = await response.json() as { ok?: boolean; message?: string };
      setMessage(result.message || (result.ok ? "Updated." : "Could not update email."));
      router.refresh();
    } catch {
      setMessage("Could not update email right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inlineActionCluster">
      <button className="panelLink buttonReset" disabled={busy} type="button" onClick={() => update("requeue")}>
        Resend
      </button>
      {status !== "SENT" ? (
        <button className="panelLink buttonReset" disabled={busy} type="button" onClick={() => update("mark-sent")}>
          Mark sent
        </button>
      ) : null}
      {status !== "FAILED" ? (
        <button className="dangerIconButton compact" disabled={busy} type="button" onClick={() => update("mark-failed")}>
          Failed
        </button>
      ) : null}
      {message ? <small>{message}</small> : null}
    </div>
  );
}
