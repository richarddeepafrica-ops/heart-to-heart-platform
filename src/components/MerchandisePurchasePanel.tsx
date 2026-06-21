"use client";

import { useMemo, useState } from "react";
import { formatKes } from "@/lib/content";
import type { MerchandiseProductRecord } from "@/lib/merchandise-data";

type MerchandisePurchasePanelProps = {
  product: MerchandiseProductRecord;
};

export function MerchandisePurchasePanel({ product }: MerchandisePurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const safeQuantity = Math.max(1, Math.min(quantity, Math.max(product.stockQuantity, 1)));
  const total = product.price * safeQuantity;
  const checkoutUrl = useMemo(() => {
    const params = new URLSearchParams({
      type: "merchandise",
      productSlug: product.slug,
      productName: product.name,
      packageName: product.name,
      quantity: String(safeQuantity),
      amount: String(total),
      label: product.causeLabel
    });
    return `/donate?${params.toString()}`;
  }, [product.causeLabel, product.name, product.slug, safeQuantity, total]);

  return (
    <div className="merchandisePurchasePanel">
      <div>
        <span>Total</span>
        <strong>{formatKes(total)}</strong>
        <small>{safeQuantity} × {formatKes(product.price)}</small>
      </div>
      <label>
        Quantity
        <input
          min="1"
          max={Math.max(product.stockQuantity, 1)}
          type="number"
          value={safeQuantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
      </label>
      <a className={product.stockQuantity > 0 ? "button primary wide" : "button primary wide disabled"} href={product.stockQuantity > 0 ? checkoutUrl : "#stock"}>
        {product.stockQuantity > 0 ? "Buy and support" : "Out of stock"}
      </a>
      <p id="stock">{product.stockQuantity} available. Proceeds go towards {product.causeLabel.toLowerCase()}.</p>
    </div>
  );
}
