"use client";

import { useMemo, useState } from "react";
import { formatKes } from "@/lib/content";
import type { MerchandiseProductRecord } from "@/lib/merchandise-data";

type MerchandisePurchasePanelProps = {
  product: MerchandiseProductRecord;
};

export function MerchandisePurchasePanel({ product }: MerchandisePurchasePanelProps) {
  const hasSizes = /t-?shirt|shirt|tee|apparel/i.test(`${product.name} ${product.category}`);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");
  const safeQuantity = Math.max(1, Math.min(quantity, Math.max(product.stockQuantity, 1)));
  const total = product.price * safeQuantity;

  const checkoutUrl = useMemo(() => {
    const params = new URLSearchParams({
      productSlug: product.slug,
      quantity: String(safeQuantity),
      ...(hasSizes ? { size } : {})
    });
    return `/shop/checkout?${params.toString()}`;
  }, [hasSizes, product.slug, safeQuantity, size]);

  return (
    <div className="merchandisePurchasePanel">
      <div className="merchandiseCheckoutHeader">
        <span>Checkout</span>
        <strong>{formatKes(total)}</strong>
        <small>{safeQuantity} x {formatKes(product.price)}</small>
      </div>

      {hasSizes ? (
        <div className="shopSizeSelector" role="group" aria-label="T-shirt size">
          <span>Size</span>
          {["S", "M", "L", "XL"].map((option) => (
            <button className={size === option ? "active" : ""} type="button" onClick={() => setSize(option)} key={option}>
              {option}
            </button>
          ))}
        </div>
      ) : null}

      <div className="shopQuantityStepper">
        <span>Quantity</span>
        <div>
          <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button>
          <strong>{safeQuantity}</strong>
          <button type="button" onClick={() => setQuantity((current) => Math.min(Math.max(product.stockQuantity, 1), current + 1))}>+</button>
        </div>
      </div>

      <a className={product.stockQuantity > 0 ? "button primary wide" : "button primary wide disabled"} href={product.stockQuantity > 0 ? checkoutUrl : "#checkout-note"}>
        {product.stockQuantity > 0 ? "Checkout now" : "Currently unavailable"}
      </a>
      <p id="checkout-note">Proceeds go towards {product.causeLabel.toLowerCase()}.</p>
    </div>
  );
}
