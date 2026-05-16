import { NextRequest, NextResponse } from "next/server";
import { db, team } from "@/db";
import { eq } from "drizzle-orm";
import { verifyApiAuth } from "@/lib/api-auth";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const [row] = await db.select().from(team).where(eq(team.id, id));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();

  const [updated] = await db
    .update(team)
    .set(body)
    .where(eq(team.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  await db.delete(team).where(eq(team.id, id));
  return NextResponse.json({ ok: true });
}
