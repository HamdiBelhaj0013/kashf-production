export interface Client {
  id: string;
  name: string;
  sector: string;
  country: "TN" | "DZ" | "FR" | "IT" | "DE" | "BE";
  logo?: string;
}

export const clients: Client[] = [];
