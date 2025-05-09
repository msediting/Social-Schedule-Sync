import { db } from './db';
import { eq, and, sql } from 'drizzle-orm';
import {
  users, User, InsertUser,
  brandSettings, BrandSetting, InsertBrandSetting,
  platformConnections, PlatformConnection, InsertPlatformConnection,
  postTemplates, PostTemplate, InsertPostTemplate,
  posts, Post, InsertPost
} from '@shared/schema';
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  // Brand settings operations
  async getBrandSettings(userId: number): Promise<BrandSetting | undefined> {
    const [settings] = await db.select().from(brandSettings).where(eq(brandSettings.userId, userId));
    return settings;
  }

  async createBrandSettings(settings: InsertBrandSetting): Promise<BrandSetting> {
    const [createdSettings] = await db.insert(brandSettings).values(settings).returning();
    return createdSettings;
  }

  async updateBrandSettings(id: number, settings: Partial<InsertBrandSetting>): Promise<BrandSetting | undefined> {
    const [updatedSettings] = await db
      .update(brandSettings)
      .set(settings)
      .where(eq(brandSettings.id, id))
      .returning();
    return updatedSettings;
  }

  // Platform connections operations
  async getPlatformConnections(userId: number): Promise<PlatformConnection[]> {
    return db.select().from(platformConnections).where(eq(platformConnections.userId, userId));
  }

  async getPlatformConnection(id: number): Promise<PlatformConnection | undefined> {
    const [connection] = await db.select().from(platformConnections).where(eq(platformConnections.id, id));
    return connection;
  }

  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const [createdConnection] = await db.insert(platformConnections).values(connection).returning();
    return createdConnection;
  }

  async updatePlatformConnection(id: number, connection: Partial<InsertPlatformConnection>): Promise<PlatformConnection | undefined> {
    const [updatedConnection] = await db
      .update(platformConnections)
      .set(connection)
      .where(eq(platformConnections.id, id))
      .returning();
    return updatedConnection;
  }

  // Post templates operations
  async getPostTemplates(userId: number): Promise<PostTemplate[]> {
    return db.select().from(postTemplates).where(eq(postTemplates.userId, userId));
  }

  async getPostTemplate(id: number): Promise<PostTemplate | undefined> {
    const [template] = await db.select().from(postTemplates).where(eq(postTemplates.id, id));
    return template;
  }

  async createPostTemplate(template: InsertPostTemplate): Promise<PostTemplate> {
    const [createdTemplate] = await db.insert(postTemplates).values(template).returning();
    return createdTemplate;
  }

  async updatePostTemplate(id: number, template: Partial<InsertPostTemplate>): Promise<PostTemplate | undefined> {
    const [updatedTemplate] = await db
      .update(postTemplates)
      .set(template)
      .where(eq(postTemplates.id, id))
      .returning();
    return updatedTemplate;
  }

  async deletePostTemplate(id: number): Promise<boolean> {
    const [deletedTemplate] = await db
      .delete(postTemplates)
      .where(eq(postTemplates.id, id))
      .returning();
    return !!deletedTemplate;
  }

  // Posts operations
  async getPosts(userId: number): Promise<Post[]> {
    return db.select().from(posts).where(eq(posts.userId, userId));
  }

  async getPostsByDate(userId: number, year: number, month: number): Promise<Post[]> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // Last day of month

    return db.select().from(posts).where(
      and(
        eq(posts.userId, userId),
        sql`${posts.scheduledDate} >= ${startDate.toISOString()}`,
        sql`${posts.scheduledDate} <= ${endDate.toISOString()}`
      )
    );
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const fullPost = {
      ...post,
      status: 'scheduled',
      publishedDate: null,
      engagementStats: { likes: 0, comments: 0, shares: 0 }
    };
    
    const [createdPost] = await db.insert(posts).values(fullPost).returning();
    return createdPost;
  }

  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    const [updatedPost] = await db
      .update(posts)
      .set(post)
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    const [deletedPost] = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();
    return !!deletedPost;
  }
}