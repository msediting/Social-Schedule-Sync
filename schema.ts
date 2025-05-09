import { pgTable, text, serial, integer, boolean, timestamp, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  businessName: text("business_name"),
  email: text("email").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  businessName: true,
  email: true,
});

// Brand settings schema
export const brandSettings = pgTable("brand_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  colors: jsonb("colors").notNull(),
  fonts: jsonb("fonts").notNull(),
  logoUrl: text("logo_url"),
});

export const insertBrandSettingsSchema = createInsertSchema(brandSettings).pick({
  userId: true,
  name: true,
  colors: true,
  fonts: true,
  logoUrl: true,
});

// Social media platform connections
export const platformConnections = pgTable("platform_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platform: text("platform").notNull(), // facebook, instagram, twitter, linkedin, youtube
  connected: boolean("connected").notNull().default(false),
  accountName: text("account_name"),
  stats: jsonb("stats"), // Platform-specific statistics
});

export const insertPlatformConnectionSchema = createInsertSchema(platformConnections).pick({
  userId: true,
  platform: true,
  connected: true,
  accountName: true,
  stats: true,
});

// Post templates schema
export const postTemplates = pgTable("post_templates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  content: text("content").notNull(),
  platforms: jsonb("platforms").notNull(), // array of platform IDs
  isDefault: boolean("is_default").default(false),
});

export const insertPostTemplateSchema = createInsertSchema(postTemplates).pick({
  userId: true,
  name: true,
  description: true,
  imageUrl: true,
  content: true,
  platforms: true,
  isDefault: true,
});

// Social media posts schema
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  publishedDate: timestamp("published_date"),
  status: text("status").notNull().default("scheduled"), // scheduled, published, failed
  platforms: jsonb("platforms").notNull(), // array of platform IDs
  templateId: integer("template_id"),
  engagementStats: jsonb("engagement_stats"),
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  content: true,
  imageUrl: true,
  scheduledDate: true,
  platforms: true,
  templateId: true,
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  brandSettings: one(brandSettings, {
    fields: [users.id],
    references: [brandSettings.userId],
  }),
  platformConnections: many(platformConnections),
  postTemplates: many(postTemplates),
  posts: many(posts),
}));

export const brandSettingsRelations = relations(brandSettings, ({ one }) => ({
  user: one(users, {
    fields: [brandSettings.userId],
    references: [users.id],
  }),
}));

export const platformConnectionsRelations = relations(platformConnections, ({ one }) => ({
  user: one(users, {
    fields: [platformConnections.userId],
    references: [users.id],
  }),
}));

export const postTemplatesRelations = relations(postTemplates, ({ one, many }) => ({
  user: one(users, {
    fields: [postTemplates.userId],
    references: [users.id],
  }),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  template: one(postTemplates, {
    fields: [posts.templateId],
    references: [postTemplates.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BrandSetting = typeof brandSettings.$inferSelect;
export type InsertBrandSetting = z.infer<typeof insertBrandSettingsSchema>;

export type PlatformConnection = typeof platformConnections.$inferSelect;
export type InsertPlatformConnection = z.infer<typeof insertPlatformConnectionSchema>;

export type PostTemplate = typeof postTemplates.$inferSelect;
export type InsertPostTemplate = z.infer<typeof insertPostTemplateSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
