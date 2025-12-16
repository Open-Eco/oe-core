# OpenEco Architecture

This document describes the technical architecture, deployment models, and distribution strategy for the Open Climate Transparency Platform.

---

## Overview

OpenEco is an **open-source, cloud-native enterprise application** that companies download, install, and self-host on their own infrastructure.

**Core Principles:**
- **Data Sovereignty**: Companies own and control their data
- **Privacy & Security**: Data stays within company-controlled environments
- **Compliance Ready**: Meets enterprise security and regulatory requirements
- **Cost Efficient**: No per-seat or subscription fees
- **Customizable**: Companies can extend and modify the platform

---

## Repository Structure

```
open-eco/
├── web/                    # Next.js application
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── lib/               # Utilities & Prisma client
│   ├── prisma/            # Database schema
│   └── public/            # Static assets
│
├── docs/                   # EcoKit design system documentation
│   ├── index.html         # Homepage
│   ├── components.html    # Component library
│   ├── tokens.html        # Design tokens
│   └── assets/EcoKit/     # Design system CSS/JS
│
├── deploy/                 # Deployment configurations
│   ├── compose.dev.yml    # Podman/Docker Compose for dev
│   └── okd/               # Kubernetes/OKD manifests
│
└── [root]/                 # Project documentation
    ├── README.md
    ├── ARCHITECTURE.md    # This file
    ├── PLATFORM_FEATURES.md
    └── INSTALLATION.md
```

---

## Distribution Model

### 1. Open Source Repository (Primary)

**GitHub**: `open-eco/oe-core`

- **License**: MIT or Apache-2.0 (permissive, enterprise-friendly)
- **Releases**: Versioned with OCI container images, Helm charts, installation scripts
- **Container Images**: Built with Buildah, runnable via Podman or Docker

### 2. Demo Site (Vercel)

**URL**: `demo.open-eco.org`

- Interactive demo with sample data
- Feature walkthroughs and sandbox
- Links to installation guides and GitHub

### 3. Documentation Site (GitHub Pages)

**URL**: `docs.open-eco.org` (EcoKit design system)

- Component library documentation
- Design tokens and guidelines
- Static HTML/CSS/JS (no build step)

---

## Deployment Architecture

### Self-Hosted Enterprise (Primary Model)

Each enterprise runs **its own isolated deployment** with **its own PostgreSQL database**.

```
┌─────────────────────────────────────────┐
│      Enterprise Infrastructure          │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Next.js Application            │  │
│  │   (OCI Container)                │  │
│  └──────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌──────────────────────────────────┐  │
│  │   PostgreSQL Database            │  │
│  │   (Per-enterprise isolation)     │  │
│  └──────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌──────────────────────────────────┐  │
│  │   Storage (S3-compatible)        │  │
│  │   (Evidence, exports, reports)   │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Deployment Options

| Option | Best For | Tools |
|--------|----------|-------|
| **Single Host** | Pilots, small teams | Podman/Docker + Compose |
| **Kubernetes/OKD** | Production, HA, enterprise | Helm charts, `kubectl`/`oc` |
| **Cloud Marketplace** | AWS/Azure/GCP users | Pre-configured templates |
| **Manual** | Custom requirements | Step-by-step guide |

### Infrastructure Requirements

**Minimum (Pilot)**:
- 2 CPU cores, 4GB RAM, 50GB storage
- PostgreSQL 14+

**Recommended (Production)**:
- 4+ CPU cores, 8GB+ RAM, 100GB+ storage
- PostgreSQL with replication
- Load balancer, SSL/TLS certificates

---

## Technology Stack

### Web Application (`web/`)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (EcoKit design system) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js |
| Container | OCI images (Buildah/Podman/Docker) |

### Documentation (`docs/`)

| Layer | Technology |
|-------|------------|
| Format | Static HTML/CSS/JS |
| Hosting | GitHub Pages |
| Design System | EcoKit |

---

## Cross-Instance Data Sharing

Enterprises with suppliers who also run OpenEco can share data securely.

### Architecture

```
┌─────────────────────────┐       ┌─────────────────────────┐
│   Host Company          │       │   Supplier Instance     │
│   OpenEco Instance      │       │   OpenEco Instance      │
│                         │       │                         │
│  Supplier table:        │       │  Organization:          │
│  - externalPublicOrgId ─┼──────▶│  - publicOrgId          │
│  - integrationEndpoint  │       │  - export APIs          │
│  - integrationToken     │       │                         │
└─────────────────────────┘       └─────────────────────────┘
```

### How It Works

1. **Public Org ID**: Each organization has a stable, non-guessable `publicOrgId` (UUID or hash)
2. **Supplier Linkage**: Host company stores supplier's `publicOrgId` and API endpoint
3. **Data Flow**: Host pulls supplier data via authenticated export APIs
4. **Auditability**: Original supplier IDs stored in metadata for audit trail

---

## Application Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────┐
│                     UI Layer                             │
│                 (Next.js / React)                        │
├─────────────────────────────────────────────────────────┤
│                    API Layer                             │
│              (Next.js API Routes)                        │
├─────────────────────────────────────────────────────────┤
│               Calculation Engine                         │
│         (Factor library, GHG calculations)               │
├─────────────────────────────────────────────────────────┤
│                   Data Layer                             │
│             (PostgreSQL + Prisma ORM)                    │
└─────────────────────────────────────────────────────────┘
```

