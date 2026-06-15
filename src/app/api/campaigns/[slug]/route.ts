import { CampaignStatus } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { campaigns, fundedPercent } from "@/lib/content";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";
import { db } from "@/lib/db";

type CampaignRouteContext = {
  params: Promise<unknown>;
};

const campaignStatuses = new Set<string>(Object.values(CampaignStatus));

async function readSlug(context: CampaignRouteContext) {
  const params = await context.params;
  return typeof params === "object" && params !== null && "slug" in params
    ? readString((params as { slug?: unknown }).slug)
    : "";
}

export async function PATCH(request: NextRequest, context: CampaignRouteContext) {
  const slug = await readSlug(context);
  if (!slug) return apiError("Campaign slug is required.");

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid campaign update request.");

  const title = readString(body.title);
  const summary = readString(body.summary);
  const goalAmount = readPositiveInt(body.goalAmount);
  const status = readString(body.status).toUpperCase();

  if (!title) return apiError("Campaign title is required.");
  if (!summary) return apiError("Campaign summary is required.");
  if (goalAmount < 1000) return apiError("Campaign goal must be at least KES 1,000.");
  if (!campaignStatuses.has(status)) return apiError("Unsupported campaign status.");

  if (!hasDatabaseUrl()) {
    const current = campaigns.find((campaign) => campaign.id === slug);
    const raised = current?.raised ?? 0;

    return NextResponse.json({
      ok: true,
      mode: "preview",
      campaign: {
        id: current?.id ?? `preview-${slug}`,
        slug,
        title,
        summary,
        goalAmount,
        raised,
        status,
        percentFunded: fundedPercent(raised, goalAmount)
      },
      nextAction: "Connect DATABASE_URL and run migrations to save campaign edits permanently."
    });
  }

  try {
    const campaign = await db.campaign.update({
      where: { slug },
      data: {
        title,
        summary,
        goalAmount,
        status: status as CampaignStatus
      },
      include: { donations: true }
    });
    const raised = campaign.donations.reduce((total, donation) => total + donation.amount, 0);

    return NextResponse.json({
      ok: true,
      mode: "database",
      campaign: {
        id: campaign.id,
        slug: campaign.slug,
        title: campaign.title,
        summary: campaign.summary,
        goalAmount: campaign.goalAmount,
        raised,
        status: campaign.status,
        percentFunded: fundedPercent(raised, campaign.goalAmount)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Campaign could not be updated right now." },
      { status: 503 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: CampaignRouteContext) {
  const slug = await readSlug(context);
  if (!slug) return apiError("Campaign slug is required.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      campaign: { slug, status: "ARCHIVED" },
      nextAction: "Connect DATABASE_URL and run migrations to archive campaigns permanently."
    });
  }

  try {
    const campaign = await db.campaign.update({
      where: { slug },
      data: { status: CampaignStatus.ARCHIVED }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      campaign: {
        id: campaign.id,
        slug: campaign.slug,
        status: campaign.status
      }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Campaign could not be archived right now." },
      { status: 503 }
    );
  }
}
