import { requireAdmin } from "@/lib/admin-auth";
import { db, messages } from "@/db";
import { eq, and, desc } from "drizzle-orm";
import AdminShell from "@/components/admin/AdminShell";
import MessagesTable from "@/components/admin/MessagesTable";
import Link from "next/link";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();

  const { tab = "all" } = await searchParams;

  let rows;
  if (tab === "unread") {
    rows = await db
      .select()
      .from(messages)
      .where(and(eq(messages.read, false), eq(messages.archived, false)))
      .orderBy(desc(messages.createdAt));
  } else if (tab === "archived") {
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

  const tabs = [
    { key: "all",      label: "All" },
    { key: "unread",   label: "Unread" },
    { key: "archived", label: "Archived" },
  ];

  return (
    <AdminShell pageTitle="Messages">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`/kashfoffice/messages?tab=${t.key}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
        <MarkAllReadButton />
      </div>
      <MessagesTable messages={rows} />
    </AdminShell>
  );
}

function MarkAllReadButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { db, messages } = await import("@/db");
        const { eq, and } = await import("drizzle-orm");
        await db
          .update(messages)
          .set({ read: true })
          .where(and(eq(messages.read, false), eq(messages.archived, false)));
      }}
    >
      <button
        type="submit"
        className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        Mark all as read
      </button>
    </form>
  );
}
