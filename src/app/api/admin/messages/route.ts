import { NextRequest, NextResponse } from "next/server";
import { db, messages } from "@/db";
import { eq, and, desc } from "drizzle-orm";
import { verifyApiAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const filter = req.nextUrl.searchParams.get("filter") || "all";

  let rows;
  if (filter === "unread") {
    rows = await db
      .select()
      .from(messages)
      .where(and(eq(messages.read, false), eq(messages.archived, false)))
      .orderBy(desc(messages.createdAt));
  } else if (filter === "archived") {
    rows = await db
      .select()
      .from(messages)
      .where(eq(messages.archived, true))
      .orderBy(desc(messages.createdAt));
  } else {
    rows = await db
      .select()
      .from(messages)
      .where(eq(messages.archived, false))
      .orderBy(desc(messages.createdAt));
  }

  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  if (body.markAllRead) {
    await db
      .update(messages)
      .set({ read: true })
      .where(and(eq(messages.read, false), eq(messages.archived, false)));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown operation" }, { status: 400 });
}
