# Vercel Deployment Configuration

⚠️ **IMPORTANT: This repository requires special configuration for Vercel deployment**

## Quick Setup

This repository uses a **monorepo structure** with the Next.js application located in the `web/` subdirectory, not the root.

### Required Configuration in Vercel Dashboard:

When setting up your Vercel project, you **MUST** configure the Root Directory:

1. Go to your **Vercel Project Settings**
2. Navigate to: **Settings → General → Build & Development Settings**
3. Set **Root Directory** to: `web`
4. Click **Save**
5. **Redeploy** your project

### Why This Is Required

Without setting the Root Directory to `web`:
- ❌ Vercel will look for `package.json` in the repository root
- ❌ Build will fail with "Cannot find module 'next'" error
- ❌ Deployment will fail

With the correct Root Directory setting:
- ✅ Vercel finds the Next.js application in `web/`
- ✅ Build commands run in the correct directory
- ✅ Deployment succeeds

## One-Click Deploy

Use this button which includes the correct root directory configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOpen-Eco%2Foe-core&project-name=openeco&repository-name=openeco&root-directory=web&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL&envDescription=Environment%20variables%20required%20for%20OpenEco&envLink=https%3A%2F%2Fgithub.com%2FOpen-Eco%2Foe-core%2Fblob%2Fmain%2FVERCEL_DEPLOYMENT.md%23environment-variables-configuration)

## Troubleshooting

### "Cannot find module 'next'" Error

This error means the Root Directory is not set to `web`. Follow the steps above to configure it.

### Build Still Failing?

1. Verify Root Directory is set to `web` (not `./web` or `/web`, just `web`)
2. Check that environment variables are configured (see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md))
3. Ensure DATABASE_URL is set and valid
4. Try redeploying after configuration changes

## Full Documentation

For complete deployment instructions, environment variables, database setup, and advanced configuration, see:

📖 **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)**

## Alternative: Manual vercel.json Configuration

If you prefer to keep the root directory at the repository root, you would need to modify the build commands in `vercel.json` to change directory to `web/` before running npm commands. However, the recommended approach is to use the Root Directory setting in Vercel dashboard as documented above.

## Repository Structure

```
oe-core/
├── web/                    ← Next.js application (Root Directory should point here)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── prisma/
│   ├── package.json        ← Application dependencies
│   ├── next.config.ts
│   └── vercel.json        ← Build configuration
├── docs/
├── deploy/
├── wiki/
└── README.md
```
