#!/bin/bash
# OpenEco Development Environment Setup Script (Linux/macOS)
# Usage: ./scripts/setup.sh [--check-only] [--skip-postgres]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Flags
CHECK_ONLY=false
SKIP_POSTGRES=false

for arg in "$@"; do
    case $arg in
        --check-only)
            CHECK_ONLY=true
            ;;
        --skip-postgres)
            SKIP_POSTGRES=true
            ;;
    esac
done

echo ""
echo -e "${CYAN}========================================"
echo "  OpenEco Development Setup"
echo -e "========================================${NC}"
echo ""

# Track missing dependencies
MISSING_DEPS=()

# ============================================
# DETECT OS
# ============================================

detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ -f /etc/debian_version ]]; then
        echo "debian"
    elif [[ -f /etc/fedora-release ]]; then
        echo "fedora"
    elif [[ -f /etc/redhat-release ]]; then
        echo "rhel"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)
echo -e "Detected OS: ${CYAN}$OS${NC}"
echo ""

# ============================================
# CHECK DEPENDENCIES
# ============================================

echo -e "${YELLOW}Checking dependencies...${NC}"
echo ""

# Node.js
printf "  Node.js 18+     : "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | sed 's/v//')
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN}OK (v$NODE_VERSION)${NC}"
    else
        echo -e "${RED}OUTDATED (v$NODE_VERSION, need 18+)${NC}"
        MISSING_DEPS+=("nodejs")
    fi
else
    echo -e "${RED}NOT FOUND${NC}"
    MISSING_DEPS+=("nodejs")
fi

# Git
printf "  Git 2.30+       : "
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | sed 's/git version //')
    echo -e "${GREEN}OK (v$GIT_VERSION)${NC}"
else
    echo -e "${RED}NOT FOUND${NC}"
    MISSING_DEPS+=("git")
fi

# Podman
printf "  Podman 4+       : "
if command -v podman &> /dev/null; then
    PODMAN_VERSION=$(podman --version | sed 's/podman version //')
    echo -e "${GREEN}OK (v$PODMAN_VERSION)${NC}"
else
    echo -e "${RED}NOT FOUND${NC}"
    MISSING_DEPS+=("podman")
fi

# npm (comes with Node.js)
printf "  npm             : "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}OK (v$NPM_VERSION)${NC}"
else
    echo -e "${RED}NOT FOUND (install Node.js first)${NC}"
fi

echo ""

# ============================================
# CHECK ONLY MODE
# ============================================

if [ "$CHECK_ONLY" = true ]; then
    if [ ${#MISSING_DEPS[@]} -eq 0 ]; then
        echo -e "${GREEN}All dependencies installed!${NC}"
        exit 0
    else
        echo -e "${RED}Missing dependencies: ${MISSING_DEPS[*]}${NC}"
        exit 1
    fi
fi

# ============================================
# INSTALL MISSING DEPENDENCIES
# ============================================

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo -e "${YELLOW}Missing dependencies detected. Attempting to install...${NC}"
    echo ""

    for dep in "${MISSING_DEPS[@]}"; do
        case $dep in
            "nodejs")
                echo -e "${YELLOW}Installing Node.js...${NC}"
                case $OS in
                    "macos")
                        if command -v brew &> /dev/null; then
                            brew install node@18
                        else
                            echo -e "${RED}Homebrew not found. Install from https://nodejs.org${NC}"
                        fi
                        ;;
                    "debian")
                        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                        ;;
                    "fedora"|"rhel")
                        sudo dnf install -y nodejs
                        ;;
                    *)
                        echo -e "${RED}Please install Node.js manually: https://nodejs.org${NC}"
                        ;;
                esac
                ;;
            "git")
                echo -e "${YELLOW}Installing Git...${NC}"
                case $OS in
                    "macos")
                        if command -v brew &> /dev/null; then
                            brew install git
                        else
                            xcode-select --install
                        fi
                        ;;
                    "debian")
                        sudo apt-get install -y git
                        ;;
                    "fedora"|"rhel")
                        sudo dnf install -y git
                        ;;
                esac
                ;;
            "podman")
                echo -e "${YELLOW}Installing Podman...${NC}"
                case $OS in
                    "macos")
                        if command -v brew &> /dev/null; then
                            brew install podman
                            echo -e "${CYAN}Run 'podman machine init && podman machine start' after installation${NC}"
                        else
                            echo -e "${RED}Install Podman Desktop from https://podman-desktop.io${NC}"
                        fi
                        ;;
                    "debian")
                        sudo apt-get install -y podman podman-compose
                        ;;
                    "fedora"|"rhel")
                        sudo dnf install -y podman podman-compose buildah
                        ;;
                esac
                ;;
        esac
    done

    echo ""
    echo -e "${YELLOW}Please restart your terminal and run this script again to verify.${NC}"
    exit 0
