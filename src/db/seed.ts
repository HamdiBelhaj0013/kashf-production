import { db, projects, clients, team, settings } from "./index";

async function seed() {
  console.log("Seeding database...");

  // Default settings
  const defaultSettings = [
    { key: "site_email",       value: "hello@kashf.tn" },
    { key: "site_location",    value: "Tunis, Tunisia" },
    { key: "social_instagram", value: "" },
    { key: "social_linkedin",  value: "" },
    { key: "social_behance",   value: "" },
    { key: "meta_title",       value: "Kashf Production" },
    { key: "meta_description", value: "We reveal your story." },
  ];
  for (const s of defaultSettings) {
    await db.insert(settings).values(s).onConflictDoNothing();
  }
  console.log("✓ Settings seeded");

  // Seed projects from static data
  const existingProjects = await db.select().from(projects).limit(1);
  if (existingProjects.length === 0) {
    const { projects: staticProjects } = await import("../data/projects");
    for (let i = 0; i < staticProjects.length; i++) {
      const p = staticProjects[i];
      await db.insert(projects).values({
        title:      p.title,
        client:     p.client,
        category:   p.category,
        year:       p.year,
        tags:       JSON.stringify(p.tags),
        coverImage: p.coverImage,
        featured:   p.featured,
        sortOrder:  i,
      });
    }
    console.log(`✓ ${staticProjects.length} projects seeded`);
  } else {
    console.log("✓ Projects already exist");
  }

  // Seed clients
  const existingClients = await db.select().from(clients).limit(1);
  if (existingClients.length === 0) {
    const { clients: staticClients } = await import("../data/clients");
    for (let i = 0; i < staticClients.length; i++) {
      const c = staticClients[i];
      await db.insert(clients).values({
        name:      c.name,
        sector:    c.sector,
        country:   c.country,
        sortOrder: i,
      });
    }
    console.log(`✓ ${staticClients.length} clients seeded`);
  } else {
    console.log("✓ Clients already exist");
  }

  // Seed team
  const existingTeam = await db.select().from(team).limit(1);
  if (existingTeam.length === 0) {
    const { team: staticTeam } = await import("../data/team");
    for (let i = 0; i < staticTeam.length; i++) {
      const m = staticTeam[i];
      await db.insert(team).values({
        name:       m.name,
        role:       m.role,
        department: m.department,
        bio:        m.bio,
        lucideIcon: m.lucideIcon,
        sortOrder:  i,
      });
    }
    console.log(`✓ ${staticTeam.length} team members seeded`);
  } else {
    console.log("✓ Team already exists");
  }

  console.log("✓ Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
