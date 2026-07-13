"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/data/projects";

const FILTERS = ["all", "video", "audio", "design", "web", "pack"] as const;
type Filter = (typeof FILTERS)[number];

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const t = useTranslations("Projects");
  const [active, setActive] = useState<Filter>("all");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.category === active);

  const filterLabels: Record<Filter, string> = {
    all: t("filterAll"),
    video: t("filterVideo"),
    audio: t("filterAudio"),
    design: t("filterDesign"),
    web: t("filterWeb"),
    pack: t("filterPack"),
  };

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              active === f
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-24 text-sm">—</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-500 ${
                  p.featured ? "md:col-span-2 lg:col-span-2" : ""
                }`}
                style={{ aspectRatio: p.featured ? "16/7" : "4/3" }}
              >
                <Image
                  src={p.coverImage || "/images/placeholder.png"}
                  alt={`${p.client} — ${p.title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {p.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-bold">
                      {t("featured")}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase block mb-1.5">
                    {p.client} · {p.year}
                  </span>
                  <div className="flex items-end justify-between">
                    <h3 className="text-white font-black text-xl tracking-tight">
                      {p.title}
                    </h3>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110 ml-3 shrink-0">
                      ↗
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-gray-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
