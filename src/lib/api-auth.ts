import { NextResponse } from "next/server";
import { getAdminSession } from "./auth";

export async function verifyApiAuth() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const, session };
}
