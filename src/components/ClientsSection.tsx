"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/AnimatedSection";
import type { Client } from "@/data/clients";

export default function ClientsSection({ clients }: { clients: Client[] }) {
  const t = useTranslations("Clients");

  // Duplicate for seamless looping
  const row1 = [...clients, ...clients];
  const row2 = [...clients.slice().reverse(), ...clients.slice().reverse()];

  return (
    <section className="w-full py-16 border-y border-gray-100 overflow-hidden bg-white">
      <AnimatedSection>
        <p className="text-center text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">
          {t("label")}
        </p>
        <p className="text-center text-2xl font-black tracking-tight text-gray-900 mb-10">
          {t("title")}
          <span className="ml-2 text-sm font-normal text-gray-400 tracking-normal">
            ({clients.length})
          </span>
        </p>
      </AnimatedSection>

      {/* Row 1 — scrolls left */}
      <div className="relative overflow-hidden mb-4">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, white, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }}
        />
        <div className="flex gap-14 items-center animate-marquee-left py-2">
          {row1.map((c, i) => (
            <span
              key={`r1-${c.id}-${i}`}
              className="text-gray-300 font-black text-lg tracking-tight whitespace-nowrap hover:text-gray-900 transition-colors cursor-default select-none"
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, white, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }}
        />
        <div className="flex gap-14 items-center animate-marquee-right py-2">
          {row2.map((c, i) => (
            <span
              key={`r2-${c.id}-${i}`}
              className="text-gray-300 font-black text-lg tracking-tight whitespace-nowrap hover:text-gray-900 transition-colors cursor-default select-none"
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
