# Deployment Guide

**Status:** Option A (Vercel automatic deploy) configured. Every push to `master` deploys automatically.

**Live:** [judgement-engine.vercel.app](https://judgement-engine.vercel.app)

---

## Automatic Deploy (Recommended)

The simplest way to get automatic deployments:

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub
2. Click **Add New** → **Project**
3. Select **Import** for `higuseonhye/judgement-engine`
4. Click **Deploy** (no config changes needed)

Vercel will:
- Deploy on every push to `master`
- Create preview deployments for pull requests
- Provide a URL like `judgement-engine.vercel.app`

---

## GitHub Actions Deploy

If you prefer deployment via GitHub Actions:

### 1. Create Vercel project (one-time)

```bash
cd judgement-engine
npx vercel
```

Follow the prompts. This creates `.vercel/project.json` with `orgId` and `projectId`.

### 2. Get your Vercel token

- Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
- Create a new token

### 3. Add GitHub secrets

Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret           | Value                          |
|------------------|--------------------------------|
| `VERCEL_TOKEN`   | Your Vercel token              |
| `VERCEL_ORG_ID`  | From `.vercel/project.json`   |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` |

### 4. Push

Push to `master` — the workflow will deploy automatically.
