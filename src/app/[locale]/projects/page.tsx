import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { getProjects, getSocialLinks } from "@/lib/api";
import { Link } from "@/i18n/routing";
import ProjectsGrid from "./ProjectsGrid";

const BASE_URL = "https://kashf.tn";
const OG_IMAGE  = `${BASE_URL}/og-image.png`;
const LOCALES   = ["en", "fr", "ar"] as const;

const pageMeta = {
  en: {
    title: "Our Work",
    description:
      "Browse the full portfolio of Kashf Production — video, audio, graphic design, and web projects across North Africa and beyond.",
  },
  fr: {
    title: "Nos Réalisations",
    description:
      "Découvrez l'ensemble du portfolio de Kashf Production — projets vidéo, audio, design graphique et web en Afrique du Nord et au-delà.",
  },
  ar: {
    title: "أعمالنا",
    description:
      "تصفّح كامل أعمال كشف للإنتاج — مشاريع فيديو وصوت وتصميم جرافيك وتطوير ويب في شمال أفريقيا وخارجها.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = pageMeta[locale as keyof typeof pageMeta] ?? pageMeta.fr;
  const url = `${BASE_URL}/${locale}/projects`;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Kashf Production`,
      description: meta.description,
      url,
      siteName: "Kashf Production",
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | Kashf Production`,
      description: meta.description,
      images: [OG_IMAGE],
    },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE_URL}/${l}/projects`])
      ),
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params; // satisfy Next.js dynamic param requirement
  const [projects, socialLinks, t] = await Promise.all([
    getProjects(),
    getSocialLinks(),
    getTranslations("Projects"),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col bg-white text-gray-900 w-full overflow-x-hidden selection:bg-gray-900 selection:text-white">
        {/* Page header */}
        <section className="w-full bg-gray-50 pt-32 pb-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors mb-8 tracking-wide uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              Kashf Production
            </Link>
            <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">
              {t("label")}
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900">
              {t("title")}
            </h1>
          </div>
        </section>

        {/* Grid */}
        <section className="w-full py-16">
          <div className="max-w-7xl mx-auto px-6">
            <ProjectsGrid projects={projects} />
          </div>
        </section>
      </main>
      <FooterSection socialLinks={socialLinks} />
    </>
  );
}
