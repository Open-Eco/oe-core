#!/bin/bash
# OpenEco Pterodactyl Demo Deployment Script
# Usage: ./scripts/pterodactyl-deploy.sh [--pull] [--migrate] [--restart]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Flags
PULL_IMAGE=false
RUN_MIGRATIONS=false
RESTART_CONTAINERS=false

for arg in "$@"; do
    case $arg in
        --pull)
            PULL_IMAGE=true
            ;;
        --migrate)
            RUN_MIGRATIONS=true
            ;;
        --restart)
            RESTART_CONTAINERS=true
            ;;
    esac
done

echo ""
echo -e "${CYAN}========================================"
echo "  OpenEco Pterodactyl Demo Deployment"
echo -e "========================================${NC}"
echo ""

# Navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

# Check if using Docker Compose
COMPOSE_FILE="deploy/pterodactyl/docker-compose.demo.yml"
if [ -f "$COMPOSE_FILE" ]; then
    echo -e "${CYAN}Using Docker Compose deployment${NC}"
    echo ""
    
    # Pull latest image if requested
    if [ "$PULL_IMAGE" = true ]; then
        echo -e "${CYAN}Pulling latest Docker image...${NC}"
        cd deploy/pterodactyl
        docker-compose -f docker-compose.demo.yml pull web || {
            echo -e "${YELLOW}⚠ Could not pull image. Building locally...${NC}"
            echo "  To build locally, run: docker build -t ghcr.io/open-eco/oe-core:web-latest -f web/Containerfile web/"
        }
        cd "$PROJECT_ROOT"
        echo -e "${GREEN}✓ Image pull complete${NC}"
        echo ""
    fi
    
    # Run migrations if requested
    if [ "$RUN_MIGRATIONS" = true ]; then
        echo -e "${CYAN}Running database migrations...${NC}"
        cd deploy/pterodactyl
        docker-compose -f docker-compose.demo.yml exec -T web npx prisma generate || {
            echo -e "${YELLOW}⚠ Container may not be running. Starting containers first...${NC}"
            docker-compose -f docker-compose.demo.yml up -d
            sleep 5
            docker-compose -f docker-compose.demo.yml exec -T web npx prisma generate
        }
        # Use 'migrate deploy' for production-safe schema updates.
        # WARNING: 'db push --accept-data-loss' can silently drop columns/tables.
        docker-compose -f docker-compose.demo.yml exec -T web npx prisma migrate deploy || {
            echo -e "${RED}✗ Migration failed${NC}"
            exit 1
        }
        cd "$PROJECT_ROOT"
        echo -e "${GREEN}✓ Migrations complete${NC}"
        echo ""
    fi
    
    # Restart containers if requested
    if [ "$RESTART_CONTAINERS" = true ]; then
        echo -e "${CYAN}Restarting containers...${NC}"
        cd deploy/pterodactyl
        docker-compose -f docker-compose.demo.yml restart web || {
            echo -e "${YELLOW}⚠ Containers may not be running. Starting containers...${NC}"
            docker-compose -f docker-compose.demo.yml up -d
        }
        cd "$PROJECT_ROOT"
        echo -e "${GREEN}✓ Containers restarted${NC}"
        echo ""
    fi
    
    echo -e "${GREEN}Deployment complete!${NC}"
    echo ""
    echo "Check container status:"
    echo "  ${CYAN}cd deploy/pterodactyl${NC}"
    echo "  ${CYAN}docker-compose -f docker-compose.demo.yml ps${NC}"
    echo ""
    echo "View logs:"
    echo "  ${CYAN}docker-compose -f docker-compose.demo.yml logs -f web${NC}"
    echo ""
    
else
    echo -e "${YELLOW}Docker Compose file not found: $COMPOSE_FILE${NC}"
    echo ""
    echo "For Pterodactyl Panel deployment:"
    echo "  1. Update Docker image in Pterodactyl panel"
    echo "  2. Restart server via panel"
    echo "  3. Run migrations in server console:"
    echo "     ${CYAN}npx prisma generate && npx prisma db push${NC}"
    echo ""
    echo "See: deploy/pterodactyl/README.md for detailed instructions"
    echo ""
fi
