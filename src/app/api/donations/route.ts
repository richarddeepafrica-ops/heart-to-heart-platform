import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";
import { db } from "@/lib/db";
import { initiateMpesaStkPush, normalizeMpesaPhone } from "@/lib/mpesa";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid donation request.");

  const amount = readPositiveInt(body.amount);
  const name = readString(body.name) || "Anonymous donor";
  const email = readString(body.email);
  const phone = readString(body.phone);
  const campaignSlug = readString(body.campaignSlug);
  const childSlug = readString(body.childSlug);
  const eventSlug = readString(body.eventSlug);
  const packageName = readString(body.packageName);
  const destinationType = readString(body.destinationType) || "campaign";
  const destinationLabel = readString(body.destinationLabel);
  const frequency = readString(body.frequency) || "one-time";
  const method = readString(body.method).toUpperCase() || "MPESA";

  if (amount < 100) return apiError("Donation amount must be at least KES 100.");
  if (!["MPESA", "CARD", "BANK_TRANSFER", "CASH"].includes(method)) {
    return apiError("Unsupported payment method.");
  }
  if (method === "MPESA" && !normalizeMpesaPhone(phone)) {
    return apiError("Enter a valid M-Pesa phone number.");
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      donation: {
        id: `preview-${Date.now()}`,
        amount,
        currency: "KES",
        method,
        status: "PENDING",
        frequency,
        destinationType,
        destinationLabel,
        packageName,
        donorName: name
      },
      nextAction: "Connect DATABASE_URL and payment provider credentials to process live gifts."
    });
  }

  try {
    const campaign = campaignSlug
      ? await db.campaign.findUnique({ where: { slug: campaignSlug } })
      : null;
    const beneficiary = childSlug
      ? await db.beneficiary.findUnique({ where: { slug: childSlug } })
      : null;
    const event = eventSlug
      ? await db.event.findUnique({ where: { slug: eventSlug } })
      : null;

    if (destinationType === "child" && !beneficiary) {
      return apiError("Selected child sponsorship profile was not found.", 404);
    }
    if (destinationType.startsWith("event") && !event) {
      return apiError("Selected event was not found.", 404);
    }

    const donor = await db.donor.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        isAnonymous: Boolean(body.isAnonymous)
      }
    });

    const donation = await db.donation.create({
      data: {
        amount,
        method: method as "MPESA" | "CARD" | "BANK_TRANSFER" | "CASH",
        donorId: donor.id,
        campaignId: campaign?.id,
        beneficiaryId: beneficiary?.id,
        eventId: event?.id,
        frequency,
        destinationType,
        destinationLabel: destinationLabel || beneficiary?.publicName || event?.title || campaign?.title || "General giving",
        packageName: packageName || null,
        source: readString(body.source) || "website"
      }
    });

    if (destinationType === "event-registration" && event && packageName) {
      await db.eventRegistration.create({
        data: {
          eventId: event.id,
          donorId: donor.id,
          donationId: donation.id,
          ticketType: packageName,
          quantity: 1,
          totalAmount: amount
        }
      });
    }

    const transaction = await db.paymentTransaction.create({
      data: {
        donationId: donation.id,
        provider: method,
        amount
      }
    });

    let nextAction = method === "MPESA" ? "Trigger STK push." : "Redirect to payment processor.";

    if (method === "MPESA") {
      const stk = await initiateMpesaStkPush({
        donationId: donation.id,
        amount,
        phone,
        accountReference: donation.receiptNumber || donation.id.slice(-12).toUpperCase(),
        description: donation.destinationLabel || "Heart to Heart donation"
      });

      if (stk.ok) {
        await db.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            providerRef: stk.merchantRequestId || null,
            checkoutRef: stk.checkoutRequestId || null,
            rawPayload: stk.raw as Prisma.InputJsonValue
          }
        });
        nextAction = stk.customerMessage || "M-Pesa STK Push sent. Enter your PIN to complete the donation.";
      } else {
        await db.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status: stk.raw ? "FAILED" : "INITIATED",
            rawPayload: (stk.raw || { message: stk.message }) as Prisma.InputJsonValue
          }
        });
        nextAction = stk.message;
      }
    }

    return NextResponse.json({
      ok: true,
      donation: {
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        method: donation.method,
        status: donation.status,
        destinationType: donation.destinationType,
        destinationLabel: donation.destinationLabel,
        packageName: donation.packageName
      },
      statusUrl: `/donations/${donation.id}/status`,
      nextAction
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Donation could not be created right now." },
      { status: 503 }
    );
  }
}
