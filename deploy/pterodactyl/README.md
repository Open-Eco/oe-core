# OpenEco Demo Deployment on Pterodactyl

This guide covers deploying OpenEco demo instance on Pterodactyl Panel, a game server management platform that can also manage Docker containers for applications.

## Overview

The OpenEco demo runs as a Docker container managed by Pterodactyl, providing:
- Full OpenEco instance with demo functionality
- Minimal PostgreSQL database (for NextAuth sessions only)
- Demo data stored in browser sessionStorage (no persistent demo data)
- Easy management via Pterodactyl panel

## Prerequisites

### Option 1: Pterodactyl Already Installed

If you already have Pterodactyl installed:
- Pterodactyl Panel (web interface)
- Pterodactyl Wings (daemon) with Docker access
- Basic understanding of Pterodactyl server management

Skip to [Creating the Demo Server](#creating-the-demo-server).

### Option 2: Install Pterodactyl

If you need to install Pterodactyl:

#### System Requirements
- Ubuntu 20.04+ / Debian 11+ / CentOS 8+ / RHEL 8+
- 2GB+ RAM (4GB+ recommended)
- Docker installed and running
- Domain name (for SSL certificates)

#### Installation Steps

1. **Install Docker** (if not installed):
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   systemctl enable docker
   systemctl start docker
   ```

2. **Install Pterodactyl Panel**:
   Follow the official installation guide:
   - [Pterodactyl Panel Installation](https://pterodactyl.io/panel/1.0/getting_started.html)
   - Requires: PHP 8.1+, MySQL/MariaDB, Redis, Nginx/Apache

3. **Install Pterodactyl Wings**:
   Follow the official installation guide:
   - [Pterodactyl Wings Installation](https://pterodactyl.io/wings/1.0/installing.html)
   - Connects to Panel and manages Docker containers

4. **Configure Reverse Proxy**:
   Set up Nginx or Caddy to route traffic to Pterodactyl panel and demo instance.

## Creating the Demo Server

### Method 1: Using Docker Compose (Recommended for Standalone)

If you want to run the demo outside Pterodactyl but using similar configuration:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Open-Eco/oe-core.git
   cd oe-core
   ```

2. **Create environment file**:
   ```bash
   cp deploy/pterodactyl/.env.example deploy/pterodactyl/.env
   # Edit .env with your settings
   ```

3. **Start the demo**:
   ```bash
   cd deploy/pterodactyl
   docker-compose -f docker-compose.demo.yml up -d
   ```

4. **Run database migrations**:
   ```bash
   docker-compose -f docker-compose.demo.yml exec web npx prisma db push
   ```

### Method 2: Using Pterodactyl Panel

#### Step 1: Create a New Server

1. Log into Pterodactyl Panel
2. Navigate to **Servers** → **Create New**
3. Fill in server details:
   - **Name**: `OpenEco Demo`
   - **Owner**: Select your user
   - **Nest**: Use "Node.js" nest (or create custom)
   - **Egg**: Use "Node.js" egg (or import `pterodactyl-egg.json`)
   - **Docker Image**: `ghcr.io/open-eco/oe-core:web-latest`
   - **Startup Command**: `npm run start`

#### Step 2: Configure Resource Limits

Set appropriate limits for the demo:
- **CPU Limit**: 50-100% (1-2 cores)
- **Memory Limit**: 512MB - 1GB
- **Disk Space**: 2-5GB
- **Block IO Weight**: 500

#### Step 3: Configure Environment Variables

In the server settings, add these environment variables:

```bash
DATABASE_URL=postgresql://openeco_demo:your_password@postgres:5432/openeco_demo?schema=public
NEXTAUTH_SECRET=your-secret-key-min-32-characters-long
NEXTAUTH_URL=https://demo.open-eco.org
NEXT_PUBLIC_APP_URL=https://demo.open-eco.org
NODE_ENV=production
PORT=3000
```

**Important**: 
- Generate a secure `NEXTAUTH_SECRET` (32+ characters)
- Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` with your actual domain
- For `DATABASE_URL`, you'll need a PostgreSQL container (see Database Setup below)

#### Step 4: Database Setup

The demo requires a PostgreSQL database. You have two options:

**Option A: Separate PostgreSQL Container (Recommended)**

1. Create a separate server in Pterodactyl for PostgreSQL:
   - Use "PostgreSQL" egg or Docker image `postgres:15-alpine`
   - Set environment variables:
     ```
     POSTGRES_DB=openeco_demo
     POSTGRES_USER=openeco_demo
     POSTGRES_PASSWORD=your_secure_password
     ```
   - Note the internal IP/hostname (usually `postgres-server-id`)

2. Update `DATABASE_URL` in the web server:
   ```
   DATABASE_URL=postgresql://openeco_demo:your_secure_password@postgres-server-id:5432/openeco_demo?schema=public
   ```

**Option B: External PostgreSQL**

Use an external PostgreSQL database and update `DATABASE_URL` accordingly.

#### Step 5: Run Database Migrations

1. In Pterodactyl, open the web server console
2. Run:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

#### Step 6: Start the Server

1. Click **Start** in Pterodactyl panel
2. Monitor logs to ensure it starts correctly
3. Check for "Ready on" message in logs

## Domain and SSL Configuration

### Using Pterodactyl's Built-in Proxy

If using Pterodactyl's proxy feature:

1. In server settings, enable **Proxy**
2. Set **Domain**: `demo.open-eco.org`
3. Configure SSL (Let's Encrypt recommended)

### Using External Reverse Proxy (Nginx/Caddy)

1. **Configure DNS**: Point `demo.open-eco.org` to your server IP

2. **Nginx Configuration**:
   ```nginx
   server {
       listen 80;
       server_name demo.open-eco.org;
       
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

3. **SSL with Let's Encrypt**:
   ```bash
   certbot --nginx -d demo.open-eco.org
   ```

## Updating the Demo

### Manual Update via Pterodactyl

1. Stop the server in Pterodactyl panel
2. Update Docker image (if using custom build):
   ```bash
   docker pull ghcr.io/open-eco/oe-core:web-latest
   ```
3. Restart the server
4. Run migrations if schema changed:
   ```bash
   npx prisma db push
   ```

### Automated Updates

Set up CI/CD to automatically rebuild and redeploy:
- GitHub Actions can build new images
- Webhook to Pterodactyl API to restart server
- Or use Pterodactyl's auto-update feature if configured

## Troubleshooting

### Server Won't Start

1. **Check Logs**: View server logs in Pterodactyl panel
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Check Database Connection**: Verify `DATABASE_URL` is correct and database is accessible
4. **Check Port**: Ensure port 3000 is not in use

### Database Connection Errors

1. **Verify PostgreSQL is Running**: Check PostgreSQL container/server status
2. **Check Network**: Ensure containers can communicate (same Docker network)
3. **Verify Credentials**: Double-check username, password, and database name in `DATABASE_URL`
4. **Test Connection**: Use `psql` or database client to test connection

### Demo Data Not Persisting

This is expected! Demo data uses browser `sessionStorage`:
- Data persists only during browser session
- Clearing browser data resets demo
- This is by design for demo instances

### SSL Certificate Issues

1. **Verify DNS**: Ensure DNS points to correct IP
2. **Check Ports**: Ensure ports 80 and 443 are open
3. **Renew Certificate**: Run `certbot renew` if expired
4. **Check Proxy**: Verify reverse proxy configuration

## Maintenance

### Regular Tasks

- **Monitor Resource Usage**: Check CPU/RAM usage in Pterodactyl
- **Update Docker Image**: Pull latest image periodically
- **Database Backups**: Backup PostgreSQL data (minimal, only sessions)
- **Log Rotation**: Configure log rotation to prevent disk fill

### Reset Demo Data

Since demo uses sessionStorage, no server-side reset needed. Users can:
- Clear browser data
- Use incognito/private browsing
- Wait for session to expire

## Security Considerations

- **Change Default Passwords**: Use strong passwords for database
- **Secure NEXTAUTH_SECRET**: Generate a strong, random secret
- **Firewall Rules**: Only expose necessary ports (80, 443)
- **Regular Updates**: Keep Docker images and dependencies updated
- **Resource Limits**: Set appropriate limits to prevent abuse

## Support

For issues specific to:
- **OpenEco**: See [README.md](../../README.md) and [INSTALLATION.md](../../INSTALLATION.md)
- **Pterodactyl**: See [Pterodactyl Documentation](https://pterodactyl.io)
- **Docker**: See [Docker Documentation](https://docs.docker.com)

## Next Steps

After deployment:
1. Verify demo is accessible at your domain
2. Test demo functionality (create org, facilities, activities)
3. Set up monitoring and alerts
4. Configure automated updates
5. Update documentation with your demo URL
