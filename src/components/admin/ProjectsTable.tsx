"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Star, StarOff, ImageIcon } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import AdminToast from "./AdminToast";

interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  tags: string[];
  coverImage: string;
  featured: boolean;
  sortOrder: number;
}

const categoryBadge: Record<string, string> = {
  video:  "bg-gray-900 text-white",
  audio:  "bg-gray-700 text-white",
  design: "bg-gray-500 text-white",
  web:    "bg-gray-200 text-gray-800",
  pack:   "bg-gray-100 text-gray-600",
};

export default function ProjectsTable({ projects: initial }: { projects: Project[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ visible: true, message, type });
  }

  async function toggleFeatured(id: string, current: boolean) {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !current }),
    });
    if (res.ok) {
      setRows((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !current } : p)));
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRows((prev) => prev.filter((p) => p.id !== id));
        showToast("Project deleted");
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
        <ImageIcon className="w-10 h-10 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium mb-4">No projects yet</p>
        <Link
          href="/kashfoffice/projects/new"
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Create first project
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
              <th className="text-left px-6 py-4">Cover</th>
              <th className="text-left px-6 py-4">Title / Client</th>
              <th className="text-left px-6 py-4">Category</th>
              <th className="text-left px-6 py-4">Year</th>
              <th className="text-left px-6 py-4">Featured</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  {p.coverImage ? (
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-12 h-9 object-cover rounded-lg border border-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{p.title}</p>
                  <p className="text-gray-400 text-xs">{p.client}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${categoryBadge[p.category] || "bg-gray-100 text-gray-600"}`}>
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{p.year}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleFeatured(p.id, p.featured)}
                    className="text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {p.featured ? (
                      <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/kashfoffice/projects/${p.id}/edit`}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setConfirmId(p.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete project?"
        description="This action cannot be undone."
        loading={!!deleting}
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
      <AdminToast
        {...toast}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
