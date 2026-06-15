import { campaigns as previewCampaigns, fundedPercent } from "@/lib/content";
import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";
import type { Campaign } from "@/lib/types";

export type AdminCampaign = Campaign & {
  status: string;
};

function previewAdminCampaigns(): AdminCampaign[] {
  return previewCampaigns.map((campaign) => ({
    ...campaign,
    status: "ACTIVE"
  }));
}

export async function getAdminCampaigns(): Promise<AdminCampaign[]> {
  if (!hasDatabaseUrl()) return previewAdminCampaigns();

  try {
    const records = await db.campaign.findMany({
      orderBy: { createdAt: "desc" },
      include: { donations: true }
    });

    return records.map((campaign) => {
      const raised = campaign.donations.reduce((total, donation) => total + donation.amount, 0);
      return {
        id: campaign.slug,
        title: campaign.title,
        type: campaign.type,
        summary: campaign.summary,
        goal: campaign.goalAmount,
        raised,
        href: `/campaigns/${campaign.slug}`,
        status: campaign.status
      };
    });
  } catch (error) {
    return previewAdminCampaigns();
  }
}

export async function getAdminCampaignBySlug(slug: string): Promise<AdminCampaign | null> {
  if (!hasDatabaseUrl()) {
    return previewAdminCampaigns().find((campaign) => campaign.id === slug) ?? null;
  }

  try {
    const campaign = await db.campaign.findUnique({
      where: { slug },
      include: { donations: true }
    });

    if (!campaign) return null;

    const raised = campaign.donations.reduce((total, donation) => total + donation.amount, 0);
    return {
      id: campaign.slug,
      title: campaign.title,
      type: campaign.type,
      summary: campaign.summary,
      goal: campaign.goalAmount,
      raised,
      href: `/campaigns/${campaign.slug}`,
      status: campaign.status
    };
  } catch (error) {
    return previewAdminCampaigns().find((campaign) => campaign.id === slug) ?? null;
  }
}

export function campaignPercent(campaign: Pick<Campaign, "raised" | "goal">) {
  return fundedPercent(campaign.raised, campaign.goal);
}
