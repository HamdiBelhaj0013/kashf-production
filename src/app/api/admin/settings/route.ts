import { NextRequest, NextResponse } from "next/server";
import { db, settings } from "@/db";
import { verifyApiAuth } from "@/lib/api-auth";

// Public — footer and other public surfaces read settings without auth.
export async function GET() {
  const rows = await db.select().from(settings);
  return NextResponse.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
}

export async function PUT(req: NextRequest) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const body = await req.json();

  for (const [key, value] of Object.entries(body)) {
    await db
      .insert(settings)
      .values({ key, value: String(value) })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: String(value), updatedAt: new Date() },
      });
  }

  return NextResponse.json({ ok: true });
}
