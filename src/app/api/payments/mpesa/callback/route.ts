import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { markDonationConfirmed, markDonationFailed } from "@/lib/payment-status";

type MpesaCallbackItem = {
  Name: string;
  Value?: string | number;
};

type MpesaCallbackPayload = {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: {
        Item?: MpesaCallbackItem[];
      };
    };
  };
};

function callbackValue(items: MpesaCallbackItem[] | undefined, name: string) {
  return items?.find((item) => item.Name === name)?.Value;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as MpesaCallbackPayload | null;
  const callback = payload?.Body?.stkCallback;

  if (!callback?.CheckoutRequestID) {
    return NextResponse.json({ ok: false, message: "Invalid M-Pesa callback." }, { status: 400 });
  }

  const transaction = await db.paymentTransaction.findFirst({
    where: { checkoutRef: callback.CheckoutRequestID },
    include: { donation: true }
  });

  if (!transaction) {
    return NextResponse.json({ ok: true, message: "Callback accepted for unknown checkout reference." });
  }

  const items = callback.CallbackMetadata?.Item;
  const receipt = String(callbackValue(items, "MpesaReceiptNumber") || "");

  await db.paymentTransaction.update({
    where: { id: transaction.id },
    data: {
      status: callback.ResultCode === 0 ? "CALLBACK_RECEIVED" : "FAILED",
      providerRef: receipt || callback.MerchantRequestID || transaction.providerRef,
      rawPayload: payload as Prisma.InputJsonValue
    }
  });

  if (callback.ResultCode === 0) {
    await markDonationConfirmed(transaction.donationId, receipt);
  } else {
    await markDonationFailed(transaction.donationId);
  }

  return NextResponse.json({ ok: true });
}
