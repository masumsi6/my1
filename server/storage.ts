import { users, profiles, links, socialLinks, profileReactions, type User, type InsertUser, type Profile, type InsertProfile, type Link, type InsertLink, type SocialLink, type InsertSocialLink, type ProfileReaction, type InsertProfileReaction } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  suspendUser(id: number): Promise<void>;
  unsuspendUser(id: number): Promise<void>;
  deleteUser(id: number): Promise<void>;
  
  getProfile(userId: number): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile & { userId: number }): Promise<Profile>;
  updateProfile(userId: number, updates: Partial<Profile>): Promise<Profile | undefined>;
  
  getLinks(profileId: number): Promise<Link[]>;
  createLink(link: InsertLink & { profileId: number }): Promise<Link>;
  updateLink(id: number, updates: Partial<Link>): Promise<Link | undefined>;
  deleteLink(id: number): Promise<void>;
  
  getSocialLinks(profileId: number): Promise<SocialLink[]>;
  createSocialLink(socialLink: InsertSocialLink & { profileId: number }): Promise<SocialLink>;
  updateSocialLink(id: number, updates: Partial<SocialLink>): Promise<SocialLink | undefined>;
  deleteSocialLink(id: number): Promise<void>;
  reorderSocialLinks(socialLinks: { id: number; order: number }[]): Promise<void>;
  
  checkUsernameAvailability(username: string): Promise<boolean>;
  
  // Profile reactions
  createProfileReaction(reaction: InsertProfileReaction & { profileId: number }): Promise<ProfileReaction>;
  getProfileReactions(profileId: number): Promise<ProfileReaction[]>;
  getAllProfileReactions(): Promise<ProfileReaction[]>;
  getProfileReactionCounts(profileId: number): Promise<{ love: number; dislike: number; report: number }>;
  hasUserReacted(profileId: number, ipAddress: string, type: string): Promise<boolean>;
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async suspendUser(id: number): Promise<void> {
    await db.update(users).set({ isSuspended: true }).where(eq(users.id, id));
  }

  async unsuspendUser(id: number): Promise<void> {
    await db.update(users).set({ isSuspended: false }).where(eq(users.id, id));
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getProfile(userId: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile || undefined;
  }

  async getProfileByUsername(username: string): Promise<Profile | undefined> {
    const [result] = await db
      .select({
        id: profiles.id,
        userId: profiles.userId,
        displayName: profiles.displayName,
        bio: profiles.bio,
        profilePicture: profiles.profilePicture,
        theme: profiles.theme,
        buttonStyle: profiles.buttonStyle,
        buttonColor: profiles.buttonColor,
        isPublished: profiles.isPublished,
        enableQrCode: profiles.enableQrCode,
        createdAt: profiles.createdAt,
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(users.username, username));
    return result || undefined;
  }

  async createProfile(profile: InsertProfile & { userId: number }): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(userId: number, updates: Partial<Profile>): Promise<Profile | undefined> {
    const [profile] = await db.update(profiles).set(updates).where(eq(profiles.userId, userId)).returning();
    return profile || undefined;
  }

  async getLinks(profileId: number): Promise<Link[]> {
    return await db.select().from(links).where(eq(links.profileId, profileId));
  }

  async createLink(link: InsertLink & { profileId: number }): Promise<Link> {
    const [newLink] = await db.insert(links).values(link).returning();
    return newLink;
  }

  async updateLink(id: number, updates: Partial<Link>): Promise<Link | undefined> {
    const [link] = await db.update(links).set(updates).where(eq(links.id, id)).returning();
    return link || undefined;
  }

  async deleteLink(id: number): Promise<void> {
    await db.delete(links).where(eq(links.id, id));
  }

  async getSocialLinks(profileId: number): Promise<SocialLink[]> {
    return await db.select().from(socialLinks).where(eq(socialLinks.profileId, profileId)).orderBy(socialLinks.order);
  }

  async createSocialLink(socialLink: InsertSocialLink & { profileId: number }): Promise<SocialLink> {
    const [newSocialLink] = await db.insert(socialLinks).values(socialLink).returning();
    return newSocialLink;
  }

  async updateSocialLink(id: number, updates: Partial<SocialLink>): Promise<SocialLink | undefined> {
    const [socialLink] = await db.update(socialLinks).set(updates).where(eq(socialLinks.id, id)).returning();
    return socialLink || undefined;
  }

  async deleteSocialLink(id: number): Promise<void> {
    await db.delete(socialLinks).where(eq(socialLinks.id, id));
  }

  async reorderSocialLinks(socialLinksData: { id: number; order: number }[]): Promise<void> {
    try {
      for (const { id, order } of socialLinksData) {
        const result = await db.update(socialLinks).set({ order }).where(eq(socialLinks.id, id));
        console.log(`Updated social link ${id} with order ${order}:`, result);
      }
    } catch (error) {
      console.error("Error in reorderSocialLinks:", error);
      throw error;
    }
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return !user;
  }

  async createProfileReaction(reaction: InsertProfileReaction & { profileId: number }): Promise<ProfileReaction> {
    const [profileReaction] = await db
      .insert(profileReactions)
      .values(reaction)
      .returning();
    return profileReaction;
  }

  async getProfileReactions(profileId: number): Promise<ProfileReaction[]> {
    return await db
      .select()
      .from(profileReactions)
      .where(eq(profileReactions.profileId, profileId));
  }

  async getAllProfileReactions(): Promise<ProfileReaction[]> {
    return await db
      .select()
      .from(profileReactions)
      .orderBy(desc(profileReactions.createdAt));
  }

  async getProfileReactionCounts(profileId: number): Promise<{ love: number; dislike: number; report: number }> {
    const reactions = await this.getProfileReactions(profileId);
    return {
      love: reactions.filter(r => r.type === 'love').length,
      dislike: reactions.filter(r => r.type === 'dislike').length,
      report: reactions.filter(r => r.type === 'report').length
    };
  }

  async hasUserReacted(profileId: number, ipAddress: string, type: string): Promise<boolean> {
    const [reaction] = await db
      .select()
      .from(profileReactions)
      .where(
        and(
          eq(profileReactions.profileId, profileId),
          eq(profileReactions.ipAddress, ipAddress),
          eq(profileReactions.type, type)
        )
      )
      .limit(1);
    return !!reaction;
  }
}

export const storage = new DatabaseStorage();
