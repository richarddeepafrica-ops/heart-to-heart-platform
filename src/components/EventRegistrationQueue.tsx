"use client";

import { useMemo, useState } from "react";
import { EventCheckInForm } from "@/components/EventCheckInForm";
import { formatKes } from "@/lib/content";

export type EventRegistrationQueueItem = {
  id: string;
  eventTitle: string;
  donorName: string;
  donorContact: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  checkedInAt: string | null;
  createdAt: string;
};

type EventRegistrationQueueProps = {
  registrations: EventRegistrationQueueItem[];
};

function normalized(value: string) {
  return value.toLowerCase().trim();
}

function registrationCode(id: string) {
  return `H2H-${id.slice(-6).toUpperCase()}`;
}

function formatRegistrationDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function EventRegistrationQueue({ registrations }: EventRegistrationQueueProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [checkIn, setCheckIn] = useState("ALL");

  const filteredRegistrations = useMemo(() => {
    const needle = normalized(query);
    return registrations.filter((registration) => {
      const haystack = normalized([
        registration.donorName,
        registration.donorContact,
        registration.eventTitle,
        registration.ticketType,
        registration.paymentStatus
      ].join(" "));
      const matchesQuery = !needle || haystack.includes(needle);
      const matchesStatus = status === "ALL" || registration.paymentStatus === status;
      const matchesCheckIn =
        checkIn === "ALL" ||
        (checkIn === "CHECKED_IN" && registration.checkedInAt) ||
        (checkIn === "NOT_CHECKED_IN" && !registration.checkedInAt);

      return matchesQuery && matchesStatus && matchesCheckIn;
    });
  }, [checkIn, query, registrations, status]);

  const paymentStatuses = Array.from(new Set(registrations.map((registration) => registration.paymentStatus))).sort();

  return (
    <div className="eventRegistrationQueue">
      <div className="eventQueueToolbar">
        <label>
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, phone, package..." />
        </label>
        <label>
          Payment
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="ALL">All payments</option>
            {paymentStatuses.map((paymentStatus) => (
              <option value={paymentStatus} key={paymentStatus}>{paymentStatus}</option>
            ))}
          </select>
        </label>
        <label>
          Check-in
          <select value={checkIn} onChange={(event) => setCheckIn(event.target.value)}>
            <option value="ALL">All attendees</option>
            <option value="CHECKED_IN">Checked in</option>
            <option value="NOT_CHECKED_IN">Not checked in</option>
          </select>
        </label>
        <a className="primaryAction" href="/api/admin/events/registrations/export">Export CSV</a>
      </div>

      <div className="simpleTable eventRegistrationTable">
        {filteredRegistrations.length ? filteredRegistrations.map((registration) => (
          <div key={registration.id}>
            <strong>{registration.donorName}<small>{registration.donorContact}</small></strong>
            <span>{registration.eventTitle}</span>
            <span>{registration.ticketType} x {registration.quantity}<small>{registrationCode(registration.id)} · {formatRegistrationDate(registration.createdAt)}</small></span>
            <span>{formatKes(registration.totalAmount)}</span>
            <em className={registration.checkedInAt ? "status success" : registration.paymentStatus === "CONFIRMED" ? "status" : "status warning"}>
              {registration.checkedInAt ? "Checked in" : registration.paymentStatus}
            </em>
            <EventCheckInForm registrationId={registration.id} initialCheckedIn={Boolean(registration.checkedInAt)} />
          </div>
        )) : (
          <div>
            <strong>No matching registrations</strong>
            <span>Adjust search or filters.</span>
            <span>Package pending</span>
            <span>{formatKes(0)}</span>
            <em className="status warning">Waiting</em>
            <span>Nothing to check in</span>
          </div>
        )}
      </div>
    </div>
  );
}
