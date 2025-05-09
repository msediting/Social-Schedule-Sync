import {
  users, User, InsertUser,
  brandSettings, BrandSetting, InsertBrandSetting,
  platformConnections, PlatformConnection, InsertPlatformConnection,
  postTemplates, PostTemplate, InsertPostTemplate,
  posts, Post, InsertPost
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Brand settings operations
  getBrandSettings(userId: number): Promise<BrandSetting | undefined>;
  createBrandSettings(settings: InsertBrandSetting): Promise<BrandSetting>;
  updateBrandSettings(id: number, settings: Partial<InsertBrandSetting>): Promise<BrandSetting | undefined>;

  // Platform connections operations
  getPlatformConnections(userId: number): Promise<PlatformConnection[]>;
  getPlatformConnection(id: number): Promise<PlatformConnection | undefined>;
  createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection>;
  updatePlatformConnection(id: number, connection: Partial<InsertPlatformConnection>): Promise<PlatformConnection | undefined>;

  // Post templates operations
  getPostTemplates(userId: number): Promise<PostTemplate[]>;
  getPostTemplate(id: number): Promise<PostTemplate | undefined>;
  createPostTemplate(template: InsertPostTemplate): Promise<PostTemplate>;
  updatePostTemplate(id: number, template: Partial<InsertPostTemplate>): Promise<PostTemplate | undefined>;
  deletePostTemplate(id: number): Promise<boolean>;

  // Posts operations
  getPosts(userId: number): Promise<Post[]>;
  getPostsByDate(userId: number, year: number, month: number): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private brandSettings: Map<number, BrandSetting>;
  private platformConnections: Map<number, PlatformConnection>;
  private postTemplates: Map<number, PostTemplate>;
  private posts: Map<number, Post>;
  
  private userId: number;
  private brandSettingId: number;
  private platformConnectionId: number;
  private postTemplateId: number;
  private postId: number;

  constructor() {
    this.users = new Map();
    this.brandSettings = new Map();
    this.platformConnections = new Map();
    this.postTemplates = new Map();
    this.posts = new Map();
    
    this.userId = 1;
    this.brandSettingId = 1;
    this.platformConnectionId = 1;
    this.postTemplateId = 1;
    this.postId = 1;
    
    // Initialize with demo data
    this.initializeData();
  }

  private initializeData() {
    // Create a demo user
    const demoUser: User = {
      id: this.userId++,
      username: 'demo',
      password: 'password',
      name: 'Jane Doe',
      businessName: 'Small Business',
      email: 'jane@example.com'
    };
    this.users.set(demoUser.id, demoUser);

    // Create brand settings for demo user
    const demoBrandSettings: BrandSetting = {
      id: this.brandSettingId++,
      userId: demoUser.id,
      name: 'My Brand',
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#111827'],
      fonts: { heading: 'Inter', body: 'Roboto' },
      logoUrl: ''
    };
    this.brandSettings.set(demoBrandSettings.id, demoBrandSettings);

    // Create platform connections
    const platforms = [
      { name: 'facebook', connected: true, accountName: 'Small Business', stats: null },
      { name: 'instagram', connected: true, accountName: '@smallbusiness', stats: null },
      { name: 'twitter', connected: false, accountName: '', stats: null },
      { name: 'linkedin', connected: false, accountName: '', stats: null },
      { 
        name: 'youtube', 
        connected: true, 
        accountName: '@smallbusinesschannel',
        stats: { 
          subscribers: 5200, 
          averageViews: 1200, 
          cpm: 4.50, 
          totalVideos: 45,
          watchHours: 4500
        } 
      }
    ];

    platforms.forEach(platform => {
      const connection: PlatformConnection = {
        id: this.platformConnectionId++,
        userId: demoUser.id,
        platform: platform.name,
        connected: platform.connected,
        accountName: platform.accountName,
        stats: platform.stats
      };
      this.platformConnections.set(connection.id, connection);
    });

    // Create post templates
    const templateData = [
      {
        name: 'Product Promotion',
        description: 'Perfect for showcasing products with clean layout',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        content: 'Check out our amazing [PRODUCT]! Now available for just $[PRICE]. Limited time offer.',
        platforms: ['facebook', 'instagram', 'twitter']
      },
      {
        name: 'Testimonial Post',
        description: 'Showcase customer reviews with quote styling',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        content: '"[QUOTE]" - [CUSTOMER_NAME], [LOCATION]',
        platforms: ['facebook', 'instagram']
      },
      {
        name: 'Special Offer',
        description: 'Eye-catching promo template with CTA',
        imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        content: 'SPECIAL OFFER: [DEAL_DESCRIPTION]. Use code [CODE] at checkout. Offer valid until [DATE].',
        platforms: ['facebook', 'instagram', 'twitter']
      },
      {
        name: 'Team Highlight',
        description: 'Showcase your team members professionally',
        imageUrl: 'https://images.unsplash.com/photo-1493421419110-74f4e85ba126?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        content: 'Meet [NAME], our [POSITION]. [BRIEF_BIO]',
        platforms: ['facebook', 'linkedin']
      },
      {
        name: 'YouTube Video Title & Description',
        description: 'Optimized for YouTube engagement and SEO',
        imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        content: '[ATTENTION-GRABBING TITLE] | [KEYWORD]\n\nIn this video, I\'ll show you [MAIN_BENEFIT]. Learn how to [TOPIC] and [VALUE_PROPOSITION].\n\n🔔 Subscribe for more: [CHANNEL_LINK]\n👍 Like and share if this was helpful!\n\n#[HASHTAG1] #[HASHTAG2] #[HASHTAG3]',
        platforms: ['youtube']
      }
    ];

    templateData.forEach(template => {
      const postTemplate: PostTemplate = {
        id: this.postTemplateId++,
        userId: demoUser.id,
        name: template.name,
        description: template.description,
        imageUrl: template.imageUrl,
        content: template.content,
        platforms: template.platforms,
        isDefault: false
      };
      this.postTemplates.set(postTemplate.id, postTemplate);
    });

    // Create upcoming posts
    const now = new Date();
    const postData = [
      {
        content: 'Introducing our new summer collection with special discount for early birds.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 0),
        platforms: ['facebook', 'instagram'],
        title: 'Summer Product Launch'
      },
      {
        content: 'Learn how Green Cafe increased their sales by 30% using our products.',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 14, 30),
        platforms: ['facebook', 'linkedin'],
        title: 'Customer Spotlight: Green Cafe'
      },
      {
        content: '5 productivity hacks for small business owners to save time and boost efficiency.',
        imageUrl: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 11, 9, 0),
        platforms: ['instagram', 'twitter'],
        title: 'Weekly Tips: Productivity Hacks'
      }
    ];

    postData.forEach(postItem => {
      const post: Post = {
        id: this.postId++,
        userId: demoUser.id,
        content: postItem.content,
        imageUrl: postItem.imageUrl,
        scheduledDate: postItem.scheduledDate,
        publishedDate: null,
        status: 'scheduled',
        platforms: postItem.platforms,
        templateId: null,
        engagementStats: { likes: 0, comments: 0, shares: 0 }
      };
      this.posts.set(post.id, post);
    });

    // Create some past posts with engagement data
    const pastPostData = [
      {
        content: 'Check out our new office space! We\'ve upgraded to better serve you.',
        imageUrl: '',
        scheduledDate: new Date(now.getFullYear(), now.getMonth() - 1, 15, 9, 0),
        publishedDate: new Date(now.getFullYear(), now.getMonth() - 1, 15, 9, 0),
        platforms: ['facebook', 'instagram'],
        status: 'published',
        engagementStats: { likes: 423, comments: 32, shares: 15 }
      },
      {
        content: 'Our Spring collection is now available! Limited stock, grab yours today.',
        imageUrl: '',
        scheduledDate: new Date(now.getFullYear(), now.getMonth() - 1, 5, 10, 0),
        publishedDate: new Date(now.getFullYear(), now.getMonth() - 1, 5, 10, 0),
        platforms: ['facebook', 'instagram', 'twitter'],
        status: 'published',
        engagementStats: { likes: 786, comments: 124, shares: 89 }
      }
    ];

    pastPostData.forEach(postItem => {
      const post: Post = {
        id: this.postId++,
        userId: demoUser.id,
        content: postItem.content,
        imageUrl: postItem.imageUrl,
        scheduledDate: postItem.scheduledDate,
        publishedDate: postItem.publishedDate,
        status: postItem.status,
        platforms: postItem.platforms,
        templateId: null,
        engagementStats: postItem.engagementStats
      };
      this.posts.set(post.id, post);
    });

    // Add calendar posts
    const calendarPosts = [
      {
        content: 'Product Launch announcement for our new line.',
        platforms: ['facebook'],
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), 2, 10, 0),
        title: 'Product Launch'
      },
      {
        content: 'Series of Instagram stories showcasing behind the scenes.',
        platforms: ['instagram'],
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), 5, 14, 0),
        title: 'Story Series'
      },
      {
        content: 'Spotlight on a customer success story.',
        platforms: ['facebook'],
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), 8, 9, 0),
        title: 'Customer Spotlight'
      },
      {
        content: 'Featuring the key benefits of our product.',
        platforms: ['instagram'],
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), 13, 11, 0),
        title: 'Product Feature'
      },
      {
        content: 'Special promotional offer for our followers.',
        platforms: ['facebook', 'instagram'],
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), 14, 10, 0),
        title: 'Promo Offer'
      },
      {
        content: 'Hosting a Twitter chat on industry trends.',
        platforms: ['twitter'],
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), 21, 16, 0),
        title: 'Twitter Chat'
      }
    ];

    calendarPosts.forEach(postItem => {
      const post: Post = {
        id: this.postId++,
        userId: demoUser.id,
        content: postItem.content,
        imageUrl: '',
        scheduledDate: postItem.scheduledDate,
        publishedDate: null,
        status: 'scheduled',
        platforms: postItem.platforms,
        templateId: null,
        engagementStats: { likes: 0, comments: 0, shares: 0 }
      };
      this.posts.set(post.id, post);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Brand settings operations
  async getBrandSettings(userId: number): Promise<BrandSetting | undefined> {
    return Array.from(this.brandSettings.values()).find(
      settings => settings.userId === userId
    );
  }

  async createBrandSettings(settings: InsertBrandSetting): Promise<BrandSetting> {
    const id = this.brandSettingId++;
    const newSettings = { ...settings, id };
    this.brandSettings.set(id, newSettings);
    return newSettings;
  }

  async updateBrandSettings(id: number, settings: Partial<InsertBrandSetting>): Promise<BrandSetting | undefined> {
    const existingSettings = this.brandSettings.get(id);
    if (!existingSettings) return undefined;

    const updatedSettings = { ...existingSettings, ...settings };
    this.brandSettings.set(id, updatedSettings);
    return updatedSettings;
  }

  // Platform connections operations
  async getPlatformConnections(userId: number): Promise<PlatformConnection[]> {
    return Array.from(this.platformConnections.values()).filter(
      connection => connection.userId === userId
    );
  }

  async getPlatformConnection(id: number): Promise<PlatformConnection | undefined> {
    return this.platformConnections.get(id);
  }

  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const id = this.platformConnectionId++;
    const newConnection = { ...connection, id };
    this.platformConnections.set(id, newConnection);
    return newConnection;
  }

  async updatePlatformConnection(id: number, connection: Partial<InsertPlatformConnection>): Promise<PlatformConnection | undefined> {
    const existingConnection = this.platformConnections.get(id);
    if (!existingConnection) return undefined;

    const updatedConnection = { ...existingConnection, ...connection };
    this.platformConnections.set(id, updatedConnection);
    return updatedConnection;
  }

  // Post templates operations
  async getPostTemplates(userId: number): Promise<PostTemplate[]> {
    return Array.from(this.postTemplates.values()).filter(
      template => template.userId === userId
    );
  }

  async getPostTemplate(id: number): Promise<PostTemplate | undefined> {
    return this.postTemplates.get(id);
  }

  async createPostTemplate(template: InsertPostTemplate): Promise<PostTemplate> {
    const id = this.postTemplateId++;
    const newTemplate = { ...template, id };
    this.postTemplates.set(id, newTemplate);
    return newTemplate;
  }

  async updatePostTemplate(id: number, template: Partial<InsertPostTemplate>): Promise<PostTemplate | undefined> {
    const existingTemplate = this.postTemplates.get(id);
    if (!existingTemplate) return undefined;

    const updatedTemplate = { ...existingTemplate, ...template };
    this.postTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deletePostTemplate(id: number): Promise<boolean> {
    return this.postTemplates.delete(id);
  }

  // Posts operations
  async getPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(
      post => post.userId === userId
    );
  }

  async getPostsByDate(userId: number, year: number, month: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => {
      const postDate = new Date(post.scheduledDate);
      return post.userId === userId && 
             postDate.getFullYear() === year && 
             postDate.getMonth() === month;
    });
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const id = this.postId++;
    const newPost = { 
      ...post, 
      id, 
      publishedDate: null, 
      status: 'scheduled',
      engagementStats: { likes: 0, comments: 0, shares: 0 }
    };
    this.posts.set(id, newPost);
    return newPost;
  }

  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    if (!existingPost) return undefined;

    const updatedPost = { ...existingPost, ...post };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }
}

// Import and use DatabaseStorage
import { DatabaseStorage } from './database-storage';

// Choose which storage implementation to use
// const storage = new MemStorage();
export const storage = new DatabaseStorage();
