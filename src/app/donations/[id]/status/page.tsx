import { notFound } from "next/navigation";
import { formatKes } from "@/lib/content";
import { db } from "@/lib/db";

type DonationStatusPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DonationStatusPage({ params }: DonationStatusPageProps) {
  const { id } = await params;
  const donation = await db.donation.findUnique({
    where: { id },
    include: {
      donor: true,
      campaign: true,
      beneficiary: true,
      event: true,
      transactions: { orderBy: { createdAt: "desc" }, take: 1 }
    }
  });

  if (!donation) notFound();

  const transaction = donation.transactions[0];
  const destination =
    donation.destinationLabel ||
    donation.beneficiary?.publicName ||
    donation.event?.title ||
    donation.campaign?.title ||
    "Heart to Heart Foundation";

  return (
    <main>
      <section className="pageHero compact">
        <p className="eyebrow">Donation status</p>
        <h1>{donation.status === "CONFIRMED" ? "Thank you. Your gift is confirmed." : "Your gift is being processed."}</h1>
        <p>
          Keep this page as your payment reference. It will show whether the gift is
          pending, confirmed, failed, or reconciled.
        </p>
      </section>

      <section className="twoColumn">
        <article className="checkoutPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Gift summary</p>
              <h2>{destination}</h2>
            </div>
            <span className={`status ${donation.status === "CONFIRMED" ? "success" : ""}`}>{donation.status}</span>
          </div>
          <div className="summaryRows">
            <span>Amount</span><strong>{formatKes(donation.amount)}</strong>
            <span>Payment method</span><strong>{donation.method.replace("_", " ")}</strong>
            <span>Destination type</span><strong>{donation.destinationType}</strong>
            {donation.packageName ? <><span>Package</span><strong>{donation.packageName}</strong></> : null}
            <span>Receipt</span><strong>{donation.receiptNumber || "Pending payment confirmation"}</strong>
            <span>Reference</span><strong>{donation.providerRef || transaction?.checkoutRef || donation.id}</strong>
          </div>
        </article>

        <aside className="checkoutPanel">
          <p className="eyebrow">What happens next</p>
          <h2>Payment follow-up</h2>
          <p className="muted">
            For M-Pesa, confirm the STK Push on your phone. Once Safaricom sends
            the callback, this donation will move from pending to confirmed.
          </p>
          <a className="button primary wide" href="/donate">Make another gift</a>
          <a className="button secondary wide" href="/">Return home</a>
        </aside>
      </section>
    </main>
  );
}
