"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ComplimentaryTicketActionsProps = {
  ticketId: string;
  sent: boolean;
  redeemed: boolean;
};

export function ComplimentaryTicketActions({ ticketId, sent, redeemed }: ComplimentaryTicketActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function update(action: "mark-sent" | "redeem" | "unredeem") {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/complimentary-tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const result = await response.json() as { ok?: boolean; message?: string };
      setMessage(result.message || (result.ok ? "Updated." : "Could not update ticket."));
      router.refresh();
    } catch {
      setMessage("Could not update ticket right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inlineActionCluster">
      {!sent ? (
        <button className="panelLink buttonReset" disabled={busy} type="button" onClick={() => update("mark-sent")}>
          Mark sent
        </button>
      ) : null}
      <button className="primaryAction small" disabled={busy} type="button" onClick={() => update(redeemed ? "unredeem" : "redeem")}>
        {redeemed ? "Undo check-in" : "Redeem"}
      </button>
      {message ? <small>{message}</small> : null}
    </div>
  );
}
