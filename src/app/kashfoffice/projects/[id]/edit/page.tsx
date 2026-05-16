import { requireAdmin } from "@/lib/admin-auth";
import { db, projects } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  if (!project) notFound();

  const data = { ...project, tags: JSON.parse(project.tags || "[]") };

  return (
    <AdminShell pageTitle="Edit Project">
      <ProjectForm initialData={data} />
    </AdminShell>
  );
}
