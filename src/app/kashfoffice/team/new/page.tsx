import { requireAdmin } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import TeamForm from "@/components/admin/TeamForm";

export default async function NewTeamPage() {
  await requireAdmin();
  return (
    <AdminShell pageTitle="New Team Member">
      <TeamForm />
    </AdminShell>
  );
}