fi

# ============================================
# SETUP PROJECT
# ============================================

echo -e "${GREEN}All dependencies installed! Setting up project...${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
WEB_DIR="$REPO_ROOT/web"

if [ ! -d "$WEB_DIR" ]; then
    echo -e "${RED}ERROR: web/ directory not found. Run from repo root.${NC}"
    exit 1
fi

# Install npm dependencies
echo -e "${YELLOW}Installing npm packages...${NC}"
cd "$WEB_DIR"
npm install

# Create .env.local if it doesn't exist
if [ ! -f "$WEB_DIR/.env.local" ]; then
    echo -e "${YELLOW}Creating .env.local...${NC}"
    if [ -f "$WEB_DIR/.env.example" ]; then
        cp "$WEB_DIR/.env.example" "$WEB_DIR/.env.local"
    else
        cat > "$WEB_DIR/.env.local" << 'EOF'
DATABASE_URL="postgresql://postgres:password@localhost:5432/openeco?schema=public"
NEXTAUTH_SECRET="dev-secret-minimum-32-characters-long-change-in-prod"
NEXTAUTH_URL="http://localhost:3000"
EOF
    fi
    echo -e "${CYAN}Created .env.local - edit with your settings${NC}"
fi

# Start PostgreSQL container if not running
if [ "$SKIP_POSTGRES" = false ]; then
    echo ""
    echo -e "${YELLOW}Checking PostgreSQL container...${NC}"

    # On macOS, check if podman machine is running
    if [ "$OS" = "macos" ]; then
        if ! podman machine list | grep -q "Currently running"; then
            echo -e "${YELLOW}Starting Podman machine...${NC}"
            podman machine init 2>/dev/null || true
            podman machine start
        fi
    fi

    PG_RUNNING=$(podman ps --filter "name=openeco-postgres" --format "{{.Names}}" 2>/dev/null || echo "")

    if [ "$PG_RUNNING" = "openeco-postgres" ]; then
        echo -e "${GREEN}PostgreSQL already running.${NC}"
    else
        PG_EXISTS=$(podman ps -a --filter "name=openeco-postgres" --format "{{.Names}}" 2>/dev/null || echo "")

        if [ "$PG_EXISTS" = "openeco-postgres" ]; then
            echo -e "${YELLOW}Starting existing PostgreSQL container...${NC}"
            podman start openeco-postgres
        else
            echo -e "${YELLOW}Creating and starting PostgreSQL container...${NC}"
            podman run --name openeco-postgres \
                -e POSTGRES_PASSWORD=password \
                -e POSTGRES_DB=openeco \
                -p 5432:5432 \
                -d postgres:15
        fi
        echo -e "${GREEN}PostgreSQL started on port 5432${NC}"
    fi
fi

# Initialize Prisma
echo ""
echo -e "${YELLOW}Initializing database...${NC}"
cd "$WEB_DIR"
npx prisma generate
npx prisma db push

# ============================================
# DONE
# ============================================

echo ""
echo -e "${GREEN}========================================"
echo "  Setup Complete!"
echo -e "========================================${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo "  1. cd web"
echo "  2. npm run dev"
echo "  3. Open http://localhost:3000"
echo ""

