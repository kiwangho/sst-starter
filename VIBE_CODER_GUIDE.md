# Vibe Coder Guide — SST Starter

This repo deploys your app to a live AWS URL from your local machine. Auth is pre-wired so only people you invite can log in.

**Tech stack:** React + TypeScript (frontend), TypeScript + Hono (backend). Your AI coding tool handles the syntax — you just need to know where to put your code.

---

## How it works (the short version)

1. **Install and deploy** with `sst deploy --stage [your-name] --profile awskiwangho`
2. **Build your app** in `frontend/src/App.tsx` and `api/src/index.ts`
3. **Redeploy** to see your changes live: run `sst deploy` again
4. **Share** the CloudFront URL with anyone you want to test your app
5. **Tear down** with `sst remove --stage [your-name] --profile awskiwangho`

---

## Prerequisites (one-time setup)

See `README.md` for full installation instructions for macOS and Windows (WSL2).

Quick summary:
- Node.js v20+
- AWS CLI, configured with the `awskiwangho` profile
- SST CLI: `curl -fsSL https://ion.sst.dev/install | bash`

---

## Step 1 — Put your code in the right place

| What you're building | Where it goes |
|----------------------|---------------|
| Frontend (React app) | `frontend/src/App.tsx` — replace the placeholder |
| Backend API routes | `api/src/index.ts` — add routes in the marked section |
| Persisting data | `import { db } from "./_db"` inside an API route — see "Storage" in `api/INSTRUCTIONS.md` |
| New components, pages, utils | Create files anywhere inside `frontend/src/` or `api/src/` |

Read the detailed guides:
- `frontend/INSTRUCTIONS.md`
- `api/INSTRUCTIONS.md` (backend routes and the DynamoDB storage layer)

**Do not touch** `infra/`, `sst.config.ts`, `frontend/src/_auth/`, `api/src/middleware/`, or `api/src/_db.ts`.

---

## Step 2 — Add users (optional)

Edit `demo-user-access.json` to add usernames for anyone you want to test your app:

```json
{ "users": ["alice", "bob"] }
```

After editing, redeploy and create the accounts manually in the AWS Cognito console, or ask Ki to run the user-creation script.

---

## Step 3 — Deploy

```bash
sst deploy --stage [your-github-username] --profile awskiwangho
```

First deploy takes ~3–5 minutes. SST prints your CloudFront URL when it's done:

```
✔  Complete
   url: https://d1abc2def3ghi4.cloudfront.net
```

Visit the URL, log in, and you're in your app.

---

## Step 4 — Iterate

Edit your code, then redeploy:

```bash
# Edit frontend/src/App.tsx or api/src/index.ts...
git add .
git commit -m "Update"
sst deploy --stage [your-github-username] --profile awskiwangho
```

The URL stays the same across redeploys. Data in DynamoDB persists across redeploys too — it only disappears when you run `sst remove`.

---

## Step 5 — Tear down

```bash
sst remove --stage [your-github-username] --profile awskiwangho
```

This removes all AWS resources for your stage: CloudFront, S3, Lambda, Cognito, and the DynamoDB table (data goes with it). Your code stays in GitHub.

---

## Where to put your code (summary)

```
frontend/src/
  App.tsx           ← Your app entry point
  MyComponent.tsx   ← Add your components here
  pages/            ← Add pages/routes here
  ...

api/src/
  index.ts          ← Add API routes in the marked section
  ...
```

**Everything in `_auth/`, `middleware/`, `_db.ts`, `infra/`, `sst.config.ts` is platform-owned — do not modify.**

---

## Common issues

**`sst deploy` fails with credentials error**
Run `aws sts get-caller-identity --profile awskiwangho` to verify your credentials are working. If it fails, contact Ki.

**Login form shows but login fails**
The Cognito user account may not exist yet. Ask Ki to create it.

**CloudFront URL returns 403**
Wait 2–3 minutes after the deploy finishes. CloudFront takes a moment to propagate.

**`sst: command not found`**
Restart your terminal after installing the SST CLI. On WSL2, close and reopen the Ubuntu terminal.
