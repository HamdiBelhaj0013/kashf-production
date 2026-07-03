"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Archive,
  ArchiveX,
  Trash2,
  Loader2,
  Send,
  CheckCircle2,
  X,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AdminToast from "@/components/admin/AdminToast";

interface MessageActionsProps {
  id: string;
  email: string;
  name: string;
  archived: boolean;
  originalMessage: string;
  repliedAt: Date | string | null;
  repliedBy: string | null;
}

export default function MessageActions({
  id,
  email,
  name,
  archived,
  originalMessage,
  repliedAt: initialRepliedAt,
  repliedBy: initialRepliedBy,
}: MessageActionsProps) {
  const router = useRouter();
  const [isArchived, setIsArchived] = useState(archived);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  // Reply state
  const [repliedAt, setRepliedAt] = useState<Date | string | null>(initialRepliedAt);
  const [repliedBy, setRepliedBy] = useState<string | null>(initialRepliedBy);
  const [showReplyPanel, setShowReplyPanel] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  async function handleSendReply() {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch(`/api/admin/messages/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText }),
      });
      if (res.ok) {
        const updated = await res.json();
        setRepliedAt(updated.repliedAt);
        setRepliedBy(updated.repliedBy);
        setShowReplyPanel(false);
        setReplyText("");
        showToast(`Reply sent to ${email}`);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error ?? "Failed to send reply", "error");
      }
    } finally {
      setIsSending(false);
    }
  }

  const formattedRepliedAt = repliedAt
    ? new Date(repliedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {/* Reply button / Replied badge */}
        {repliedAt ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 text-gray-500 text-sm font-medium rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
              Replied {formattedRepliedAt}
              {repliedBy && (
                <span className="text-gray-400 font-normal">by {repliedBy}</span>
              )}
            </span>
            <button
              onClick={() => setShowReplyPanel((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-gray-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Follow-up
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowReplyPanel((v) => !v)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Reply
          </button>
        )}

        <button
          onClick={toggleArchive}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:border-gray-400 transition-colors"
        >
          {isArchived ? (
            <ArchiveX className="w-4 h-4" />
          ) : (
            <Archive className="w-4 h-4" />
          )}
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

      {/* Inline reply panel */}
      {showReplyPanel && (
        <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Original message for context */}
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Original message from {name}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap line-clamp-4">
              {originalMessage}
            </p>
          </div>

          {/* Reply compose area */}
          <div className="p-5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Your reply
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Write your reply to ${name}…`}
              rows={5}
              className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder-gray-400"
              disabled={isSending}
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-400">
                Sending as{" "}
                <span className="text-gray-600 font-medium">
                  {process.env.NEXT_PUBLIC_MAIL_FROM ??
                    "hello@kashf.tn"}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowReplyPanel(false);
                    setReplyText("");
                  }}
                  disabled={isSending}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-40"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={isSending || !replyText.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isSending ? "Sending…" : "Send reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete message?"
        description="This action cannot be undone."
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
      <AdminToast
        {...toast}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