### Data Model (Core Entities)

| Entity | Purpose |
|--------|---------|
| `Organization` | Company/tenant |
| `User` | Auth and profiles |
| `Facility` | Physical locations |
| `RawActivityData` | Activity inputs (energy, waste, travel) |
| `EmissionResult` | Calculated emissions |
| `EmissionFactor` | Factor library (versioned) |
| `Report` | Generated reports |
| `Supplier` | Supply chain entities |

### Security Model

| Priority | Implementation |
|----------|----------------|
| **Integrity** | Append-only audit logs, immutable calculation runs |
| **Authenticity** | Verified orgs, NextAuth sessions |
| **Auditability** | Change logs, factor provenance, evidence attachments |
| **Multi-tenancy** | Per-org database isolation |

---

## Release Strategy

### Versioning

- **Semantic versioning**: v1.0.0, v1.1.0, etc.
- **Channels**: Stable, Beta, Nightly

### Distribution

| Artifact | Location |
|----------|----------|
| Source code | GitHub Releases |
| Container images | GHCR, Quay, Docker Hub |
| Helm charts | Helm repository |
| Cloud templates | AWS/Azure/GCP marketplaces |

---

## Roadmap

### Phase 1: Foundation ✅
- [x] Core Next.js application
- [x] EcoKit design system
- [x] Prisma data model
- [x] Basic auth and API routes
- [ ] OCI containerization

### Phase 2: Self-Hosting
- [ ] Podman/Docker Compose setup
- [ ] Helm charts for Kubernetes/OKD
- [ ] Installation documentation
- [ ] Demo site on Vercel

### Phase 3: Enterprise Features
- [ ] Factor library with versioning
- [ ] Approval workflows
- [ ] Audit pack exports
- [ ] High availability setup

### Phase 4: Ecosystem
- [ ] Plugin system
- [ ] Supplier portal
- [ ] Framework reporting (CSRD/TCFD)
- [ ] API marketplace

### Phase 5: Developer Experience
- [ ] `openeco` CLI wrapper
- [ ] Cross-platform dev scripts
- [ ] Local dev with Podman/Docker

---

## Related Documentation

- [README.md](./README.md) - Project overview
- [PLATFORM_FEATURES.md](./PLATFORM_FEATURES.md) - Features and roadmap
- [INSTALLATION.md](./INSTALLATION.md) - Setup and deployment guide
- [OPEN_SOURCE_PLAYBOOK.md](./OPEN_SOURCE_PLAYBOOK.md) - Governance and auditability implementation

---

**Status**: 🚧 In Development  
**Last Updated**: 2024
