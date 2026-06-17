import { ChildCareApplicationForm } from "@/components/ChildCareApplicationForm";

export default function ApplyForCarePage() {
  return (
    <main>
      <section className="applicationHero childApplicationHero">
        <div>
          <p className="eyebrow">Apply for support</p>
          <h1>Request help for a child who may need heart care.</h1>
          <p>
            Parents and guardians can submit a private application for review by
            the Heart to Heart Foundation team. Applications are not published
            publicly without consent and medical review.
          </p>
        </div>
        <aside>
          <span>Private intake</span>
          <strong>Admin review happens before any child profile or fundraising page is created.</strong>
        </aside>
      </section>
      <section className="section applicationSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Parent / guardian form</p>
          <h2>Tell us what support is needed.</h2>
        </div>
        <ChildCareApplicationForm />
      </section>
    </main>
  );
}
