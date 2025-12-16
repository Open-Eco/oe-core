# Open Climate Transparency Platform - Web Application

Next.js application for the Open Climate Transparency Platform.

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and update with your actual values:
# - DATABASE_URL: Your PostgreSQL connection string
# - NEXTAUTH_SECRET: Generate a new secret (see ENV_SETUP.md)
```

**Quick setup:**
- See `ENV_SETUP.md` for detailed instructions
- Or copy `.env.example` to `.env.local` and update the values
- Make sure `DATABASE_URL` points to a PostgreSQL database

3. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or create a migration (for production)
npm run db:migrate
```

4. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database (dev)
- `npm run db:migrate` - Create and run migrations (prod)
- `npm run db:studio` - Open Prisma Studio (database GUI)

## API Routes

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Organizations
- `GET /api/organizations` - List user's organizations
- `POST /api/organizations` - Create new organization
- `GET /api/organizations/[id]` - Get organization details

### Activity Data
- `GET /api/activity-data` - List activity data entries
- `POST /api/activity-data` - Create new activity data entry

### Emissions
- `GET /api/emissions` - List emission results
- `POST /api/emissions` - Create emission result (from calculation)

### Reports
- `GET /api/reports` - List reports
- `POST /api/reports` - Create new report

## Database Schema

The database schema is defined in `prisma/schema.prisma`. Key models include:

- **User** - Authentication and user accounts
- **Organization** - Multi-tenant organizations
- **OrganizationUser** - User-organization relationships with roles
- **Facility** - Physical locations
- **RawActivityData** - Input data for emissions calculations
- **EmissionResult** - Calculated emissions (append-only)
- **Report** - Generated reports
- **EmissionFactor** - Emission factors from datasets
- **DatasetVersion** - Versioned emission factor datasets

See `prisma/schema.prisma` for complete schema documentation.

## Architecture

- **Framework**: Next.js 16+ (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Language**: TypeScript

## Development

### Adding a new API route

1. Create a new file in `app/api/[route-name]/route.ts`
2. Export `GET`, `POST`, `PUT`, `DELETE` functions as needed
3. Use `getServerSession(authOptions)` for authentication
4. Use `prisma` from `@/lib/prisma` for database access
5. Use Zod schemas for validation

### Database migrations

For development, use `npm run db:push` to sync schema changes.

For production, create migrations:
```bash
npm run db:migrate
```

This creates a migration file that can be reviewed and applied.

## Self-Hosting

This application is designed to be self-hosted. See the main [GAMEPLAN.md](../GAMEPLAN.md) for deployment options including:

- Docker Compose
- Kubernetes (Helm charts)
- Cloud provider marketplaces
- Manual installation
