"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import AdminToast from "./AdminToast";
import ImageUpload from "./ImageUpload";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  lucideIcon: string;
  photoUrl: string;
  active: boolean;
  sortOrder: number;
}

const inputClass =
  "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 transition-all";

export default function TeamForm({ initialData }: { initialData?: TeamMember }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name:       initialData?.name       || "",
    role:       initialData?.role       || "",
    department: initialData?.department || "creative",
    bio:        initialData?.bio        || "",
    lucideIcon: initialData?.lucideIcon || "User",
    photoUrl:   initialData?.photoUrl   || "",
    active:     initialData?.active !== undefined ? initialData.active : true,
    sortOrder:  initialData?.sortOrder  || 0,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "error" });

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ visible: true, message, type });
  }

  const IconComponent = (Icons as Record<string, unknown>)[form.lucideIcon] as React.ComponentType<{ className?: string }> | undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData ? `/api/admin/team/${initialData.id}` : "/api/admin/team";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Save failed", "error"); return; }
      router.push("/kashfoffice/team");
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
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role *</label>
            <input type="text" required value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Department *</label>
          <select value={form.department} onChange={(e) => setForm((s) => ({ ...s, department: e.target.value }))} className={inputClass + " cursor-pointer"}>
            <option value="creative">Creative</option>
            <option value="technical">Technical</option>
            <option value="production">Production</option>
            <option value="management">Management</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
          <textarea rows={3} value={form.bio} onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))} className={inputClass + " resize-none"} />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Lucide Icon Name</label>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={form.lucideIcon}
              onChange={(e) => setForm((s) => ({ ...s, lucideIcon: e.target.value }))}
              placeholder="e.g. Code2, Camera, User"
              className={inputClass}
            />
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
              {IconComponent ? (
                <IconComponent className="w-5 h-5 text-gray-700" />
              ) : (
                <span className="text-[10px] text-red-500 text-center leading-tight px-1">Invalid</span>
              )}
            </div>
          </div>
        </div>

        <ImageUpload label="Photo" value={form.photoUrl} onChange={(url) => setForm((s) => ({ ...s, photoUrl: url }))} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm((s) => ({ ...s, sortOrder: Number(e.target.value) }))} className={inputClass} />
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm((s) => ({ ...s, active: !s.active }))} className={`w-10 h-6 rounded-full transition-colors ${form.active ? "bg-gray-900" : "bg-gray-200"} relative`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active ? "left-5" : "left-1"}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-7 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? "Save changes" : "Create member"}
          </button>
          <button type="button" onClick={() => router.push("/kashfoffice/team")} className="px-7 py-3 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Cancel
          </button>
        </div>
      </form>
      <AdminToast {...toast} onHide={() => setToast((t) => ({ ...t, visible: false }))} />
    </>
  );
}
