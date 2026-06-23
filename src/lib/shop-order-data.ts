import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

export type ShopOrderRecord = {
  id: string;
  customerName: string;
  customerContact: string;
  item: string;
  quantity: number;
  size: string | null;
  amount: number;
  status: string;
  method: string;
  createdAt: Date;
};

function sourceValue(source: string | null | undefined, prefix: string) {
  const parts = (source || "").split("|");
  const match = parts.find((part) => part.startsWith(prefix));
  return match ? match.slice(prefix.length) : "";
}

export function parseShopQuantity(source: string | null | undefined) {
  return Number(sourceValue(source, "quantity-")) || 1;
}

export function parseShopSize(source: string | null | undefined) {
  return sourceValue(source, "size-") || null;
}

export async function getShopOrders(limit = 60): Promise<ShopOrderRecord[]> {
  if (!hasDatabaseUrl()) return [];

  try {
    const orders = await db.donation.findMany({
      where: { destinationType: "merchandise" },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { donor: true }
    });

    return orders.map((order) => ({
      id: order.id,
      customerName: order.donor?.name || "Shop customer",
      customerContact: order.donor?.email || order.donor?.phone || "No contact",
      item: order.packageName || order.destinationLabel || "Shop item",
      quantity: parseShopQuantity(order.source),
      size: parseShopSize(order.source),
      amount: order.amount,
      status: order.status,
      method: order.method,
      createdAt: order.createdAt
    }));
  } catch {
    return [];
  }
}
