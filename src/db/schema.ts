import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const admin = pgTable("admin", {
  id:        uuid("id").primaryKey().defaultRandom(),
  username:  text("username").notNull().unique(),
  password:  text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id:         uuid("id").primaryKey().defaultRandom(),
  title:      text("title").notNull(),
  client:     text("client").notNull(),
  category:   text("category").notNull(),
  year:       text("year").notNull(),
  tags:       text("tags").notNull().default("[]"),
  coverImage: text("cover_image").notNull().default(""),
  featured:   boolean("featured").notNull().default(false),
  sortOrder:  integer("sort_order").notNull().default(0),
  createdAt:  timestamp("created_at").defaultNow(),
  updatedAt:  timestamp("updated_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      text("name").notNull(),
  sector:    text("sector").notNull().default(""),
  country:   text("country").notNull().default(""),
  logoUrl:   text("logo_url").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  active:    boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const team = pgTable("team", {
  id:         uuid("id").primaryKey().defaultRandom(),
  name:       text("name").notNull(),
  role:       text("role").notNull(),
  department: text("department").notNull(),
  bio:        text("bio").notNull().default(""),
  lucideIcon: text("lucide_icon").notNull().default("User"),
  photoUrl:   text("photo_url").notNull().default(""),
  sortOrder:  integer("sort_order").notNull().default(0),
  active:     boolean("active").notNull().default(true),
  createdAt:  timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id:           uuid("id").primaryKey().defaultRandom(),
  name:         text("name").notNull(),
  email:        text("email").notNull(),
  service:      text("service").notNull().default(""),
  message:      text("message").notNull(),
  read:         boolean("read").notNull().default(false),
  archived:     boolean("archived").notNull().default(false),
  createdAt:    timestamp("created_at").defaultNow(),
  repliedAt:    timestamp("replied_at"),
  replyMessage: text("reply_message"),
  repliedBy:    text("replied_by"),
});

export const settings = pgTable("settings", {
  key:       text("key").primaryKey(),
  value:     text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});
