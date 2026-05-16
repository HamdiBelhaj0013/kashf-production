"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, Inbox } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "./ConfirmDialog";
import AdminToast from "./AdminToast";

interface Message {
  id: string;
  name: string;
  email: string;
  service: string;
  read: boolean;
  createdAt: Date | string | null;
}

export default function MessagesTable({ messages: initial }: { messages: Message[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ visible: true, message, type });
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRows((prev) => prev.filter((m) => m.id !== id));
        showToast("Message deleted");
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
      <div className="text-center py-20">
        <Inbox className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400 font-medium">No messages yet</p>
        <p className="text-gray-300 text-sm mt-1">
          Messages from the contact form will appear here
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="text-left px-6 py-4 w-4"></th>
              <th className="text-left px-6 py-4">Name</th>
              <th className="text-left px-6 py-4">Email</th>
              <th className="text-left px-6 py-4">Service</th>
              <th className="text-left px-6 py-4">Date</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((m) => (
              <tr
                key={m.id}
                className={`transition-colors cursor-pointer hover:bg-gray-50 ${m.read ? "bg-gray-50" : "bg-white"}`}
                onClick={() => router.push(`/kashfoffice/messages/${m.id}`)}
              >
                <td className="px-6 py-4">
                  <div className={`w-2 h-2 rounded-full ${m.read ? "bg-gray-200" : "bg-gray-900"}`} />
                </td>
                <td className="px-6 py-4">
                  <span className={m.read ? "text-gray-600" : "font-medium text-gray-900"}>{m.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{m.email}</td>
                <td className="px-6 py-4 text-gray-500">{m.service || "—"}</td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {m.createdAt
                    ? new Date(m.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : "—"}
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/kashfoffice/messages/${m.id}`}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setConfirmId(m.id)}
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
        title="Delete message?"
        description="This action cannot be undone."
        loading={!!deleting}
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
      <AdminToast {...toast} onHide={() => setToast((t) => ({ ...t, visible: false }))} />
    </>
  );
}
