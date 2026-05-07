"use client";

import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function FooterSection() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const navLinks = ["about", "services", "projects", "team", "contact"] as const;

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
            <img
              src="/kashf version noir (1).png"
              alt="Kashf Production"
              className="h-8 w-auto object-contain"
              style={{ filter: "invert(1)" }}
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
                const span = document.createElement("span");
                span.className = "font-black text-2xl tracking-tighter text-white";
                span.textContent = "KASHF";
                el.parentNode?.appendChild(span);
              }}
            />
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

          {/* Social links */}
          <div className="flex gap-3">
            {["Instagram", "LinkedIn", "Behance"].map((s) => (
              <a
                key={s}
                href="#"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-xs font-medium hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-all"
                aria-label={s}
              >
                <ExternalLink className="w-3 h-3" />
                {s}
              </a>
            ))}
          </div>
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
