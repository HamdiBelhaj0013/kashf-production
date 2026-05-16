"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AdminToast from "./AdminToast";
import ImageUpload from "./ImageUpload";

interface Client {
  id: string;
  name: string;
  sector: string;
  country: string;
  logoUrl: string;
  active: boolean;
  sortOrder: number;
}

const inputClass =
  "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 transition-all";

const countries = [
  { value: "TN", label: "Tunisia" },
  { value: "DZ", label: "Algeria" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  { value: "BE", label: "Belgium" },
  { value: "IT", label: "Italy" },
  { value: "OTHER", label: "Other" },
];

export default function ClientForm({ initialData }: { initialData?: Client }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name:      initialData?.name      || "",
    sector:    initialData?.sector    || "",
    country:   initialData?.country   || "TN",
    logoUrl:   initialData?.logoUrl   || "",
    active:    initialData?.active    !== undefined ? initialData.active : true,
    sortOrder: initialData?.sortOrder || 0,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "error" });

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ visible: true, message, type });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData ? `/api/admin/clients/${initialData.id}` : "/api/admin/clients";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Save failed", "error"); return; }
      router.push("/kashfoffice/clients");
      router.refresh();
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sector</label>
            <input type="text" value={form.sector} onChange={(e) => setForm((s) => ({ ...s, sector: e.target.value }))} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
            <select value={form.country} onChange={(e) => setForm((s) => ({ ...s, country: e.target.value }))} className={inputClass + " cursor-pointer"}>
              {countries.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm((s) => ({ ...s, sortOrder: Number(e.target.value) }))} className={inputClass} />
          </div>
        </div>

        <ImageUpload label="Logo" value={form.logoUrl} onChange={(url) => setForm((s) => ({ ...s, logoUrl: url }))} />

        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => setForm((s) => ({ ...s, active: !s.active }))} className={`w-10 h-6 rounded-full transition-colors ${form.active ? "bg-gray-900" : "bg-gray-200"} relative`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active ? "left-5" : "left-1"}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-7 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? "Save changes" : "Create client"}
          </button>
          <button type="button" onClick={() => router.push("/kashfoffice/clients")} className="px-7 py-3 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Cancel
          </button>
        </div>
      </form>
      <AdminToast {...toast} onHide={() => setToast((t) => ({ ...t, visible: false }))} />
    </>
  );
}
