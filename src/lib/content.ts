import type { Campaign, EventProduct, ImpactMetric } from "./types";

export const heroImages = [
  "/assets/hero/DSC_0634-scaled.jpg",
  "/assets/hero/DSC_0101-scaled.jpg",
  "/assets/hero/Heart-to-Heart-Foundation-1.jpg",
  "/assets/hero/DSC_8428-scaled.jpg",
  "/assets/hero/Heart-to-Heart-Foundation-6.jpg",
  "/assets/hero/Heart-to-Heart-Foundation-9.jpg",
  "/assets/hero/Heart-to-Heart-Foundation-3.jpg",
  "/assets/hero/Heart-to-Heart-Foundation-5.jpg"
];

export const impactMetrics: ImpactMetric[] = [
  { label: "teachers trained annually", value: "500+" },
  { label: "children taught about rheumatic fever", value: "10K" },
  { label: "surgeries and growing", value: "600+" },
  { label: "Heart Run / Walk participants annually", value: "25K" }
];

export const campaigns: Campaign[] = [
  {
    id: "fund-20-heart-surgeries",
    title: "Fund 20 Heart Surgeries",
    type: "Urgent surgery appeal",
    summary: "Support open heart surgeries for children from underprivileged backgrounds.",
    goal: 10000000,
    raised: 6400000,
    href: "/campaigns/fund-20-heart-surgeries"
  },
  {
    id: "rheumatic-fever-awareness",
    title: "Rheumatic Fever Prevention",
    type: "Prevention and control",
    summary: "Support awareness and prevention of rheumatic fever and rheumatic heart disease.",
    goal: 3000000,
    raised: 1140000,
    href: "/campaigns/rheumatic-fever-awareness"
  },
  {
    id: "heart-run-walk",
    title: "Heart Run / Walk Giving",
    type: "Event fundraising",
    summary: "Donate toward the annual Heart Run / Walk and help the event raise funds for children awaiting heart care.",
    goal: 5000000,
    raised: 2100000,
    href: "/events/heart-run/donate"
  }
];

export const eventProducts: EventProduct[] = [
  { name: "Individual", price: 1500, description: "Single Heart Run / Walk registration." },
  { name: "Family", price: 5000, description: "Family registration package." },
  { name: "School Team", price: 25000, description: "School team registration and coordination." },
  { name: "Corporate Team", price: 100000, description: "Corporate team package with visibility." }
];

export function formatKes(value: number) {
  return `KES ${value.toLocaleString("en-KE")}`;
}

export function fundedPercent(raised: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}
