import { requireAdmin } from "@/lib/admin-auth";
import { db, team } from "@/db";
import { asc } from "drizzle-orm";
import AdminShell from "@/components/admin/AdminShell";
import TeamTable from "@/components/admin/TeamTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function TeamPage() {
  await requireAdmin();

  const rows = await db.select().from(team).orderBy(asc(team.sortOrder));

  return (
    <AdminShell pageTitle="Team">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{rows.length} member{rows.length !== 1 ? "s" : ""}</p>
        <Link
          href="/kashfoffice/team/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Member
        </Link>
      </div>
      <TeamTable members={rows} />
    </AdminShell>
  );
}
