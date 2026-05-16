import { NextRequest, NextResponse } from "next/server";
import { db, team } from "@/db";
import { asc } from "drizzle-orm";
import { verifyApiAuth } from "@/lib/api-auth";

export async function GET() {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const rows = await db.select().from(team).orderBy(asc(team.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { name, role, department, bio, lucideIcon, photoUrl, active, sortOrder } = body;

  if (!name || !role || !department) {
    return NextResponse.json({ error: "Name, role, and department are required" }, { status: 400 });
  }

  const [created] = await db
    .insert(team)
    .values({
      name,
      role,
      department,
      bio: bio || "",
      lucideIcon: lucideIcon || "User",
      photoUrl: photoUrl || "",
      active: active !== undefined ? active : true,
      sortOrder: sortOrder || 0,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
