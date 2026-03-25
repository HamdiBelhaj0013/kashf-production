"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Intersection observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setInView(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = Math.ceil(end / 60);
    const id = setInterval(() => {
      n += step;
      if (n >= end) { setVal(end); clearInterval(id); } else setVal(n);
    }, 16);
    return () => clearInterval(id);
  }, [inView, end]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── Interactive Particle Canvas ──────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const COLS = Math.floor(W / 38);
    const ROWS = Math.floor(H / 38);

    type Dot = { x: number; y: number; bx: number; by: number; vx: number; vy: number; size: number; alpha: number };
    const dots: Dot[] = [];

    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const bx = (c / COLS) * W;
        const by = (r / ROWS) * H;
        dots.push({ x: bx, y: by, bx, by, vx: 0, vy: 0, size: Math.random() * 1.4 + 0.6, alpha: Math.random() * 0.4 + 0.08 });
      }
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      const pos = "touches" in e ? e.touches[0] : e;
      mouse.current = { x: pos.clientX, y: pos.clientY };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove as EventListener, { passive: true });

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      for (const d of dots) {
        const dx = d.x - mouse.current.x;
        const dy = d.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 140;
        const force = Math.max(0, (radius - dist) / radius);

        // Spring push
        d.vx += (dx / (dist + 1)) * force * 2.5;
        d.vy += (dy / (dist + 1)) * force * 2.5;
        // Spring return
        d.vx += (d.bx - d.x) * 0.06;
        d.vy += (d.by - d.y) * 0.06;
        // Damping
        d.vx *= 0.78;
        d.vy *= 0.78;

        d.x += d.vx;
        d.y += d.vy;

        // Brightness near cursor
        const glow = Math.max(0, (100 - dist) / 100);
        const alpha = d.alpha + glow * 0.55;
        const gray = Math.floor(glow * 60);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size + glow * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${gray},${gray},${gray},${alpha})`;
        ctx.fill();
      }

      // Draw thin lines between nearby moved dots
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        const distA = Math.hypot(a.x - mouse.current.x, a.y - mouse.current.y);
        if (distA > 180) continue;
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const d2 = Math.hypot(a.x - b.x, a.y - b.y);
          if (d2 > 55) continue;
          const alpha = (0.12 * (1 - d2 / 55)) * (1 - distA / 180);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(100,100,100,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}

// ─── Tilt Card ─────────────────────────────────────────────────────────────────
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transition: "transform 0.2s ease", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [formState, setFormState] = useState({ name: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const aboutRef = useInView();
  const servicesRef = useInView();
  const statsRef = useInView();
  const projectsRef = useInView();
  const clientsRef = useInView();
  const teamRef = useInView();
  const contactRef = useInView();
  const whyRef = useInView();

  const services = [
    {
      id: "video", icon: "🎬", color: "from-slate-100 to-white",
      tags: ["Short Film", "Corporate", "Reels", "Docs", "Motion"],
      highlights: ["4K Production", "Post-Production", "Color Grading", "Motion Graphics"],
    },
    {
      id: "audio", icon: "🎙️", color: "from-stone-100 to-white",
      tags: ["Podcast", "Voice-Over", "Jingles", "Mixing", "Sound Design"],
      highlights: ["Studio Recording", "Remote Sessions", "Broadcast Ready", "Multilingual VO"],
    },
    {
      id: "graphics", icon: "✦", color: "from-zinc-100 to-white",
      tags: ["Branding", "Logo", "Social Visuals", "Print", "Identity"],
      highlights: ["Brand Strategy", "Logo System", "Style Guide", "Full Identity"],
    },
    {
      id: "web", icon: "⌨", color: "from-neutral-100 to-white",
      tags: ["Next.js", "React", "E-Commerce", "CMS", "SEO"],
      highlights: ["Performance First", "Mobile Optimized", "CMS Integration", "Analytics"],
    },
  ];

  const stats = [
    { value: 120, suffix: "+", label: "Projects Delivered", icon: "📦" },
    { value: 80, suffix: "+", label: "Happy Clients", icon: "🤝" },
    { value: 5, suffix: "yr", label: "Years of Expertise", icon: "⭐" },
    { value: 3, suffix: "", label: "Languages", icon: "🌍" },
  ];

  const projects = [
    { title: "Brand Film — Sonatrach", cat: "Video", year: "2024", img: "https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=700&q=80", featured: true },
    { title: "Podcast Series — Maghreb Voices", cat: "Audio", year: "2024", img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=700&q=80", featured: false },
    { title: "Visual Identity — StartUp DZ", cat: "Graphic Design", year: "2023", img: "https://images.unsplash.com/photo-1634942536790-4d1d5ab3f3c0?w=700&q=80", featured: false },
    { title: "E-Commerce — ArtisanCraft", cat: "Web Dev", year: "2023", img: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=700&q=80", featured: false },
    { title: "Campaign — CulturArt Festival", cat: "Video + Design", year: "2024", img: "https://images.unsplash.com/photo-1603739903239-8b6e64c3b185?w=700&q=80", featured: false },
    { title: "Corporate Site — Atlas Group", cat: "Web Dev", year: "2023", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80", featured: false },
  ];

  const clients = ["Sonatrach", "Atlas Group", "StartUp DZ", "CulturArt", "Maghreb Voices", "ArtisanCraft", "MediaHub", "TechNorth", "Djezzy", "Cevital"];

  const team = [
    { name: "Moenes Guesmi", role: "Creative Director", emoji: "🎨", social: "@moenes" },
    { name: "Aymen Touihri", role: "Video Producer", emoji: "🎬", social: "@aymen" },
    { name: "Nidhal Othmen", role: "Sound Engineer", emoji: "🎙️", social: "@nidhal" },
    { name: "Hamdi Belhaj", role: "Lead Developer", emoji: "💻", social: "@hamdi" },
    { name: "Aziz Jbeli", role: "Graphic Designer", emoji: "✦", social: "@aziz" },
    { name: "Badis Belguith", role: "Project Manager", emoji: "📋", social: "@badis" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setSubmitted(true);
  };

  return (
    <>
      <main className="flex-1 flex flex-col items-center bg-white text-gray-900 w-full overflow-x-hidden selection:bg-gray-900 selection:text-white">

        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-sm py-3" : "bg-transparent py-5"}`}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* ↓ Replace src with your actual logo path e.g. /kashf-version-noir.png */}
              <img
                src="/kashf version noir (1).png"
                alt="Kashf Production"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  // Fallback: show text if logo not found
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = document.createElement("span");
                  fallback.className = "font-black text-xl tracking-tighter text-gray-900";
                  fallback.textContent = "KASHF";
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
              {["about", "services", "projects", "team", "contact"].map(s => (
                <a
                  key={s}
                  href={`#${s}`}
                  className="relative group hover:text-gray-900 transition-colors capitalize"
                >
                  {t(`Navigation.${s}` as any)}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200 text-xs tracking-widest font-bold">
                <Link href="/" locale="en" className="hover:text-gray-900 transition-colors">EN</Link>
                <Link href="/" locale="fr" className="hover:text-gray-900 transition-colors">FR</Link>
                <Link href="/" locale="ar" className="hover:text-gray-900 transition-colors">AR</Link>
              </div>
              <a href="#contact" className="ml-2 px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-full hover:bg-gray-700 hover:scale-105 transition-all tracking-wide shadow-sm">
                {t("Navigation.startProject")}
              </a>
            </nav>

            <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(v => !v)} aria-label="menu">
              <div className="space-y-1.5 w-6">
                <span className={`block h-px bg-gray-900 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-px bg-gray-900 transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : ""}`} />
                <span className={`block h-px bg-gray-900 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 px-6 py-6 space-y-4 text-sm shadow-xl animate-slideDown">
              {["about", "services", "projects", "team", "contact"].map(s => (
                <a key={s} href={`#${s}`} className="flex items-center justify-between text-gray-600 hover:text-gray-900 capitalize py-1 group" onClick={() => setMenuOpen(false)}>
                  <span>{t(`Navigation.${s}` as any)}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </a>
              ))}
              <div className="flex gap-4 pt-3 border-t border-gray-100 text-xs font-bold tracking-widest text-gray-400">
                <Link href="/" locale="en">EN</Link>
                <Link href="/" locale="fr">FR</Link>
                <Link href="/" locale="ar">AR</Link>
              </div>
            </div>
          )}
        </header>

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 text-center pt-28 pb-24 overflow-hidden bg-white">
          <ParticleCanvas />

          {/* Radial gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.9) 30%, rgba(245,245,245,0.6) 70%, rgba(235,235,235,0.3) 100%)" }} />

          <div className="relative z-10 max-w-5xl w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm" style={{ animation: "fadeUp 0.7s ease both" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
              {t("Hero.badge")}
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[104px] font-black tracking-[-0.04em] leading-[0.88] mb-6 text-gray-900" style={{ animation: "fadeUp 0.8s 0.1s ease both", opacity: 0, animationFillMode: "forwards" }}>
              {t("Hero.titleLine1")}<br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 pb-2">
                <Typewriter words={[t("Hero.word1"), t("Hero.word2"), t("Hero.word3"), t("Hero.word4")]} />
                <svg className="absolute bottom-0 left-0 w-full overflow-visible" viewBox="0 0 300 10" fill="none" preserveAspectRatio="none">
                  <path d="M2 7 C75 2, 225 2, 298 7" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>{" "}
              {t("Hero.titleLine2")}
            </h1>

            <p className="text-xl md:text-2xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12" style={{ animation: "fadeUp 0.8s 0.25s ease both", opacity: 0, animationFillMode: "forwards" }}>
              {t("Hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16" style={{ animation: "fadeUp 0.8s 0.35s ease both", opacity: 0, animationFillMode: "forwards" }}>
              <a href="#services" className="group relative px-9 py-4 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">{t("Hero.cta")}</span>
                <span className="relative group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a href="#projects" className="group px-9 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:border-gray-400 hover:bg-white hover:-translate-y-0.5 transition-all text-center shadow-sm hover:shadow-md">
                {t("Hero.ctaSecondary")}
                <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↓</span>
              </a>
            </div>

            {/* Floating service pills */}
            <div className="flex flex-wrap justify-center gap-3" style={{ animation: "fadeUp 0.8s 0.5s ease both", opacity: 0, animationFillMode: "forwards" }}>
              {[
                { icon: "🎬", label: t("Hero.pillVideo") },
                { icon: "🎙️", label: t("Hero.pillAudio") },
                { icon: "✦", label: t("Hero.pillDesign") },
                { icon: "💻", label: t("Hero.pillWeb") },
                { icon: "📦", label: t("Hero.pillPacks") },
              ].map((item, i) => (
                <a
                  key={i}
                  href="#services"
                  className="group px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm font-medium text-gray-600 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-gray-400 hover:bg-white transition-all duration-200 flex items-center gap-2"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" style={{ animation: "fadeUp 1s 0.8s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-bold">{t("Hero.scrollHint")}</span>
            <div className="w-6 h-10 rounded-full border border-gray-300 flex items-start justify-center pt-2">
              <div className="w-1 h-2 rounded-full bg-gray-400 animate-scrollDot" />
            </div>
          </div>
        </section>

        {/* ── ABOUT ──────────────────────────────────────────────────────────── */}
        <section id="about" className="w-full max-w-7xl mx-auto px-6 py-28 scroll-m-20">
          <div
            ref={aboutRef.ref}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-20 items-center transition-all duration-700 ${aboutRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-5">About Kashf</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-8 text-gray-900">
                We don't just<br />create content.<br />
                <em className="not-italic text-gray-400">We reveal your story.</em>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-5">
                <strong>Kashf</strong> (كشف) means <em>revelation</em> — the moment something hidden becomes clear. We uncover the authentic voice of every person, brand, or project and make it powerfully visible online.
              </p>
              <p className="text-gray-500 text-base leading-relaxed mb-10">
                Based in Tunisia, operating globally. We serve clients in Arabic, French, and English — across video, audio, design, and web — as standalone services or integrated production packs.
              </p>

              {/* Metric cards */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { val: "2019", label: "Founded" },
                  { val: "3", label: "Languages" },
                  { val: "12+", label: "Countries" },
                ].map((m, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center hover:border-gray-300 transition-colors">
                    <div className="text-xl font-black text-gray-900">{m.val}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {["Arabic", "French", "English", "Tunisia-based", "Global reach", "Since 2019"].map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium border border-gray-200 rounded-full text-gray-500 bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 3D Orbital visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                {/* Outer rings */}
                <div className="absolute inset-0 rounded-full border border-gray-100 animate-spin" style={{ animationDuration: "40s" }} />
                <div className="absolute inset-6 rounded-full border border-gray-200 animate-spin" style={{ animationDuration: "28s", animationDirection: "reverse" }} />
                <div className="absolute inset-14 rounded-full border border-gray-100" />

                {/* Gradient center */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-inner flex items-center justify-center flex-col gap-1">
                  <img
                    src="/kashf version noir (1).png"
                    alt="Kashf"
                    className="w-20 h-auto object-contain"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = "none";
                      const span = document.createElement("span");
                      span.className = "font-black text-2xl tracking-tighter";
                      span.textContent = "K";
                      el.parentNode?.appendChild(span);
                    }}
                  />
                  <span className="text-[8px] tracking-[0.3em] text-gray-400 font-bold uppercase">Production</span>
                </div>

                {/* Orbiting badges */}
                {[
                  { icon: "🎬", label: "Video", angle: 0 },
                  { icon: "🎙️", label: "Audio", angle: 90 },
                  { icon: "✦", label: "Design", angle: 180 },
                  { icon: "💻", label: "Web", angle: 270 },
                ].map(({ icon, label, angle }) => {
                  const rad = (angle * Math.PI) / 180;
                  const r = 46;
                  const x = 50 + r * Math.sin(rad);
                  const y = 50 - r * Math.cos(rad);
                  return (
                    <div
                      key={label}
                      className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-lg hover:scale-125 hover:shadow-lg transition-all duration-300 cursor-default">
                        {icon}
                      </div>
                      <span className="text-[8px] font-bold tracking-widest text-gray-400 uppercase">{label}</span>
                    </div>
                  );
                })}

                {/* Floating accent dots */}
                {[...Array(8)].map((_, i) => {
                  const a = (i / 8) * 360;
                  const rad = (a * Math.PI) / 180;
                  const r = 49;
                  return (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-gray-300 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${50 + r * Math.sin(rad)}%`, top: `${50 - r * Math.cos(rad)}%`, opacity: 0.4 + i * 0.07 }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ──────────────────────────────────────────────────────────── */}
        <section className="w-full bg-gray-900 py-16 relative overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div
            ref={statsRef.ref}
            className={`relative max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 ${statsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {stats.map((s, i) => (
              <div key={i} className="group flex flex-col items-center gap-2 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors text-center">
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</span>
                <span className="text-5xl md:text-6xl font-black tracking-tighter text-white tabular-nums">
                  <Counter end={s.value} suffix={s.suffix} />
                </span>
                <span className="text-xs text-gray-400 tracking-[0.2em] uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICES ───────────────────────────────────────────────────────── */}
        <section id="services" className="w-full max-w-7xl mx-auto px-6 py-28 scroll-m-20">
          <div
            ref={servicesRef.ref}
            className={`transition-all duration-700 ${servicesRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">What We Do</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">Our Services</h2>
              </div>
              <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
                Available standalone or bundled in integrated production packs — starting from a single deliverable to full campaigns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {services.map((svc, i) => (
                <TiltCard key={svc.id} className="group relative p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-default" data-hover="true">
                  <div className={`absolute inset-0 bg-gradient-to-br ${svc.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none`} />
                  <div className="relative flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                      {svc.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{t(`Services.${svc.id}`)}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-mono tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">{t(`Services.${svc.id}_desc`)}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {svc.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full font-medium hover:bg-gray-200 transition-colors">{tag}</span>
                        ))}
                      </div>

                      {/* Highlights */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {svc.highlights.map(h => (
                          <div key={h} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                            <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                            {h}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs">
                    <a href="#contact" className="text-gray-400 group-hover:text-gray-700 transition-colors font-medium">Request a quote</a>
                    <span className="text-gray-300 group-hover:text-gray-700 group-hover:translate-x-1 transition-all">→</span>
                  </div>
                </TiltCard>
              ))}
            </div>

            {/* Production Packs Banner */}
            <div className="mt-6 p-8 rounded-2xl bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📦</span>
                  <h3 className="font-bold text-xl">Production Packs</h3>
                </div>
                <p className="text-gray-400 text-sm max-w-md">Bundle video, audio, design, and web into cohesive brand packages. Better results, better value — built around your goals.</p>
              </div>
              <a href="#contact" className="relative shrink-0 px-8 py-3.5 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg">
                Get a Custom Pack →
              </a>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ───────────────────────────────────────────────────────── */}
        <section id="projects" className="w-full bg-gray-50 py-28 scroll-m-20">
          <div className="max-w-7xl mx-auto px-6">
            <div
              ref={projectsRef.ref}
              className={`transition-all duration-700 ${projectsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">Portfolio</p>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">Selected Work</h2>
                </div>
                <a href="#contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors group flex items-center gap-1">
                  See all projects <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>

              {/* Featured project */}
              <div className="mb-4 relative rounded-2xl overflow-hidden cursor-pointer group" style={{ aspectRatio: "16/7" }}>
                <img src={projects[0].img} alt={projects[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 flex items-end justify-between w-full">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase block mb-2">{projects[0].cat} · {projects[0].year} · Featured</span>
                    <h3 className="text-white font-black text-3xl tracking-tight">{projects[0].title}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xl opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110">
                    ↗
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-bold">Featured</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {projects.slice(1).map((p, i) => (
                  <div
                    key={i}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-500 ${i === 0 || i === 3 ? "lg:col-span-3" : "lg:col-span-2"}`}
                    style={{ aspectRatio: "4/3" }}
                  >
                    <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase block mb-1">{p.cat} · {p.year}</span>
                      <h3 className="text-white font-bold text-sm leading-snug">{p.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110">
                      <span className="text-white text-xs">↗</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CLIENTS MARQUEE ────────────────────────────────────────────────── */}
        <section className="w-full py-16 border-y border-gray-100 overflow-hidden bg-white">
          <div ref={clientsRef.ref} className={`transition-all duration-700 ${clientsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-center text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-10">Trusted by Clients &amp; Partners</p>
            <div className="flex overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, white, transparent)" }} />
              <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, white, transparent)" }} />
              <div className="flex gap-14 items-center shrink-0 animate-marquee pr-14">
                {[...clients, ...clients].map((c, i) => (
                  <span key={i} className="text-gray-200 font-black text-xl tracking-tight whitespace-nowrap hover:text-gray-600 transition-colors cursor-default select-none">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY US ─────────────────────────────────────────────────────────── */}
        <section className="w-full bg-white py-24">
          <div
            ref={whyRef.ref}
            className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${whyRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-3 text-center">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 text-center mb-12">Built Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "🌍", title: "Multilingual by Default", desc: "We deliver in Arabic, French, and English — reaching audiences across North Africa, Europe, and beyond. No translation needed.", accent: "border-t-2 border-t-gray-900" },
                { icon: "📦", title: "End-to-End Production", desc: "From strategy and script to final delivery, we handle every stage. One team. One vision. Zero handoff gaps.", accent: "border-t-2 border-t-gray-900" },
                { icon: "⚡", title: "Fast & Transparent", desc: "Tight deadlines? Our team thrives. Speed, quality, and honest communication — every time, without compromise.", accent: "border-t-2 border-t-gray-900" },
              ].map((item, i) => (
                <div key={i} className={`group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${item.accent}`}>
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ────────────────────────────────────────────────────────── */}
        <section className="w-full bg-gray-900 py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="relative max-w-7xl mx-auto px-6">
            <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-3 text-center">How We Work</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white text-center mb-16">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-gray-700" />
              {[
                { step: "01", title: "Discover", desc: "Deep dive into your brand, goals, and audience to shape the right strategy.", icon: "🔍" },
                { step: "02", title: "Create", desc: "Production begins — scripts, visuals, audio, code — all under one roof.", icon: "✨" },
                { step: "03", title: "Refine", desc: "Collaborative feedback rounds to sharpen every detail until it's perfect.", icon: "🎯" },
                { step: "04", title: "Launch", desc: "Final delivery, publishing support, and performance tracking.", icon: "🚀" },
              ].map((p, i) => (
                <div key={i} className="relative flex flex-col items-center text-center group">
                  <div className="relative w-16 h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl mb-4 group-hover:border-gray-500 group-hover:scale-110 transition-all duration-300 z-10">
                    {p.icon}
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-[9px] font-black text-gray-400">{p.step}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ───────────────────────────────────────────────────────────── */}
        <section id="team" className="w-full bg-gray-50 py-28 scroll-m-20">
          <div className="max-w-7xl mx-auto px-6">
            <div
              ref={teamRef.ref}
              className={`transition-all duration-700 ${teamRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="mb-16">
                <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">The People</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">Our Team</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {team.map((m, i) => (
                  <TiltCard key={i} className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-400 hover:shadow-lg text-center transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <div className="relative w-14 h-14 mx-auto mb-4">
                      <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {m.emoji}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight mb-1">{m.name}</h3>
                    <p className="text-[11px] text-gray-400 mb-2">{m.role}</p>
                    <p className="text-[10px] text-gray-300 font-mono">{m.social}</p>
                  </TiltCard>
                ))}
              </div>
              <div className="mt-8 p-6 rounded-xl bg-white border border-dashed border-gray-300 text-center hover:border-gray-400 transition-colors">
                <p className="text-gray-500 text-sm">
                  We're growing. Passionate about content?{" "}
                  <a href="#contact" className="text-gray-900 font-semibold underline underline-offset-2 hover:no-underline">Join the team →</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL ────────────────────────────────────────────────────── */}
        <section className="w-full bg-white py-20 border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="text-4xl mb-6">❝</div>
            <blockquote className="text-2xl md:text-3xl font-light text-gray-700 leading-relaxed mb-8 italic">
              "Kashf transformed our brand presence across North Africa. The team's multilingual approach and attention to detail is unmatched."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-lg">👤</div>
              <div className="text-left">
                <div className="font-bold text-sm text-gray-900">Ahmed Benali</div>
                <div className="text-xs text-gray-400">CEO, Atlas Group</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ────────────────────────────────────────────────────────── */}
        <section id="contact" className="w-full bg-white py-28 scroll-m-20">
          <div className="max-w-7xl mx-auto px-6">
            <div
              ref={contactRef.ref}
              className={`transition-all duration-700 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-5">Get In Touch</p>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6 text-gray-900">
                    Ready to become<br /><span className="text-gray-400">visible?</span>
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed mb-10">
                    Tell us about your project — we'll get back to you within 24 hours with a tailored proposal that fits your goals and budget.
                  </p>
                  <div className="space-y-4">
                    {[
                      { icon: "✉", label: "Email", value: "hello@kashf.tn", href: "mailto:hello@kashf.tn" },
                      { icon: "📍", label: "Location", value: "Tunis, Tunisia", href: "#" },
                      { icon: "🌐", label: "Languages", value: "AR · FR · EN", href: "#" },
                      { icon: "📱", label: "Response time", value: "Within 24h", href: "#" },
                    ].map(item => (
                      <a key={item.label} href={item.href} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-base shrink-0 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">{item.icon}</div>
                        <div>
                          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{item.label}</p>
                          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{item.value}</p>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Social links */}
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <p className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-4">Follow Along</p>
                    <div className="flex gap-3">
                      {[
                        { name: "Instagram", handle: "@kashf.production" },
                        { name: "LinkedIn", handle: "Kashf Production" },
                        { name: "Behance", handle: "kashfpro" },
                      ].map(s => (
                        <a key={s.name} href="#" className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 hover:bg-white transition-all text-center group">
                          <div className="text-xs font-bold text-gray-900 group-hover:text-gray-700">{s.name}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{s.handle}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm relative overflow-hidden">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                      <div className="text-5xl mb-4 animate-bounce">✅</div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-500 text-sm">We'll get back to you within 24 hours. Check your inbox!</p>
                      <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-700 transition-colors">
                        Send Another
                      </button>
                    </div>
                  ) : (
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                      <h3 className="font-black text-lg text-gray-900 mb-2">Start a Conversation</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Your name *"
                            value={formState.name}
                            onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                            className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Email address *"
                            value={formState.email}
                            onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                            className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                          />
                        </div>
                      </div>
                      <select
                        value={formState.service}
                        onChange={e => setFormState(s => ({ ...s, service: e.target.value }))}
                        className="px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-500 text-sm focus:outline-none focus:border-gray-500 transition-colors cursor-pointer"
                      >
                        <option value="" disabled>Select a service</option>
                        <option>Video Production</option>
                        <option>Audio Production</option>
                        <option>Graphic Design</option>
                        <option>Web Development</option>
                        <option>Production Pack</option>
                        <option>Other / Not Sure</option>
                      </select>
                      <textarea
                        rows={4}
                        placeholder="Tell us about your project... *"
                        value={formState.message}
                        onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                        className="px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors resize-none"
                      />
                      <button
                        type="submit"
                        className="group w-full py-4 bg-gray-900 text-white font-bold rounded-xl text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        Send Message
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                      <p className="text-[10px] text-gray-400 text-center">We respond within 24 hours · No spam, ever</p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
        <footer className="w-full bg-gray-900 text-white py-14 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
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
              <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                {["about", "services", "projects", "team", "contact"].map(s => (
                  <a key={s} href={`#${s}`} className="hover:text-white transition-colors capitalize relative group">
                    {s}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                  </a>
                ))}
              </nav>
              <div className="flex gap-5 text-sm text-gray-400">
                {["X (Twitter)", "Instagram", "LinkedIn"].map(s => (
                  <a key={s} href="#" className="hover:text-white transition-colors">{s}</a>
                ))}
              </div>
            </div>
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
              <p>© {new Date().getFullYear()} Kashf Production. All rights reserved.</p>
              <div className="flex gap-6 items-center">
                <Link href="/" locale="en" className="hover:text-gray-300 transition-colors">EN</Link>
                <Link href="/" locale="fr" className="hover:text-gray-300 transition-colors">FR</Link>
                <Link href="/" locale="ar" className="hover:text-gray-300 transition-colors">AR</Link>
              </div>
            </div>
          </div>
        </footer>

        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes scrollDot {
            0%   { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(14px); opacity: 0; }
          }
          .animate-marquee { animation: marquee 22s linear infinite; }
          .animate-slideDown { animation: slideDown 0.2s ease both; }
          .animate-scrollDot { animation: scrollDot 1.4s ease-in-out infinite; }
          
          ::selection { background: #111; color: #fff; }

          html { scroll-behavior: smooth; }
        `}</style>
      </main>
    </>
  );
}