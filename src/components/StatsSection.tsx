"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { FolderOpen, Users, Clock, Globe2 } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

function AnimatedStat({
  value,
  suffix,
  label,
  Icon,
  isLast,
}: {
  value: number;
  suffix: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [inView, count, value]);

  return (
    <div
      ref={ref}
      className={`relative group flex flex-col items-center gap-2 p-6 text-center ${
        !isLast ? "md:border-r md:border-gray-800" : ""
      }`}
    >
      <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mb-1 group-hover:bg-gray-700 transition-colors">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="text-5xl md:text-6xl font-black tracking-tighter text-white tabular-nums">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </div>
      <span className="text-xs text-gray-400 tracking-[0.2em] uppercase">{label}</span>
    </div>
  );
}

export default function StatsSection() {
  const t = useTranslations("Stats");

  const stats = [
    { value: 120, suffix: "+",  labelKey: "projects"  as const, Icon: FolderOpen },
    { value: 80,  suffix: "+",  labelKey: "clients"   as const, Icon: Users      },
    { value: 5,   suffix: "yr", labelKey: "years"     as const, Icon: Clock      },
    { value: 3,   suffix: "",   labelKey: "languages" as const, Icon: Globe2     },
  ];

  return (
    <section className="w-full bg-gray-900 py-16 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        className="relative max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-0"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {stats.map(({ value, suffix, labelKey, Icon }, i) => (
          <AnimatedStat
            key={labelKey}
            value={value}
            suffix={suffix}
            label={t(labelKey)}
            Icon={Icon}
            isLast={i === stats.length - 1}
          />
        ))}
      </motion.div>
    </section>
  );
}
