import { getEventDashboard } from "@/lib/event-data";

function csvCell(value: string | number | Date | null) {
  const stringValue = value instanceof Date ? value.toISOString() : String(value ?? "");
  return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, "\"\"")}"` : stringValue;
}

function registrationCode(id: string) {
  return `H2H-${id.slice(-6).toUpperCase()}`;
}

export async function GET() {
  const dashboard = await getEventDashboard();
  const rows = [
    ["Registration ID", "Check-in code", "Event", "Attendee", "Contact", "Package", "Quantity", "Amount", "Payment status", "Checked in at", "Created at"],
    ...dashboard.registrations.map((registration) => [
      registration.id,
      registrationCode(registration.id),
      registration.eventTitle,
      registration.donorName,
      registration.donorContact,
      registration.ticketType,
      registration.quantity,
      registration.totalAmount,
      registration.paymentStatus,
      registration.checkedInAt,
      registration.createdAt
    ])
  ];
  const csv = `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
  const filenameDate = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="heart-to-heart-event-registrations-${filenameDate}.csv"`
    }
  });
}
