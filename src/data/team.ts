export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: "creative" | "technical" | "production" | "management";
  bio: string;
  lucideIcon: string;
}

export const team: TeamMember[] = [];
