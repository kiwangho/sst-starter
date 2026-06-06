import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { authMiddleware } from "./middleware/auth";
import { db } from "./_db";

const app = new Hono();

// Auth guard — all routes under /api/* require a valid Cognito JWT
// DO NOT remove this middleware
app.use("/api/*", authMiddleware);

// =====================================================================
// ADD YOUR API ROUTES BELOW
// All routes under /api/* are automatically authenticated.
// Access the logged-in user via: const user = c.get("user")  // { username, sub }
//
// Storage: `import { db } from "./_db"` — see api/INSTRUCTIONS.md "Storage"
// for the PK/SK pattern cookbook. The routes below are a worked example.
// =====================================================================

// ---------- Demo: per-user checklist (delete or replace with your feature) ----------
type ChecklistItem = {
  PK: string;
  SK: string;
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

app.get("/api/items", async (c) => {
  const user = c.get("user");
  const items = await db.query<ChecklistItem>(`USER#${user.sub}`, {
    skBeginsWith: "ITEM#",
  });
  return c.json({ items });
});

app.post("/api/items", async (c) => {
  const user = c.get("user");
  const { text } = await c.req.json<{ text: string }>();
  if (!text || typeof text !== "string") {
    return c.json({ error: "text is required" }, 400);
  }
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  const item: ChecklistItem = {
    PK: `USER#${user.sub}`,
    SK: `ITEM#${createdAt}#${id}`,
    id,
    text,
    done: false,
    createdAt,
  };
  await db.put(item);
  return c.json({ item });
});

app.patch("/api/items/:sk{.+}", async (c) => {
  const user = c.get("user");
  const sk = c.req.param("sk");
  const patch = await c.req.json<Partial<Pick<ChecklistItem, "done" | "text">>>();
  const existing = await db.get<ChecklistItem>(`USER#${user.sub}`, sk);
  if (!existing) return c.json({ error: "not found" }, 404);
  const updated: ChecklistItem = { ...existing, ...patch };
  await db.put(updated);
  return c.json({ item: updated });
});

app.delete("/api/items/:sk{.+}", async (c) => {
  const user = c.get("user");
  const sk = c.req.param("sk");
  await db.delete(`USER#${user.sub}`, sk);
  return c.json({ ok: true });
});

// Health check — no auth required
app.get("/health", (c) => c.json({ status: "ok" }));

export const handler = handle(app);
