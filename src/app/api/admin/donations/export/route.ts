import { getDonationDashboard } from "@/lib/donation-data";

function csvCell(value: string | number | Date) {
  const stringValue = value instanceof Date ? value.toISOString() : String(value);
  return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, "\"\"")}"` : stringValue;
}

export async function GET() {
  const dashboard = await getDonationDashboard();
  const rows = [
    ["Receipt", "Donor", "Amount", "Method", "Destination", "Status", "Created at"],
    ...dashboard.records.map((record) => [
      record.id,
      record.donor,
      record.amount,
      record.method,
      record.destination,
      record.status,
      record.createdAt
    ])
  ];
  const csv = `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
  const filenameDate = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="heart-to-heart-donations-${filenameDate}.csv"`
    }
  });
}
