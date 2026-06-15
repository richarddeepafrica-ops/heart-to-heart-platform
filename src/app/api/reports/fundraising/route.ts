import { getReportDashboard, reportRowsToCsv } from "@/lib/report-data";

export async function GET() {
  const report = await getReportDashboard();
  const csv = reportRowsToCsv(report);
  const filenameDate = report.generatedAt.toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="heart-to-heart-fundraising-${filenameDate}.csv"`
    }
  });
}
