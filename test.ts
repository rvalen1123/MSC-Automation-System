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

export default app; 