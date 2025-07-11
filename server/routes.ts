import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProfileSchema, insertLinkSchema, insertSocialLinkSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Check username availability
  app.get("/api/check-username/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const isAvailable = await storage.checkUsernameAvailability(username);
      res.json({ available: isAvailable });
    } catch (error) {
      res.status(500).json({ message: "Error checking username availability" });
    }
  });

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const profile = await storage.getProfile(req.user!.id);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile({
        ...profileData,
        userId: req.user!.id
      });
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const profileData = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(req.user!.id, profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Public profile route
  app.get("/api/profile/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: "Profile not found" });
      }

      if (user.isSuspended) {
        return res.status(403).json({ message: "Account suspended" });
      }

      const profile = await storage.getProfile(user.id);
      if (!profile || !profile.isPublished) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const links = await storage.getLinks(profile.id);
      const socialLinks = await storage.getSocialLinks(profile.id);

      res.json({
        profile,
        links,
        socialLinks,
        user: {
          username: user.username,
          name: user.name
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  // Links routes
  app.get("/api/links", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const profile = await storage.getProfile(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      const links = await storage.getLinks(profile.id);
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: "Error fetching links" });
    }
  });

  app.post("/api/links", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const linkData = insertLinkSchema.parse(req.body);
      const profile = await storage.getProfile(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      const link = await storage.createLink({
        ...linkData,
        profileId: profile.id
      });
      res.status(201).json(link);
    } catch (error) {
      res.status(400).json({ message: "Invalid link data" });
    }
  });

  app.put("/api/links/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { id } = req.params;
      const linkData = insertLinkSchema.partial().parse(req.body);
      const link = await storage.updateLink(parseInt(id), linkData);
      res.json(link);
    } catch (error) {
      res.status(400).json({ message: "Invalid link data" });
    }
  });

  app.delete("/api/links/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { id } = req.params;
      await storage.deleteLink(parseInt(id));
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting link" });
    }
  });

  // Social links routes
  app.get("/api/social-links", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const profile = await storage.getProfile(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      const socialLinks = await storage.getSocialLinks(profile.id);
      res.json(socialLinks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching social links" });
    }
  });

  app.post("/api/social-links", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const socialLinkData = insertSocialLinkSchema.parse(req.body);
      const profile = await storage.getProfile(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      const socialLink = await storage.createSocialLink({
        ...socialLinkData,
        profileId: profile.id
      });
      res.status(201).json(socialLink);
    } catch (error) {
      res.status(400).json({ message: "Invalid social link data" });
    }
  });

  app.put("/api/social-links/reorder", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { socialLinks } = req.body;
      console.log("Received socialLinks:", socialLinks);
      
      if (!Array.isArray(socialLinks)) {
        console.log("socialLinks is not an array:", typeof socialLinks);
        return res.status(400).json({ message: "Invalid social links data - not an array" });
      }
      
      // Validate each social link has required fields
      for (const link of socialLinks) {
        if (!link.id || typeof link.order !== 'number') {
          console.log("Invalid link format:", link);
          return res.status(400).json({ message: "Invalid social link format" });
        }
      }
      
      console.log("Calling storage.reorderSocialLinks...");
      await storage.reorderSocialLinks(socialLinks);
      console.log("Successfully reordered social links");
      res.json({ success: true });
    } catch (error) {
      console.error("Error reordering social links:", error);
      res.status(500).json({ message: "Error reordering social links", error: error.message });
    }
  });

  app.put("/api/social-links/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { id } = req.params;
      const socialLinkData = insertSocialLinkSchema.partial().parse(req.body);
      const socialLink = await storage.updateSocialLink(parseInt(id), socialLinkData);
      res.json(socialLink);
    } catch (error) {
      res.status(400).json({ message: "Invalid social link data" });
    }
  });

  app.delete("/api/social-links/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { id } = req.params;
      await storage.deleteSocialLink(parseInt(id));
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting social link" });
    }
  });

  // Publish profile
  app.post("/api/publish", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const profile = await storage.updateProfile(req.user!.id, { isPublished: true });
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error publishing profile" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.sendStatus(403);
    }
    
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  app.post("/api/admin/suspend/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.sendStatus(403);
    }
    
    try {
      const { id } = req.params;
      await storage.suspendUser(parseInt(id));
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Error suspending user" });
    }
  });

  app.post("/api/admin/unsuspend/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.sendStatus(403);
    }
    
    try {
      const { id } = req.params;
      await storage.unsuspendUser(parseInt(id));
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Error unsuspending user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.sendStatus(403);
    }
    
    try {
      const { id } = req.params;
      await storage.deleteUser(parseInt(id));
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });

  // Profile reactions
  app.post("/api/profile-reactions", async (req, res) => {
    try {
      const { profileId, type, reason } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress || "unknown";
      
      // Check if user has already reacted with this type
      const hasReacted = await storage.hasUserReacted(profileId, ipAddress, type);
      if (hasReacted) {
        return res.status(400).json({ error: "You have already reacted with this type" });
      }
      
      const reaction = await storage.createProfileReaction({
        profileId,
        type,
        reason,
        ipAddress
      });
      
      res.json(reaction);
    } catch (error) {
      console.error("Error creating profile reaction:", error);
      res.status(500).json({ error: "Failed to create reaction" });
    }
  });

  // Get reaction counts for a profile
  app.get("/api/profile-reaction-counts/:profileId", async (req, res) => {
    try {
      const profileId = parseInt(req.params.profileId);
      const counts = await storage.getProfileReactionCounts(profileId);
      res.json(counts);
    } catch (error) {
      console.error("Error fetching reaction counts:", error);
      res.status(500).json({ error: "Failed to fetch reaction counts" });
    }
  });

  app.get("/api/profile-reactions/:profileId", async (req, res) => {
    try {
      const profileId = parseInt(req.params.profileId);
      const reactions = await storage.getProfileReactions(profileId);
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching profile reactions:", error);
      res.status(500).json({ error: "Failed to fetch reactions" });
    }
  });

  app.get("/api/admin/profile-reactions", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.sendStatus(403);
    }
    
    try {
      const reactions = await storage.getAllProfileReactions();
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching all profile reactions:", error);
      res.status(500).json({ error: "Failed to fetch all reactions" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (username === "masumlv" && password === "22992299") {
      const adminUser = await storage.getUserByUsername("admin") || await storage.createUser({
        email: "admin@linktreepro.com",
        username: "admin",
        password: "hashed_password",
        name: "Admin"
      });
      
      await storage.updateUser(adminUser.id, { isAdmin: true });
      
      req.login(adminUser, (err) => {
        if (err) return res.status(500).json({ message: "Login failed" });
        res.json(adminUser);
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
