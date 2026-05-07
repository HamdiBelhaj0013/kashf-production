"use client";

import { useTranslations } from "next-intl";
import { Globe2, Layers, Zap } from "lucide-react";
import { AnimatedSection, staggerContainer, staggerItem } from "@/components/AnimatedSection";
import { motion } from "framer-motion";

export default function WhyUsSection() {
  const t = useTranslations("WhyUs");

  const items = [
    {
      Icon: Globe2,
      titleKey: "item1Title" as const,
      descKey:  "item1Desc"  as const,
    },
    {
      Icon: Layers,
      titleKey: "item2Title" as const,
      descKey:  "item2Desc"  as const,
    },
    {
      Icon: Zap,
      titleKey: "item3Title" as const,
      descKey:  "item3Desc"  as const,
    },
  ];

  return (
    <section className="w-full bg-white py-28">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-12">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">
            {t("label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
            {t("title")}
          </h2>
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          {items.map(({ Icon, titleKey, descKey }) => (
            <motion.div
              key={titleKey}
              variants={staggerItem}
              className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-2 border-t-gray-900"
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-5 group-hover:bg-gray-900 group-hover:border-gray-900 transition-all duration-300">
                <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">{t(titleKey)}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t(descKey)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
