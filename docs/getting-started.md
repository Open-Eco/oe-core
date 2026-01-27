# Getting Started

Self-hosted climate transparency for enterprises.

## Quick Deploy (IT Admins)

**🚀 Need to deploy this now?** See [Quick Deploy Guide](./deployment/quick-deploy.md) - 5-minute deployment guide.

## Choose Your Deployment

Decide between a single-host container runtime (Podman/Docker + Compose) or a Kubernetes/OKD cluster for production.

### Option 1: Quick Test (Docker/Podman Compose)

See [Quick Start Guide](./deployment/quick-start.md) for local testing.

### Option 2: Production Deployment

See [Deployment Guide](./deployment/deployment-guide.md) for production setup.

### Option 3: Kubernetes/OKD

See [Installation Guide](./deployment/installation.md#kubernetes--okd--openshift) for cluster deployment.

## Configure PostgreSQL

Each enterprise deployment uses its own PostgreSQL database via `DATABASE_URL`. Point the app at your managed database or containerized Postgres.

See [Environment Setup](./deployment/env-setup.md) for configuration details.

## Seed an Organization

Create your first user and organization, then configure facilities and suppliers to begin capturing activity data.

## Documentation

- [Quick Deploy](./deployment/quick-deploy.md) - 5-minute production deployment
- [Quick Start](./deployment/quick-start.md) - Local development setup
- [Deployment Guide](./deployment/deployment-guide.md) - Comprehensive deployment instructions
- [Installation Guide](./deployment/installation.md) - Enterprise setup guide
- [Podman Guide](./deployment/podman-guide.md) - Using Podman instead of Docker
- [Environment Setup](./deployment/env-setup.md) - Environment variables
