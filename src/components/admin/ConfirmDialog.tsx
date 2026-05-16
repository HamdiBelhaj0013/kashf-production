"use client";

import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm mt-1 mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin w-4 h-4" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
