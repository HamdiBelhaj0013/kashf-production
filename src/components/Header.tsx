"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = ["about", "services", "projects", "team", "contact"] as const;
type NavLink = (typeof NAV_LINKS)[number];

export default function Header() {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavLink | null>(null);

  // Scroll detection for sticky style
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_LINKS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <img
            src="/kashf version noir (1).png"
            alt="Kashf Production"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = "none";
              const wrap = document.createElement("div");
              wrap.className = "flex items-center gap-1.5";
              const k = document.createElement("span");
              k.className = "font-black text-xl tracking-tighter text-gray-900";
              k.textContent = "KASHF";
              const p = document.createElement("span");
              p.className = "text-gray-400 font-light text-sm";
              p.textContent = "Production";
              wrap.appendChild(k);
              wrap.appendChild(p);
              el.parentNode?.appendChild(wrap);
            }}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-500">
          {NAV_LINKS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className={`relative group transition-colors capitalize ${
                activeSection === s
                  ? "text-gray-900 font-semibold"
                  : "hover:text-gray-900"
              }`}
            >
              {t(`Navigation.${s}`)}
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-gray-900 transition-all duration-300 ${
                  activeSection === s ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </a>
          ))}

          {/* Language switcher */}
          <div className="flex items-center gap-2.5 ml-2 pl-4 border-l border-gray-200 text-xs tracking-widest font-bold">
            <Link href="/" locale="en" className="hover:text-gray-900 transition-colors">EN</Link>
            <span className="text-gray-300 select-none">·</span>
            <Link href="/" locale="fr" className="hover:text-gray-900 transition-colors">FR</Link>
            <span className="text-gray-300 select-none">·</span>
            <Link href="/" locale="ar" className="hover:text-gray-900 transition-colors">AR</Link>
          </div>

          <a
            href="#contact"
            className="ml-1 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-full hover:bg-gray-700 transition-all tracking-wide shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            {t("Navigation.startProject")}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900 z-40 flex flex-col justify-center items-center gap-8 px-8">
          {/* Close */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1.5"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          {NAV_LINKS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="text-3xl font-black text-white hover:text-gray-300 transition-colors capitalize tracking-tight"
              onClick={() => setMenuOpen(false)}
            >
              {t(`Navigation.${s}`)}
            </a>
          ))}

          <a
            href="#contact"
            className="mt-2 inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 font-bold rounded-full text-sm hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {t("Navigation.startProject")}
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="flex gap-6 text-sm font-bold tracking-widest text-gray-500">
            <Link href="/" locale="en" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">EN</Link>
            <span className="text-gray-700 select-none">·</span>
            <Link href="/" locale="fr" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">FR</Link>
            <span className="text-gray-700 select-none">·</span>
            <Link href="/" locale="ar" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">AR</Link>
          </div>
        </div>
      )}
    </header>
  );
}
