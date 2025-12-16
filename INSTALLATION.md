# OpenEco Installation Guide

This guide covers all installation scenarios: local development, enterprise self-hosting, and public site deployment.

---

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+ and npm
- Git
- PostgreSQL 14+ (or use containerized Postgres)

### Setup

```bash
# Clone the repository
git clone https://github.com/Open-Eco/oe-core.git
cd oe-core

# Install dependencies
cd web
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

Create `web/.env.local`:

```bash
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/openeco?schema=public"

# Auth (required)
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# App (optional)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="OpenEco"
```

### Local PostgreSQL Options

**Option 1: Containerized (Recommended)**

```bash
# Podman
podman run --name openeco-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=openeco \
  -p 5432:5432 -d postgres:15

# Docker
docker run --name openeco-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=openeco \
  -p 5432:5432 -d postgres:15
```

**Option 2: System PostgreSQL**

```bash
# Create database
createdb openeco
```

---

## Enterprise Self-Hosting

Each enterprise runs **its own isolated deployment** with **its own PostgreSQL database**.

### Deployment Models

| Model | Best For | Complexity |
|-------|----------|------------|
| **Single Host** | Pilots, small teams | Low |
| **Kubernetes/OKD** | Production, HA | Medium |
| **Cloud Marketplace** | AWS/Azure/GCP users | Low |

### Option A: Single Host (Podman/Docker + Compose)

#### Requirements

- Linux server (recommended) or Windows/macOS with container runtime
- Podman or Docker installed
- PostgreSQL 14+ (managed or containerized)

#### Step 1: Provision PostgreSQL

**Managed PostgreSQL (Recommended for Production)**:
- Use your company's managed PostgreSQL (RDS, Cloud SQL, etc.)
- Create database: `openeco`
- Note connection string:
  ```
  postgresql://openeco_user:password@postgres.mycorp.internal:5432/openeco?schema=public
  ```

**Containerized PostgreSQL (Pilots)**:
```bash
podman run --name openeco-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=openeco \
  -p 5432:5432 -d postgres:15
```

#### Step 2: Configure Compose File

Use `deploy/compose.dev.yml` as a starting point:

```yaml
services:
  web:
    image: ghcr.io/open-eco/oe-core:web-latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://openeco_user:password@postgres:5432/openeco?schema=public
      NEXTAUTH_URL: https://climate.yourcompany.com
      NEXTAUTH_SECRET: change-me-to-a-long-random-secret
      NEXT_PUBLIC_APP_URL: https://climate.yourcompany.com
      NEXT_PUBLIC_APP_NAME: OpenEco
```

#### Step 3: Run the Stack

```bash
cd deploy

# Podman Compose
podman-compose -f compose.dev.yml up -d

# Docker Compose
docker-compose -f compose.dev.yml up -d
```

#### Step 4: Run Migrations

```bash
# One-off migration job
podman run --rm \
  --env DATABASE_URL=postgresql://... \
  ghcr.io/open-eco/oe-core:web-latest \
  npx prisma db push
```

Visit `https://climate.yourcompany.com`

### Option B: Kubernetes / OKD / OpenShift

#### Requirements

- Kubernetes/OKD/OpenShift cluster
- `kubectl` or `oc` CLI configured
- Container registry access (GHCR, Quay, ACR, ECR)

#### Step 1: Build and Push Image

```bash
# Build with Buildah
buildah bud -t registry.example.com/openeco/web:latest ./web

# Push
podman push registry.example.com/openeco/web:latest
```

#### Step 2: Create ConfigMap and Secret

Edit `deploy/okd/config-and-secrets.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: openeco-config
data:
  NEXTAUTH_URL: "https://climate.yourcompany.com"
  NEXT_PUBLIC_APP_URL: "https://climate.yourcompany.com"
---
apiVersion: v1
kind: Secret
metadata:
  name: openeco-secrets
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:pass@postgres:5432/openeco"
  NEXTAUTH_SECRET: "your-secret-key"
```

Apply:
```bash
kubectl apply -f deploy/okd/config-and-secrets.yaml
# or
oc apply -f deploy/okd/config-and-secrets.yaml
```

#### Step 3: Deploy Application

```bash
kubectl apply -f deploy/okd/deployment-web.yaml
kubectl apply -f deploy/okd/service-web.yaml
```

#### Step 4: Create Ingress/Route

