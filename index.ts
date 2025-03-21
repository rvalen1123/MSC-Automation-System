// index.ts - Main application entry point for MSC Wound Care Form Automation System

import { Hono } from "hono";
import { html } from "hono/html";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { api } from "./api";
import { config } from "./config";

// Create main application
const app = new Hono();

// Apply middlewares
app.use("*", logger());
app.use("*", secureHeaders());
app.use("*", cors({
  origin: ["https://msc-wound-care.com", "https://forms.msc-wound-care.com"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
  maxAge: 86400,
  credentials: true
}));

// Serve static files
app.use("/static/*", serveStatic({ root: "./public" }));
app.use("/uploads/*", serveStatic({ root: "./uploads" }));
app.use("/forms/*", serveStatic({ root: "./forms" }));

// Mount API routes
app.route("/api", api);

// Import the HTML template from external file
import { homePage } from "./template";

// Serve the HTML form at the root route
app.get("/", (c) => {
  return c.html(homePage);
});

// Catch-all route for single-page application
app.get("*", (c) => {
  return c.html(homePage);
});

// Start the server
export default {
  port: config.PORT,
  fetch: app.fetch
};

console.log(`MSC Wound Care Form Automation System running in ${config.NODE_ENV} mode on port ${config.PORT}`);
console.log(`Features enabled: OCR=${config.ENABLE_OCR}, Document History=${config.ENABLE_DOCUMENT_HISTORY}`);
