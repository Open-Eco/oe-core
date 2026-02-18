# OpenEco Vercel Deployment Guide

**Deploy OpenEco to Vercel in 10 minutes for demos, previews, or production.**

---

## Overview

[Vercel](https://vercel.com) provides automatic deployments from GitHub with zero configuration for Next.js applications. This guide covers deploying OpenEco's web application to Vercel for:

- **Demo environments** - Public showcase instances
- **Preview deployments** - Automatic PR previews
- **Production** - Managed hosting for small-medium workloads

**Note:** For enterprise production deployments with high-security requirements, see [INSTALLATION.md](./INSTALLATION.md) for self-hosted options (Kubernetes, Podman, Docker).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Deploy (One-Click)](#quick-deploy-one-click)
3. [Manual Deployment Setup](#manual-deployment-setup)
4. [Environment Variables Configuration](#environment-variables-configuration)
5. [Database Setup](#database-setup)
6. [Custom Domain Configuration](#custom-domain-configuration)
7. [Vercel Configuration Reference](#vercel-configuration-reference)
8. [Troubleshooting](#troubleshooting)
9. [Limitations and Considerations](#limitations-and-considerations)
10. [Related Documentation](#related-documentation)

---

## Prerequisites

Before deploying to Vercel, ensure you have:

1. **GitHub Account** - Repository must be on GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **PostgreSQL Database** - See [Database Setup](#database-setup) below
4. **Domain Name** (Optional) - For production deployments

**Time Estimate:** 10-15 minutes for first deployment

---

## Quick Deploy (One-Click)

The fastest way to deploy OpenEco to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOpen-Eco%2Foe-core&project-name=openeco&repository-name=openeco&root-directory=web&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL&envDescription=Environment%20variables%20required%20for%20OpenEco&envLink=https%3A%2F%2Fgithub.com%2FOpen-Eco%2Foe-core%2Fblob%2Fmain%2FVERCEL_DEPLOYMENT.md%23environment-variables-configuration)

**What happens:**
1. Forks/clones repository to your GitHub account
2. Creates new Vercel project
3. Prompts for environment variables
4. Deploys automatically

**After deployment:**
- Configure environment variables (see [Environment Variables](#environment-variables-configuration))
- Set up PostgreSQL database (see [Database Setup](#database-setup))
- Run database migrations

---

## Manual Deployment Setup

### Step 1: Prepare Your Repository

1. **Fork or clone the repository:**
   ```bash
   git clone https://github.com/Open-Eco/oe-core.git
   cd oe-core
   ```

2. **Push to your GitHub account** (if you forked)

### Step 2: Connect to Vercel

1. **Visit [vercel.com/new](https://vercel.com/new)**
2. **Import your Git repository:**
   - Select your GitHub repository
   - Choose "Open-Eco/oe-core" or your fork

3. **Configure project settings:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `web` ⚠️ **IMPORTANT** - Must be set to `web`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add environment variables** (see next section)

5. **Deploy!**

### Step 3: Environment Variables

Add these required environment variables in Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/openeco` |
| `NEXTAUTH_SECRET` | Auth secret (32+ chars) | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel deployment URL | `https://your-project.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://your-project.vercel.app` |
| `NODE_ENV` | Environment | `production` |

**To add environment variables:**
1. Go to Project Settings > Environment Variables
2. Add each variable with its value
3. Select which environments (Production, Preview, Development)
4. Redeploy after adding variables

---

## Environment Variables Configuration

### Required Variables

#### 1. DATABASE_URL

Your PostgreSQL database connection string.

**Format:**
```
postgresql://username:password@host:port/database?schema=public
```

**Example (Neon.tech):**
```
postgresql://user:pass@ep-cool-darkness-123456.us-east-2.aws.neon.tech/openeco?sslmode=require
```

**Example (Supabase):**
```
postgresql://postgres:your-password@db.projectref.supabase.co:5432/postgres
```

See [Database Setup](#database-setup) for managed PostgreSQL options.

#### 2. NEXTAUTH_SECRET

Secure random string for encrypting auth tokens.

**Generate:**
```bash
openssl rand -base64 32
```

**Example:**
```
A7x9Kp2mN5vB8wQ3rT6yU4jH1gF0sD9zL7cE8bV5nM2xW4pR3
```

**Important:** Keep this secret! Never commit to version control.

#### 3. NEXTAUTH_URL

The full URL where your app is deployed.

**For Vercel:**
```
https://your-project.vercel.app
```

**For custom domain:**
```
https://your-domain.com
```

**Note:** Vercel provides this automatically as `VERCEL_URL`, but NextAuth needs explicit configuration.

#### 4. NEXT_PUBLIC_APP_URL

Public-facing app URL (same as NEXTAUTH_URL for Vercel deployments).

```
https://your-project.vercel.app
```

### Optional Variables

#### Authentication (Keycloak)

If using Keycloak for federated authentication:

| Variable | Description | Example |
|----------|-------------|---------|
| `KEYCLOAK_ISSUER` | Keycloak issuer URL | `https://keycloak.company.com/realms/openeco` |
| `KEYCLOAK_CLIENT_ID` | OAuth client ID | `openeco-web` |
| `KEYCLOAK_CLIENT_SECRET` | OAuth client secret | `your-keycloak-secret` |

See [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed Keycloak setup.

#### Database Connection Pool

For production workloads:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_POOL_MIN` | Min pool connections | `2` |
| `DATABASE_POOL_MAX` | Max pool connections | `10` |
| `DATABASE_POOL_TIMEOUT` | Connection timeout (ms) | `20000` |

---

## Database Setup

OpenEco requires PostgreSQL 14+ for production use. Vercel does not provide built-in PostgreSQL, so you'll need a managed database service.

### Recommended Database Providers

#### Option 1: Neon (Recommended for Vercel)

**Neon** provides serverless PostgreSQL with generous free tier and excellent Vercel integration.

1. **Sign up:** [neon.tech](https://neon.tech)
2. **Create project:** "OpenEco Production"
3. **Create database:** `openeco`
4. **Copy connection string**
5. **Add to Vercel environment variables as `DATABASE_URL`**

**Pricing:**
- Free tier: 0.5 GB storage, serverless compute
- Pro: $19/month, autoscaling, branching

**Vercel Integration:**
- Official Neon integration available in Vercel marketplace
- Automatic connection string injection
- Database branching for preview deployments

#### Option 2: Supabase

**Supabase** provides PostgreSQL with additional features (auth, storage, realtime).

1. **Sign up:** [supabase.com](https://supabase.com)
2. **Create project**
3. **Get connection string:** Settings > Database > Connection String
4. **Add to Vercel as `DATABASE_URL`**

**Pricing:**
- Free tier: 500 MB database, 50k monthly active users
- Pro: $25/month

#### Option 3: Railway

**Railway** provides managed PostgreSQL with simple setup.

1. **Sign up:** [railway.app](https://railway.app)
2. **Create PostgreSQL database**
3. **Copy connection string**
4. **Add to Vercel as `DATABASE_URL`**

**Pricing:**
- Free trial: $5 credit
- Pay-as-you-go: ~$5-20/month typical

#### Option 4: AWS RDS / Azure Database / Google Cloud SQL

For enterprise deployments, use your cloud provider's managed PostgreSQL.

**Setup:**
1. Create PostgreSQL 14+ instance
2. Configure firewall to allow Vercel IP ranges
3. Create database: `openeco`
4. Add connection string to Vercel

See [INSTALLATION.md](./INSTALLATION.md) for detailed enterprise database setup.

### Database Initialization

After connecting your database:

1. **Via Vercel CLI:**
   ```bash
   vercel env pull .env.local
   cd web
   npx prisma generate
   npx prisma db push
   ```

2. **Via Vercel Dashboard:**
   - Go to Project > Settings > Functions
   - Add deployment hook with script:
     ```json
     {
       "buildCommand": "npm run build",
       "installCommand": "npm install && npx prisma generate && npx prisma db push"
     }
     ```

3. **Manual (one-time):**
   - Connect to your database with `psql` or a GUI tool
   - Run migrations from `web/prisma/migrations/` directory

---

## Custom Domain Configuration

### Add Custom Domain to Vercel

1. **Go to Project Settings > Domains**
2. **Add domain:** `demo.open-eco.org` or `your-domain.com`
3. **Configure DNS:**

#### DNS Configuration

**For Vercel subdomain:**
```
Type: CNAME
Name: demo (or www)
Value: cname.vercel-dns.com
```

**For root domain (apex):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Vercel automatically handles:**
- ✅ SSL certificate provisioning (via Let's Encrypt)
- ✅ HTTPS redirect
- ✅ CDN caching
- ✅ Global edge network

### Update Environment Variables

After adding custom domain, update:

```bash
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Then **redeploy** for changes to take effect.

---

## Vercel Configuration Reference

The repository includes a `vercel.json` configuration file that optimizes deployment:

**Important:** This configuration assumes you set the **Root Directory** to `web` in Vercel project settings.

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
        }
      ]
    }
  ],
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### Configuration Explained

| Setting | Purpose |
|---------|---------|
| `buildCommand` | Runs Next.js build (npm install handled by installCommand) |
| `installCommand` | Installs dependencies before build |
| `headers` | Security headers (CSP, frame protection, content type) |
| `functions` | Serverless function configuration |

**Note:** Vercel auto-detects Next.js projects, so framework/regions are optional.

---

## Troubleshooting

### Build Failures

**Error: "Cannot find module 'next'" or "Command failed"**

**Solution:**
Ensure **Root Directory** is set to `web` in Vercel project settings:
1. Go to Project Settings > General
2. Under "Build & Development Settings"
3. Set **Root Directory** to `web`
4. Redeploy

**Error: "Prisma Client not generated"**

**Solution:**
```bash
# Add postinstall script to web/package.json
"postinstall": "prisma generate"
```

Then redeploy.

**Error: "DATABASE_URL is not defined"**

**Solution:**
1. Verify environment variable is set in Vercel project settings
2. Ensure it's enabled for Production environment
3. Redeploy after adding variable

### Database Connection Issues

**Error: "Connection timeout"**

**Causes:**
- Database not accepting connections from Vercel IPs
- Incorrect connection string
- Database server is down

**Solution:**
1. Check firewall rules allow Vercel IP ranges
2. Verify connection string format
3. Test connection with `psql` or database GUI
4. Check database provider status page

**Error: "SSL required"**

**Solution:**
Add `?sslmode=require` to DATABASE_URL:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

### Authentication Issues

**Error: "NextAuth: NEXTAUTH_URL must be defined"**

**Solution:**
Set `NEXTAUTH_URL` to your Vercel deployment URL:
```
NEXTAUTH_URL=https://your-project.vercel.app
```

**Error: "Invalid callback URL"**

**Solution:**
Ensure NEXTAUTH_URL matches your actual deployment URL (including https://)

### Performance Issues

**Slow API responses**

**Solutions:**
1. **Use connection pooling** - Add Prisma Data Proxy or PgBouncer
2. **Increase function memory** - Edit `vercel.json` functions.memory
3. **Enable caching** - Use Vercel Edge Config for read-heavy data
4. **Optimize queries** - Review slow queries in database logs

---

## Limitations and Considerations

### Vercel vs Self-Hosted

| Feature | Vercel | Self-Hosted (Kubernetes) |
|---------|--------|--------------------------|
| Setup Time | 10 minutes | 2-4 hours |
| Scaling | Automatic | Manual configuration |
| SSL/HTTPS | Automatic | Manual (cert-manager) |
| Database | External required | Full control |
| Cost | Free tier + usage | Infrastructure only |
| Data Residency | Multi-region | Full control |
| Enterprise Auth | Limited | Full OIDC/SAML support |

### When to Use Vercel

✅ **Good for:**
- Demo environments
- Proof-of-concept deployments
- Small team pilots
- Preview deployments for PRs
- Development/staging environments

❌ **Consider self-hosting for:**
- Enterprise production with strict data residency requirements
- High-security environments requiring air-gapped deployment
- Large-scale deployments (1000+ users)
- Complex authentication requirements (custom SAML/OIDC)
- Budget-sensitive workloads (self-hosted can be cheaper at scale)

### Vercel-Specific Limitations

1. **Serverless Functions:** 10-second timeout (Pro: 60s)
2. **Build Time:** 45 minutes max
3. **Bundle Size:** 50 MB limit
4. **Memory:** 1024 MB default, 3 GB max (Pro)
5. **Database:** Must use external PostgreSQL

See [Vercel Limits](https://vercel.com/docs/concepts/limits/overview) for details.

---

## Related Documentation

### OpenEco Documentation

- **[README.md](./README.md)** - Project overview and quick start
- **[INSTALLATION.md](./INSTALLATION.md)** - Full installation guide (self-hosted)
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment options
- **[DEPLOY_TLDR.md](./DEPLOY_TLDR.md)** - Quick container deployment (5 minutes)
- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Keycloak and OIDC setup
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design
- **[SECURITY_AND_GOVERNANCE.md](./SECURITY_AND_GOVERNANCE.md)** - Security model
- **[FAQ.md](./FAQ.md)** - Frequently asked questions
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute

### Technical Documentation

- **[PLATFORM_FEATURES.md](./PLATFORM_FEATURES.md)** - Complete feature list
- **[ROADMAP.md](./ROADMAP.md)** - Development roadmap
- **[PRD.md](./PRD.md)** - Product requirements document
- **[UI_UX_WIREFRAME_PLAN.md](./UI_UX_WIREFRAME_PLAN.md)** - UI/UX design specs
- **[Reporting_enginer.md](./Reporting_enginer.md)** - Reporting engine documentation

### Deployment-Specific Guides

- **[PODMAN_GUIDE.md](./PODMAN_GUIDE.md)** - Using Podman instead of Docker
- **[QUICK_START.md](./QUICK_START.md)** - Local development setup
- **[web/ENV_SETUP.md](./web/ENV_SETUP.md)** - Environment variables reference

### External Resources

- **[Vercel Documentation](https://vercel.com/docs)** - Official Vercel docs
- **[Next.js Deployment](https://nextjs.org/docs/deployment)** - Next.js on Vercel
- **[Prisma Vercel Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)** - Database setup
- **[Neon Vercel Integration](https://neon.tech/docs/guides/vercel)** - Serverless PostgreSQL

---

## Support

### Need Help?

- **GitHub Issues:** [github.com/Open-Eco/oe-core/issues](https://github.com/Open-Eco/oe-core/issues)
- **Discussions:** [github.com/Open-Eco/oe-core/discussions](https://github.com/Open-Eco/oe-core/discussions)
- **Documentation:** [open-eco.github.io/oe-core](https://open-eco.github.io/oe-core/)

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute improvements to this guide.

---

## Success Checklist

After deploying to Vercel, verify:

- [ ] Application loads at your Vercel URL
- [ ] Database connection successful
- [ ] Can create user accounts
- [ ] Can log in and access dashboard
- [ ] Environment variables configured correctly
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate issued and valid
- [ ] Database migrations completed
- [ ] Authentication working (local or Keycloak)
- [ ] API endpoints responding correctly

---

**Deployment Time:** 10-15 minutes ⚡  
**Next Steps:** Visit your deployment URL and create your first admin user!

---

*Last Updated: January 2026*  
*Version: 1.0.0*
