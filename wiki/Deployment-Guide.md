# OpenEco Deployment Guide

This guide covers two main tasks:
1. **Setting up Pterodactyl for container deployment testing**
2. **Building the UI based on the mockups**

---

## Part 1: Pterodactyl Setup for Container Deployment Testing

### Option A: Quick Test with Docker Compose (Recommended for Testing)

This is the fastest way to test if your container works without setting up a full Pterodactyl instance.

#### Step 1: Build the Container Image

**Using Docker:**
```powershell
# Navigate to the web directory
cd web

# Build the container image
docker build -t openeco-web:local -f Containerfile .
```

**Using Podman (Docker-compatible alternative):**
```powershell
# Navigate to the web directory
cd web

# Build the container image (same command!)
podman build -t openeco-web:local -f Containerfile .
```

> **Note:** Podman is a Docker-compatible container runtime. Most Docker commands work with Podman by simply replacing `docker` with `podman`. Docker Desktop is free for personal use, but Podman is fully open-source and doesn't require a daemon.

#### Step 2: Set Up Environment Variables

Create a `.env` file in `deploy/pterodactyl/`:

```powershell
# Create the .env file
cd ..\deploy\pterodactyl
New-Item -ItemType File -Path .env -Force
```

Edit `.env` with these values:

```env
# PostgreSQL password (change this!)
POSTGRES_PASSWORD=your_secure_password_here

# Web application port
WEB_PORT=3000

# Docker image (use local build)
WEB_IMAGE=openeco-web:local

# Domain (for local testing, use localhost)
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Generate a secure secret (run this in PowerShell):
# [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
NEXTAUTH_SECRET=your_generated_secret_here_min_32_chars
```

**Generate NEXTAUTH_SECRET:**
```powershell
# Run this in PowerShell to generate a secure secret:
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

#### Step 3: Start the Containers

**Using Docker Compose:**
```powershell
# Make sure you're in deploy/pterodactyl directory
cd deploy\pterodactyl

# Start the containers
docker-compose -f docker-compose.demo.yml up -d

# Check if containers are running
docker-compose -f docker-compose.demo.yml ps
```

**Using Podman Compose:**
```powershell
# Make sure you're in deploy/pterodactyl directory
cd deploy\pterodactyl

# Start the containers (Podman Compose is compatible)
podman-compose -f docker-compose.demo.yml up -d

# Or use podman play kube (if you convert compose to kube)
# Check if containers are running
podman-compose -f docker-compose.demo.yml ps
```

> **Note:** Podman Compose works the same way. If you don't have `podman-compose`, you can install it or use `podman play kube` with a converted Kubernetes YAML.

#### Step 4: Run Database Migrations

**Using Docker Compose:**
```powershell
# Wait a few seconds for containers to start, then run migrations
docker-compose -f docker-compose.demo.yml exec web npx prisma generate
docker-compose -f docker-compose.demo.yml exec web npx prisma db push
```

**Using Podman Compose:**
```powershell
# Wait a few seconds for containers to start, then run migrations
podman-compose -f docker-compose.demo.yml exec web npx prisma generate
podman-compose -f docker-compose.demo.yml exec web npx prisma db push
```

#### Step 5: Verify the Deployment

1. **Check logs:**
   ```powershell
   docker-compose -f docker-compose.demo.yml logs -f web
   ```
   Look for: `Ready on http://localhost:3000`

2. **Open in browser:**
   Navigate to `http://localhost:3000`

3. **Check health:**
   ```powershell
   # Test the health endpoint
   curl http://localhost:3000/api/health
   ```

#### Step 6: Stop the Containers (when done testing)

```powershell
docker-compose -f docker-compose.demo.yml down
```

---

### Option B: Full Pterodactyl Installation

If you want to use the actual Pterodactyl panel for management:

#### Prerequisites

- Ubuntu 20.04+ / Debian 11+ / Windows with WSL2
- 2GB+ RAM (4GB+ recommended)
- Docker installed
- Domain name (for SSL) or use localhost for testing

#### Installation Steps

1. **Install Docker or Podman** (if not installed):
   
   **Docker (Free for personal use):**
   ```powershell
   # On Windows, install Docker Desktop from docker.com
   # On Linux:
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```
   
   **Podman (Fully open-source, no daemon required):**
   ```powershell
   # On Linux (most distributions):
   # Fedora/RHEL/CentOS:
   sudo dnf install podman podman-compose
   
   # Ubuntu/Debian:
   sudo apt-get install podman podman-compose
   
   # On macOS:
   brew install podman
   
   # On Windows (WSL2 recommended):
   # Install via WSL2, then use podman commands
   ```
   
   > **Docker vs Podman:** Docker Desktop is free for personal use. Podman is fully open-source, doesn't require a daemon, and is rootless by default. Both work with the same commands (just replace `docker` with `podman`).

2. **Install Pterodactyl Panel**:
   - Follow: https://pterodactyl.io/panel/1.0/getting_started.html
   - Requires: PHP 8.1+, MySQL/MariaDB, Redis, Nginx/Apache

3. **Install Pterodactyl Wings**:
   - Follow: https://pterodactyl.io/wings/1.0/installing.html

4. **Create Server in Pterodactyl**:
   - Log into Pterodactyl Panel
   - Navigate to **Servers** → **Create New**
   - Use these settings:
     - **Name**: `OpenEco Demo`
     - **Docker Image**: `openeco-web:local` (or your built image)
     - **Startup Command**: `npm run start`
     - **Port**: `3000`

