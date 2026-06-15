import { NextResponse } from "next/server";
import { CampaignStatus } from "@prisma/client";
import { campaigns, fundedPercent } from "@/lib/content";
import { db } from "@/lib/db";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";

const campaignStatuses = new Set<string>(Object.values(CampaignStatus));

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      source: "static-preview",
      campaigns: campaigns.map((campaign) => ({
        ...campaign,
        percentFunded: fundedPercent(campaign.raised, campaign.goal)
      }))
    });
  }

  try {
    const records = await db.campaign.findMany({
      orderBy: { createdAt: "desc" },
      include: { donations: true }
    });

    return NextResponse.json({
      ok: true,
      source: "database",
      campaigns: records.map((campaign) => {
        const raised = campaign.donations.reduce((total, donation) => total + donation.amount, 0);
        return {
          id: campaign.id,
          slug: campaign.slug,
          title: campaign.title,
          type: campaign.type,
          summary: campaign.summary,
          goal: campaign.goalAmount,
          raised,
          href: `/campaigns/${campaign.slug}`,
          status: campaign.status,
          percentFunded: fundedPercent(raised, campaign.goalAmount)
        };
      })
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Campaign data is temporarily unavailable." },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid campaign request.");

  const title = readString(body.title);
  const type = readString(body.type) || "Fundraising appeal";
  const summary = readString(body.summary);
  const goalAmount = readPositiveInt(body.goalAmount);
  const status = readString(body.status).toUpperCase() || CampaignStatus.DRAFT;
  const requestedSlug = readString(body.slug);
  const slug = slugify(requestedSlug || title);

  if (!title) return apiError("Campaign title is required.");
  if (!summary) return apiError("Campaign summary is required.");
  if (!slug) return apiError("Campaign slug is required.");
  if (goalAmount < 1000) return apiError("Campaign goal must be at least KES 1,000.");
  if (!campaignStatuses.has(status)) return apiError("Unsupported campaign status.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      campaign: {
        id: `preview-${Date.now()}`,
        slug,
        title,
        type,
        summary,
        goalAmount,
        raised: 0,
        status,
        percentFunded: 0
      },
      nextAction: "Connect DATABASE_URL and run migrations to save campaigns permanently."
    });
  }

  try {
    const campaign = await db.campaign.create({
      data: {
        slug,
        title,
        type,
        summary,
        goalAmount,
        status: status as CampaignStatus
      }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      campaign: {
        id: campaign.id,
        slug: campaign.slug,
        title: campaign.title,
        type: campaign.type,
        summary: campaign.summary,
        goalAmount: campaign.goalAmount,
        raised: 0,
        status: campaign.status,
        percentFunded: 0
      }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Campaign could not be created right now. Check that the slug is unique." },
      { status: 503 }
    );
  }
}
