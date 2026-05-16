import { requireAdmin } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <AdminShell pageTitle="New Project">
      <ProjectForm />
    </AdminShell>
  );
}
