import { NextRequest, NextResponse } from "next/server";
import { db, messages } from "@/db";
import { eq } from "drizzle-orm";
import { verifyApiAuth } from "@/lib/api-auth";
import { sendAdminReply } from "@/lib/mail";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyApiAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const [msg] = await db.select().from(messages).where(eq(messages.id, id));
  if (!msg) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  const body = await req.json();
  const replyText: string = (body.message ?? "").trim();
  if (!replyText) {
    return NextResponse.json({ error: "Reply message is required" }, { status: 400 });
  }

  try {
    await sendAdminReply({
      to: msg.email,
      subject: "Re: Your message to Kashf Production",
      message: replyText,
      originalMessage: msg.message,
      recipientName: msg.name,
    });
  } catch (err: unknown) {
    const safeMessage =
      err instanceof Error ? err.message : "Failed to send email";
    // Never log or expose SMTP_PASSWORD
    console.error("[reply] SMTP error:", safeMessage);
    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }

  const [updated] = await db
    .update(messages)
    .set({
      repliedAt: new Date(),
      replyMessage: replyText,
      repliedBy: auth.session.username,
    })
    .where(eq(messages.id, id))
    .returning();

  return NextResponse.json(updated);
}
