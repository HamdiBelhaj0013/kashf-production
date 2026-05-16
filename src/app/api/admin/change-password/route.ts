import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, admin } from "@/db";
import { eq } from "drizzle-orm";
import { verifyApiAuth } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const { currentPassword, newPassword, confirmPassword } = await req.json();

  const [adminUser] = await db
    .select()
    .from(admin)
    .where(eq(admin.id, auth.session.adminId))
    .limit(1);

  if (!adminUser || !(await bcrypt.compare(currentPassword, adminUser.password))) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await db
    .update(admin)
    .set({ password: hash })
    .where(eq(admin.id, auth.session.adminId));

  return NextResponse.json({ ok: true });
}
