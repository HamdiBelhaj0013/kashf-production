import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/db";
import { asc } from "drizzle-orm";
import { verifyApiAuth } from "@/lib/api-auth";

export async function GET() {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  return NextResponse.json(
    rows.map((r) => ({ ...r, tags: JSON.parse(r.tags || "[]") }))
  );
}

export async function POST(req: NextRequest) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { title, client, category, year, tags, coverImage, featured, sortOrder } = body;

  if (!title || !client || !category || !year) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [created] = await db
    .insert(projects)
    .values({
      title,
      client,
      category,
      year,
      tags: JSON.stringify(tags || []),
      coverImage: coverImage || "",
      featured: featured || false,
      sortOrder: sortOrder || 0,
    })
    .returning();

  return NextResponse.json({ ...created, tags: JSON.parse(created.tags || "[]") }, { status: 201 });
}
