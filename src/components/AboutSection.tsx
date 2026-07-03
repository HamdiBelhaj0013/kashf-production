"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Clapperboard, Mic2, PenTool, Monitor } from "lucide-react";
import Image from "next/image";
import { AnimatedSection, staggerContainer, staggerItem } from "@/components/AnimatedSection";
import { motion } from "framer-motion";

// ─── Orbital diagram (PROTECTED — structure preserved, emojis → Lucide icons) ──
function OrbitalDiagram() {
  const t = useTranslations("About");
  const [logoError, setLogoError] = useState(false);

  // angle 0 = top (Video), 90 = right (Audio), 180 = bottom (Design), 270 = left (Web)
  const nodes = [
    { Icon: Clapperboard, label: t("orbitalVideo"),  angle: 0   },
    { Icon: Mic2,         label: t("orbitalAudio"),  angle: 90  },
    { Icon: PenTool,      label: t("orbitalDesign"), angle: 180 },
    { Icon: Monitor,      label: t("orbitalWeb"),    angle: 270 },
  ];

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Outer spinning ring */}
        <div
          className="absolute inset-0 rounded-full border border-gray-200"
          style={{ animation: "spin 30s linear infinite" }}
        />
        {/* Inner counter-spinning ring */}
        <div
          className="absolute inset-6 rounded-full border border-gray-100"
          style={{ animation: "spin 20s linear infinite reverse" }}
        />
        {/* Static inner ring */}
        <div className="absolute inset-14 rounded-full border border-gray-100" />

        {/* Center — logo or wordmark */}
        <div className="absolute inset-16 rounded-full bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-inner flex items-center justify-center flex-col gap-1">
          {logoError ? (
            <span className="font-black text-2xl tracking-tighter text-gray-900">K</span>
          ) : (
            <Image
              src="/kashf version noir (1).png"
              alt="Kashf Production logo"
              width={413}
              height={297}
              className="w-20 h-auto object-contain"
              onError={() => setLogoError(true)}
            />
          )}
          <span className="text-[8px] tracking-[0.3em] text-gray-400 font-bold uppercase">
            {t("orbitalProduction")}
          </span>
        </div>

        {/* Orbiting service nodes with Lucide icons */}
        {nodes.map(({ Icon, label, angle }) => {
          const rad = (angle * Math.PI) / 180;
          const r = 46;
          const x = 50 + r * Math.sin(rad);
          const y = 50 - r * Math.cos(rad);
          return (
            <div
              key={label}
              className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-300 cursor-default">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mt-2">
                {label}
              </span>
            </div>
          );
        })}

        {/* Floating accent dots */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * 360;
          const rad = (a * Math.PI) / 180;
          const r = 49;
          return (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-gray-300 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${50 + r * Math.sin(rad)}%`,
                top: `${50 - r * Math.cos(rad)}%`,
                opacity: 0.4 + i * 0.07,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function AboutSection() {
  const t = useTranslations("About");
  const tTags = useTranslations("About");

  const tags = [
    tTags("tagArabic"),
    tTags("tagFrench"),
    tTags("tagEnglish"),
    tTags("tagBased"),
    tTags("tagGlobal"),
    tTags("tagSince"),
  ];

  const metrics = [
    { val: "2019", labelKey: "founded" },
    { val: "3",    labelKey: "languages" },
    { val: "12+",  labelKey: "countries" },
  ];

  return (
    <section id="about" className="relative w-full max-w-7xl mx-auto px-6 py-28 scroll-m-20 overflow-hidden">
      {/* Arabic watermark background */}
      <span
        className="absolute -top-8 right-0 text-[180px] font-black text-gray-100 select-none pointer-events-none leading-none"
        aria-hidden="true"
      >
        كشف
      </span>

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left — text */}
        <AnimatedSection>
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-5">
            {t("label")}
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-8 text-gray-900">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
            <br />
            <em className="not-italic text-gray-400">{t("titleLine3")}</em>
          </h2>
          <p className="text-gray-600 text-base leading-relaxed mb-5">
            {t("body1")}
          </p>
          <p className="text-gray-500 text-base leading-relaxed mb-10">
            {t("body2")}
          </p>

          {/* Metric cards */}
          <motion.div
            className="grid grid-cols-3 gap-3 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {metrics.map((m) => (
              <motion.div
                key={m.labelKey}
                variants={staggerItem}
                className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center hover:border-gray-300 transition-colors"
              >
                <div className="text-xl font-black text-gray-900">{m.val}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mt-0.5">
                  {t(m.labelKey as "founded" | "languages" | "countries")}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tag pills */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium border border-gray-200 rounded-full text-gray-500 bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </AnimatedSection>

        {/* Right — orbital diagram (PROTECTED) */}
        <AnimatedSection delay={0.2}>
          <OrbitalDiagram />
        </AnimatedSection>
      </div>
    </section>
  );
}
