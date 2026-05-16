import { requireAdmin } from "@/lib/admin-auth";
import { db, team } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import TeamForm from "@/components/admin/TeamForm";

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [member] = await db.select().from(team).where(eq(team.id, id));
  if (!member) notFound();

  return (
    <AdminShell pageTitle="Edit Team Member">
      <TeamForm initialData={member} />
    </AdminShell>
  );
}
