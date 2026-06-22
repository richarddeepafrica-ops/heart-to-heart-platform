import { formatKes } from "@/lib/content";
import { getReportDashboard } from "@/lib/report-data";

const reportTypeLabels: Record<string, string> = {
  board: "Board fundraising report",
  pl: "Monthly P&L",
  campaigns: "Campaign performance",
  partners: "Partner contribution",
  children: "Children helped / waiting list"
};

const periodLabels: Record<string, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
  custom: "Custom range"
};

function pdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function line(text: string, x: number, y: number, size = 11) {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${pdfText(text)}) Tj ET`;
}

function createPdf(lines: Array<{ text: string; x: number; y: number; size?: number }>) {
  const content = lines.map((item) => line(item.text, item.x, item.y, item.size)).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "board";
  const period = url.searchParams.get("period") || "month";
  const report = await getReportDashboard();
  const generated = new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(report.generatedAt);

  const rows: Array<{ text: string; x: number; y: number; size?: number }> = [
    { text: "Heart to Heart Foundation", x: 52, y: 742, size: 18 },
    { text: reportTypeLabels[type] || reportTypeLabels.board, x: 52, y: 716, size: 24 },
    { text: `Period: ${periodLabels[period] || periodLabels.month}  |  Generated: ${generated}`, x: 52, y: 694, size: 10 },
    { text: `Confirmed raised: ${formatKes(report.confirmedRaised)}`, x: 52, y: 654, size: 14 },
    { text: `Pending review: ${formatKes(report.pendingAmount)}`, x: 52, y: 632, size: 11 },
    { text: `Failed payments: ${formatKes(report.failedAmount)}`, x: 52, y: 614, size: 11 },
    { text: `Donors: ${report.donorCount}  |  Event registrations: ${report.eventRegistrationCount}`, x: 52, y: 596, size: 11 },
    { text: "Campaign Performance", x: 52, y: 558, size: 15 }
  ];

  let y = 532;
  report.campaigns.slice(0, 8).forEach((campaign) => {
    rows.push({ text: campaign.name, x: 62, y, size: 11 });
    rows.push({ text: `${formatKes(campaign.raised)} / ${formatKes(campaign.goal)} (${campaign.percent}%)`, x: 330, y, size: 10 });
    y -= 20;
  });

  rows.push({ text: "Payment Methods", x: 52, y: y - 18, size: 15 });
  y -= 44;
  (report.methods.length ? report.methods : [{ name: "No received gifts", count: 0, amount: 0 }]).slice(0, 5).forEach((method) => {
    rows.push({ text: `${method.name} - ${method.count} gifts`, x: 62, y, size: 11 });
    rows.push({ text: formatKes(method.amount), x: 420, y, size: 10 });
    y -= 18;
  });

  rows.push({ text: "Board Priorities", x: 52, y: y - 18, size: 15 });
  y -= 44;
  report.boardPriorities.slice(0, 5).forEach((priority, index) => {
    rows.push({ text: `${index + 1}. ${priority}`, x: 62, y, size: 10 });
    y -= 18;
  });

  const pdf = createPdf(rows);
  const filenameDate = report.generatedAt.toISOString().slice(0, 10);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="heart-to-heart-report-${filenameDate}.pdf"`
    }
  });
}