5. **Configure Environment Variables** in Pterodactyl:
   ```
   DATABASE_URL=postgresql://openeco_demo:password@postgres:5432/openeco_demo
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=https://your-domain.com
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   NODE_ENV=production
   PORT=3000
   ```

6. **Run Migrations**:
   - Open server console in Pterodactyl
   - Run: `npx prisma generate && npx prisma db push`

---

## Part 2: Building the UI Based on Mockups

### Overview

The mockups show these main screens:
1. **Dashboard** - Overview with charts, summary cards, and top emitters table
2. **Analyze** - Export options and data analysis
3. **Audit & Data Lineage** - Data tracking and audit trail
4. **Roles & Permissions** - User management

### Step 1: Integrate EcoKit Design System

The EcoKit design system is already in `docs/assets/EcoKit/`. We need to copy it to the web app.

#### Copy EcoKit to Web App

```powershell
# Create assets directory in web app
New-Item -ItemType Directory -Path "web\public\assets\EcoKit" -Force

# Copy EcoKit files (adjust paths as needed)
Copy-Item -Path "docs\assets\EcoKit\*" -Destination "web\public\assets\EcoKit\" -Recurse
```

#### Import EcoKit in globals.css

Add to `web/app/globals.css`:

```css
/* Import EcoKit Design System */
@import url('/assets/EcoKit/ecokit.css');
```

### Step 2: Build Core Layout Components

Based on the mockups, we need:

1. **Top Navigation Bar** - Logo, main nav links, search, notifications, user menu
2. **Left Sidebar** - Vertical navigation with icons
3. **Main Content Area** - Dynamic content based on route

### Step 3: Build Dashboard Components

1. **Summary Cards** - Total Emissions, Scope 1, etc.
2. **Charts** - Pie chart (emissions by category), Bar chart (emissions over time)
3. **Data Table** - Top emitters with sorting/filtering
4. **Filter Bar** - Year, Location, Scope, Unit selectors

### Step 4: Build Other Pages

- Analyze page with export cards
- Audit & Data Lineage page with data table
- Roles & Permissions page with user table and role panel

---

## Quick Start Commands

### Test Container Deployment

**Using Docker:**
```powershell
# 1. Build container
cd web
docker build -t openeco-web:local -f Containerfile .

# 2. Set up environment
cd ..\deploy\pterodactyl
# Edit .env file with your values

# 3. Start containers
docker-compose -f docker-compose.demo.yml up -d

# 4. Run migrations
docker-compose -f docker-compose.demo.yml exec web npx prisma generate
docker-compose -f docker-compose.demo.yml exec web npx prisma db push

# 5. View logs
docker-compose -f docker-compose.demo.yml logs -f web

# 6. Access at http://localhost:3000
```

**Using Podman (replace `docker` with `podman`):**
```powershell
# 1. Build container
cd web
podman build -t openeco-web:local -f Containerfile .

# 2. Set up environment
cd ..\deploy\pterodactyl
# Edit .env file with your values

# 3. Start containers
podman-compose -f docker-compose.demo.yml up -d

# 4. Run migrations
podman-compose -f docker-compose.demo.yml exec web npx prisma generate
podman-compose -f docker-compose.demo.yml exec web npx prisma db push

# 5. View logs
podman-compose -f docker-compose.demo.yml logs -f web

# 6. Access at http://localhost:3000
```

### Build UI Components

```powershell
# 1. Copy EcoKit to web app
Copy-Item -Path "docs\assets\EcoKit\*" -Destination "web\public\assets\EcoKit\" -Recurse

# 2. Install dependencies (if needed)
cd web
npm install

# 3. Run dev server
npm run dev

# 4. Access at http://localhost:3000
```

---

## Troubleshooting

### Container Won't Start

1. **Check logs:**
   ```powershell
   docker-compose -f docker-compose.demo.yml logs web
   ```

2. **Verify environment variables:**
   - Ensure `NEXTAUTH_SECRET` is at least 32 characters
   - Check `DATABASE_URL` is correct
   - Verify PostgreSQL container is running

3. **Check database connection:**
   ```powershell
   docker-compose -f docker-compose.demo.yml exec postgres psql -U openeco_demo -d openeco_demo
   ```

### UI Not Loading

1. **Check EcoKit files are copied:**
   ```powershell
   Test-Path "web\public\assets\EcoKit\ecokit.css"
   ```

2. **Check browser console** for errors

3. **Verify CSS imports** in `globals.css`

### Database Migration Errors

1. **Reset database** (WARNING: deletes all data):
   ```powershell
   docker-compose -f docker-compose.demo.yml exec web npx prisma migrate reset
   ```

2. **Check Prisma schema:**
   ```powershell
   docker-compose -f docker-compose.demo.yml exec web npx prisma validate
   ```

---

## Next Steps

After successful deployment:

1. ✅ Verify container runs and responds to requests
2. ✅ Test database connections
3. ✅ Build UI components based on mockups
4. ✅ Test UI in browser
5. ✅ Deploy to production environment

---

## Resources

- [Pterodactyl Documentation](https://pterodactyl.io)
- [Docker Documentation](https://docs.docker.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [EcoKit Design System](../docs/assets/EcoKit/README.md)
