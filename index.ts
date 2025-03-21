// index.ts - Main application entry point for MSC Wound Care Form Automation System

import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { api } from "./api";
import { config } from "./config";
import { homePage } from "./template";

// Create the main app instance
const app = new Hono();

// Apply middleware
app.use("*", logger());
app.use("*", cors());
app.use("*", secureHeaders());

// Register API routes
app.route("/api", api);

// Health check endpoint for the main app
app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Serve the HTML form
app.get("/", (c) => {
  return c.html(homePage);
});

// Start the server
console.log(`Server running on port ${config.PORT}`);

export default {
  port: config.PORT,
  fetch: app.fetch
};
