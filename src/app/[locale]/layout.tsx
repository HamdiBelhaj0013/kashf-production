import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getSocialLinks } from "@/lib/api";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://kashf.tn";
const OG_IMAGE  = `${BASE_URL}/og-image.png`;

const localeMeta = {
  en: {
    title: "Kashf Production | Creative Production Studio",
    description:
      "We transform ideas into content that connects — video, audio, graphic design, and web, crafted for brands that want to stand out across North Africa and beyond.",
    ogLocale: "en_US",
    keywords: [
      "production studio", "video production", "audio production",
      "graphic design", "web development", "branding", "Tunisia",
      "North Africa", "Kashf Production",
    ],
  },
  fr: {
    title: "Kashf Production | Studio de Production Créative",
    description:
      "Nous transformons les idées en contenu qui connecte — vidéo, audio, design graphique et web, conçu pour les marques qui veulent se démarquer en Afrique du Nord et au-delà.",
    ogLocale: "fr_FR",
    keywords: [
      "studio de production", "production vidéo", "production audio",
      "design graphique", "développement web", "branding", "Tunisie",
      "Afrique du Nord", "Kashf Production",
    ],
  },
  ar: {
    title: "كشف للإنتاج | استوديو إنتاج إبداعي",
    description:
      "نحوّل الأفكار إلى محتوى يُحدث أثرًا حقيقيًا — فيديو وصوت وتصميم جرافيك وتطوير ويب، مصمَّم للعلامات التجارية التي تريد التميّز في شمال أفريقيا وخارجها.",
    ogLocale: "ar_TN",
    keywords: [
      "استوديو إنتاج", "إنتاج فيديو", "إنتاج صوتي",
      "تصميم جرافيك", "تطوير ويب", "هوية بصرية", "تونس",
      "شمال أفريقيا", "كشف للإنتاج",
    ],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = localeMeta[locale as keyof typeof localeMeta] ?? localeMeta.en;
  const url = `${BASE_URL}/${locale}`;

  return {
    title: {
      default: meta.title,
      template: `%s | Kashf Production`,
    },
    description: meta.description,
    keywords: [...meta.keywords],
    openGraph: {
      title: meta.title,
      description: meta.description,
      siteName: "Kashf Production",
      locale: meta.ogLocale,
      type: "website",
      url,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Kashf Production — Creative Production Studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en`,
        fr: `${BASE_URL}/fr`,
        ar: `${BASE_URL}/ar`,
      },
    },
    metadataBase: new URL(BASE_URL),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [messages, socialLinks] = await Promise.all([
    getMessages(),
    getSocialLinks(),
  ]);
  const dir = locale === "ar" ? "rtl" : "ltr";

  const sameAs = [
    socialLinks.instagram,
    socialLinks.linkedin,
    socialLinks.behance,
  ].filter((url) => url.trim() !== "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kashf Production",
    url: BASE_URL,
    logo: `${BASE_URL}/icon.png`,
    description:
      "Video production, audio production, graphic design, and web development studio based in Tunis, Tunisia. Serving clients in Arabic, French, and English across North Africa and beyond.",
    sameAs,
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Video Production" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Audio Production" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Graphic Design" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development" } },
    ],
  };

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
