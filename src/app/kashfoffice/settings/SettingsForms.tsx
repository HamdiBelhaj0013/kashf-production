"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import AdminToast from "@/components/admin/AdminToast";

interface SettingsFormsProps {
  initialSettings: Record<string, string>;
}

const inputClass =
  "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 transition-all";

export default function SettingsForms({ initialSettings }: SettingsFormsProps) {
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as "success" | "error" });

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ visible: true, message, type });
  }

  return (
    <div className="max-w-2xl space-y-8">
      <SiteSettingsForm initial={initialSettings} showToast={showToast} />
      <ChangePasswordForm showToast={showToast} />
      <AdminToast {...toast} onHide={() => setToast((t) => ({ ...t, visible: false }))} />
    </div>
  );
}

function SiteSettingsForm({
  initial,
  showToast,
}: {
  initial: Record<string, string>;
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [form, setForm] = useState({
    site_email:       initial.site_email       || "",
    site_location:    initial.site_location    || "",
    social_instagram: initial.social_instagram || "",
    social_linkedin:  initial.social_linkedin  || "",
    social_behance:   initial.social_behance   || "",
    meta_title:       initial.meta_title       || "",
    meta_description: initial.meta_description || "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast("Settings saved");
      } else {
        const d = await res.json();
        showToast(d.error || "Save failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  }

  const fields: { key: keyof typeof form; label: string; placeholder?: string }[] = [
    { key: "site_email",       label: "Contact Email",      placeholder: "hello@kashf.tn" },
    { key: "site_location",    label: "Location",           placeholder: "Tunis, Tunisia" },
    { key: "social_instagram", label: "Instagram URL",      placeholder: "https://instagram.com/..." },
    { key: "social_linkedin",  label: "LinkedIn URL",       placeholder: "https://linkedin.com/..." },
    { key: "social_behance",   label: "Behance URL",        placeholder: "https://behance.net/..." },
    { key: "meta_title",       label: "Meta Title",         placeholder: "Kashf Production" },
    { key: "meta_description", label: "Meta Description",   placeholder: "We reveal your story." },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-bold text-gray-900 text-lg mb-6">Site Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              {label}
            </label>
            <input
              type="text"
              value={form[key]}
              onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
              placeholder={placeholder}
              className={inputClass}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-7 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors mt-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save settings
        </button>
      </form>
    </div>
  );
}

function ChangePasswordForm({
  showToast,
}: {
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Password changed successfully");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-bold text-gray-900 text-lg mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={form.currentPassword}
              onChange={(e) => setForm((s) => ({ ...s, currentPassword: e.target.value }))}
              className={inputClass + " pr-11"}
            />
            <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              required
              value={form.newPassword}
              onChange={(e) => setForm((s) => ({ ...s, newPassword: e.target.value }))}
              className={inputClass + " pr-11"}
            />
            <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm((s) => ({ ...s, confirmPassword: e.target.value }))}
            className={inputClass}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-7 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Change password
        </button>
      </form>
    </div>
  );
}

