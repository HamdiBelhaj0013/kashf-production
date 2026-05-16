"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Clapperboard, Mic2, PenTool, Code2, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// ─── Typewriter animation (PROTECTED — word cycling with cursor, keep exact) ──
function Typewriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && display.length < word.length) {
      timeout = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), 80);
    } else if (!deleting && display.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && display.length > 0) {
      timeout = setTimeout(() => setDisplay(display.slice(0, -1)), 45);
    } else if (deleting && display.length === 0) {
      setDeleting(false);
      setIdx((idx + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [display, deleting, idx, words]);

  return (
    <span className="text-gray-400">
      {display}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// Framer Motion stagger config
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function HeroSection() {
  const t = useTranslations();

  const pills = [
    { Icon: Clapperboard, label: t("Hero.pillVideo")  },
    { Icon: Mic2,         label: t("Hero.pillAudio")  },
    { Icon: PenTool,      label: t("Hero.pillDesign") },
    { Icon: Code2,        label: t("Hero.pillWeb")    },
    { Icon: Package,      label: t("Hero.pillPacks")  },
  ];

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 text-center pt-28 pb-24 overflow-hidden bg-white">

      {/* Base dot grid — always visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #64748b 2px, transparent 2px)",
          backgroundSize: "40px 40px",
          opacity: 0.35,
          animation: "dotPulse 4s ease-in-out infinite",
        }}
      />

      {/* Spotlight — dark dots follow cursor smoothly */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #0f172a 2px, transparent 2px)",
          backgroundSize: "40px 40px",
          maskImage: `radial-gradient(ellipse 500px 500px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(ellipse 500px 500px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 70%)`,
          opacity: 0.7,
          transition: "mask-image 0.05s ease, -webkit-mask-image 0.05s ease",
        }}
      />

      {/* ── Soft blur blobs for depth ──────────────────────────────────────── */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-gray-100 blur-[120px] pointer-events-none opacity-60" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-gray-200 blur-[120px] pointer-events-none opacity-40" />

      {/* ── Radial gradient to fade edges ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(255,255,255,0.85) 30%, rgba(255,255,255,0.5) 70%, transparent 100%)",
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 max-w-5xl w-full"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {/* Availability badge */}
        <motion.div variants={item} className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase rounded-full bg-white border border-gray-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
            {t("Hero.badge")}
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={item}
          className="text-6xl md:text-8xl lg:text-[104px] font-black tracking-[-0.04em] leading-[0.88] mb-6 text-gray-900"
        >
          {t("Hero.titleLine1")}
          <br />
          <span className="relative inline-block pb-2">
            <Typewriter
              words={[
                t("Hero.word1"),
                t("Hero.word2"),
                t("Hero.word3"),
                t("Hero.word4"),
              ]}
            />
            {/* Underline accent */}
            <svg
              className="absolute bottom-0 left-0 w-full overflow-visible"
              viewBox="0 0 300 10"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M2 7 C75 2, 225 2, 298 7"
                stroke="#d1d5db"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          {t("Hero.titleLine2")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="text-xl md:text-2xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12"
        >
          {t("Hero.subtitle")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
        >
          <a
            href="#services"
            className="group inline-flex items-center justify-center gap-2 px-9 py-4 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {t("Hero.cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#projects"
            className="group inline-flex items-center justify-center gap-2 px-9 py-4 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:border-gray-400 hover:bg-white hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
          >
            {t("Hero.ctaSecondary")}
          </a>
        </motion.div>

        {/* Service pills */}
        <motion.div
          variants={item}
          className="flex flex-wrap justify-center gap-3"
        >
          {pills.map(({ Icon, label }, i) => (
            <a
              key={i}
              href="#services"
              className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-600 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-gray-400 hover:bg-white transition-all duration-200"
            >
              <Icon className="w-4 h-4 text-gray-500" />
              <span>{label}</span>
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-bold">
          {t("Hero.scrollHint")}
        </span>
        <div className="w-6 h-10 rounded-full border border-gray-300 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-gray-400 animate-scrollDot" />
        </div>
      </div>
    </section>
  );
}
