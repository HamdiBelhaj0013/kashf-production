"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Aperture,
  Clapperboard,
  AudioWaveform,
  Code2,
  PenTool,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { AnimatedSection, staggerContainerVariants, staggerItem } from "@/components/AnimatedSection";
import type { TeamMember } from "@/data/team";
import { useState } from "react";

// Explicit icon map — avoids dynamic import of entire lucide bundle
const iconMap: Record<string, LucideIcon> = {
  Aperture,
  Clapperboard,
  AudioWaveform,
  Code2,
  PenTool,
  LayoutGrid,
};

const departmentStyles: Record<TeamMember["department"], string> = {
  creative:   "bg-gray-900 text-white border-gray-900",
  technical:  "bg-gray-100 text-gray-700 border-gray-200",
  production: "bg-gray-100 text-gray-700 border-gray-200",
  management: "bg-gray-100 text-gray-700 border-gray-200",
};

function MemberCard({ member }: { member: TeamMember }) {
  const [hovered, setHovered] = useState(false);
  const IconComponent = iconMap[member.lucideIcon] ?? Aperture;

  return (
    <motion.div
      variants={staggerItem}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md text-center transition-all duration-300 cursor-default overflow-hidden"
      whileHover={{ y: -4 }}
    >
      {/* Icon circle */}
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <IconComponent className="w-6 h-6 text-gray-600" />
        </div>
        {/* Online indicator */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
      </div>

      <h3 className="font-bold text-sm text-gray-900 leading-tight mb-1">
        {member.name}
      </h3>
      <p className="text-xs text-gray-500 mb-3">{member.role}</p>

      {/* Department badge */}
      <span
        className={`inline-block text-[9px] px-2.5 py-0.5 rounded-full font-semibold tracking-widest uppercase border ${
          departmentStyles[member.department]
        }`}
      >
        {member.department}
      </span>

      {/* Bio — slides up on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="bio"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden absolute inset-x-0 bottom-0"
          >
            <div className="bg-white border-t border-gray-100 px-4 py-3">
              <p className="text-[11px] text-gray-500 leading-snug">{member.bio}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TeamSection({ team }: { team: TeamMember[] }) {
  const t = useTranslations("Team");

  return (
    <section id="team" className="w-full bg-gray-50 py-28 scroll-m-20">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="mb-16">
            <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">
              {t("label")}
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
              {t("title")}
            </h2>
          </div>
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainerVariants}
        >
          {team.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </motion.div>

        {/* Join the team nudge */}
        <AnimatedSection delay={0.3}>
          <div className="mt-8 p-6 rounded-xl bg-white border border-gray-200 text-center hover:border-gray-300 transition-colors">
            <p className="text-gray-500 text-sm">
              {t("join")}{" "}
              <a
                href="#contact"
                className="text-gray-900 font-semibold underline underline-offset-2 hover:no-underline"
              >
                {t("joinLink")}
              </a>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
