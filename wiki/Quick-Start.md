# Quick Start Guide

This guide will help you:
1. **Test container deployment** (without full Pterodactyl setup)
2. **View the new UI** based on mockups

---

## Part 1: Test Container Deployment

### Step 1: Build the Container

**Using Docker:**
```powershell
# Navigate to web directory
cd web

# Build the container image
docker build -t openeco-web:local -f Containerfile .
```

**Using Podman (Docker-compatible):**
```powershell
# Navigate to web directory
cd web

# Build the container image (same command, just use podman)
podman build -t openeco-web:local -f Containerfile .
```

> **Note:** Docker is free for personal use. Podman is fully open-source and works the same way - just replace `docker` with `podman` in all commands.

### Step 2: Create Environment File

```powershell
# Go to pterodactyl deploy directory
cd ..\deploy\pterodactyl

# Create .env file (or edit existing)
```

Add this content to `deploy/pterodactyl/.env`:

```env
POSTGRES_PASSWORD=your_secure_password_here
WEB_PORT=3000
WEB_IMAGE=openeco-web:local
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Generate secret with this PowerShell command:
# $bytes = New-Object byte[] 32; [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes); [Convert]::ToBase64String($bytes)
NEXTAUTH_SECRET=your_generated_secret_here
```

**Generate NEXTAUTH_SECRET:**
```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

### Step 3: Start Containers

**Using Docker Compose:**
```powershell
# Make sure you're in deploy/pterodactyl
docker-compose -f docker-compose.demo.yml up -d

# Check status
docker-compose -f docker-compose.demo.yml ps
```

**Using Podman Compose:**
```powershell
# Make sure you're in deploy/pterodactyl
podman-compose -f docker-compose.demo.yml up -d

# Check status
podman-compose -f docker-compose.demo.yml ps
```

### Step 4: Run Database Migrations

**Using Docker Compose:**
```powershell
# Wait a few seconds, then run:
docker-compose -f docker-compose.demo.yml exec web npx prisma generate
docker-compose -f docker-compose.demo.yml exec web npx prisma db push
```

**Using Podman Compose:**
```powershell
# Wait a few seconds, then run:
podman-compose -f docker-compose.demo.yml exec web npx prisma generate
podman-compose -f docker-compose.demo.yml exec web npx prisma db push
```

### Step 5: View Logs

**Using Docker Compose:**
```powershell
docker-compose -f docker-compose.demo.yml logs -f web
```

**Using Podman Compose:**
```powershell
podman-compose -f docker-compose.demo.yml logs -f web
```

Look for: `Ready on http://localhost:3000`

### Step 6: Access the App

Open your browser to: **http://localhost:3000**

### Step 7: Stop Containers (when done)

**Using Docker Compose:**
```powershell
docker-compose -f docker-compose.demo.yml down
```

**Using Podman Compose:**
```powershell
podman-compose -f docker-compose.demo.yml down
```

---

## Part 2: View the New UI

### Step 1: Install Dependencies (if needed)

```powershell
cd web
npm install
```

### Step 2: Run Development Server

```powershell
npm run dev
```

### Step 3: Access the App

Open your browser to: **http://localhost:3000**

You should see:
- **Top Navigation Bar** with logo, main nav links, search, notifications, user avatar
- **Left Sidebar** with vertical navigation
- **Main Content Area** with your pages

### Step 4: Navigate to Dashboard

Go to: **http://localhost:3000/dashboard**

You'll see the new layout with:
- Top nav bar matching the mockups
- Sidebar navigation
- Dashboard content area

---

## What's Been Implemented

### ✅ Completed

1. **EcoKit Design System Integration**
   - Copied EcoKit assets to `web/public/assets/EcoKit/`
   - Imported in `globals.css`

2. **Navigation Components**
   - `TopNav` component with logo, main nav, search, notifications, user menu
   - `Sidebar` component with vertical navigation
   - Updated app layout to use new navigation

3. **Layout Structure**
   - New app layout matching mockup structure
   - Responsive design
   - Active state indicators

### 🚧 Next Steps

1. **Dashboard Page** - Build summary cards, charts, and data tables
2. **Data Tables** - Build emissions data tables with sorting/filtering
3. **Charts** - Add pie charts and bar charts for emissions data
4. **Other Pages** - Build Analyze, Audit, Roles & Permissions pages

---

## Troubleshooting

### Container Won't Start

1. Check Docker/Podman is running: 
   - Docker: `docker ps`
   - Podman: `podman ps`
2. Check logs: 
   - Docker: `docker-compose -f docker-compose.demo.yml logs web`
   - Podman: `podman-compose -f docker-compose.demo.yml logs web`
3. Verify `.env` file exists and has correct values
4. Check port 3000 is not in use

### UI Not Loading

1. Check EcoKit files exist: `Test-Path "web\public\assets\EcoKit\ecokit.css"`
2. Check browser console for errors
3. Verify CSS imports in `globals.css`

### Database Errors

1. Check PostgreSQL container is running: 
   - Docker: `docker-compose -f docker-compose.demo.yml ps postgres`
   - Podman: `podman-compose -f docker-compose.demo.yml ps postgres`
2. Verify DATABASE_URL in `.env` matches container name
3. Try resetting: 
   - Docker: `docker-compose -f docker-compose.demo.yml exec web npx prisma migrate reset`
   - Podman: `podman-compose -f docker-compose.demo.yml exec web npx prisma migrate reset`

---

## Files Created/Modified

### New Files
- `web/components/Navigation/TopNav.tsx` - Top navigation bar
- `web/components/Navigation/Sidebar.tsx` - Left sidebar navigation
- `web/app/(app)/layout.module.css` - Layout styles
- `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- `QUICK_START.md` - This file

### Modified Files
- `web/app/(app)/layout.tsx` - Updated to use new navigation
- `web/app/globals.css` - Added EcoKit import and navigation styles

---

## Next: Building Dashboard Components

The next phase will involve:
1. Creating dashboard summary cards (Total Emissions, Scope 1, etc.)
2. Adding charts (pie chart for categories, bar chart for time series)
3. Building data tables with sorting and filtering
4. Adding filter controls (Year, Location, Scope, Unit)

See `DEPLOYMENT_GUIDE.md` for detailed instructions on Pterodactyl setup.
