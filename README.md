# OpenEco - Open Climate Transparency Platform

**An open-source, enterprise-grade carbon accounting platform that companies can self-host on their own infrastructure.**

> **Climate transparency should not be paywalled.**

---

## Our Commitment to Credibility

OpenEco is built on the principle that **climate data must be trustworthy, verifiable, and reproducible**. We're not just building software — we're building infrastructure for accountability.

<table>
<tr>
<td width="50%" valign="top">

### Methodology & Standards

✓ **GHG Protocol–aligned methodologies**  
Full conformance with the GHG Protocol Corporate Standard for Scope 1, 2, and 3 accounting.

✓ **Uses IPCC / DEFRA / EPA factors**  
Built on authoritative, publicly available emission factor datasets — versioned, cited, and reproducible.

</td>
<td width="50%" valign="top">

### Audit & Assurance

✓ **Designed for third-party assurance**  
Every calculation links inputs → factors → outputs with full provenance.

✓ **Audit-ready by design**  
Evidence attachments, approval workflows, locked periods, and immutable calculation records.

✓ **Reproducible, transparent calculations**  
Open algorithms. No black boxes. Anyone can verify.

</td>
</tr>
</table>

> *We believe the credibility of climate reporting depends on transparency of method, not proprietary systems.*

---

## What is OpenEco?

OpenEco is a free, open-source platform for measuring, tracking, and reporting greenhouse gas emissions. Companies download and self-host the platform, maintaining full control over their data while contributing to global climate transparency.

**Key Capabilities:**
- Full Scope 1, 2, and 3 emissions tracking
- GHG Protocol aligned calculations
- Custom dashboards and reporting
- Audit-ready documentation
- Enterprise self-hosting (Podman/Docker, Kubernetes/OKD)

---

## Prerequisites

Before you begin, install these dependencies:

### Required Software