**Kubernetes Ingress**:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: openeco-web
spec:
  rules:
    - host: climate.yourcompany.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: openeco-web
                port:
                  number: 80
```

**OpenShift Route**:
```yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: openeco-web
spec:
  host: climate.yourcompany.com
  to:
    kind: Service
    name: openeco-web
  tls:
    termination: edge
```

### Per-Enterprise Isolation

For each enterprise:
1. Create separate namespace: `openeco-acme`, `openeco-contoso`
2. Deploy same manifests with different:
   - `DATABASE_URL` (separate Postgres instance/schema)
   - `NEXTAUTH_URL` (their domain)
3. Result: One codebase, many isolated installations

---

## Public Site Deployment

### Demo Site → Vercel

**Platform**: Vercel  
**Domain**: `demo.open-eco.org`

#### Setup

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Set root directory to `web/`

2. **Configure Environment Variables**
   
   In Vercel dashboard → Settings → Environment Variables:
   ```
   DATABASE_URL=your-postgres-connection-string
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://demo.open-eco.org
   NEXT_PUBLIC_APP_URL=https://demo.open-eco.org
   ```

3. **Add Custom Domain**
   - Project Settings → Domains → Add `demo.open-eco.org`
   - Configure DNS CNAME to `cname.vercel-dns.com`

4. **Auto-Deployment**
   - Production: Deploys on push to `main`
   - Preview: Every PR gets a preview URL

### Documentation Site → GitHub Pages

**Platform**: GitHub Pages  
**Domain**: `docs.open-eco.org`

#### Setup

1. **Enable GitHub Pages**
   - Repository Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main`, Folder: `/docs`

2. **Add Custom Domain** (Optional)
   ```bash
   echo "docs.open-eco.org" > docs/CNAME
   ```

3. **Configure DNS**
   ```
   Type: CNAME
   Name: docs
   Value: open-eco.github.io
   ```

4. **Auto-Deployment**
   - Rebuilds on push to `main` (when `docs/` changes)

---

## DNS Configuration Summary

```
# Demo site (Vercel)
Type: CNAME
Name: demo (or @)
Value: cname.vercel-dns.com

# Documentation (GitHub Pages)
Type: CNAME
Name: docs
Value: open-eco.github.io
```

---

## Upgrades and Rollbacks

### Upgrades

1. Build and push new image version (`:v1.1.0`)
2. Update `image:` tag in manifests or compose file
3. Apply: `kubectl apply -f` or `podman-compose up -d`

Kubernetes/OKD performs rolling updates automatically.

### Rollbacks

- Keep older image tags (`:v1.0.0`)
- Change `image:` back to previous tag
- Re-apply manifests

---

## Enterprise Installation Checklist

- [ ] **Choose deployment model**
  - [ ] Single host (Podman/Docker + Compose)
  - [ ] Kubernetes / OKD / OpenShift
- [ ] **Provision PostgreSQL**
  - [ ] Create database and user
  - [ ] Obtain connection string
- [ ] **Configure secrets**
  - [ ] `DATABASE_URL`
  - [ ] `NEXTAUTH_SECRET` (32+ random bytes)
  - [ ] `NEXTAUTH_URL`
  - [ ] `NEXT_PUBLIC_APP_URL`
- [ ] **Deploy containers**
- [ ] **Run Prisma migrations**
- [ ] **Verify**
  - [ ] Sign-up/sign-in works
  - [ ] Dashboard loads
  - [ ] Data persists to correct database

---

## Troubleshooting

### Application Not Loading

- Check container logs: `podman logs openeco-web`
- Verify environment variables are set
- Check database connectivity

### Database Connection Failed

- Verify `DATABASE_URL` format
- Check network connectivity to Postgres
- Ensure database exists and user has permissions

### SSL/HTTPS Issues

- **Vercel**: HTTPS is automatic
- **Kubernetes**: Configure cert-manager or use service mesh
- **Single host**: Use reverse proxy (nginx, traefik) with Let's Encrypt

### DNS Not Resolving

- Check propagation: https://dnschecker.org
- Verify CNAME records are correct
- Wait up to 48 hours for propagation

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [web/ENV_SETUP.md](./web/ENV_SETUP.md) - Environment variable reference
- [OPEN_SOURCE_PLAYBOOK.md](./OPEN_SOURCE_PLAYBOOK.md) - Governance setup

---

**Need help?** Open an issue on [GitHub](https://github.com/Open-Eco/oe-core/issues).
