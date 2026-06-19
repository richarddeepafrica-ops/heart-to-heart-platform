import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { writeAuditLog } from "@/lib/admin-system";
import { db } from "@/lib/db";

type EventRegistrationRouteContext = {
  params: Promise<unknown>;
};

async function readId(context: EventRegistrationRouteContext) {
  const params = await context.params;
  return typeof params === "object" && params !== null && "id" in params
    ? readString((params as { id?: unknown }).id)
    : "";
}

export async function PATCH(request: NextRequest, context: EventRegistrationRouteContext) {
  const id = await readId(context);
  if (!id) return apiError("Registration id is required.");

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.checkedIn !== "boolean") return apiError("checkedIn must be true or false.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      registration: {
        id,
        checkedInAt: body.checkedIn ? new Date().toISOString() : null
      }
    });
  }

  try {
    const registration = await db.eventRegistration.update({
      where: { id },
      data: { checkedInAt: body.checkedIn ? new Date() : null }
    });
    await writeAuditLog({
      action: body.checkedIn ? "CHECK_IN_EVENT_REGISTRATION" : "CLEAR_EVENT_CHECK_IN",
      entityType: "EventRegistration",
      entityId: id,
      metadata: { checkedIn: body.checkedIn }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      registration: {
        id: registration.id,
        checkedInAt: registration.checkedInAt?.toISOString() || null
      }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Registration check-in could not be updated right now." },
      { status: 503 }
    );
  }
}