| Dependency | Version | Purpose | Installation |
|------------|---------|---------|--------------|
| **Node.js** | 18+ | JavaScript runtime | [nodejs.org](https://nodejs.org) |
| **Git** | 2.30+ | Version control | [git-scm.com](https://git-scm.com) |
| **Podman Desktop** | 4+ | Container runtime (for PostgreSQL) | [podman-desktop.io](https://podman-desktop.io) |

### Automated Setup (Recommended)

Run the setup script to check and install dependencies:

**Windows (PowerShell as Admin):**
```powershell
.\scripts\setup.ps1
```

**macOS / Linux:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Manual Installation

<details>
<summary><strong>Windows</strong></summary>

```powershell
# Node.js (via winget)
winget install OpenJS.NodeJS.LTS

# Git
winget install Git.Git

# Podman Desktop
winget install RedHat.Podman-Desktop
```

</details>

<details>
<summary><strong>macOS</strong></summary>

```bash
# Using Homebrew
brew install node@18 git
brew install --cask podman-desktop
```

</details>

<details>
<summary><strong>Linux (Ubuntu/Debian)</strong></summary>

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Podman
sudo apt-get install -y podman podman-compose
```

</details>

<details>
<summary><strong>Linux (Fedora/RHEL)</strong></summary>

```bash
sudo dnf install nodejs git podman podman-compose buildah
```

</details>

### Verify Installation

```bash
node --version    # v18.x or higher
git --version     # 2.30 or higher
podman --version  # 4.x or higher
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Open-Eco/oe-core.git
cd oe-core
cd web
npm install
```

### 2. Start PostgreSQL (via Podman)

```bash
podman run --name openeco-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=openeco \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `web/.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/openeco?schema=public"
NEXTAUTH_SECRET="dev-secret-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialize Database

```bash
npx prisma db push
npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## Common Commands

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run start` | Start production server |

### Database (Prisma)

| Command | Description |
|---------|-------------|
| `npx prisma db push` | Push schema to database |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create migration |

### Containers (Podman)

| Command | Description |
|---------|-------------|
| `podman ps` | List running containers |
| `podman start openeco-postgres` | Start PostgreSQL |
| `podman stop openeco-postgres` | Stop PostgreSQL |
| `podman logs openeco-postgres` | View logs |

---

## Documentation

| Document | Description |
|----------|-------------|
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Technical architecture, engines, and deployment models |
| [**SECURITY_AND_GOVERNANCE.md**](./SECURITY_AND_GOVERNANCE.md) | Security model, trust boundaries, data governance |
| [**PLATFORM_FEATURES.md**](./PLATFORM_FEATURES.md) | Full feature list, requirements, and roadmap |
| [**INSTALLATION.md**](./INSTALLATION.md) | Setup guide for dev, enterprise, and public deployment |
| [**OPEN_SOURCE_PLAYBOOK.md**](./OPEN_SOURCE_PLAYBOOK.md) | Open source governance and community guidelines |
| [**COMPETITIVE_ANALYSIS.md**](./COMPETITIVE_ANALYSIS.md) | Competitive landscape and product strategy |
| [**FAQ.md**](./FAQ.md) | Frequently asked questions |
| [**CONTRIBUTING.md**](./CONTRIBUTING.md) | How to contribute |

---

## Repository Structure

```
open-eco/
├── web/                # Next.js application
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities & Prisma
│   └── prisma/        # Database schema
│
├── docs/              # EcoKit design system (GitHub Pages)
│   ├── components.html
│   ├── tokens.html
│   └── assets/EcoKit/
│
├── deploy/            # Deployment configs
│   ├── compose.dev.yml
│   └── okd/
│
├── scripts/           # Setup and utility scripts
│   ├── setup.sh       # Linux/macOS setup
│   └── setup.ps1      # Windows setup
│
└── [root]/            # Project documentation
```

---

## Deployment Options

| Method | Best For | Documentation |
|--------|----------|---------------|
| **Local Dev** | Development | See Quick Start above |
| **Podman/Docker** | Pilots, small teams | [INSTALLATION.md](./INSTALLATION.md#option-a-single-host-podmandocker--compose) |
| **Kubernetes/OKD** | Production, enterprise | [INSTALLATION.md](./INSTALLATION.md#option-b-kubernetes--okd--openshift) |
| **Vercel** | Demo site | [INSTALLATION.md](./INSTALLATION.md#demo-site--vercel) |

Each enterprise deployment gets **its own isolated database** - no shared multi-tenant infrastructure.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Database | PostgreSQL 15+ Prisma ORM |
| Auth | NextAuth.js |
| Styling | Vanilla CSS (EcoKit design system) |
| Container | OCI images (Buildah/Podman/Docker) |

---

## Troubleshooting

### Podman not found (Windows)

Restart your terminal after installing Podman Desktop, or run:
```powershell
podman machine init
podman machine start
```

### Database connection refused

1. Check PostgreSQL is running: `podman ps`
2. Start if stopped: `podman start openeco-postgres`
3. On Windows, try `host.containers.internal` instead of `localhost` in DATABASE_URL

### Port 5432 already in use

```bash
# Use a different port
podman run ... -p 5433:5432 ...
# Update DATABASE_URL to use port 5433
```

### Prisma errors

```bash
# Regenerate client
npx prisma generate

# Reset database (caution: deletes data)
npx prisma db push --force-reset
```

---

## Live Sites

| Site | URL | Purpose |
|------|-----|---------|
| Demo | demo.open-eco.org | Interactive demo |
| Docs | [open-eco.github.io/oe-core](https://open-eco.github.io/oe-core) | EcoKit design system |

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

- **Code**: GNU Affero General Public License v3.0 (AGPL-3.0-only)
- **Data**: CC-BY or CC0

---

## Links

- **GitHub**: [github.com/Open-Eco/oe-core](https://github.com/Open-Eco/oe-core)
- **Design System**: [EcoKit Documentation](https://open-eco.github.io/oe-core)

---

**Status**: 🚧 In Development
