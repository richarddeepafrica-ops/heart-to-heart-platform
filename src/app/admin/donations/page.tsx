import { formatKes } from "@/lib/content";
import { getDonationDashboard } from "@/lib/donation-data";
import { OfflineDonationForm } from "@/components/OfflineDonationForm";

type DonationsPageProps = {
  searchParams: Promise<{ status?: string; method?: string; type?: string; sort?: string }>;
};

export default async function DonationsPage({ searchParams }: DonationsPageProps) {
  const params = await searchParams;
  const dashboard = await getDonationDashboard();
  const statuses = Array.from(new Set(dashboard.records.map((record) => record.status)));
  const methods = Array.from(new Set(dashboard.records.map((record) => record.method)));
  const types = Array.from(new Set(dashboard.records.map((record) => record.type)));
  const sort = params.sort || "latest";
  const filteredRecords = dashboard.records
    .filter((record) => !params.status || record.status === params.status)
    .filter((record) => !params.method || record.method === params.method)
    .filter((record) => !params.type || record.type === params.type)
    .sort((a, b) => {
      if (sort === "amount-high") return b.amount - a.amount;
      if (sort === "amount-low") return a.amount - b.amount;
      if (sort === "donor-az") return a.donor.localeCompare(b.donor);
      if (sort === "destination-az") return a.destination.localeCompare(b.destination);
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  function filterHref(key: "status" | "method" | "type" | "sort", value: string) {
    const query = new URLSearchParams({
      ...(params.status ? { status: params.status } : {}),
      ...(params.method ? { method: params.method } : {}),
      ...(params.type ? { type: params.type } : {}),
      ...(params.sort ? { sort: params.sort } : {})
    });
    query.set(key, value);
    return `/admin/donations?${query.toString()}`;
  }

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Donations</p><h1>Gift records</h1></div>
        <div className="adminActions"><a href="/api/admin/donations/export">Export CSV</a><a className="primaryAction" href="#record-offline-gift">Record offline gift</a></div>
      </header>
      <section className="adminKpis">
        {[ 
          ["Today", formatKes(dashboard.todayTotal), "latest gifts", "/admin/donations?sort=latest"],
          ["Confirmed", formatKes(dashboard.confirmedTotal), "paid or reconciled", "/admin/donations?status=CONFIRMED"],
          ["Pending", String(dashboard.pendingCount), "receipt queue", "/admin/donations?status=PENDING"],
          ["Failed", String(dashboard.failedCount), "needs follow-up", "/admin/donations?status=FAILED"]
        ].map(([label, value, meta, href]) => <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>)}
      </section>
      <article className="appPanel">
        <div className="panelHeader"><div><p className="eyebrow">Records</p><h2>Latest donations</h2></div><a className="panelLink" href="/admin/finance">Finance review</a></div>
        <div className="adminFilterBar" aria-label="Donation filters">
          <a href="/admin/donations">All records</a>
          {statuses.map((status) => <a href={filterHref("status", status)} key={status}>{status}</a>)}
          {methods.map((method) => <a href={filterHref("method", method)} key={method}>{method.replace("_", " ")}</a>)}
          {types.map((type) => <a href={filterHref("type", type)} key={type}>{type.replace("-", " ")}</a>)}
          {[
            ["latest", "Latest"],
            ["amount-high", "Amount high-low"],
            ["amount-low", "Amount low-high"],
            ["donor-az", "Donor A-Z"],
            ["destination-az", "Destination A-Z"]
          ].map(([value, label]) => <a className={sort === value ? "active" : ""} href={filterHref("sort", value)} key={value}>{label}</a>)}
        </div>
        <div className="simpleTable six">
          {filteredRecords.map((record) => (
            <div key={record.id}>
              <strong>{record.id}</strong>
              <span>{record.donor}</span>
              <span>{formatKes(record.amount)}</span>
              <span>{record.method.replace("_", " ")}</span>
              <span>{record.destination}</span>
              <em>{record.status}</em>
            </div>
          ))}
        </div>
      </article>
      <div className="adminInlineHelp"><a href="/admin/help">Open donation reconciliation guide</a></div>
      <article className="appPanel adminFormPanel" id="record-offline-gift">
        <div className="panelHeader">
          <div><p className="eyebrow">Offline gifts</p><h2>Record cash or bank transfer</h2></div>
        </div>
        <OfflineDonationForm />
      </article>
    </>
  );
}
