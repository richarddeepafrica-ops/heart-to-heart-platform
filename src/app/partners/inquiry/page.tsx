import { PartnerInquiryForm } from "@/components/PartnerInquiryForm";

export default function PartnerInquiryPage() {
  return (
    <main>
      <section className="partnerInquiryHero">
        <div>
          <p className="eyebrow">Partnership inquiry</p>
          <h1>Tell us how your organisation would like to help.</h1>
          <p>
            Share your details and the foundation team will follow up on the
            right sponsorship package, event opportunity, CSR partnership, or
            custom giving route.
          </p>
        </div>
        <aside className="partnerInquiryAside">
          <span>Admin follow-up</span>
          <strong>Submitted details go to the foundation team for partnership review.</strong>
          <p>For urgent matters, call +254 738 150 092 or email hearttoheart@karenhospital.org.</p>
        </aside>
      </section>

      <section className="section partnerInquirySection">
        <PartnerInquiryForm />
      </section>
    </main>
  );
}
