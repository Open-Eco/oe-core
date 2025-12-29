# OpenEco Installation Guide

This guide covers all installation scenarios: local development, enterprise self-hosting, and public site deployment.

---

## Table of Contents

1. [Getting Started: Enterprise Deployment](#getting-started-enterprise-deployment) ⭐ **Start here for production deployments**
2. [Target Environments](#target-environments-officially-supported)
3. [Quick Start (Local Development)](#quick-start-local-development)
4. [Enterprise Self-Hosting](#enterprise-self-hosting)
   - [Option A: Single Host (Podman/Docker + Compose)](#option-a-single-host-podmandocker--compose)
   - [Option B: Kubernetes / OKD / OpenShift](#option-b-kubernetes--okd--openshift)
5. [Public Site Deployment](#public-site-deployment)
6. [Upgrades and Rollbacks](#upgrades-and-rollbacks)
7. [Enterprise Installation Checklist](#enterprise-installation-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started: Enterprise Deployment

This section provides a step-by-step guide for companies deploying OpenEco on their own infrastructure.

### Overview

OpenEco is self-hosted software. Each company runs its own isolated deployment with its own PostgreSQL database. You can deploy on:
- **Single Linux server** (simplest, recommended for pilots)
- **Kubernetes/OKD/OpenShift** (production, high availability)
- **Windows Server** (via Linux containers)

**Time estimate:** 2-4 hours for a pilot deployment, 1-2 days for production.

---

### Step-by-Step Deployment Flow

#### Step 1: Choose Your Deployment Model

**Option A: Single Host (Recommended for Pilots)**
- ✅ Simplest setup
- ✅ Best for: Small teams, pilots, proof-of-concept
- ✅ Requirements: Linux server with Podman/Docker
- ⏱️ Setup time: 2-4 hours

**Option B: Kubernetes/OKD/OpenShift (Production)**
- ✅ High availability, scalability
- ✅ Best for: Production, enterprise scale
- ✅ Requirements: Existing K8s cluster
- ⏱️ Setup time: 1-2 days

---

#### Step 2: Provision Infrastructure

**For Single Host Deployment:**

1. **Get a Linux server**
   - Minimum: 2 CPU cores, 4GB RAM, 50GB storage
   - Recommended: 4+ CPU cores, 8GB+ RAM, 100GB+ storage
   - OS: RHEL 8+, Ubuntu 20.04+, Debian 11+, or similar

2. **Install Podman or Docker**
   
   **RHEL/CentOS/Fedora:**
   ```bash
   sudo dnf install podman podman-compose
   ```
   
   **Ubuntu/Debian:**
   ```bash
   sudo apt-get update
   sudo apt-get install podman podman-compose
   # or
   sudo apt-get install docker.io docker-compose
   ```

3. **Verify installation**
   ```bash
   podman --version  # Should show 4.x or higher
   podman-compose --version
   ```

**For Kubernetes Deployment:**
- Ensure you have access to a Kubernetes/OKD/OpenShift cluster
- Configure `kubectl` or `oc` CLI
- Ensure you can pull images from container registries

---

#### Step 3: Set Up PostgreSQL Database

**Option 1: Managed PostgreSQL (Recommended for Production)**

Use your company's managed PostgreSQL service:
- AWS RDS, Azure Database, Google Cloud SQL
- Internal managed PostgreSQL service
- Any PostgreSQL 14+ instance

**Steps:**
1. Create a new database: `openeco`
2. Create a database user with appropriate permissions:
   ```sql
   CREATE USER openeco_user WITH PASSWORD 'your-secure-password';
   GRANT ALL PRIVILEGES ON DATABASE openeco TO openeco_user;
   ```
3. Note your connection string:
   ```
   postgresql://openeco_user:password@postgres.mycorp.internal:5432/openeco?schema=public
   ```

**Option 2: Containerized PostgreSQL (For Pilots)**

If you don't have managed PostgreSQL, run it in a container:

```bash
podman run --name openeco-postgres \
  -e POSTGRES_PASSWORD=your-secure-password \
  -e POSTGRES_DB=openeco \
  -e POSTGRES_USER=openeco_user \
  -p 5432:5432 \
  -v openeco-postgres-data:/var/lib/postgresql/data \
  -d postgres:15
```

**Important:** For production, use managed PostgreSQL with automated backups.

---

#### Step 4: Configure Environment Variables

Create a file to store your configuration. You'll need these variables:

**Required Variables:**

```bash
# Database Connection (REQUIRED)
DATABASE_URL="postgresql://openeco_user:password@host:5432/openeco?schema=public"

# Authentication Secret (REQUIRED)
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-long-random-secret-minimum-32-characters"

# Application URL (REQUIRED)
# The public URL where OpenEco will be accessible
NEXTAUTH_URL="https://climate.yourcompany.com"
NEXT_PUBLIC_APP_URL="https://climate.yourcompany.com"

# Application Name (OPTIONAL)
NEXT_PUBLIC_APP_NAME="OpenEco"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Security Note:** Never commit these values to version control. Use environment variables or secrets management.

---

#### Step 5: Deploy the Application

**For Single Host (Podman/Docker Compose):**

1. **Get the deployment files:**
   ```bash
   git clone https://github.com/Open-Eco/oe-core.git
   cd oe-core/deploy
   ```

2. **Create or edit `compose.prod.yml`:**
   ```yaml
   version: '3.8'
   
   services:
     web:
       image: ghcr.io/open-eco/oe-core:web-latest
       container_name: openeco-web
       ports:
         - "3000:3000"
       environment:
         DATABASE_URL: ${DATABASE_URL}
         NEXTAUTH_URL: ${NEXTAUTH_URL}
         NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
         NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL}
         NEXT_PUBLIC_APP_NAME: ${NEXT_PUBLIC_APP_NAME:-OpenEco}
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
         interval: 30s
         timeout: 10s
         retries: 3
   ```

3. **Create `.env` file in the same directory:**
   ```bash
   # .env
   DATABASE_URL=postgresql://openeco_user:password@postgres:5432/openeco?schema=public
   NEXTAUTH_URL=https://climate.yourcompany.com
   NEXTAUTH_SECRET=your-generated-secret-here
   NEXT_PUBLIC_APP_URL=https://climate.yourcompany.com
   NEXT_PUBLIC_APP_NAME=OpenEco
   ```

4. **Start the application:**
   ```bash
   podman-compose -f compose.prod.yml up -d
   # or
   docker-compose -f compose.prod.yml up -d
   ```

5. **Check logs:**
   ```bash
   podman logs -f openeco-web
   ```

**For Kubernetes/OKD/OpenShift:**

1. **Create secrets:**
   ```bash
   kubectl create namespace openeco
   
   kubectl create secret generic openeco-secrets \
     --namespace=openeco \
     --from-literal=DATABASE_URL="postgresql://user:pass@host:5432/openeco" \
     --from-literal=NEXTAUTH_SECRET="your-secret-here"
   
   kubectl create configmap openeco-config \
     --namespace=openeco \
     --from-literal=NEXTAUTH_URL="https://climate.yourcompany.com" \
     --from-literal=NEXT_PUBLIC_APP_URL="https://climate.yourcompany.com" \
     --from-literal=NEXT_PUBLIC_APP_NAME="OpenEco"
   ```

2. **Deploy using manifests:**
   ```bash
   cd oe-core/deploy/okd
   kubectl apply -f deployment-web.yaml
   kubectl apply -f service-web.yaml
   ```

3. **Create Ingress/Route:**
   ```bash
   # For Kubernetes
   kubectl apply -f ingress.yaml
   
   # For OpenShift
   oc apply -f route.yaml
   ```

---

#### Step 6: Run Database Migrations

The database schema needs to be initialized. Run this one-time migration:

**For Single Host:**
```bash
podman run --rm \
  --env DATABASE_URL="postgresql://openeco_user:password@postgres:5432/openeco?schema=public" \
  ghcr.io/open-eco/oe-core:web-latest \
  npx prisma db push
```

**For Kubernetes:**
```bash
kubectl run openeco-migrate --rm -i --tty \
  --namespace=openeco \
  --image=ghcr.io/open-eco/oe-core:web-latest \
  --env="DATABASE_URL=postgresql://..." \
  -- npx prisma db push
```

**Expected output:**
```
✔ Generated Prisma Client
Your database is now in sync with your Prisma schema.
```

---

#### Step 7: Configure Reverse Proxy & SSL

**Set up NGINX (Recommended):**

1. **Install NGINX:**
   ```bash
   # RHEL/CentOS/Fedora
   sudo dnf install nginx
   
   # Ubuntu/Debian
   sudo apt-get install nginx
   ```

2. **Create configuration file:**
   ```bash
   sudo nano /etc/nginx/sites-available/openeco
   ```

3. **Add configuration:**
   ```nginx
   server {
       listen 80;
       server_name climate.yourcompany.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/openeco /etc/nginx/sites-enabled/
   sudo nginx -t  # Test configuration
   sudo systemctl reload nginx
   ```

5. **Add SSL with Let's Encrypt:**
   ```bash
   sudo dnf install certbot python3-certbot-nginx
   # or
   sudo apt-get install certbot python3-certbot-nginx
   
   sudo certbot --nginx -d climate.yourcompany.com
   ```

**Alternative: Use Traefik or Caddy** (both have automatic SSL)

---

#### Step 8: Configure DNS

Point your domain to your server:

**DNS Records:**
```
Type: A
Name: climate (or @ for root domain)
Value: [Your server's IP address]
TTL: 3600
```

**Or if using a load balancer:**
```
Type: CNAME
Name: climate
Value: [Your load balancer hostname]
TTL: 3600
```

**Verify DNS propagation:**
```bash
dig climate.yourcompany.com
# or
nslookup climate.yourcompany.com
```

---

#### Step 9: Verify Deployment

1. **Visit your URL:**
   ```
   https://climate.yourcompany.com
   ```

2. **Test functionality:**
   - [ ] Homepage loads
   - [ ] Can create an account
   - [ ] Can sign in
   - [ ] Dashboard loads
   - [ ] Can create an organization
   - [ ] Can enter activity data

3. **Check application logs:**
   ```bash
   # Single host
   podman logs -f openeco-web
   
   # Kubernetes
   kubectl logs -f deployment/openeco-web -n openeco
   ```

4. **Check database connectivity:**
   ```bash
   # Verify data is being stored
   psql -h postgres-host -U openeco_user -d openeco -c "SELECT COUNT(*) FROM \"User\";"
   ```

---

#### Step 10: Set Up Monitoring & Backups

**Monitoring:**
- Set up health checks on `/api/health` endpoint
- Monitor container/pod status
- Set up alerts for disk space, memory, CPU

**Backups:**
- **PostgreSQL:** Set up automated daily backups
  ```bash
  # Example cron job for PostgreSQL backup
  0 2 * * * pg_dump -h postgres-host -U openeco_user openeco > /backups/openeco-$(date +\%Y\%m\%d).sql
  ```
- **Evidence files:** If using S3-compatible storage, enable versioning
- **Retention:** Keep backups for at least 30 days

---

### Deployment Checklist

Use this checklist to ensure you've completed all steps:

- [ ] **Infrastructure**
  - [ ] Server provisioned (or K8s cluster access)
  - [ ] Podman/Docker installed (or K8s CLI configured)
  - [ ] PostgreSQL database created and accessible

- [ ] **Configuration**
  - [ ] Environment variables configured
  - [ ] `NEXTAUTH_SECRET` generated (32+ characters)
  - [ ] `DATABASE_URL` tested and working
  - [ ] `NEXTAUTH_URL` matches your domain

- [ ] **Deployment**
  - [ ] Application containers running
  - [ ] Database migrations completed successfully
  - [ ] Reverse proxy configured (NGINX/Traefik)
  - [ ] SSL certificate installed

- [ ] **Network**
  - [ ] DNS records configured
  - [ ] Firewall rules allow traffic (ports 80, 443)
  - [ ] Domain resolves correctly

- [ ] **Verification**
  - [ ] Application accessible via HTTPS
  - [ ] Sign-up/sign-in works
  - [ ] Data persists to database
  - [ ] Logs show no errors

- [ ] **Operations**
  - [ ] Monitoring configured
  - [ ] Backups scheduled
  - [ ] Team has access credentials

---

### Troubleshooting

**Application won't start:**
- Check container logs: `podman logs openeco-web`
- Verify environment variables are set correctly
- Check database connectivity: `psql $DATABASE_URL -c "SELECT 1;"`

**Database connection errors:**
- Verify `DATABASE_URL` format is correct
- Check network connectivity to PostgreSQL
- Ensure database user has proper permissions
- Check firewall rules

**SSL/HTTPS issues:**
- Verify DNS is pointing to your server
- Check NGINX configuration: `sudo nginx -t`
- Ensure port 443 is open: `sudo firewall-cmd --list-ports`
- Check certificate: `sudo certbot certificates`

**502 Bad Gateway:**
- Verify application is running: `podman ps` or `kubectl get pods`
- Check application logs for errors
- Verify reverse proxy is pointing to correct port (3000)

---

### Next Steps

After deployment:

1. **Create your first organization** in OpenEco
2. **Invite team members** to your organization
3. **Configure emission factors** (see Factor Library documentation)
4. **Start entering activity data**
5. **Set up reporting periods**

For more details, see:
- [Full Installation Guide](#enterprise-self-hosting) (below)
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [SECURITY_AND_GOVERNANCE.md](./SECURITY_AND_GOVERNANCE.md) - Security best practices

---

## Target Environments (Officially Supported)

OpenEco is designed to be deployed in the following environments. All of them use the **same OCI image** for the web application; only the runtime and infrastructure differ.

| Environment | Recommended Pattern | Notes |
|------------|---------------------|-------|
| **Linux Server** | Podman/Docker + Compose (single host) | Primary, simplest path for pilots and production. See [Option A: Single Host](#option-a-single-host-podmandocker--compose). |
| **Windows Server** | Run Linux containers via WSL2 or a small Linux VM | Windows Server hosts a Linux VM/WSL2 instance that runs the same Podman/Docker + Compose stack as Linux. IIS/NGINX on Windows can reverse proxy to the Linux VM if desired. |
| **Kubernetes / OKD / OpenShift** | Native K8s/OKD deployment | Use the manifests in `deploy/okd/` with the same web image. See [Option B: Kubernetes / OKD / OpenShift](#option-b-kubernetes--okd--openshift). |

**Key idea:**

- **One application image**, many deployment options.
- Enterprise customers can choose the runtime that best fits their infra (Linux server, Windows server with Linux containers, or OKD/OpenShift), without any changes to application code.

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
   echo "docs.open-eco.org" > docs/CREDENTIALS
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
