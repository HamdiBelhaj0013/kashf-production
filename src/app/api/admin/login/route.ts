import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, admin } from "@/db";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const [adminUser] = await db
    .select()
    .from(admin)
    .where(eq(admin.username, username))
    .limit(1);

  if (!adminUser || !(await bcrypt.compare(password, adminUser.password))) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const session = await getAdminSession();
  session.adminId = adminUser.id;
  session.username = adminUser.username;
  session.isLoggedIn = true;
  await session.save();

  return NextResponse.json({ ok: true });
}
