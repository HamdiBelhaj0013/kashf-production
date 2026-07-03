"use client";

import { useTranslations } from "next-intl";
import { Search, Clapperboard, SlidersHorizontal, Rocket } from "lucide-react";
import { AnimatedSection, staggerContainerVariants, staggerItem } from "@/components/AnimatedSection";
import { motion } from "framer-motion";

const steps = [
  { num: "01", Icon: Search,           titleKey: "step1Title", descKey: "step1Desc" },
  { num: "02", Icon: Clapperboard,     titleKey: "step2Title", descKey: "step2Desc" },
  { num: "03", Icon: SlidersHorizontal,titleKey: "step3Title", descKey: "step3Desc" },
  { num: "04", Icon: Rocket,           titleKey: "step4Title", descKey: "step4Desc" },
] as const;

export default function ProcessSection() {
  const t = useTranslations("Process");

  return (
    <section className="w-full bg-gray-50 py-28">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">
            {t("label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
            {t("title")}
          </h2>
        </AnimatedSection>

        <div className="relative">
          {/* Dashed connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[13%] right-[13%] border-t border-dashed border-gray-200 z-0" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainerVariants}
          >
            {steps.map(({ num, Icon, titleKey, descKey }) => (
              <motion.div
                key={num}
                variants={staggerItem}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step number watermark */}
                <span className="absolute -top-6 text-[72px] font-mono font-black text-gray-100 select-none leading-none pointer-events-none">
                  {num}
                </span>

                {/* Icon circle */}
                <div className="relative w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 z-10 group-hover:border-gray-900 group-hover:bg-gray-900 transition-all duration-300 shadow-sm">
                  <Icon className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-2">
                  {t(titleKey)}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-[160px]">
                  {t(descKey)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
