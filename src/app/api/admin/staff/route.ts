import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { hashPassword } from "@/lib/auth";
import { writeAuditLog } from "@/lib/admin-system";
import { db } from "@/lib/db";
import { isUserRole, staffRoleProfiles } from "@/lib/staff-data";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid staff request.");

  const name = readString(body.name);
  const email = readString(body.email).toLowerCase();
  const role = readString(body.role).toUpperCase();
  const password = readString(body.password);
  const active = readString(body.active).toLowerCase() !== "inactive";

  if (!name) return apiError("Staff name is required.");
  if (!email || !email.includes("@")) return apiError("A valid staff email is required.");
  if (!isUserRole(role)) return apiError("Unsupported staff role.");
  if (password.length < 8) return apiError("Temporary password must be at least 8 characters.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      staff: { id: `preview-${Date.now()}`, name, email, role, department: staffRoleProfiles[role].department },
      nextAction: "Connect DATABASE_URL to persist staff users."
    });
  }

  try {
    const user = await db.user.upsert({
      where: { email },
      update: {
        name,
        role,
        passwordHash: hashPassword(password)
      },
      create: {
        name,
        email,
        role,
        passwordHash: hashPassword(password)
      }
    });
    await db.$executeRawUnsafe(
      `UPDATE "User" SET "active" = $1, "passwordResetRequired" = true WHERE "id" = $2`,
      active,
      user.id
    );

    await writeAuditLog({
      action: "UPSERT_STAFF_USER",
      entityType: "User",
      entityId: user.id,
      metadata: { email: user.email, role: user.role, active }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      staff: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: staffRoleProfiles[user.role].department
      }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Staff member could not be saved right now." },
      { status: 503 }
    );
  }
}
