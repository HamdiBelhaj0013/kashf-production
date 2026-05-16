"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Users } from "lucide-react";
import * as Icons from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import AdminToast from "./AdminToast";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  lucideIcon: string;
  photoUrl: string;
  active: boolean;
  sortOrder: number;
}

const deptBadge: Record<string, string> = {
  creative:   "bg-gray-900 text-white",
  technical:  "bg-gray-100 text-gray-700",
  production: "bg-gray-100 text-gray-700",
  management: "bg-gray-100 text-gray-700",
};

export default function TeamTable({ members: initial }: { members: TeamMember[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ visible: true, message, type });
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/team/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
    if (res.ok) {
      setRows((prev) => prev.map((m) => (m.id === id ? { ...m, active: !current } : m)));
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRows((prev) => prev.filter((m) => m.id !== id));
        showToast("Member deleted");
        router.refresh();
      } else {
        showToast("Failed to delete", "error");
      }
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
        <Users className="w-10 h-10 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium mb-4">No team members yet</p>
        <Link href="/kashfoffice/team/new" className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
          Add first member
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="text-left px-6 py-4">Icon</th>
              <th className="text-left px-6 py-4">Name</th>
              <th className="text-left px-6 py-4">Role</th>
              <th className="text-left px-6 py-4">Department</th>
              <th className="text-left px-6 py-4">Active</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((m) => {
              const IconComponent = (Icons as Record<string, unknown>)[m.lucideIcon] as React.ComponentType<{ className?: string }> | undefined;
              return (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {m.photoUrl ? (
                      <img
                        src={m.photoUrl}
                        alt={m.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {IconComponent ? <IconComponent className="w-4 h-4 text-gray-700" /> : <Users className="w-4 h-4 text-gray-400" />}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                  <td className="px-6 py-4 text-gray-500">{m.role}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${deptBadge[m.department] || "bg-gray-100 text-gray-600"}`}>
                      {m.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleActive(m.id, m.active)} className={`w-10 h-6 rounded-full transition-colors ${m.active ? "bg-gray-900" : "bg-gray-200"} relative`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${m.active ? "left-5" : "left-1"}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/kashfoffice/team/${m.id}/edit`} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setConfirmId(m.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete team member?"
        description="This action cannot be undone."
        loading={!!deleting}
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
      <AdminToast {...toast} onHide={() => setToast((t) => ({ ...t, visible: false }))} />
    </>
  );
}
