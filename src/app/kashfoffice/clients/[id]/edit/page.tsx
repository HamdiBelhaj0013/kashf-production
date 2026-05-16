import { requireAdmin } from "@/lib/admin-auth";
import { db, clients } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ClientForm from "@/components/admin/ClientForm";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [client] = await db.select().from(clients).where(eq(clients.id, id));
  if (!client) notFound();

  return (
    <AdminShell pageTitle="Edit Client">
      <ClientForm initialData={client} />
    </AdminShell>
  );
}
