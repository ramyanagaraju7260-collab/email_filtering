import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple JSON Database Implementation
const DB_PATH = "db.json";
let dbData = {
  emails: [] as any[],
  filters: [] as any[]
};

function loadDB() {
  if (fs.existsSync(DB_PATH)) {
    try {
      dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (e) {
      console.error("Failed to load DB", e);
    }
  }
}

function saveDB() {
  fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2));
}

loadDB();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  // API Routes
  app.get("/api/emails", (req, res) => {
    res.json(dbData.emails.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  });

  app.post("/api/emails/mock", (req, res) => {
    const mockEmails = [
      {
        id: "1",
        sender: "support@google.com",
        to_address: "user@example.com",
        subject: "Security Alert",
        body: "We detected a new login on your account. If this wasn't you, please reset your password.",
        date: new Date().toISOString(),
        category: "Important",
        status: "unread",
        is_starred: 0,
        sentiment: "neutral",
        tags: "[]"
      },
      {
        id: "2",
        sender: "newsletter@techcrunch.com",
        to_address: "user@example.com",
        subject: "The Daily Crunch: AI is taking over",
        body: "Today we look at the latest trends in LLMs and how they are changing software development.",
        date: new Date(Date.now() - 3600000).toISOString(),
        category: "Promotions",
        status: "read",
        is_starred: 0,
        sentiment: "neutral",
        tags: "[]"
      },
      {
        id: "3",
        sender: "friend@gmail.com",
        to_address: "user@example.com",
        subject: "Dinner tonight?",
        body: "Hey, are we still on for tacos at 7pm? Let me know!",
        date: new Date(Date.now() - 7200000).toISOString(),
        category: "Social",
        status: "unread",
        is_starred: 1,
        sentiment: "positive",
        tags: "[]"
      },
      {
        id: "4",
        sender: "spam@junk-mail.com",
        to_address: "user@example.com",
        subject: "YOU WON A FREE IPHONE!!!",
        body: "Click here now to claim your prize! Limited time only!",
        date: new Date(Date.now() - 10800000).toISOString(),
        category: "Spam",
        status: "unread",
        is_starred: 0,
        sentiment: "negative",
        tags: "[]"
      }
    ];

    dbData.emails = mockEmails;
    saveDB();
    res.json({ message: "Mock emails loaded" });
  });

  app.patch("/api/emails/:id", (req, res) => {
    const { id } = req.params;
    const { status, is_starred, category, sentiment, summary, tags } = req.body;
    
    const index = dbData.emails.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ error: "Email not found" });

    if (status !== undefined) dbData.emails[index].status = status;
    if (is_starred !== undefined) dbData.emails[index].is_starred = is_starred ? 1 : 0;
    if (category !== undefined) dbData.emails[index].category = category;
    if (sentiment !== undefined) dbData.emails[index].sentiment = sentiment;
    if (summary !== undefined) dbData.emails[index].summary = summary;
    if (tags !== undefined) dbData.emails[index].tags = tags;

    saveDB();
    res.json({ updated: 1 });
  });

  app.post("/api/emails", (req, res) => {
    const { subject, body, sender } = req.body;
    const newEmail = {
      id: Math.random().toString(36).substring(7),
      sender: sender || "System User <user@example.com>",
      to_address: "central@emailwise.ai",
      subject: subject || "(No Subject)",
      body: body || "",
      date: new Date().toISOString(),
      category: "Updates",
      status: "unread",
      is_starred: 0,
      sentiment: "neutral",
      tags: "[]"
    };

    dbData.emails.push(newEmail);
    saveDB();
    res.json(newEmail);
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("CRITICAL SERVER ERROR:", err);
  process.exit(1);
});
