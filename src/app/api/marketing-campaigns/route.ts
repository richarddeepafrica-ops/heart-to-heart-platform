import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";
import { db } from "@/lib/db";

const allowedChannels = ["EMAIL", "SMS", "WHATSAPP", "SOCIAL", "MULTI_CHANNEL"] as const;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid marketing campaign request.");

  const name = readString(body.name);
  const objective = readString(body.objective);
  const audienceName = readString(body.audienceName);
  const channel = readString(body.channel).toUpperCase() || "MULTI_CHANNEL";
  const budgetAmount = readPositiveInt(body.budgetAmount);

  if (!name) return apiError("Campaign name is required.");
  if (!objective) return apiError("Campaign objective is required.");
  if (!audienceName) return apiError("Audience name is required.");
  if (!allowedChannels.includes(channel as (typeof allowedChannels)[number])) {
    return apiError("Unsupported marketing channel.");
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      marketingCampaign: {
        id: `preview-marketing-${Date.now()}`,
        name,
        objective,
        audienceName,
        channel,
        status: "DRAFT",
        budgetAmount: budgetAmount || null
      }
    });
  }

  try {
    const marketingCampaign = await db.marketingCampaign.create({
      data: {
        name,
        objective,
        audienceName,
        channel: channel as (typeof allowedChannels)[number],
        budgetAmount: budgetAmount || null
      }
    });

    return NextResponse.json({ ok: true, marketingCampaign });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Marketing campaign could not be created right now." },
      { status: 503 }
    );
  }
}
