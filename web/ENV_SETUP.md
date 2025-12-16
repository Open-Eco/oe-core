# Environment Variables Setup

## Quick Start

1. Create a `.env.local` file in the `web/` directory

2. Add the following variables:

```env
# Database Connection
# Format: postgresql://username:password@host:port/database?schema=public
# Example for local PostgreSQL:
DATABASE_URL="postgresql://postgres:password@localhost:5432/openeco?schema=public"

# NextAuth Configuration
# Generate a secret with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_SECRET="your-generated-secret-here"

# App URL (for development)
NEXTAUTH_URL="http://localhost:3000"

# Optional: App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Open Climate Transparency Platform"
```

## Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

## Database Setup Options

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```sql
   CREATE DATABASE openeco;
   ```
3. Use connection string:
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/openeco?schema=public"
   ```

### Option 2: Containerized PostgreSQL (Podman or Docker)

1. Run PostgreSQL in a container (Linux/WSL2 with Podman recommended):
   ```bash
   # Podman (Linux/WSL2)
   podman run --name openeco-postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=openeco \
     -p 5432:5432 \
     -d postgres:15

   # Or Docker (Docker Desktop / Rancher Desktop, etc.)
   docker run --name openeco-postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=openeco \
     -p 5432:5432 \
     -d postgres:15
   ```

2. Use connection string:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/openeco?schema=public"
   ```

### Option 3: Cloud Database (Supabase, Neon, etc.)

1. Create a database on your cloud provider
2. Copy the connection string they provide
3. Use it as your `DATABASE_URL`

## After Setting Up

Once you've created `.env.local` with `DATABASE_URL`:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

## Troubleshooting

### "Environment variable not found: DATABASE_URL"

- Make sure `.env.local` is in the `web/` directory (same level as `package.json`)
- Check that the file is named exactly `.env.local` (not `.env.local.txt`)
- Restart your terminal/IDE after creating the file

### Connection refused errors

- Make sure PostgreSQL is running
- Check that the host, port, username, and password are correct
- Verify the database exists

### Authentication errors

- Make sure `NEXTAUTH_SECRET` is set and is a long random string
- Regenerate the secret if you're getting session errors

