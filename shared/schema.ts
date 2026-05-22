import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  metaDescription: text("meta_description").default(""),
  content: text("content").notNull().default(""),
  excerpt: text("excerpt").default(""),
  category: text("category").default("物流コラム"),
  tags: text("tags").array().default([]),
  status: text("status").notNull().default("draft"),
  imageUrl: text("image_url").default(""),
  faqData: text("faq_data").default("[]"),
  internalLinks: text("internal_links").default("[]"),
  authorNote: text("author_note").default(""),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, createdAt: true, updatedAt: true, publishedAt: true });
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  target: text("target").notNull().default("shipper"),
  priority: integer("priority").notNull().default(3),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertKeywordSchema = createInsertSchema(keywords).omit({ id: true, createdAt: true });
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;
export type Keyword = typeof keywords.$inferSelect;

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").default(""),
  company: text("company").default(""),
  message: text("message").default(""),
  cargoType: text("cargo_type").default(""),
  route: text("route").default(""),
  frequency: text("frequency").default(""),
  position: text("position").default(""),
  experience: text("experience").default(""),
  vehicleType: text("vehicle_type").default(""),
  vehicleCount: text("vehicle_count").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  sessionId: text("session_id").default(""),
  prefecture: text("prefecture").default(""),
  referrer: text("referrer").default(""),
  userAgent: text("user_agent").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertPageViewSchema = createInsertSchema(pageViews).omit({ id: true, createdAt: true });
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  eventName: text("event_name").notNull(),
  path: text("path").default(""),
  sessionId: text("session_id").default(""),
  properties: text("properties").default("{}"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type SiteEvent = typeof events.$inferSelect;

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true });
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export const emailLeads = pgTable("email_leads", {
  id: serial("id").primaryKey(),
  company: text("company").notNull().default(""),
  website: text("website").default(""),
  email: text("email").default(""),
  contactName: text("contact_name").default(""),
  category: text("category").notNull().default("shipper"),
  status: text("status").notNull().default("pending"),
  emailSubject: text("email_subject").default(""),
  emailBody: text("email_body").default(""),
  crawlQuery: text("crawl_query").default(""),
  errorMsg: text("error_msg").default(""),
  unsubscribeToken: text("unsubscribe_token").default(""),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertEmailLeadSchema = createInsertSchema(emailLeads).omit({ id: true, createdAt: true, sentAt: true });
export type InsertEmailLead = z.infer<typeof insertEmailLeadSchema>;
export type EmailLead = typeof emailLeads.$inferSelect;

export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull().default(""),
  body: text("body").notNull().default(""),
  category: text("category").default("shipper"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({ id: true, createdAt: true });
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;

export const searchConsoleData = pgTable("search_console_data", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  page: text("page").notNull(),
  query: text("query").notNull(),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  ctr: real("ctr").notNull().default(0),
  position: real("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertSearchConsoleSchema = createInsertSchema(searchConsoleData).omit({ id: true, createdAt: true });
export type InsertSearchConsoleData = z.infer<typeof insertSearchConsoleSchema>;
export type SearchConsoleData = typeof searchConsoleData.$inferSelect;
