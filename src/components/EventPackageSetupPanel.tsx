"use client";

import { FormEvent, useMemo, useState } from "react";
import { eventProducts, formatKes } from "@/lib/content";
import type { EventTicketPackageRecord } from "@/lib/event-ticket-data";

type PackageDraft = {
  id?: string;
  slug?: string;
  eventId?: string;
  name: string;
  price: number;
  description: string;
  audience: string;
  capacity: number;
  benefits: string;
  color: string;
  showInShop: boolean;
  status: string;
};

type EventPackageSetupPanelProps = {
  events?: { id: string; title: string }[];
  packages?: EventTicketPackageRecord[];
};

function fallbackPackages(events: { id: string; title: string }[]) {
  return eventProducts.map((item, index) => ({
    id: "",
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    eventId: events[0]?.id || "",
    name: item.name,
    price: item.price,
    description: item.description,
    audience: item.audience,
    capacity: item.capacity,
    benefits: item.benefits.join("\n"),
    color: ["#00539C", "#00A35A", "#194A7A", "#0D6E5F"][index] || "#00539C",
    showInShop: true,
    status: "ACTIVE"
  }));
}

export function EventPackageSetupPanel({ events = [], packages: savedPackages = [] }: EventPackageSetupPanelProps) {
  const [packages, setPackages] = useState<PackageDraft[]>(() =>
    savedPackages.length
      ? savedPackages.map((item) => ({
          id: item.id,
          slug: item.slug,
          eventId: item.eventId,
          name: item.name,
          price: item.price,
          description: item.description,
          audience: item.audience,
          capacity: item.capacity,
          benefits: item.benefits.join("\n"),
          color: item.color,
          showInShop: item.showInShop,
          status: item.status
        }))
      : fallbackPackages(events)
  );
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || packages[0]?.eventId || "");
  const [selectedName, setSelectedName] = useState(packages[0]?.name || "");
  const [message, setMessage] = useState("");
  const [compMessage, setCompMessage] = useState("");
  const selectedPackage = packages.find((item) => item.name === selectedName) || packages[0];
  const checkoutCopy = useMemo(() => {
    if (!selectedPackage) return "";
    return `${selectedPackage.name} - ${formatKes(selectedPackage.price)}. ${selectedPackage.description}`;
  }, [selectedPackage]);

  function updateSelected(field: keyof PackageDraft, value: string | boolean | number) {
    setPackages((current) =>
      current.map((item) => item.name === selectedName ? { ...item, [field]: value } : item)
    );
  }

  async function savePackage() {
    if (!selectedPackage) return;
    setMessage("Saving ticket package...");
    const response = await fetch("/api/admin/event-tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...selectedPackage, eventId: selectedPackage.eventId || selectedEventId })
    });
    const result = (await response.json()) as { ok?: boolean; message?: string; nextAction?: string };
    setMessage(result.nextAction || result.message || (response.ok ? "Ticket package saved." : "Ticket package could not be saved."));
  }

  async function issueComplimentaryTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPackage) return;
    const formData = new FormData(event.currentTarget);
    setCompMessage("Issuing complimentary ticket...");
    const response = await fetch("/api/admin/complimentary-tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: selectedPackage.eventId || selectedEventId,
        packageName: selectedPackage.name,
        recipientName: formData.get("recipientName"),
        recipientEmail: formData.get("recipientEmail"),
        recipientPhone: formData.get("recipientPhone"),
        quantity: formData.get("quantity"),
        note: formData.get("note")
      })
    });
    const result = (await response.json()) as { ok?: boolean; code?: string; message?: string; nextAction?: string };
    setCompMessage(result.ok ? `${result.nextAction} Code: ${result.code}` : result.message || "Complimentary ticket could not be issued.");
  }

  return (
    <div className="eventPackageBuilder">
      <div className="packageEventSelector">
        <label>
          Event
          <select value={selectedEventId} onChange={(event) => setSelectedEventId(event.target.value)}>
            {events.length ? events.map((event) => (
              <option value={event.id} key={event.id}>{event.title}</option>
            )) : <option value="">Heart Run</option>}
          </select>
        </label>
        <span>Manage public packages, shop visibility, colors, and complimentary tickets.</span>
      </div>
      <div className="packageSetupList">
        {packages.map((item) => (
          <button className={item.name === selectedName ? "active" : ""} type="button" key={item.name} onClick={() => setSelectedName(item.name)}>
            <strong>{item.name}</strong>
            <span>{formatKes(item.price)}</span>
            <small>{item.capacity.toLocaleString("en-KE")} capacity / {item.status}{item.showInShop ? " / shop" : ""}</small>
          </button>
        ))}
      </div>

      {selectedPackage ? (
        <div className="packageSetupEditor">
          <label>Package name<input value={selectedPackage.name} onChange={(event) => updateSelected("name", event.target.value)} /></label>
          <label>Price<input type="number" value={selectedPackage.price} onChange={(event) => updateSelected("price", Number(event.target.value) || 0)} /></label>
          <label>Audience<input value={selectedPackage.audience} onChange={(event) => updateSelected("audience", event.target.value)} /></label>
          <label>Capacity<input type="number" value={selectedPackage.capacity} onChange={(event) => updateSelected("capacity", Number(event.target.value) || 0)} /></label>
          <label>Ticket color<input type="color" value={selectedPackage.color} onChange={(event) => updateSelected("color", event.target.value)} /></label>
          <label>Status<select value={selectedPackage.status} onChange={(event) => updateSelected("status", event.target.value)}><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="PAUSED">Paused</option></select></label>
          <label className="checkboxLine wide"><input checked={selectedPackage.showInShop} onChange={(event) => updateSelected("showInShop", event.target.checked)} type="checkbox" /> Show in public shop</label>
          <label className="wide">Public description<textarea rows={3} value={selectedPackage.description} onChange={(event) => updateSelected("description", event.target.value)} /></label>
          <label className="wide">Benefits<textarea rows={4} value={selectedPackage.benefits} onChange={(event) => updateSelected("benefits", event.target.value)} /></label>
          <div className="packageReadinessChecklist">
            <span className={selectedPackage.name ? "complete" : ""}>Name</span>
            <span className={selectedPackage.price > 0 ? "complete" : ""}>Price</span>
            <span className={selectedPackage.capacity > 0 ? "complete" : ""}>Capacity</span>
            <span className={selectedPackage.benefits.trim() ? "complete" : ""}>Benefits</span>
          </div>
          <div className="packageCopyPreview"><span>Public summary</span><strong>{checkoutCopy}</strong></div>
          <button className="primaryAction" type="button" onClick={savePackage}>Save package</button>
          {message ? <small className="formSuccess">{message}</small> : null}
          <form className="complimentaryTicketForm wide" onSubmit={issueComplimentaryTicket}>
            <strong>Issue complimentary ticket</strong>
            <div className="formGrid">
              <label>Name<input name="recipientName" placeholder="Recipient name" required /></label>
              <label>Email<input name="recipientEmail" placeholder="recipient@example.com" type="email" /></label>
              <label>Phone<input name="recipientPhone" placeholder="07..." /></label>
              <label>Quantity<input name="quantity" min="1" defaultValue="1" type="number" /></label>
            </div>
            <label>Note<textarea name="note" rows={2} placeholder="Partner, guest, sponsor, or internal reason" /></label>
            <button className="panelLink buttonReset" type="submit">Create complimentary ticket</button>
            {compMessage ? <small className="formSuccess">{compMessage}</small> : null}
          </form>
        </div>
      ) : null}
    </div>
  );
}
