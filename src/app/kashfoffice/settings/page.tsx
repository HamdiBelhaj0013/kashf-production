import { requireAdmin } from "@/lib/admin-auth";
import { db, settings } from "@/db";
import AdminShell from "@/components/admin/AdminShell";
import SettingsForms from "./SettingsForms";

export default async function SettingsPage() {
  await requireAdmin();

  const rows = await db.select().from(settings);
  const siteSettings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <AdminShell pageTitle="Settings">
      <SettingsForms initialSettings={siteSettings} />
    </AdminShell>
  );
}
