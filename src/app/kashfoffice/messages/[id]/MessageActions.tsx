"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Archive, ArchiveX, Trash2, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AdminToast from "@/components/admin/AdminToast";

interface MessageActionsProps {
  id: string;
  email: string;
  name: string;
  archived: boolean;
}

export default function MessageActions({ id, email, name, archived }: MessageActionsProps) {
  const router = useRouter();
  const [isArchived, setIsArchived] = useState(archived);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "error" });

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ visible: true, message, type });
  }

  async function toggleArchive() {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: !isArchived }),
    });
    if (res.ok) {
      setIsArchived((v) => !v);
      showToast(isArchived ? "Message unarchived" : "Message archived");
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/kashfoffice/messages");
        router.refresh();
      } else {
        showToast("Failed to delete", "error");
      }
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <a
          href={`mailto:${email}?subject=Re: your message&body=Hi ${name},%0A%0A`}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Reply
        </a>
        <button
          onClick={toggleArchive}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:border-gray-400 transition-colors"
        >
          {isArchived ? <ArchiveX className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
          {isArchived ? "Unarchive" : "Archive"}
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete message?"
        description="This action cannot be undone."
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
      <AdminToast {...toast} onHide={() => setToast((t) => ({ ...t, visible: false }))} />
    </>
  );
}
