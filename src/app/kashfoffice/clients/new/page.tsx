import { requireAdmin } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import ClientForm from "@/components/admin/ClientForm";

export default async function NewClientPage() {
  await requireAdmin();
  return (
    <AdminShell pageTitle="New Client">
      <ClientForm />
    </AdminShell>
  );
}
