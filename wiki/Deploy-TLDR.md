# OpenEco Deployment - TLDR for IT Admins

**Quick deployment guide for production servers. 5 minutes to running.**

---

## Prerequisites

1. **Container runtime installed:**
   - Docker: `docker --version` ✅
   - OR Podman: `podman --version` ✅

2. **PostgreSQL database** (can be containerized or external)

3. **Domain name** (for production) or use IP address

---

## Quick Deploy (Happy Path)

### Step 1: Get the Container Image

**Option A: Pull from registry (recommended)**
```bash
docker pull ghcr.io/open-eco/oe-core:web-latest
# OR
podman pull ghcr.io/open-eco/oe-core:web-latest
```

**Option B: Build from source**
```bash
git clone https://github.com/Open-Eco/oe-core.git
cd oe-core/web
docker build -t openeco-web:latest -f Containerfile .
# OR
podman build -t openeco-web:latest -f Containerfile .
```

### Step 2: Create Environment File

Create `.env` file:

```env
# Database (use your PostgreSQL connection string)
DATABASE_URL=postgresql://user:password@postgres-host:5432/openeco?schema=public

# Auth secret (generate: openssl rand -base64 32)
NEXTAUTH_SECRET=your-32-char-secret-here

# Your domain
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Runtime
NODE_ENV=production
PORT=3000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Run with Docker Compose (Easiest)

```bash
# Use the provided compose file
cd deploy/pterodactyl
docker-compose -f docker-compose.demo.yml up -d

# OR with Podman
podman-compose -f docker-compose.demo.yml up -d
```

### Step 4: Run Database Migrations

```bash
docker-compose -f docker-compose.demo.yml exec web npx prisma generate
docker-compose -f docker-compose.demo.yml exec web npx prisma db push

# OR with Podman
podman-compose -f docker-compose.demo.yml exec web npx prisma generate
podman-compose -f docker-compose.demo.yml exec web npx prisma db push
```

### Step 5: Verify

```bash
# Check logs
docker-compose -f docker-compose.demo.yml logs -f web

# Should see: "Ready on http://localhost:3000"
```

**Access:** `https://your-domain.com` (or `http://your-server-ip:3000`)

---

## Alternative: Standalone Container

If you prefer running without compose:

```bash
# Run PostgreSQL (if not external)
docker run -d \
  --name openeco-postgres \
  -e POSTGRES_DB=openeco \
  -e POSTGRES_USER=openeco \
  -e POSTGRES_PASSWORD=your-password \
  postgres:15-alpine

# Run OpenEco web
docker run -d \
  --name openeco-web \
  --link openeco-postgres:postgres \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://openeco:your-password@postgres:5432/openeco \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXTAUTH_URL=https://your-domain.com \
  -e NEXT_PUBLIC_APP_URL=https://your-domain.com \
  -e NODE_ENV=production \
  ghcr.io/open-eco/oe-core:web-latest

# Run migrations
docker exec openeco-web npx prisma generate
docker exec openeco-web npx prisma db push
```

---

## Production Checklist

- [ ] PostgreSQL database configured
- [ ] `NEXTAUTH_SECRET` generated (32+ characters)
- [ ] Domain/URL configured in environment variables
- [ ] Reverse proxy configured (Nginx/Caddy) for SSL
- [ ] Firewall rules allow port 3000 (or your proxy port)
- [ ] Database migrations run
- [ ] Container health check passing

---

## Reverse Proxy (Nginx Example)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then add SSL:
```bash
certbot --nginx -d your-domain.com
```

---

## Troubleshooting

**Container won't start?**
```bash
docker logs openeco-web
# Check for DATABASE_URL errors
```

**Database connection failed?**
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
- Check PostgreSQL is accessible from container network
- Test connection: `docker exec openeco-web npx prisma db push`

**Migrations failing?**
```bash
# Reset (WARNING: deletes data)
docker exec openeco-web npx prisma migrate reset

# Or check schema
docker exec openeco-web npx prisma validate
```

---

## What You Get

- ✅ Web application on port 3000
- ✅ PostgreSQL database (if using compose)
- ✅ Production-ready container
- ✅ Self-hosted, no external dependencies

---

## Next Steps

1. **Initial Setup:** Visit `https://your-domain.com/setup` to configure
2. **Create Admin User:** First user becomes admin
3. **Configure Auth:** Set up OIDC/SAML if needed (see `AUTHENTICATION.md`)
4. **Import Data:** Start adding organizations and emissions data

---

## Full Documentation

- **Detailed Guide:** `DEPLOYMENT_GUIDE.md`
- **Podman Users:** `PODMAN_GUIDE.md`
- **Authentication:** `AUTHENTICATION.md`
- **Installation:** `INSTALLATION.md`

---

**That's it!** Your OpenEco instance should be running. 🎉
