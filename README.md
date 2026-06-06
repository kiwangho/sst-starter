# sst-starter

A fullstack SST v3 starter for building and deploying your own app to AWS. Ships with auth, a backend API, and DynamoDB pre-wired. Deploy with a single command.

**Stack:** React + TypeScript · Hono serverless API · DynamoDB · Cognito auth · CloudFront + S3

---

## Installation

### Prerequisites

You need three things installed: **Node.js**, the **AWS CLI**, and the **SST CLI**.

---

### macOS

**Node.js (v20+)**

```bash
# Check if already installed
node --version

# If not installed, use Homebrew:
brew install node

# Or download the installer: https://nodejs.org/
```

**AWS CLI**

```bash
# Check if already installed
aws --version

# If not installed:
brew install awscli
# Or download: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
```

**SST CLI**

```bash
curl -fsSL https://ion.sst.dev/install | bash

# Verify:
sst version
```

---

### Windows — requires WSL2 (Ubuntu)

All commands run inside the **Ubuntu terminal**, not PowerShell or Command Prompt.

> **Don't have WSL2?** Open PowerShell as Administrator and run `wsl --install`. Restart when prompted. Ubuntu opens automatically after restart — create a username and password. Then open Ubuntu from the Start menu for all steps below.

**Node.js (v20+)**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify:
node --version
```

**AWS CLI**

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip aws/

# Verify:
aws --version
```

**SST CLI**

```bash
curl -fsSL https://ion.sst.dev/install | bash

# Verify:
sst version
```

> **VS Code with WSL2:** Open Ubuntu, navigate to your project folder, and run `code .` to open VS Code connected to WSL2. You’ll see "WSL: Ubuntu" in the bottom-left corner. All terminal commands in VS Code will run in Linux.

---

### AWS credentials

You need the `awskiwangho` AWS profile configured. If you completed the summer program badges, this is already set up.

Verify:

```bash
aws sts get-caller-identity --profile awskiwangho
```

You should see account `363426442171`. If this fails, contact Ki.

---

## Getting started

```bash
# 1. Fork this repo on GitHub and rename it to your project
# 2. Clone your fork
git clone https://github.com/[your-username]/[your-project]
cd [your-project]

# 3. Install dependencies
npm install

# 4. Deploy your stage (use your GitHub username as the stage name)
sst deploy --stage [your-github-username] --profile awskiwangho
```

After ~3–5 minutes, SST prints your CloudFront URL. That's your live app.

**To tear down:**

```bash
sst remove --stage [your-github-username] --profile awskiwangho
```

---

## Where to work

| What | Where |
|------|-------|
| Your React app | `frontend/src/App.tsx` |
| New components / pages | Anywhere inside `frontend/src/` |
| Backend API routes | `api/src/index.ts` (marked section) |
| Reviewer logins | `demo-user-access.json` |

Read the full guides:
- [`VIBE_CODER_GUIDE.md`](./VIBE_CODER_GUIDE.md) — complete walkthrough
- [`frontend/INSTRUCTIONS.md`](./frontend/INSTRUCTIONS.md) — frontend reference
- [`api/INSTRUCTIONS.md`](./api/INSTRUCTIONS.md) — backend + storage reference

**Do not modify:** `infra/`, `sst.config.ts`, `frontend/src/_auth/`, `api/src/middleware/`, `api/src/_db.ts`

---

## Auth in your app

Login is pre-wired. When `App.tsx` renders, the user is already authenticated:

```tsx
import { useAuth } from "./_auth/useAuth";

const { user, signOut, getAccessToken } = useAuth();
```

To call the backend:

```tsx
const token = await getAccessToken();
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/my-route`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript, hosted on CloudFront + S3 |
| Backend | TypeScript, Hono, deployed as a Lambda function |
| Storage | DynamoDB — one table per stage |
| Auth | Cognito User Pool, username + password |
| IaC | SST v3 (Pulumi) |
