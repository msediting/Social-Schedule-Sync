import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBrandSettingsSchema,
  insertPlatformConnectionSchema,
  insertPostTemplateSchema,
  insertPostSchema,
  insertUserSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // Current demo user ID (in a real app, this would come from auth)
  const demoUserId = 1;

  // Helper function to validate request body with Zod schema
  function validateBody<T>(schema: z.ZodType<T>) {
    return (req: Request, res: Response, next: Function) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        res.status(400).json({ error: "Invalid request body", details: error });
      }
    };
  }

  // User routes
  app.get(`${apiPrefix}/user`, async (req, res) => {
    const user = await storage.getUser(demoUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Brand settings routes
  app.get(`${apiPrefix}/brand-settings`, async (req, res) => {
    const settings = await storage.getBrandSettings(demoUserId);
    if (!settings) {
      return res.status(404).json({ error: "Brand settings not found" });
    }
    res.json(settings);
  });

  app.post(
    `${apiPrefix}/brand-settings`, 
    validateBody(insertBrandSettingsSchema),
    async (req, res) => {
      const settings = await storage.createBrandSettings({
        ...req.body,
        userId: demoUserId
      });
      res.status(201).json(settings);
    }
  );

  app.patch(
    `${apiPrefix}/brand-settings/:id`, 
    async (req, res) => {
      const id = parseInt(req.params.id);
      const settings = await storage.getBrandSettings(demoUserId);
      
      if (!settings || settings.id !== id) {
        return res.status(404).json({ error: "Brand settings not found" });
      }
      
      const updatedSettings = await storage.updateBrandSettings(id, req.body);
      res.json(updatedSettings);
    }
  );

  // Platform connections routes
  app.get(`${apiPrefix}/platform-connections`, async (req, res) => {
    const connections = await storage.getPlatformConnections(demoUserId);
    res.json(connections);
  });

  app.get(`${apiPrefix}/platform-connections/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const connection = await storage.getPlatformConnection(id);
    
    if (!connection) {
      return res.status(404).json({ error: "Platform connection not found" });
    }
    
    res.json(connection);
  });

  app.post(
    `${apiPrefix}/platform-connections`,
    validateBody(insertPlatformConnectionSchema),
    async (req, res) => {
      const connection = await storage.createPlatformConnection({
        ...req.body,
        userId: demoUserId
      });
      res.status(201).json(connection);
    }
  );

  app.patch(
    `${apiPrefix}/platform-connections/:id`,
    async (req, res) => {
      const id = parseInt(req.params.id);
      const connection = await storage.updatePlatformConnection(id, req.body);
      
      if (!connection) {
        return res.status(404).json({ error: "Platform connection not found" });
      }
      
      res.json(connection);
    }
  );

  // Post templates routes
  app.get(`${apiPrefix}/templates`, async (req, res) => {
    const templates = await storage.getPostTemplates(demoUserId);
    res.json(templates);
  });

  app.get(`${apiPrefix}/templates/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const template = await storage.getPostTemplate(id);
    
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    res.json(template);
  });

  app.post(
    `${apiPrefix}/templates`,
    validateBody(insertPostTemplateSchema),
    async (req, res) => {
      const template = await storage.createPostTemplate({
        ...req.body,
        userId: demoUserId
      });
      res.status(201).json(template);
    }
  );

  app.patch(
    `${apiPrefix}/templates/:id`,
    async (req, res) => {
      const id = parseInt(req.params.id);
      const template = await storage.updatePostTemplate(id, req.body);
      
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      res.json(template);
    }
  );

  app.delete(`${apiPrefix}/templates/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deletePostTemplate(id);
    
    if (!success) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    res.status(204).send();
  });

  // Posts routes
  app.get(`${apiPrefix}/posts`, async (req, res) => {
    const posts = await storage.getPosts(demoUserId);
    res.json(posts);
  });

  app.get(`${apiPrefix}/posts/calendar`, async (req, res) => {
    const year = parseInt(req.query.year as string || new Date().getFullYear().toString());
    const month = parseInt(req.query.month as string || new Date().getMonth().toString());
    
    const posts = await storage.getPostsByDate(demoUserId, year, month);
    res.json(posts);
  });

  app.get(`${apiPrefix}/posts/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await storage.getPost(id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.json(post);
  });

  app.post(
    `${apiPrefix}/posts`,
    validateBody(insertPostSchema),
    async (req, res) => {
      const post = await storage.createPost({
        ...req.body,
        userId: demoUserId
      });
      res.status(201).json(post);
    }
  );

  app.patch(
    `${apiPrefix}/posts/:id`,
    async (req, res) => {
      const id = parseInt(req.params.id);
      const post = await storage.updatePost(id, req.body);
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      res.json(post);
    }
  );

  app.delete(`${apiPrefix}/posts/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deletePost(id);
    
    if (!success) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.status(204).send();
  });

  // Analytics summary
  app.get(`${apiPrefix}/analytics/summary`, async (req, res) => {
    const posts = await storage.getPosts(demoUserId);
    
    // Current month stats
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const publishedThisMonth = posts.filter(post => {
      if (!post.publishedDate) return false;
      const publishedDate = new Date(post.publishedDate);
      return publishedDate.getFullYear() === currentYear && 
             publishedDate.getMonth() === currentMonth;
    }).length;
    
    const scheduledThisMonth = posts.filter(post => {
      const scheduledDate = new Date(post.scheduledDate);
      return scheduledDate.getFullYear() === currentYear && 
             scheduledDate.getMonth() === currentMonth &&
             post.status === 'scheduled';
    }).length;
    
    // Calculate total engagement
    const totalEngagement = posts.reduce((sum, post) => {
      if (!post.engagementStats) return sum;
      const { likes = 0, comments = 0, shares = 0 } = post.engagementStats;
      return sum + likes + comments + shares;
    }, 0);
    
    // Engagement breakdown
    const engagementBreakdown = posts.reduce((acc, post) => {
      if (!post.engagementStats) return acc;
      const { likes = 0, comments = 0, shares = 0 } = post.engagementStats;
      return {
        likes: acc.likes + likes,
        comments: acc.comments + comments,
        shares: acc.shares + shares
      };
    }, { likes: 0, comments: 0, shares: 0 });
    
    res.json({
      publishedThisMonth,
      scheduledThisMonth,
      totalPlannedPosts: publishedThisMonth + scheduledThisMonth,
      totalEngagement,
      engagementBreakdown
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
