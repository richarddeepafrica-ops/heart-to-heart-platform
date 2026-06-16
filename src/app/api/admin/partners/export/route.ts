import { getPartnerDashboard, partnerRowsToCsv } from "@/lib/partner-data";

export async function GET() {
  const dashboard = await getPartnerDashboard();
  const csv = partnerRowsToCsv(dashboard);
  const filenameDate = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="heart-to-heart-partner-pipeline-${filenameDate}.csv"`
    }
  });
}
