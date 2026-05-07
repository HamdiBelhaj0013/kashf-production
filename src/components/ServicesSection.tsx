"use client";

import { useTranslations } from "next-intl";
import { Clapperboard, Mic2, PenTool, Code2, Package } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection, staggerContainer, staggerItem } from "@/components/AnimatedSection";

const services = [
  {
    id: "video",
    Icon: Clapperboard,
    tags: ["Short Film", "Corporate", "Reels", "Docs", "Motion"],
    highlights: ["4K Production", "Post-Production", "Color Grading", "Motion Graphics"],
  },
  {
    id: "audio",
    Icon: Mic2,
    tags: ["Podcast", "Voice-Over", "Jingles", "Mixing", "Sound Design"],
    highlights: ["Studio Recording", "Remote Sessions", "Broadcast Ready", "Multilingual VO"],
  },
  {
    id: "graphics",
    Icon: PenTool,
    tags: ["Branding", "Logo", "Social Visuals", "Print", "Identity"],
    highlights: ["Brand Strategy", "Logo System", "Style Guide", "Full Identity"],
  },
  {
    id: "web",
    Icon: Code2,
    tags: ["Next.js", "React", "E-Commerce", "CMS", "SEO"],
    highlights: ["Performance First", "Mobile Optimized", "CMS Integration", "Analytics"],
  },
] as const;

export default function ServicesSection() {
  const t = useTranslations("Services");

  return (
    <section id="services" className="w-full max-w-7xl mx-auto px-6 py-28 scroll-m-20">
      <AnimatedSection>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">
              {t("label")}
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
              {t("title")}
            </h2>
          </div>
          <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </AnimatedSection>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        {services.map((svc, i) => {
          const { Icon } = svc;
          return (
            <motion.div
              key={svc.id}
              variants={staggerItem}
              className="group relative p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-default"
            >
              <div className="relative flex items-start gap-6">
                {/* Icon box — black on hover */}
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 group-hover:bg-gray-900 group-hover:border-gray-900 transition-all duration-300">
                  <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {t(svc.id as "video" | "audio" | "graphics" | "web")}
                    </h3>
                    {/* Service number top-right */}
                    <span className="text-gray-300 font-mono text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {t(`${svc.id}_desc` as "video_desc" | "audio_desc" | "graphics_desc" | "web_desc")}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full font-medium hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {svc.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs">
                <a
                  href="#contact"
                  className="text-gray-400 group-hover:text-gray-700 transition-colors font-medium"
                >
                  {t("requestQuote")}
                </a>
                <span className="text-gray-300 group-hover:text-gray-700 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Production Packs Banner */}
      <AnimatedSection delay={0.2}>
        <div className="mt-6 p-8 rounded-2xl bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-xl">{t("packsTitle")}</h3>
            </div>
            <p className="text-gray-400 text-sm max-w-md">{t("packsDesc")}</p>
          </div>
          <a
            href="#contact"
            className="relative shrink-0 px-8 py-3.5 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
          >
            {t("packsCta")}
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
}
