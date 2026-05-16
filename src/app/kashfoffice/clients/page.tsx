import { requireAdmin } from "@/lib/admin-auth";
import { db, clients } from "@/db";
import { asc } from "drizzle-orm";
import AdminShell from "@/components/admin/AdminShell";
import ClientsTable from "@/components/admin/ClientsTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ClientsPage() {
  await requireAdmin();

  const rows = await db.select().from(clients).orderBy(asc(clients.sortOrder));

  return (
    <AdminShell pageTitle="Clients">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{rows.length} client{rows.length !== 1 ? "s" : ""}</p>
        <Link
          href="/kashfoffice/clients/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Client
        </Link>
      </div>
      <ClientsTable clients={rows} />
    </AdminShell>
  );
}
