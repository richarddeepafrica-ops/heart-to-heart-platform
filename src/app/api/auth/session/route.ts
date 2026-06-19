import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminSessionCookie, verifyAdminSession } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(adminSessionCookie)?.value);

  if (!session) {
    return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    email: session.email
  });
}
