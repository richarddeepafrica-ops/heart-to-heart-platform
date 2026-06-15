export type SponsorshipProfile = {
  slug: string;
  initials: string;
  name: string;
  displayName: string;
  age: string;
  need: string;
  goalAmount: number;
  raisedPercent: string;
  story: string;
  portraitImage?: string;
};

export const sponsorshipProfiles: SponsorshipProfile[] = [
  {
    slug: "joy-wambui",
    initials: "JW",
    name: "Joy Wambui",
    displayName: "Joy, age 9",
    age: "9 years",
    need: "Needs surgery support and post-care follow-up.",
    goalAmount: 180000,
    raisedPercent: "72% funded",
    story: "Sponsorship helps Joy's family stay connected to review, treatment, medication, and recovery support.",
    portraitImage: "/assets/impact/joy-wambui.jpeg"
  },
  {
    slug: "jsean-kairu",
    initials: "JK",
    name: "J'sean Kairu",
    displayName: "J'sean, age 7",
    age: "7 years",
    need: "Funding needed for treatment and recovery care.",
    goalAmount: 250000,
    raisedPercent: "46% funded",
    story: "Your sponsorship helps cover practical treatment needs while the family follows the care plan.",
    portraitImage: "/assets/impact/jsean-kairu.jpeg"
  },
  {
    slug: "privacy-safe-profile",
    initials: "LM",
    name: "Privacy-safe profile",
    displayName: "Privacy-safe profile",
    age: "Draft review",
    need: "Visible only after consent and admin approval.",
    goalAmount: 100000,
    raisedPercent: "Draft review",
    story: "This profile represents a child whose story should only be published after guardian consent and medical review."
  }
];

export function findSponsorshipProfile(slug: string) {
  return sponsorshipProfiles.find((profile) => profile.slug === slug);
}

export function sponsorDonateHref(profile: SponsorshipProfile, amount = profile.goalAmount) {
  const params = new URLSearchParams({
    type: "child",
    childSlug: profile.slug,
    label: profile.displayName,
    amount: String(amount)
  });
  return `/donate?${params.toString()}#give`;
}
