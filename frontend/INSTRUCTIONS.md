# Frontend — Vibe Coder Instructions

## Where to work

**Your code lives in `frontend/src/App.tsx`** and any files you create alongside it.

Do not modify anything in `frontend/src/_auth/` — that folder handles authentication and is managed by the platform.

## Auth is already done for you

When `App.tsx` renders, the user is already logged in. You get access to:

```tsx
import { useAuth } from "./_auth/useAuth";

const { user, signOut, getAccessToken } = useAuth();

user.username      // Cognito username
signOut()          // logs the user out
getAccessToken()   // JWT to put in the Authorization header for /api/* calls
```

## Calling the API

```tsx
const token = await getAccessToken();

const res = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();
```

The `VITE_API_URL` environment variable is injected automatically at build time — you don't need to set it.

## Persisting data

The app has a DynamoDB table wired into the Lambda — your backend routes can persist data with no extra setup. See the "Storage" section of `api/INSTRUCTIONS.md` for the access pattern cookbook. The checklist demo in `App.tsx` is a complete worked example.

## Running locally

```bash
cd frontend
npm install
npm run dev
```

> Note: Auth won't work locally without a deployed Cognito pool. For local dev, you can stub `useAuth` to return a fake user, or run `sst dev` from the repo root for a full local dev environment that connects to your deployed stage.

## Adding dependencies

```bash
cd frontend
npm install <package>
```

## UI libraries

This template ships **no UI library** to keep the starting point minimal. Add MUI, Chakra, Tailwind, or shadcn yourself:

```bash
cd frontend
npm install @mui/material @emotion/react @emotion/styled
```

## What NOT to touch

| Path | Reason |
|------|--------|
| `frontend/src/_auth/` | Auth wiring — DO NOT MODIFY |
| `frontend/src/main.tsx` | App bootstrap — DO NOT MODIFY |
| `infra/` | AWS infrastructure — DO NOT MODIFY |
| `sst.config.ts` | Deployment config — DO NOT MODIFY |
