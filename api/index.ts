import express from "express";
import path from "path";

const app = express();
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", platform: "vercel", timestamp: new Date().toISOString() });
});

app.post("/api/export-pdf", (req, res) => {
  res.json({ message: "PDF Export service ready via Vercel Function" });
});

// Since Vercel handles static files automatically via the build output,
// we don't need to manually serve the 'dist' folder here like in server.ts.
// This file acts as the handler for /api/* requests.

export default app;
