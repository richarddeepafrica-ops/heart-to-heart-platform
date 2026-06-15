const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const campaigns = [
  {
    slug: "fund-20-heart-surgeries",
    title: "Fund 20 Heart Surgeries",
    type: "Urgent surgery appeal",
    summary: "Support open heart surgeries for children from underprivileged backgrounds.",
    goalAmount: 10000000,
    raised: 6400000,
    status: "ACTIVE"
  },
  {
    slug: "rheumatic-fever-awareness",
    title: "Rheumatic Fever Prevention",
    type: "Prevention and control",
    summary: "Support awareness and prevention of rheumatic fever and rheumatic heart disease.",
    goalAmount: 3000000,
    raised: 1140000,
    status: "ACTIVE"
  },
  {
    slug: "heart-run-walk",
    title: "Heart Run / Walk Giving",
    type: "Event fundraising",
    summary: "Donate toward the annual Heart Run / Walk and help the event raise funds for children awaiting heart care.",
    goalAmount: 5000000,
    raised: 2100000,
    status: "ACTIVE"
  }
];

const events = [
  {
    slug: "heart-run",
    title: "Heart Run / Walk",
    summary: "Annual community run raising funds for children awaiting heart treatment.",
    startsAt: new Date("2026-03-28T06:30:00+03:00"),
    venue: "Nairobi"
  },
  {
    slug: "goat-derby",
    title: "Goat Derby",
    summary: "A community fundraising tradition for child heart care.",
    startsAt: new Date("2026-08-15T11:00:00+03:00"),
    venue: "Nairobi"
  },
  {
    slug: "gala-dinner",
    title: "Gala Dinner",
    summary: "A partner and major supporter giving moment.",
    startsAt: new Date("2026-11-27T18:30:00+03:00"),
    venue: "Nairobi"
  }
];

const partners = [
  ["KCB Bank", "Banking partner", 1000000],
  ["Co-op Bank", "Corporate supporter", 750000],
  ["Philips", "Healthcare technology partner", 750000],
  ["Jubilee", "Insurance partner", 500000]
];

const beneficiaries = [
  {
    slug: "joy-wambui",
    publicName: "Joy Wambui",
    privateName: "Joy Wambui",
    age: 9,
    diagnosis: "Surgery and follow-up support",
    storySummary: "Sponsorship helps Joy's family stay connected to review, treatment, medication, and recovery support.",
    fundingGoal: 180000,
    consentStatus: "APPROVED"
  },
  {
    slug: "jsean-kairu",
    publicName: "J'sean Kairu",
    privateName: "J'sean Kairu",
    age: 7,
    diagnosis: "Treatment and recovery care",
    storySummary: "Your sponsorship helps cover practical treatment needs while the family follows the care plan.",
    fundingGoal: 250000,
    consentStatus: "APPROVED"
  },
  {
    slug: "privacy-safe-profile",
    publicName: "Privacy-safe profile",
    privateName: null,
    age: null,
    diagnosis: "Pending approval",
    storySummary: "This profile should only publish after guardian consent and medical review.",
    fundingGoal: 100000,
    consentStatus: "DRAFT"
  }
];

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@hearttoheart.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-this-password";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "System Administrator",
      role: "SUPER_ADMIN",
      passwordHash: hashPassword(adminPassword)
    },
    create: {
      name: "System Administrator",
      email: adminEmail,
      role: "SUPER_ADMIN",
      passwordHash: hashPassword(adminPassword)
    }
  });

  for (const campaign of campaigns) {
    const { raised, ...campaignData } = campaign;
    const record = await prisma.campaign.upsert({
      where: { slug: campaign.slug },
      update: campaignData,
      create: campaignData
    });

    const existingDonationCount = await prisma.donation.count({
      where: { campaignId: record.id, source: "seed-progress" }
    });

    if (existingDonationCount === 0 && raised > 0) {
      await prisma.donation.create({
        data: {
          campaignId: record.id,
          amount: raised,
          method: "CASH",
          status: "CONFIRMED",
          source: "seed-progress"
        }
      });
    }
  }

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: event,
      create: event
    });
  }

  for (const [organization, interest, estimatedValue] of partners) {
    await prisma.corporatePartner.upsert({
      where: { organization },
      update: { interest, estimatedValue, pipelineStage: "ACTIVE_PARTNER" },
      create: { organization, interest, estimatedValue, pipelineStage: "ACTIVE_PARTNER" }
    });
  }

  for (const beneficiary of beneficiaries) {
    await prisma.beneficiary.upsert({
      where: { slug: beneficiary.slug },
      update: beneficiary,
      create: beneficiary
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
