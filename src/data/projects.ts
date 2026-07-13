export interface Project {
  id: string;
  title: string;
  client: string;
  category: "video" | "audio" | "design" | "web" | "pack";
  year: string;
  tags: string[];
  coverImage: string;
  link?: string | null;
  featured: boolean;
}

export const projects: Project[] = [];
