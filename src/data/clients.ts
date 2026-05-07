export interface Client {
  id: string;
  name: string;
  sector: string;
  country: "TN" | "DZ" | "FR" | "IT" | "DE" | "BE";
}

export const clients: Client[] = [
  { id: "sonatrach",    name: "Sonatrach",        sector: "Energy",      country: "DZ" },
  { id: "atlas",        name: "Atlas Group",       sector: "Industry",    country: "TN" },
  { id: "startup-dz",  name: "StartUp DZ",        sector: "Tech",        country: "DZ" },
  { id: "culturart",   name: "CulturArt",          sector: "Culture",     country: "TN" },
  { id: "tunisair",    name: "Tunisair Horizons",  sector: "Transport",   country: "TN" },
  { id: "agil",        name: "AGIL Energie",       sector: "Energy",      country: "TN" },
  { id: "biat",        name: "BIAT",               sector: "Finance",     country: "TN" },
  { id: "leoni",       name: "Leoni Tunisia",      sector: "Industry",    country: "TN" },
  { id: "mediahub",    name: "MediaHub Paris",     sector: "Media",       country: "FR" },
  { id: "artisancraft",name: "ArtisanCraft",       sector: "E-Commerce",  country: "FR" },
  { id: "nordstern",   name: "Nordstern Studio",   sector: "Creative",    country: "DE" },
  { id: "bruxmedia",   name: "BruxMedia",          sector: "Media",       country: "BE" },
];
