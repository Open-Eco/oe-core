# OpenEco Development Environment Setup Script (Windows)
# Run as Administrator: .\scripts\setup.ps1

param(
    [switch]$SkipNodeJS,
    [switch]$SkipGit,
    [switch]$SkipPodman,
    [switch]$SkipPostgres,
    [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OpenEco Development Setup (Windows)  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Track what needs to be installed
$missingDeps = @()

# ============================================
# CHECK DEPENDENCIES
# ============================================

function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

Write-Host "Checking dependencies..." -ForegroundColor Yellow
Write-Host ""

# Node.js
Write-Host -NoNewline "  Node.js 18+     : "
if (Test-Command "node") {
    $nodeVersion = (node --version) -replace 'v', ''
    $nodeMajor = [int]($nodeVersion.Split('.')[0])
    if ($nodeMajor -ge 18) {
        Write-Host "OK (v$nodeVersion)" -ForegroundColor Green
    } else {
        Write-Host "OUTDATED (v$nodeVersion, need 18+)" -ForegroundColor Red
        $missingDeps += "nodejs"
    }
} else {
    Write-Host "NOT FOUND" -ForegroundColor Red
    $missingDeps += "nodejs"
}

# Git
Write-Host -NoNewline "  Git 2.30+       : "
if (Test-Command "git") {
    $gitVersion = (git --version) -replace 'git version ', ''
    Write-Host "OK (v$gitVersion)" -ForegroundColor Green
} else {
    Write-Host "NOT FOUND" -ForegroundColor Red
    $missingDeps += "git"
}

# Podman
Write-Host -NoNewline "  Podman 4+       : "
if (Test-Command "podman") {
    $podmanVersion = (podman --version) -replace 'podman version ', ''
    Write-Host "OK (v$podmanVersion)" -ForegroundColor Green
} else {
    Write-Host "NOT FOUND" -ForegroundColor Red
    $missingDeps += "podman"
}

# npm (comes with Node.js)
Write-Host -NoNewline "  npm             : "
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "OK (v$npmVersion)" -ForegroundColor Green
} else {
    Write-Host "NOT FOUND (install Node.js first)" -ForegroundColor Red
}

Write-Host ""

# ============================================
# CHECK ONLY MODE
# ============================================

if ($CheckOnly) {
    if ($missingDeps.Count -eq 0) {
        Write-Host "All dependencies installed!" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "Missing dependencies: $($missingDeps -join ', ')" -ForegroundColor Red
        exit 1
    }
}

# ============================================
# INSTALL MISSING DEPENDENCIES
# ============================================

if ($missingDeps.Count -gt 0) {
    Write-Host "Missing dependencies detected. Attempting to install..." -ForegroundColor Yellow
    Write-Host ""

    # Check for winget
    if (-not (Test-Command "winget")) {
        Write-Host "ERROR: winget not found. Please install dependencies manually:" -ForegroundColor Red
        Write-Host ""
        Write-Host "  Node.js:       https://nodejs.org" -ForegroundColor White
        Write-Host "  Git:           https://git-scm.com" -ForegroundColor White
        Write-Host "  Podman Desktop: https://podman-desktop.io" -ForegroundColor White
        exit 1
    }

    foreach ($dep in $missingDeps) {
        switch ($dep) {
            "nodejs" {
                if (-not $SkipNodeJS) {
                    Write-Host "Installing Node.js..." -ForegroundColor Yellow
                    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
                }
            }
            "git" {
                if (-not $SkipGit) {
                    Write-Host "Installing Git..." -ForegroundColor Yellow
                    winget install Git.Git --accept-package-agreements --accept-source-agreements
                }
            }
            "podman" {
                if (-not $SkipPodman) {
                    Write-Host "Installing Podman Desktop..." -ForegroundColor Yellow
                    winget install RedHat.Podman-Desktop --accept-package-agreements --accept-source-agreements
                    Write-Host ""
                    Write-Host "NOTE: After installation, launch Podman Desktop and initialize a machine." -ForegroundColor Cyan
                }
            }
        }
    }

    Write-Host ""
    Write-Host "Please restart your terminal and run this script again to verify installation." -ForegroundColor Yellow
    exit 0
}

# ============================================
# SETUP PROJECT
# ============================================

Write-Host "All dependencies installed! Setting up project..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
$webDir = Join-Path $PSScriptRoot "..\web"
if (-not (Test-Path $webDir)) {
    Write-Host "ERROR: web/ directory not found. Run this script from the repo root." -ForegroundColor Red
    exit 1
}

# Install npm dependencies
Write-Host "Installing npm packages..." -ForegroundColor Yellow
Push-Location $webDir
npm install
Pop-Location

# Create .env.local if it doesn't exist
$envFile = Join-Path $webDir ".env.local"
$envExample = Join-Path $webDir ".env.example"

if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env.local..." -ForegroundColor Yellow
    if (Test-Path $envExample) {
        Copy-Item $envExample $envFile
    } else {
        @"
DATABASE_URL="postgresql://postgres:password@localhost:5432/openeco?schema=public"
NEXTAUTH_SECRET="dev-secret-minimum-32-characters-long-change-in-prod"
NEXTAUTH_URL="http://localhost:3000"
"@ | Out-File -FilePath $envFile -Encoding UTF8
    }
    Write-Host "Created $envFile - edit with your settings" -ForegroundColor Cyan
}

# Start PostgreSQL container if not running
if (-not $SkipPostgres) {
    Write-Host ""
    Write-Host "Checking PostgreSQL container..." -ForegroundColor Yellow
    
    $pgRunning = podman ps --filter "name=openeco-postgres" --format "{{.Names}}" 2>$null
    
    if ($pgRunning -eq "openeco-postgres") {
        Write-Host "PostgreSQL already running." -ForegroundColor Green
    } else {
        # Check if container exists but is stopped
        $pgExists = podman ps -a --filter "name=openeco-postgres" --format "{{.Names}}" 2>$null
        
        if ($pgExists -eq "openeco-postgres") {
            Write-Host "Starting existing PostgreSQL container..." -ForegroundColor Yellow
            podman start openeco-postgres
        } else {
            Write-Host "Creating and starting PostgreSQL container..." -ForegroundColor Yellow
            podman run --name openeco-postgres `
                -e POSTGRES_PASSWORD=password `
                -e POSTGRES_DB=openeco `
                -p 5432:5432 `
                -d postgres:15
        }
        Write-Host "PostgreSQL started on port 5432" -ForegroundColor Green
    }
}

# Initialize Prisma
Write-Host ""
Write-Host "Initializing database..." -ForegroundColor Yellow
Push-Location $webDir
npx prisma generate
npx prisma db push
Pop-Location

# ============================================
# DONE
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete!                      " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. cd web" -ForegroundColor White
Write-Host "  2. npm run dev" -ForegroundColor White
Write-Host "  3. Open http://localhost:3000" -ForegroundColor White
Write-Host ""

