import { NextRequest, NextResponse } from "next/server";
import { db, clients } from "@/db";
import { asc } from "drizzle-orm";
import { verifyApiAuth } from "@/lib/api-auth";

export async function GET() {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const rows = await db.select().from(clients).orderBy(asc(clients.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { name, sector, country, logoUrl, active, sortOrder } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const [created] = await db
    .insert(clients)
    .values({
      name,
      sector: sector || "",
      country: country || "",
      logoUrl: logoUrl || "",
      active: active !== undefined ? active : true,
      sortOrder: sortOrder || 0,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
