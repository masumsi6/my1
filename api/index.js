// Vercel API handler - imports your Express app
import express from 'express';
import { registerRoutes } from '../server/routes.js';

let app = null;

async function createApp() {
  if (!app) {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    
    // Register all your API routes
    await registerRoutes(app);
    
    // Error handler
    app.use((err, req, res, next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
  }
  return app;
}

export default async function handler(req, res) {
  const app = await createApp();
  return app(req, res);
}
