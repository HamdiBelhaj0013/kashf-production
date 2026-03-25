import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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

export const metadata: Metadata = {
  title: "Kashf Production — Video, Audio, Design & Web",
  description:
    "We transform ideas into powerful content — video production, audio, graphic design, and web development. Serving clients in Arabic, French, and English across North Africa and beyond.",
  keywords: [
    "production house",
    "video production",
    "audio production",
    "graphic design",
    "web development",
    "branding",
    "Tunisia",
    "North Africa",
    "Kashf",
  ],
  openGraph: {
    title: "Kashf Production — Make Your Vision Visible",
    description:
      "Video, audio, graphic design, and web development for brands that want to stand out.",
    siteName: "Kashf Production",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kashf Production — Make Your Vision Visible",
    description:
      "Video, audio, graphic design, and web development for brands that want to stand out.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

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
      </body>
    </html>
  );
}
