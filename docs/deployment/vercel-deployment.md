# Vercel Deployment Guide

Deploy OpenEco to Vercel for demos, previews, or small-scale production deployments.

---

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOpen-Eco%2Foe-core&project-name=openeco&repository-name=openeco&root-directory=web&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL)

**Time:** ~10 minutes

---

## Prerequisites

- GitHub account
- Vercel account ([sign up free](https://vercel.com))
- PostgreSQL database (see [Database Options](#database-options))

---

## Step-by-Step Deployment

### 1. Import Repository

1. Visit [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `Open-Eco/oe-core`
3. Configure:
   - **Root Directory:** `web`
   - **Framework:** Next.js (auto-detected)

### 2. Configure Environment Variables

Add these in Vercel project settings:

| Variable | Value | How to Get |
|----------|-------|------------|
| `DATABASE_URL` | PostgreSQL connection string | See [Database Options](#database-options) |
| `NEXTAUTH_SECRET` | Random 32+ char string | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL | `https://your-project.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Same as NEXTAUTH_URL | `https://your-project.vercel.app` |

### 3. Deploy

Click **Deploy** and wait ~2-5 minutes.

### 4. Initialize Database

After first deploy:

```bash
# Clone repo locally
git clone https://github.com/Open-Eco/oe-core.git
cd oe-core/web

# Pull Vercel environment variables
vercel env pull .env.local

# Run migrations
npx prisma generate
npx prisma db push
```

---

## Database Options

### Recommended: Neon (Serverless PostgreSQL)

**Best for Vercel deployments**

1. Sign up: [neon.tech](https://neon.tech)
2. Create project and database
3. Copy connection string
4. Add to Vercel as `DATABASE_URL`

**Free tier:** 0.5 GB storage, perfect for demos

### Alternative: Supabase

1. Sign up: [supabase.com](https://supabase.com)
2. Create project
3. Get connection string: Settings > Database
4. Add to Vercel as `DATABASE_URL`

**Free tier:** 500 MB database

### Alternative: Railway

1. Sign up: [railway.app](https://railway.app)
2. Create PostgreSQL service
3. Copy connection string
4. Add to Vercel as `DATABASE_URL`

---

## Custom Domain

### Add Domain in Vercel

1. Project Settings > Domains
2. Add your domain: `demo.open-eco.org`
3. Configure DNS:

```
Type: CNAME
Name: demo
Value: cname.vercel-dns.com
```

### Update Environment Variables

After adding domain:

```
NEXTAUTH_URL=https://demo.open-eco.org
NEXT_PUBLIC_APP_URL=https://demo.open-eco.org
```

Then redeploy.

---

## Troubleshooting

### 404 Not Found Error

A `404 Not Found` response after deployment is one of the most common issues with OpenEco on Vercel.

#### Common Causes

1. **Root Directory not set to `web`** — OpenEco's Next.js app lives in `web/`. If Vercel builds from the repository root it cannot locate the application, causing all routes to return 404.
2. **Incorrect or missing `vercel.json`** — Invalid `rewrites`, `redirects`, or `routes` entries can send requests to paths that do not exist.
3. **Build output directory mismatch** — Setting `outputDirectory` to anything other than `.next` (the Next.js default) prevents Vercel from serving the compiled app.
4. **Build did not complete successfully** — A failed build leaves no deployable output, so all routes return 404.
5. **Next.js page not found** — The requested path simply does not exist in the Next.js app (mistyped URL, removed route, etc.).

#### Step-by-Step Debugging

**Step 1: Check the Root Directory setting**

1. Go to **Project Settings > General** in your Vercel project
2. Under **Build & Development Settings**, confirm **Root Directory** is `web`
3. If blank or set to `.`, change it to `web` and redeploy

**Step 2: Verify `vercel.json`**

The repository-level `vercel.json` should look like this (no `outputDirectory` or `framework` overrides needed):

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**Step 3: Review build logs**

1. Open the Vercel project dashboard and select the affected deployment
2. Click **View Build Logs** and scroll to the end
3. A successful build ends with `✓ Compiled successfully` and a route listing
4. Any errors or a missing `.next` output indicate a build failure

**Step 4: Confirm the build output locally**

```bash
cd web
npm install
npm run build
ls -la .next/   # Should list: cache/, server/, static/, BUILD_ID, etc.
```

**Step 5: Test a known route**

Visit `https://your-project.vercel.app/` and `https://your-project.vercel.app/api/health`. If only specific routes return 404, the issue is in Next.js routing rather than Vercel configuration.

#### Repository-Specific Example

| Setting | Correct Value |
|---------|---------------|
| Root Directory | `web` |
| Framework Preset | Next.js (auto-detected) |
| Build Command | `npm run build` |
| Output Directory | `.next` (auto-detected) |
| Install Command | `npm install` |

An empty Root Directory causes Vercel to look for `next.config.js` in the repository root (where it does not exist), producing a build error or 404 on all routes.

#### Further Reading

- [Vercel – Error: 404 Not Found (official docs)](https://vercel.com/docs/errors/not-found)
- [Vercel – Monorepo support and Root Directory](https://vercel.com/docs/monorepos/overview)
- [Next.js – Custom 404 page](https://nextjs.org/docs/pages/building-your-application/routing/custom-error#404-page)
- [Vercel Community Discussions](https://github.com/orgs/vercel/discussions)

---

### Build Fails: "Prisma Client not generated"

**Solution:** Ensure `web/package.json` has:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Connection Failed

**Check:**
- Environment variable `DATABASE_URL` is set
- Connection string includes `?sslmode=require` for managed databases
- Database allows connections from Vercel IP ranges

### Authentication Not Working

**Check:**
- `NEXTAUTH_URL` matches your actual deployment URL
- `NEXTAUTH_SECRET` is set (32+ characters)
- URL includes `https://` prefix

---

## Configuration Files

### vercel.json

Located in repository root. Key settings:

```json
{
  "framework": "nextjs",
  "buildCommand": "cd web && npm install && npm run build",
  "outputDirectory": "web/.next",
  "regions": ["iad1"]
}
```

### Security Headers

**Automatically applied:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval';`

---

## Vercel vs Self-Hosted

| Feature | Vercel | Self-Hosted |
|---------|--------|-------------|
| Setup Time | 10 min | 2-4 hours |
| SSL/HTTPS | Automatic | Manual |
| Scaling | Automatic | Manual |
| Database | External | Included |
| Best For | Demos, small teams | Enterprise, production |

**When to self-host:**
- Data residency requirements
- Air-gapped deployments
- 1000+ concurrent users
- Complex authentication (SAML/OIDC)

See [INSTALLATION.md](./installation.md) for self-hosted deployment.

---

## Related Documentation

### Deployment Guides
- **[Installation Guide](./installation.md)** - Self-hosted deployment
- **[Quick Deploy](./quick-deploy.md)** - Container deployment (5 min)
- **[Deployment Guide](./deployment-guide.md)** - Comprehensive options
- **[Podman Guide](./podman-guide.md)** - Using Podman

### Configuration
- **[Environment Setup](./env-setup.md)** - All environment variables
- **[Quick Start](./quick-start.md)** - Local development

### Resources
- **[Architecture](../resources/architecture.md)** - System design
- **[Security & Governance](../compliance/security-governance.md)** - Security model
- **[FAQ](../resources/faq.md)** - Common questions

### External Links
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Neon + Vercel Integration](https://neon.tech/docs/guides/vercel)

---

## Full Documentation

For complete Vercel deployment documentation with advanced configuration, see:

**[VERCEL_DEPLOYMENT.md](../../VERCEL_DEPLOYMENT.md)** in the repository root

---

**Estimated Time:** 10-15 minutes  
**Difficulty:** Easy  
**Best For:** Demos, previews, small teams

---

*Part of the [OpenEco Documentation](../README.md)*
