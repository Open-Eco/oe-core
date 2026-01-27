# Using Podman Instead of Docker

This guide explains how to use Podman (a Docker-compatible alternative) with OpenEco.

## What is Podman?

**Podman** is a daemonless, rootless container engine that's fully compatible with Docker commands. It's:
- ✅ **Fully open-source** (no licensing concerns)
- ✅ **Rootless by default** (more secure)
- ✅ **No daemon required** (lighter weight)
- ✅ **Docker-compatible** (same commands, just replace `docker` with `podman`)

## Docker vs Podman

| Feature | Docker | Podman |
|---------|--------|--------|
| **Cost** | Free for personal use | Free (fully open-source) |
| **Daemon** | Requires daemon | No daemon needed |
| **Root** | Often requires root | Rootless by default |
| **Compatibility** | Industry standard | Docker-compatible |
| **Best for** | General use, Docker Desktop users | Linux servers, security-focused setups |

> **Note:** Docker Desktop is free for personal use, small businesses, and education. For most development work, both are free.

## Installation

### Linux (Fedora/RHEL/CentOS)
```bash
sudo dnf install podman podman-compose
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install podman podman-compose
```

### macOS
```bash
brew install podman
```

### Windows (WSL2 recommended)
```bash
# Install via WSL2, then use podman commands
# Or use Podman Desktop for Windows
```

## Quick Reference: Docker → Podman

Simply replace `docker` with `podman` in all commands:

| Docker Command | Podman Equivalent |
|----------------|-------------------|
| `docker build` | `podman build` |
| `docker run` | `podman run` |
| `docker ps` | `podman ps` |
| `docker-compose` | `podman-compose` |
| `docker exec` | `podman exec` |
| `docker logs` | `podman logs` |

## Using Podman with OpenEco

### Build the Container

```bash
cd web
podman build -t openeco-web:local -f Containerfile .
```

### Start Containers with Podman Compose

```bash
cd deploy/pterodactyl
podman-compose -f docker-compose.demo.yml up -d
```

### Run Migrations

```bash
podman-compose -f docker-compose.demo.yml exec web npx prisma generate
podman-compose -f docker-compose.demo.yml exec web npx prisma db push
```

### View Logs

```bash
podman-compose -f docker-compose.demo.yml logs -f web
```

### Stop Containers

```bash
podman-compose -f docker-compose.demo.yml down
```

## Podman-Specific Features

### Rootless Containers

Podman runs containers as your user by default (no sudo needed):

```bash
# No sudo required!
podman build -t openeco-web:local -f Containerfile .
podman run -d openeco-web:local
```

### Podman Machine (for macOS/Windows)

If you need a Linux VM (similar to Docker Desktop):

```bash
# Create a podman machine
podman machine init

# Start the machine
podman machine start

# Now use podman commands normally
```

## Troubleshooting

### Port Conflicts

If you get port binding errors, check what's using the port:

```bash
# Linux
sudo netstat -tulpn | grep 3000

# Or use podman's port check
podman port <container-name>
```

### Permission Issues

Podman is rootless by default, but if you have issues:

```bash
# Check podman info
podman info

# If needed, configure subuid/subgid (usually automatic)
```

### Podman Compose Not Found

Install podman-compose:

```bash
# Linux
sudo dnf install podman-compose  # Fedora/RHEL
sudo apt-get install podman-compose  # Ubuntu/Debian

# Or use pip
pip3 install podman-compose
```

## When to Use Podman vs Docker

**Use Podman if:**
- You're on Linux and want rootless containers
- You prefer fully open-source tools
- You're deploying to servers without Docker Desktop
- You want better security isolation

**Use Docker if:**
- You're already using Docker Desktop
- You need Docker-specific features
- Your team/CI/CD already uses Docker
- You're on Windows/macOS and want the easiest setup

## Compatibility

Podman is **fully compatible** with:
- ✅ Docker images (same format)
- ✅ Docker Compose files (use `podman-compose`)
- ✅ Dockerfile syntax (same commands)
- ✅ Container registries (Docker Hub, etc.)

You can even use Docker and Podman on the same system - they won't conflict!

## Resources

- [Podman Documentation](https://docs.podman.io/)
- [Podman vs Docker](https://podman.io/whatis/)
- [Podman Compose](https://github.com/containers/podman-compose)
