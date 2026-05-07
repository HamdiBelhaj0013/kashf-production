export interface Project {
  id: string;
  title: string;
  client: string;
  category: "video" | "audio" | "design" | "web" | "pack";
  year: string;
  tags: string[];
  coverImage: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "sonatrach-brand-film",
    title: "Brand Film",
    client: "Sonatrach",
    category: "video",
    year: "2024",
    tags: ["Corporate Film", "Brand Story"],
    coverImage: "https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=800&q=80",
    featured: true,
  },
  {
    id: "maghreb-voices-podcast",
    title: "Podcast Series",
    client: "Maghreb Voices",
    category: "audio",
    year: "2024",
    tags: ["Podcast", "Sound Design"],
    coverImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80",
    featured: true,
  },
  {
    id: "startup-dz-identity",
    title: "Visual Identity",
    client: "StartUp DZ",
    category: "design",
    year: "2023",
    tags: ["Branding", "Logo", "Guidelines"],
    coverImage: "https://images.unsplash.com/photo-1634942536790-4d1d5ab3f3c0?w=800&q=80",
    featured: true,
  },
  {
    id: "artisan-ecommerce",
    title: "E-Commerce Platform",
    client: "ArtisanCraft",
    category: "web",
    year: "2023",
    tags: ["Next.js", "E-Commerce", "CMS"],
    coverImage: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80",
    featured: false,
  },
  {
    id: "culturart-campaign",
    title: "Social Campaign",
    client: "CulturArt Festival",
    category: "pack",
    year: "2024",
    tags: ["Video", "Motion Graphics", "Social"],
    coverImage: "https://images.unsplash.com/photo-1603739903239-8b6e64c3b185?w=800&q=80",
    featured: false,
  },
  {
    id: "atlas-corporate-site",
    title: "Corporate Website",
    client: "Atlas Group",
    category: "web",
    year: "2023",
    tags: ["Web Dev", "SEO", "CMS"],
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    featured: false,
  },
];
