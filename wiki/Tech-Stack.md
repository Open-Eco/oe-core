# Monorepo 

This document describes the monorepo structure and deployment architecture for the OpenEco Project: Open Climate Transparency Platform.

## Repository Structure

```
open-eco/
├── web/                    # Next.js application
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   └── public/            # Static assets
│
├── docs/                   # Documentation site (EcoKit design system)
│   ├── index.html         # Homepage
│   ├── components.html    # Component library
│   ├── tokens.html        # Design tokens
│   ├── assets.html        # Brand assets
│   ├── guidelines.html    # Usage guidelines
│   └── styles.css         # Documentation styles
│
└── [root docs]/            # Project documentation
    ├── README.md
    ├── Arc Plan.md
    ├── VISION.md
    ├── GETTING_STARTED.md
    └── ...
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         open-eco.org                     │
│         (Vercel)                         │
│         web/ directory                   │
│         Next.js Application              │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      docs.open-eco.org                   │
│      (GitHub Pages)                      │
│      docs/ directory                     │
│      Static Documentation Site           │
└─────────────────────────────────────────┘
```

## Directory Purposes

### `web/` - Main Application

**Purpose**: User-facing Next.js application for the climate transparency platform

**Contents**:
- Next.js 14+ with App Router
- Authentication (Supabase)
- Dashboards and data entry
- Reports and analytics
- Public emissions dataset pages

**Deployment**:
- **Platform**: Vercel
- **Domain**: `open-eco.org`
- **Root Directory**: Set to `web/` in Vercel project settings
- **Auto-deploy**: On push to `main` branch
- **Preview**: PR previews automatically

**Tech Stack**:
- Next.js 16+ (App Router)
- TypeScript
- Supabase (Auth, Database, Storage)
- Vanilla CSS (custom design system)

### `docs/` - Documentation Site (EcoKit)

**Purpose**: Design system documentation (like MUI.com)

**Contents**:
- EcoKit design system documentation
- Component library
- Design tokens (colors, typography, spacing)
- Brand assets documentation
- Usage guidelines

**Deployment**:
- **Platform**: GitHub Pages
- **Source**: `main` branch, `/docs` folder
- **Auto-deploy**: On push to `main` (if files in `docs/` change)

**Tech Stack**:
- HTML/CSS/JS (static site)
- No build step required
- Simple, fast, and maintainable

## Deployment Flow

### Web Application (`web/`)

1. **Development**:
   ```bash
   cd web
   npm run dev
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   - Push to `main` branch
   - Vercel automatically detects changes in `web/`
   - Builds and deploys to `open-eco.org`
   - HTTPS automatically configured

### Documentation Site (`docs/`)

1. **Development**:
   - Open HTML files directly in browser
   - Or use a local server:
   ```bash
   cd docs
   python -m http.server 8000
   # Or: npx serve .
   ```

2. **Deploy**:
   - Push to `main` branch
   - GitHub Pages automatically serves from `docs/` folder
   - No build step required (static HTML/CSS/JS)
   - HTTPS automatically configured

## DNS Configuration

At your domain registrar (e.g., Cloudflare):

```
# Main site (Vercel)
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com

# Documentation (GitHub Pages) - Optional
# If using custom domain, add CNAME record
# Otherwise uses default GitHub Pages URL
```

## Environment Variables

### Web Application (Vercel)

Set in Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://open-eco.org
```

### Documentation Site

No environment variables needed (static site).

## Benefits of This Structure

### ✅ Monorepo Advantages

- **Single Repository**: Easier to manage, one place for all code
- **Consistent Versioning**: All code in sync
- **Simpler CI/CD**: One repository, unified workflows

### ✅ Separation of Concerns

- **Web App**: Focused on user-facing application
- **Docs**: Focused on design system documentation (EcoKit)

### ✅ Deployment Flexibility

- **Vercel**: Perfect for Next.js with server-side features
- **GitHub Pages**: Perfect for static documentation
- **Different Domains**: Clear separation (`open-eco.org` vs `docs.open-eco.org`)

### ✅ Developer Experience

- **Clear Structure**: Easy to navigate
- **Local Development**: Both sites can run locally
- **Documentation**: Always up-to-date with code

## Future Considerations

### Potential Additions

- `packages/` - Shared TypeScript packages (if needed)
- `apps/` - Additional applications (admin panel, etc.)
- `tools/` - Build tools and scripts

### Scaling

- If `web/` grows large, consider splitting into:
  - `apps/web/` - Main application
  - `apps/admin/` - Admin panel
  - `packages/ui/` - Shared UI components
  - `packages/calculator/` - Calculation engine

For now, the current structure is optimal for a solo/small team.

---

**See Also**:
- [README.md](./README.md) - Monorepo overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup instructions

