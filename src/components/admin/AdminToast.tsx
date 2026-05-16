"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface AdminToastProps {
  message: string;
  type: "success" | "error";
  visible: boolean;
  onHide: () => void;
}

export default function AdminToast({ message, type, visible, onHide }: AdminToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onHide, 3000);
    return () => clearTimeout(t);
  }, [visible, onHide]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      } ${type === "success" ? "bg-gray-900 text-white" : "bg-red-600 text-white"}`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 shrink-0" />
      )}
      {message}
    </div>
  );
}
