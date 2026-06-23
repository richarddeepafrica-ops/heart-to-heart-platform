import { notFound } from "next/navigation";
import { formatKes } from "@/lib/content";
import { db } from "@/lib/db";
import { parseShopQuantity, parseShopSize } from "@/lib/shop-order-data";

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
      registration: { include: { event: true } },
      transactions: { orderBy: { createdAt: "desc" }, take: 1 }
    }
  });

  if (!donation) notFound();

  const transaction = donation.transactions[0];
  const isShopOrder = donation.destinationType === "merchandise";
  const isEventTicket = donation.destinationType === "event-registration";
  const shopQuantity = parseShopQuantity(donation.source);
  const shopSize = parseShopSize(donation.source);
  const destination =
    donation.destinationLabel ||
    donation.beneficiary?.publicName ||
    donation.event?.title ||
    donation.campaign?.title ||
    "Heart to Heart Foundation";

  return (
    <main>
      <section className="pageHero compact">
        <p className="eyebrow">{isShopOrder ? "Shop receipt" : isEventTicket ? "Ticket receipt" : "Donation status"}</p>
        <h1>{donation.status === "CONFIRMED" ? "Thank you. Payment is confirmed." : "Your payment is being processed."}</h1>
        <p>
          Keep this page as your payment reference. It shows the item, event, or cause connected to this payment.
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
            <span>{isShopOrder ? "Item" : isEventTicket ? "Ticket" : "Destination type"}</span><strong>{isShopOrder || isEventTicket ? donation.packageName || destination : donation.destinationType}</strong>
            {isShopOrder ? <><span>Quantity</span><strong>{shopQuantity}</strong></> : null}
            {isShopOrder && shopSize ? <><span>Size</span><strong>{shopSize}</strong></> : null}
            {isEventTicket ? <><span>Event</span><strong>{donation.registration?.event.title || donation.event?.title || destination}</strong></> : null}
            {isEventTicket ? <><span>Attendees</span><strong>{donation.registration?.quantity || 1}</strong></> : null}
            {isEventTicket ? <><span>Check-in code</span><strong>{donation.registration ? `H2H-${donation.registration.id.slice(-6).toUpperCase()}` : "Pending"}</strong></> : null}
            <span>Receipt</span><strong>{donation.receiptNumber || "Pending payment confirmation"}</strong>
            <span>Reference</span><strong>{donation.providerRef || transaction?.checkoutRef || donation.id}</strong>
          </div>
        </article>

        <aside className="checkoutPanel">
          <p className="eyebrow">What happens next</p>
          <h2>{isEventTicket ? "Event check-in" : isShopOrder ? "Order follow-up" : "Payment follow-up"}</h2>
          <p className="muted">
            {isEventTicket
              ? "Bring your check-in code to the event. The registration team can confirm payment and mark arrival from the admin portal."
              : isShopOrder
                ? "The shop team can use this receipt to confirm payment and prepare the item for collection or delivery."
                : "For M-Pesa, confirm the STK Push on your phone. Once Safaricom sends the callback, this donation will move from pending to confirmed."}
          </p>
          <a className="button primary wide" href={isShopOrder ? "/shop" : isEventTicket ? "/events" : "/donate"}>{isShopOrder ? "Return to shop" : isEventTicket ? "View events" : "Make another gift"}</a>
          <a className="button secondary wide" href="/">Return home</a>
        </aside>
      </section>
    </main>
  );
}
