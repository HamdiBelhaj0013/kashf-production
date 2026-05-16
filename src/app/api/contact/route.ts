import { NextRequest, NextResponse } from "next/server";
import { db, messages } from "@/db";

// Simple in-memory rate limit
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const { name, email, service, message } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!message?.trim() || message.trim().length < 10) {
    return NextResponse.json(
      { error: "Message must be at least 10 characters" },
      { status: 400 }
    );
  }

  await db.insert(messages).values({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    service: service || "",
    message: message.trim(),
  });

  return NextResponse.json({ ok: true });
}
