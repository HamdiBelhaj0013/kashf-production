import { db, projects, clients, team, settings } from "@/db";
import { eq, asc, inArray } from "drizzle-orm";
import type { Project } from "@/data/projects";
import type { Client } from "@/data/clients";
import type { TeamMember } from "@/data/team";

export async function getProjects(): Promise<Project[]> {
  try {
    const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
    return rows.map((r) => ({
      id:         r.id,
      title:      r.title,
      client:     r.client,
      category:   r.category as Project["category"],
      year:       r.year,
      tags:       JSON.parse(r.tags || "[]") as string[],
      coverImage: r.coverImage,
      link:       r.link ?? null,
      featured:   r.featured,
    }));
  } catch {
    const { projects: staticProjects } = await import("@/data/projects");
    return staticProjects;
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.featured);
}

export async function getClients(): Promise<Client[]> {
  try {
    const rows = await db
      .select()
      .from(clients)
      .where(eq(clients.active, true))
      .orderBy(asc(clients.sortOrder));
    return rows.map((r) => ({
      id:      r.id,
      name:    r.name,
      sector:  r.sector,
      country: r.country as Client["country"],
      logo:    r.logoUrl || undefined,
    }));
  } catch {
    const { clients: staticClients } = await import("@/data/clients");
    return staticClients;
  }
}

export async function getTeam(): Promise<TeamMember[]> {
  try {
    const rows = await db
      .select()
      .from(team)
      .where(eq(team.active, true))
      .orderBy(asc(team.sortOrder));
    return rows.map((r) => ({
      id:         r.id,
      name:       r.name,
      role:       r.role,
      department: r.department as TeamMember["department"],
      bio:        r.bio,
      lucideIcon: r.lucideIcon,
    }));
  } catch {
    const { team: staticTeam } = await import("@/data/team");
    return staticTeam;
  }
}

export interface SocialLinks {
  instagram: string;
  linkedin: string;
  behance: string;
}

export async function getSocialLinks(): Promise<SocialLinks> {
  try {
    const rows = await db
      .select()
      .from(settings)
      .where(inArray(settings.key, ["social_instagram", "social_linkedin", "social_behance"]));
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      instagram: map.social_instagram ?? "",
      linkedin:  map.social_linkedin  ?? "",
      behance:   map.social_behance   ?? "",
    };
  } catch {
    return { instagram: "", linkedin: "", behance: "" };
  }
}
