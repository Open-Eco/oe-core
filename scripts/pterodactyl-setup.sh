#!/bin/bash
# OpenEco Pterodactyl Demo Setup Script
# Usage: ./scripts/pterodactyl-setup.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}========================================"
echo "  OpenEco Pterodactyl Demo Setup"
echo -e "========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${YELLOW}Warning: Running as root. Consider using a non-root user.${NC}"
fi

# Check prerequisites
echo -e "${CYAN}Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed${NC}"
    echo "  Install Docker: https://docs.docker.com/get-docker/"
    exit 1
else
    echo -e "${GREEN}✓ Docker is installed${NC}"
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    echo "  Install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
else
    echo -e "${GREEN}✓ Docker Compose is installed${NC}"
fi

# Check if Pterodactyl is mentioned (optional check)
echo -e "${YELLOW}ℹ Note: This script sets up the demo for Pterodactyl deployment${NC}"
echo -e "${YELLOW}  For full Pterodactyl installation, see: deploy/pterodactyl/README.md${NC}"
echo ""

# Navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

echo -e "${CYAN}Project root: $PROJECT_ROOT${NC}"
echo ""

# Check if .env file exists in pterodactyl directory
ENV_FILE="deploy/pterodactyl/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Creating environment file...${NC}"
    cat > "$ENV_FILE" << EOF
# OpenEco Demo Environment Variables
# Update these values for your deployment

# PostgreSQL password (change this!)
POSTGRES_PASSWORD=demo_password_change_me

# Web application port
WEB_PORT=3000

# Docker image (default: latest from GitHub Container Registry)
WEB_IMAGE=ghcr.io/open-eco/oe-core:web-latest

# Domain (update with your actual domain)
NEXTAUTH_URL=https://demo.open-eco.org
NEXT_PUBLIC_APP_URL=https://demo.open-eco.org
EOF
    echo -e "${GREEN}✓ Created $ENV_FILE${NC}"
    echo -e "${YELLOW}⚠ IMPORTANT: Edit $ENV_FILE and update the values!${NC}"
    echo ""
else
    echo -e "${GREEN}✓ Environment file exists: $ENV_FILE${NC}"
fi

# Create Docker network if it doesn't exist
NETWORK_NAME="openeco-demo"
if ! docker network ls | grep -q "$NETWORK_NAME"; then
    echo -e "${CYAN}Creating Docker network: $NETWORK_NAME${NC}"
    docker network create "$NETWORK_NAME" || true
    echo -e "${GREEN}✓ Network created${NC}"
else
    echo -e "${GREEN}✓ Network already exists: $NETWORK_NAME${NC}"
fi

echo ""
echo -e "${CYAN}========================================"
echo "  Setup Complete"
echo -e "========================================${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo ""
echo "1. Edit environment variables:"
echo "   ${CYAN}vi deploy/pterodactyl/.env${NC}"
echo ""
echo "2. Generate NEXTAUTH_SECRET:"
echo "   ${CYAN}node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"${NC}"
echo ""
echo "3. Start the demo (using Docker Compose):"
echo "   ${CYAN}cd deploy/pterodactyl${NC}"
echo "   ${CYAN}docker-compose -f docker-compose.demo.yml up -d${NC}"
echo ""
echo "4. Run database migrations:"
echo "   ${CYAN}docker-compose -f docker-compose.demo.yml exec web npx prisma db push${NC}"
echo ""
echo "5. Or deploy via Pterodactyl Panel:"
echo "   ${CYAN}See: deploy/pterodactyl/README.md${NC}"
echo ""
echo -e "${YELLOW}For detailed instructions, see: deploy/pterodactyl/README.md${NC}"
echo ""
