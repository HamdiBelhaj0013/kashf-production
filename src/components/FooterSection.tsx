"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import type { SocialLinks } from "@/lib/api";

interface FooterSectionProps {
  socialLinks: SocialLinks;
}

const LOGO_W = 413;
const LOGO_H = 297;

export default function FooterSection({ socialLinks }: FooterSectionProps) {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();
  const [logoError, setLogoError] = useState(false);

  const navLinks = ["about", "services", "projects", "team", "contact"] as const;

  // Only render social entries whose URL is non-empty
  const socials = [
    { label: "Instagram", url: socialLinks.instagram },
    { label: "LinkedIn",  url: socialLinks.linkedin  },
    { label: "Behance",   url: socialLinks.behance   },
  ].filter((s) => s.url.trim() !== "");

  return (
    <footer className="w-full bg-gray-900 text-white py-14 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="w-full border-b border-gray-800 mb-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          {/* Logo */}
          <div>
            {logoError ? (
              <span className="font-black text-2xl tracking-tighter text-white">KASHF</span>
            ) : (
              <Image
                src="/kashf version noir (1).png"
                alt="Kashf Production"
                width={LOGO_W}
                height={LOGO_H}
                className="h-8 w-auto object-contain"
                style={{ filter: "invert(1)" }}
                onError={() => setLogoError(true)}
              />
            )}
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            {navLinks.map((s) => (
              <a
                key={s}
                href={`#${s}`}
                className="hover:text-white transition-colors capitalize relative group"
              >
                {s}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Social links — only rendered when at least one URL is set */}
          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map(({ label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-xs font-medium hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-all"
                  aria-label={label}
                >
                  <ExternalLink className="w-3 h-3" />
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>{t("rights", { year })}</p>
          <div className="flex gap-5 items-center">
            <Link href="/" locale="en" className="hover:text-gray-300 transition-colors font-semibold">
              EN
            </Link>
            <Link href="/" locale="fr" className="hover:text-gray-300 transition-colors font-semibold">
              FR
            </Link>
            <Link href="/" locale="ar" className="hover:text-gray-300 transition-colors font-semibold">
              AR
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
