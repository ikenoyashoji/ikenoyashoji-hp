import { eq, desc, gte } from "drizzle-orm";
import { db } from "./db";
import {
  users, articles, keywords, contacts, pageViews, events, searchConsoleData, adminUsers, emailLeads, emailTemplates,
  type User, type InsertUser,
  type Article, type InsertArticle,
  type Keyword, type InsertKeyword,
  type Contact, type InsertContact,
  type PageView, type InsertPageView,
  type SiteEvent, type InsertEvent,
  type SearchConsoleData, type InsertSearchConsoleData,
  type AdminUser,
  type EmailLead, type InsertEmailLead,
  type EmailTemplate, type InsertEmailTemplate,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getArticles(status?: string): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticleById(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;
  publishArticle(id: number): Promise<Article>;

  getKeywords(): Promise<Keyword[]>;
  createKeyword(keyword: InsertKeyword): Promise<Keyword>;
  updateKeyword(id: number, keyword: Partial<InsertKeyword>): Promise<Keyword>;
  deleteKeyword(id: number): Promise<void>;

  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;

  createPageView(pv: InsertPageView): Promise<PageView>;
  getPageViews(days?: number): Promise<PageView[]>;
  createEvent(event: InsertEvent): Promise<SiteEvent>;
  getEvents(days?: number): Promise<SiteEvent[]>;

  upsertSearchConsoleData(data: InsertSearchConsoleData): Promise<void>;
  getSearchConsoleData(): Promise<SearchConsoleData[]>;

  getAdminUsers(): Promise<AdminUser[]>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(username: string, passwordHash: string, role?: string): Promise<AdminUser>;
  updateAdminUserPassword(id: number, passwordHash: string): Promise<void>;
  deleteAdminUser(id: number): Promise<void>;

  getEmailLeads(status?: string): Promise<EmailLead[]>;
  getEmailLeadById(id: number): Promise<EmailLead | undefined>;
  getEmailLeadByWebsite(website: string): Promise<EmailLead | undefined>;
  createEmailLead(lead: InsertEmailLead): Promise<EmailLead>;
  updateEmailLead(id: number, data: Partial<InsertEmailLead> & { sentAt?: Date | null }): Promise<EmailLead>;
  deleteEmailLead(id: number): Promise<void>;

  getEmailTemplates(): Promise<EmailTemplate[]>;
  createEmailTemplate(data: InsertEmailTemplate): Promise<EmailTemplate>;
  deleteEmailTemplate(id: number): Promise<void>;

  clearPageViews(): Promise<number>;
  clearEvents(): Promise<number>;
  getDbStats(): Promise<{ pvCount: number; eventsCount: number; contactsCount: number; articlesCount: number; leadsCount: number }>;
}

export class DrizzleStorage implements IStorage {
  async getUser(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getArticles(status?: string) {
    if (status) {
      return db.select().from(articles).where(eq(articles.status, status)).orderBy(desc(articles.createdAt));
    }
    return db.select().from(articles).orderBy(desc(articles.createdAt));
  }

  async getArticleBySlug(slug: string) {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article;
  }

  async getArticleById(id: number) {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(article: InsertArticle) {
    const [created] = await db.insert(articles).values(article).returning();
    return created;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>) {
    const [updated] = await db
      .update(articles)
      .set({ ...article, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return updated;
  }

  async deleteArticle(id: number) {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async publishArticle(id: number) {
    const [updated] = await db
      .update(articles)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return updated;
  }

  async getKeywords() {
    return db.select().from(keywords).orderBy(desc(keywords.priority), desc(keywords.createdAt));
  }

  async createKeyword(keyword: InsertKeyword) {
    const [created] = await db.insert(keywords).values(keyword).returning();
    return created;
  }

  async updateKeyword(id: number, keyword: Partial<InsertKeyword>) {
    const [updated] = await db.update(keywords).set(keyword).where(eq(keywords.id, id)).returning();
    return updated;
  }

  async deleteKeyword(id: number) {
    await db.delete(keywords).where(eq(keywords.id, id));
  }

  async createContact(contact: InsertContact) {
    const [created] = await db.insert(contacts).values(contact).returning();
    return created;
  }

  async getContacts() {
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createPageView(pv: InsertPageView) {
    const [created] = await db.insert(pageViews).values(pv).returning();
    return created;
  }

  async getPageViews(days = 28) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return db.select().from(pageViews).where(gte(pageViews.createdAt, since)).orderBy(desc(pageViews.createdAt));
  }

  async createEvent(event: InsertEvent) {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async getEvents(days = 28) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return db.select().from(events).where(gte(events.createdAt, since)).orderBy(desc(events.createdAt));
  }

  async upsertSearchConsoleData(data: InsertSearchConsoleData) {
    await db.insert(searchConsoleData).values(data).onConflictDoNothing();
  }

  async getSearchConsoleData() {
    return db.select().from(searchConsoleData).orderBy(desc(searchConsoleData.date), desc(searchConsoleData.impressions));
  }

  async getAdminUsers() {
    return db.select().from(adminUsers).orderBy(adminUsers.createdAt);
  }

  async getAdminUserByUsername(username: string) {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(username: string, passwordHash: string, role = "admin") {
    const [created] = await db.insert(adminUsers).values({ username, passwordHash, role }).returning();
    return created;
  }

  async updateAdminUserPassword(id: number, passwordHash: string) {
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, id));
  }

  async deleteAdminUser(id: number) {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
  }

  async getEmailLeads(status?: string) {
    if (status) {
      return db.select().from(emailLeads).where(eq(emailLeads.status, status)).orderBy(desc(emailLeads.createdAt));
    }
    return db.select().from(emailLeads).orderBy(desc(emailLeads.createdAt));
  }

  async getEmailLeadById(id: number) {
    const [lead] = await db.select().from(emailLeads).where(eq(emailLeads.id, id));
    return lead;
  }

  async getEmailLeadByWebsite(website: string) {
    const normalized = website.replace(/\/$/, "").substring(0, 100);
    const all = await db.select().from(emailLeads);
    return all.find((l) => l.website?.replace(/\/$/, "").substring(0, 100) === normalized);
  }

  async createEmailLead(lead: InsertEmailLead) {
    const [created] = await db.insert(emailLeads).values(lead).returning();
    return created;
  }

  async updateEmailLead(id: number, data: Partial<InsertEmailLead> & { sentAt?: Date | null }) {
    const [updated] = await db.update(emailLeads).set(data).where(eq(emailLeads.id, id)).returning();
    return updated;
  }

  async deleteEmailLead(id: number) {
    await db.delete(emailLeads).where(eq(emailLeads.id, id));
  }

  async getEmailTemplates() {
    return db.select().from(emailTemplates).orderBy(desc(emailTemplates.createdAt));
  }

  async createEmailTemplate(data: InsertEmailTemplate) {
    const [created] = await db.insert(emailTemplates).values(data).returning();
    return created;
  }

  async deleteEmailTemplate(id: number) {
    await db.delete(emailTemplates).where(eq(emailTemplates.id, id));
  }

  async clearPageViews() {
    const all = await db.select().from(pageViews);
    await db.delete(pageViews);
    return all.length;
  }

  async clearEvents() {
    const all = await db.select().from(events);
    await db.delete(events);
    return all.length;
  }

  async getDbStats() {
    const [pvs, evts, cts, arts, leads] = await Promise.all([
      db.select().from(pageViews),
      db.select().from(events),
      db.select().from(contacts),
      db.select().from(articles),
      db.select().from(emailLeads),
    ]);
    return {
      pvCount: pvs.length,
      eventsCount: evts.length,
      contactsCount: cts.length,
      articlesCount: arts.length,
      leadsCount: leads.length,
    };
  }
}

export const storage = new DrizzleStorage();
