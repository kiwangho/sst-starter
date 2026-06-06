# SST Starter — Claude Code Instructions

## Your workspace

You are helping build an app on top of a pre-wired SST infrastructure. Edit freely inside:
- `frontend/src/` — your React app (`App.tsx` is the entry point)
- `api/src/index.ts` — add Hono routes here
- `demo-user-access.json` — list user accounts

## Persisting data

A DynamoDB table is wired into the API. Persist data from any `/api/*` route with `import { db } from "./_db"` — see the "Storage" section of `api/INSTRUCTIONS.md` for the PK/SK pattern cookbook. Do not import the AWS SDK directly.

## Deploying

Deploy with: `sst deploy --stage [stage-name] --profile awskiwangho`

Tear down with: `sst remove --stage [stage-name] --profile awskiwangho`

Do not change the AWS profile. Do not create new AWS resources outside of the SST stack.

## Off-limits — do not read, edit, or suggest changes to these paths

These are owned by the platform. Modifying them will break auth, deployment, or storage:

- `infra/` — AWS infrastructure (Cognito, Lambda, CloudFront, DynamoDB)
- `sst.config.ts` — SST deployment config
- `frontend/src/_auth/` — auth provider and hook
- `api/src/middleware/` — JWT validation middleware
- `api/src/_db.ts` — DynamoDB wrapper (use the exported `db` helper instead)

If a task seems to require editing these files, stop and ask Ki instead.
