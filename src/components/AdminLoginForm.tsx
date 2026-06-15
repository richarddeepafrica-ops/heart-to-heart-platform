"use client";

import { FormEvent, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string };

export function AdminLoginForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    });
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      setState({ status: "error", message: payload?.message || "Sign in failed." });
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form className="adminLoginForm" onSubmit={submitLogin}>
      <label>
        Email
        <input autoComplete="email" name="email" placeholder="admin@hearttoheart.local" type="email" />
      </label>
      <label>
        Password
        <input autoComplete="current-password" name="password" placeholder="Enter password" type="password" />
      </label>
      <button className="primaryAction" disabled={state.status === "submitting"} type="submit">
        {state.status === "submitting" ? "Signing in..." : "Sign in"}
      </button>
      {state.status === "error" ? <div className="notice error">{state.message}</div> : null}
    </form>
  );
}
