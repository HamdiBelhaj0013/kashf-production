import { projects, type Project } from "@/data/projects";
import { clients, type Client } from "@/data/clients";
import { team, type TeamMember } from "@/data/team";

// These functions currently return static data.
// In the future, replace with: fetch('/api/projects'), etc.

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return projects.filter((p) => p.featured);
}

export async function getClients(): Promise<Client[]> {
  return clients;
}

export async function getTeam(): Promise<TeamMember[]> {
  return team;
}

export type { Project, Client, TeamMember };
