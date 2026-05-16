"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AdminToast from "./AdminToast";
import ImageUpload from "./ImageUpload";
import TagInput from "./TagInput";

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

const inputClass =
  "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 transition-all";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2018 }, (_, i) =>
  String(currentYear - i)
);

export default function ProjectForm({ initialData }: { initialData?: Project }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title:      initialData?.title      || "",
    client:     initialData?.client     || "",
    category:   initialData?.category   || "video",
    year:       initialData?.year       || String(currentYear),
    tags:       initialData?.tags       || ([] as string[]),
    coverImage: initialData?.coverImage || "",
    featured:   initialData?.featured   || false,
    sortOrder:  initialData?.sortOrder  || 0,
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
      const url = initialData
        ? `/api/admin/projects/${initialData.id}`
        : "/api/admin/projects";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Save failed", "error");
        return;
      }
      router.push("/kashfoffice/projects");
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
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Client *
            </label>
            <input
              type="text"
              required
              value={form.client}
              onChange={(e) => setForm((s) => ({ ...s, client: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              className={inputClass + " cursor-pointer"}
            >
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="design">Design</option>
              <option value="web">Web</option>
              <option value="pack">Pack</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Year *
            </label>
            <select
              value={form.year}
              onChange={(e) => setForm((s) => ({ ...s, year: e.target.value }))}
              className={inputClass + " cursor-pointer"}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Tags
          </label>
          <TagInput
            value={form.tags}
            onChange={(tags) => setForm((s) => ({ ...s, tags }))}
            placeholder="Add tag and press Enter…"
          />
        </div>

        <ImageUpload
          label="Cover Image"
          value={form.coverImage}
          onChange={(url) => setForm((s) => ({ ...s, coverImage: url }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Sort Order
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((s) => ({ ...s, sortOrder: Number(e.target.value) }))}
              className={inputClass}
            />
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm((s) => ({ ...s, featured: !s.featured }))}
                className={`w-10 h-6 rounded-full transition-colors ${form.featured ? "bg-gray-900" : "bg-gray-200"} relative`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.featured ? "left-5" : "left-1"}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-7 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? "Save changes" : "Create project"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/kashfoffice/projects")}
            className="px-7 py-3 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      <AdminToast
        {...toast}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
