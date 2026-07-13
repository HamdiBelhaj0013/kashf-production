import type { MetadataRoute } from "next";

const BASE_URL = "https://kashf.tn";
const LOCALES = ["en", "fr", "ar"] as const;
const ROUTES = [
  { path: "",          priority: 1.0 },
  { path: "/projects", priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    ROUTES.map(({ path, priority }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`])
        ),
      },
    }))
  );
}
