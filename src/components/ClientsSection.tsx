"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/AnimatedSection";
import type { Client } from "@/data/clients";

function ClientLogoItem({ client }: { client: Client }) {
  const [imgError, setImgError] = useState(false);

  if (client.logo && !imgError) {
    return (
      <div className="flex items-center justify-center h-14 w-36 flex-shrink-0 cursor-default select-none bg-gray-100 rounded-xl px-4 py-2">
        <Image
          src={client.logo}
          alt={client.name}
          width={120}
          height={48}
          className="object-contain max-h-10 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <span className="text-gray-300 font-black text-lg tracking-tight whitespace-nowrap hover:text-gray-900 transition-colors cursor-default select-none">
      {client.name}
    </span>
  );
}

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
            <ClientLogoItem key={`r1-${c.id}-${i}`} client={c} />
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
            <ClientLogoItem key={`r2-${c.id}-${i}`} client={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
