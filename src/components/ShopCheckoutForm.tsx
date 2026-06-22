"use client";

import { FormEvent, useState } from "react";
import { formatKes } from "@/lib/content";
import type { MerchandiseProductRecord } from "@/lib/merchandise-data";

type CheckoutState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
  reference?: string;
  statusUrl?: string;
};

type ShopCheckoutFormProps = {
  product: MerchandiseProductRecord;
  quantity: number;
  size?: string;
};

export function ShopCheckoutForm({ product, quantity, size }: ShopCheckoutFormProps) {
  const safeQuantity = Math.max(1, quantity);
  const total = product.price * safeQuantity;
  const [method, setMethod] = useState<"MPESA" | "CARD" | "BANK_TRANSFER">("MPESA");
  const [state, setState] = useState<CheckoutState>({ status: "idle", message: "" });

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setState({ status: "submitting", message: "Preparing checkout..." });

    const response = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        method,
        frequency: "one-time",
        destinationType: "merchandise",
        destinationLabel: product.name,
        productSlug: product.slug,
        packageName: size ? `${product.name} - Size ${size}` : product.name,
        quantity: safeQuantity,
        source: ["shop-checkout", product.slug, size ? `size-${size}` : "", `quantity-${safeQuantity}`].filter(Boolean).join(":")
      })
    });

    const result = (await response.json()) as {
      ok: boolean;
      message?: string;
      donation?: { id: string; status: string };
      statusUrl?: string;
      nextAction?: string;
    };

    if (!response.ok || !result.ok) {
      setState({ status: "error", message: result.message || "Checkout could not be started. Please try again." });
      return;
    }

    setState({
      status: "success",
      message: result.nextAction || "Payment started successfully.",
      reference: result.donation?.id,
      statusUrl: result.statusUrl
    });
  }

  return (
    <form className="shopCheckout" onSubmit={submitOrder}>
      <aside className="shopCheckoutSummary">
        <img src={product.imageUrl} alt="" />
        <div>
          <span>{product.category}</span>
          <strong>{product.name}</strong>
          <small>{product.causeLabel}</small>
        </div>
        <div className="shopCheckoutRows">
          {size ? <><span>Size</span><strong>{size}</strong></> : null}
          <span>Quantity</span><strong>{safeQuantity}</strong>
          <span>Unit price</span><strong>{formatKes(product.price)}</strong>
          <span>Total</span><strong>{formatKes(total)}</strong>
        </div>
      </aside>

      <section className="shopCheckoutPanel">
        <div className="checkoutHeader">
          <div>
            <p className="eyebrow">Shop checkout</p>
            <h2>Complete your order</h2>
          </div>
          <span className="checkoutBadge">KES</span>
        </div>

        <div className="shopCheckoutBlock">
          <h3>Contact details</h3>
          <div className="formGrid">
            <label>Name<input name="name" placeholder="Your name" required /></label>
            <label>Phone<input name="phone" placeholder="07..." required /></label>
          </div>
          <label>Email<input name="email" placeholder="you@example.com" type="email" /></label>
        </div>

        <div className="shopCheckoutBlock">
          <h3>Payment method</h3>
          <div className="paymentMethods" role="group" aria-label="Payment method">
            {[
              ["MPESA", "M-Pesa", "STK push"],
              ["CARD", "Card", "Coming soon"],
              ["BANK_TRANSFER", "Bank", "Finance review"]
            ].map(([value, label, copy]) => (
              <button
                className={method === value ? "active" : ""}
                key={value}
                type="button"
                onClick={() => setMethod(value as "MPESA" | "CARD" | "BANK_TRANSFER")}
              >
                <strong>{label}</strong>
                <span>{copy}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="button primary wide checkoutSubmit" disabled={state.status === "submitting"} type="submit">
          {state.status === "submitting" ? "Starting payment..." : `Pay ${formatKes(total)}`}
        </button>

        {state.message ? (
          <div className={state.status === "error" ? "notice error" : "notice"}>
            <strong>{state.status === "success" ? "Payment ready" : "Status"}</strong>
            <span>{state.message}</span>
            {state.reference ? <small>Reference: {state.reference}</small> : null}
            {state.statusUrl ? <a className="button secondary" href={state.statusUrl}>View payment status</a> : null}
          </div>
        ) : null}
      </section>
    </form>
  );
}
