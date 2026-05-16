import { requireAdmin } from "@/lib/admin-auth";
import { db, projects } from "@/db";
import { asc } from "drizzle-orm";
import AdminShell from "@/components/admin/AdminShell";
import ProjectsTable from "@/components/admin/ProjectsTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ProjectsPage() {
  await requireAdmin();

  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  const data = rows.map((r) => ({ ...r, tags: JSON.parse(r.tags || "[]") }));

  return (
    <AdminShell pageTitle="Projects">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{data.length} project{data.length !== 1 ? "s" : ""}</p>
        <Link
          href="/kashfoffice/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>
      <ProjectsTable projects={data} />
    </AdminShell>
  );
}
