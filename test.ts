import { Hono } from "hono";
import { html } from "hono/html";

const app = new Hono();

// Create a simple HTML template
const simplePage = html`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a test page.</p>
</body>
</html>`;

// Export the template
export { simplePage };

// Create a simple server
app.get("/", (c) => {
  return c.html(simplePage);
});

// Basic test for the server
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  
  it('should return HTML for the root route', async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });
}

// Export the app
export default app; 