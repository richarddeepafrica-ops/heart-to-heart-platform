"use client";

import { useMemo, useState } from "react";
import { eventProducts, formatKes } from "@/lib/content";

type PackageDraft = {
  name: string;
  price: number;
  description: string;
  audience: string;
  capacity: number;
  benefits: string;
  status: string;
};

export function EventPackageSetupPanel() {
  const [packages, setPackages] = useState<PackageDraft[]>(() =>
    eventProducts.map((item) => ({
      name: item.name,
      price: item.price,
      description: item.description,
      audience: item.audience,
      capacity: item.capacity,
      benefits: item.benefits.join("\n"),
      status: "Ready"
    }))
  );
  const [selectedName, setSelectedName] = useState(packages[0]?.name || "");
  const selectedPackage = packages.find((item) => item.name === selectedName) || packages[0];
  const checkoutCopy = useMemo(() => {
    if (!selectedPackage) return "";
    return `${selectedPackage.name} - ${formatKes(selectedPackage.price)}. ${selectedPackage.description} Benefits: ${selectedPackage.benefits}`;
  }, [selectedPackage]);

  function updateSelected(field: keyof PackageDraft, value: string) {
    setPackages((current) =>
      current.map((item) =>
        item.name === selectedName
          ? { ...item, [field]: field === "price" ? Number(value) || 0 : value }
          : item
      )
    );
  }

  function updateSelectedNumber(field: "price" | "capacity", value: string) {
    setPackages((current) =>
      current.map((item) =>
        item.name === selectedName
          ? { ...item, [field]: Number(value) || 0 }
          : item
      )
    );
  }

  return (
    <div className="eventPackageBuilder">
      <div className="packageSetupList">
        {packages.map((item) => (
          <button className={item.name === selectedName ? "active" : ""} type="button" key={item.name} onClick={() => setSelectedName(item.name)}>
            <strong>{item.name}</strong>
            <span>{formatKes(item.price)}</span>
            <small>{item.capacity.toLocaleString("en-KE")} capacity · {item.status}</small>
          </button>
        ))}
      </div>

      {selectedPackage ? (
        <div className="packageSetupEditor">
          <label>
            Package name
            <input value={selectedPackage.name} onChange={(event) => updateSelected("name", event.target.value)} />
          </label>
          <label>
            Price
            <input type="number" value={selectedPackage.price} onChange={(event) => updateSelectedNumber("price", event.target.value)} />
          </label>
          <label>
            Audience
            <input value={selectedPackage.audience} onChange={(event) => updateSelected("audience", event.target.value)} />
          </label>
          <label>
            Capacity
            <input type="number" value={selectedPackage.capacity} onChange={(event) => updateSelectedNumber("capacity", event.target.value)} />
          </label>
          <label className="wide">
            Public checkout description
            <textarea rows={3} value={selectedPackage.description} onChange={(event) => updateSelected("description", event.target.value)} />
          </label>
          <label className="wide">
            Benefits
            <textarea rows={4} value={selectedPackage.benefits} onChange={(event) => updateSelected("benefits", event.target.value)} />
          </label>
          <label>
            Launch status
            <select value={selectedPackage.status} onChange={(event) => updateSelected("status", event.target.value)}>
              <option>Ready</option>
              <option>Needs review</option>
              <option>Paused</option>
            </select>
          </label>
          <div className="packageReadinessChecklist">
            <span className={selectedPackage.name ? "complete" : ""}>Name</span>
            <span className={selectedPackage.price > 0 ? "complete" : ""}>Price</span>
            <span className={selectedPackage.capacity > 0 ? "complete" : ""}>Capacity</span>
            <span className={selectedPackage.benefits.trim() ? "complete" : ""}>Benefits</span>
          </div>
          <div className="packageCopyPreview">
            <span>Public checkout copy</span>
            <strong>{checkoutCopy}</strong>
          </div>
        </div>
      ) : null}
    </div>
  );
}
