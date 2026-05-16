import { requireAdmin } from "@/lib/admin-auth";
import { db, messages } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";
import MessageActions from "./MessageActions";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const [msg] = await db.select().from(messages).where(eq(messages.id, id));
  if (!msg) notFound();

  // Auto-mark as read
  if (!msg.read) {
    await db.update(messages).set({ read: true }).where(eq(messages.id, id));
  }

  const formattedDate = msg.createdAt
    ? new Date(msg.createdAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <AdminShell pageTitle="Message">
      <div className="max-w-2xl">
        <Link
          href="/kashfoffice/messages"
          className="text-sm text-gray-400 hover:text-gray-700 mb-6 inline-flex items-center gap-1"
        >
          ← Messages
        </Link>

        {/* Sender card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{msg.name}</h2>
              <a
                href={`mailto:${msg.email}`}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                {msg.email}
              </a>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-xs text-gray-400">{formattedDate}</span>
              {msg.service && (
                <span className="text-[11px] font-bold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {msg.service}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Message body */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-6 whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
          {msg.message}
        </div>

        {/* Actions */}
        <MessageActions
          id={msg.id}
          email={msg.email}
          name={msg.name}
          archived={msg.archived}
        />
      </div>
    </AdminShell>
  );
}
