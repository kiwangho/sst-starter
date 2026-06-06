# API — Vibe Coder Instructions

## Where to work

**Your routes live in `api/src/index.ts`**, in the section marked "ADD YOUR API ROUTES BELOW".

Do not modify `api/src/middleware/auth.ts` or `api/src/_db.ts` — they handle JWT validation and DynamoDB wiring.

## Adding a route

All routes under `/api/*` are automatically protected — only logged-in users can call them.

```typescript
// GET route
app.get("/api/my-data", (c) => {
  const user = c.get("user"); // { username, sub }
  return c.json({ items: [], requestedBy: user.username });
});

// POST route
app.post("/api/my-action", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  // do something with body...
  return c.json({ success: true });
});
```

## Calling the API from the frontend

```tsx
const token = await getAccessToken();
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/my-data`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Storage (DynamoDB)

The app ships with one DynamoDB table available to every route. Use it via the `db` helper:

```typescript
import { db } from "./_db";
```

You **do not** need to provision tables, configure IAM, or import the AWS SDK. The table is part of the SST stack and persists as long as your stage is deployed.

### Mental model

There is ONE table. Every item has two required string keys:

- **`PK`** (partition key) — what bucket the item lives in
- **`SK`** (sort key) — what kind of item it is and/or when

### Pattern cookbook

| Goal | `PK` | `SK` | Operation |
|---|---|---|---|
| Save an item for the current user | `` `USER#${user.sub}` `` | `` `ITEM#${createdAt}#${id}` `` | `db.put({...})` |
| List current user's items | `` `USER#${user.sub}` `` | begins with `"ITEM#"` | `db.query(pk, { skBeginsWith: "ITEM#" })` |
| Newest first | `` `USER#${user.sub}` `` | begins with `"ITEM#"` | `db.query(pk, { skBeginsWith: "ITEM#", reverse: true })` |
| Read / write user profile | `` `USER#${user.sub}` `` | `"PROFILE"` | `db.get(pk, sk)` / `db.put({...})` |
| Global / shared data | `"GLOBAL"` | `` `ENTRY#${Date.now()}#${id}` `` | `db.put({...})` |

**Use `user.sub` (not `user.username`) for per-user partition keys.** `sub` is the Cognito-assigned UUID — stable, unique, and safe to put in a key.

### `db` API reference

```typescript
db.get<T>(PK, SK): Promise<T | null>
db.put<T>(item: { PK, SK, ...whatever }): Promise<T>
db.query<T>(PK, opts?: { skBeginsWith?, limit?, reverse? }): Promise<T[]>
db.delete(PK, SK): Promise<void>
```

### Hard rules

1. **Always scope per user** with `PK: \`USER#${user.sub}\`` unless the data is intentionally global.
2. **Always include a timestamp in `SK` for list-style data** so `query({ reverse: true })` returns newest first.
3. **Do not store secrets or files larger than ~100KB.** For files, use S3 (ask Ki).
4. **The table is destroyed when you run `sst remove`.** Data does not persist after teardown.

## Adding dependencies

```bash
cd api
npm install <package>
```

SST bundles all dependencies automatically.

## What NOT to touch

| Path | Reason |
|------|--------|
| `api/src/middleware/auth.ts` | JWT validation — DO NOT MODIFY |
| `api/src/_db.ts` | DynamoDB wrapper — DO NOT MODIFY |
| The `app.use("/api/*", authMiddleware)` line | Removes auth guard if deleted — DO NOT REMOVE |
| `infra/` | AWS infrastructure — DO NOT MODIFY |
| `sst.config.ts` | Deployment config — DO NOT MODIFY |
