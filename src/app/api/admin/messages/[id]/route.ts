import { NextRequest, NextResponse } from "next/server";
import { db, messages } from "@/db";
import { eq } from "drizzle-orm";
import { verifyApiAuth } from "@/lib/api-auth";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const [row] = await db.select().from(messages).where(eq(messages.id, id));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Auto-mark as read
  if (!row.read) {
    await db.update(messages).set({ read: true }).where(eq(messages.id, id));
  }

  return NextResponse.json({ ...row, read: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const { archived } = await req.json();

  const [updated] = await db
    .update(messages)
    .set({ archived })
    .where(eq(messages.id, id))
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
  await db.delete(messages).where(eq(messages.id, id));
  return NextResponse.json({ ok: true });
}
