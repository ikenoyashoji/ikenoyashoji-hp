import { eq, desc, gte } from "drizzle-orm";
import { db } from "./db";
import {
  users, articles, keywords, contacts, pageViews, events, searchConsoleData, adminUsers,
  type User, type InsertUser,
  type Article, type InsertArticle,
  type Keyword, type InsertKeyword,
  type Contact, type InsertContact,
  type PageView, type InsertPageView,
  type SiteEvent, type InsertEvent,
  type SearchConsoleData, type InsertSearchConsoleData,
  type AdminUser,
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
}

export const storage = new DrizzleStorage();
