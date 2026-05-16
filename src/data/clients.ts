export interface Client {
  id: string;
  name: string;
  sector: string;
  country: "TN" | "DZ" | "FR" | "IT" | "DE" | "BE";
  logo?: string;
}

export const clients: Client[] = [
  { id: "sonatrach",    name: "Sonatrach",        sector: "Energy",      country: "DZ", logo: "/clients/sonatrach.png" },
  { id: "atlas",        name: "Atlas Group",       sector: "Industry",    country: "TN", logo: "/clients/atlas.png" },
  { id: "startup-dz",  name: "StartUp DZ",        sector: "Tech",        country: "DZ", logo: "/clients/startup-dz.png" },
  { id: "culturart",   name: "CulturArt",          sector: "Culture",     country: "TN", logo: "/clients/culturart.png" },
  { id: "tunisair",    name: "Tunisair Horizons",  sector: "Transport",   country: "TN", logo: "/clients/tunisair.png" },
  { id: "agil",        name: "AGIL Energie",       sector: "Energy",      country: "TN", logo: "/clients/agil.png" },
  { id: "biat",        name: "BIAT",               sector: "Finance",     country: "TN", logo: "/clients/biat.png" },
  { id: "leoni",       name: "Leoni Tunisia",      sector: "Industry",    country: "TN", logo: "/clients/leoni.png" },
  { id: "mediahub",    name: "MediaHub Paris",     sector: "Media",       country: "FR", logo: "/clients/mediahub.png" },
  { id: "artisancraft",name: "ArtisanCraft",       sector: "E-Commerce",  country: "FR", logo: "/clients/artisancraft.png" },
  { id: "nordstern",   name: "Nordstern Studio",   sector: "Creative",    country: "DE", logo: "/clients/nordstern.png" },
  { id: "bruxmedia",   name: "BruxMedia",          sector: "Media",       country: "BE", logo: "/clients/bruxmedia.png" },
];
