import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeSeasonalData } from "./seasonal";

// Create memory store
const MemoryStoreSession = MemoryStore(session);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// We'll define and register the health check endpoint in routes.ts

// Add trust proxy to handle Replit deployment correctly
app.set('trust proxy', 1);

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'texas-hill-country-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to false to work in both HTTP and HTTPS environments
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax', // Makes cookies work better across domains when deployed
    httpOnly: true, // Prevents client-side JS from reading the cookie
    path: '/' // Ensure cookie is available on all paths
  },
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Health check endpoint - separate from root to allow normal website to load
  app.get("/health", (_req, res) => {
    res.status(200).send("OK");
  });
  
  // We'll skip the seasonal data initialization on startup for now
  // This will be handled separately when accessing the seasonal routes
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
