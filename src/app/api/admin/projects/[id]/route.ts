import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/db";
import { eq } from "drizzle-orm";
import { verifyApiAuth } from "@/lib/api-auth";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const [row] = await db.select().from(projects).where(eq(projects.id, id));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...row, tags: JSON.parse(row.tags || "[]") });
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
    .update(projects)
    .set({
      ...body,
      tags: JSON.stringify(body.tags || []),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...updated, tags: JSON.parse(updated.tags || "[]") });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  await db.delete(projects).where(eq(projects.id, id));
  return NextResponse.json({ ok: true });
}
