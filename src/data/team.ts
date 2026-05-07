export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: "creative" | "technical" | "production" | "management";
  bio: string;
  lucideIcon: string;
}

export const team: TeamMember[] = [
  {
    id: "moenes",
    name: "Moenes Guesmi",
    role: "Creative Director",
    department: "creative",
    bio: "Visual storyteller with 8 years in brand film.",
    lucideIcon: "Aperture",
  },
  {
    id: "aymen",
    name: "Aymen Touihri",
    role: "Video Producer",
    department: "production",
    bio: "From concept to final cut — he owns the timeline.",
    lucideIcon: "Clapperboard",
  },
  {
    id: "nidhal",
    name: "Nidhal Othmen",
    role: "Sound Engineer",
    department: "production",
    bio: "Crafts the audio identity of every project.",
    lucideIcon: "AudioWaveform",
  },
  {
    id: "hamdi",
    name: "Hamdi Belhaj",
    role: "Lead Developer",
    department: "technical",
    bio: "Builds fast, accessible, and beautiful interfaces.",
    lucideIcon: "Code2",
  },
  {
    id: "aziz",
    name: "Aziz Jbeli",
    role: "Graphic Designer",
    department: "creative",
    bio: "Shapes visual identities that last.",
    lucideIcon: "PenTool",
  },
  {
    id: "badis",
    name: "Badis Belguith",
    role: "Project Manager",
    department: "management",
    bio: "Keeps every project on time and every client happy.",
    lucideIcon: "LayoutGrid",
  },
];
