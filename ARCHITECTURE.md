# OpenEco Architecture

This document describes the technical architecture, deployment models, and distribution strategy for the Open Climate Transparency Platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Repository Structure](#repository-structure)
3. [Distribution Model](#distribution-model)
4. [Deployment Architecture](#deployment-architecture)
5. [Technology Stack](#technology-stack)
6. [Application Architecture](#application-architecture)
7. [Calculation Engine](#calculation-engine)
8. [Reporting Engine](#reporting-engine)
9. [Forecasting & Analytics Engine](#forecasting--analytics-engine)
10. [Cross-Instance Data Sharing](#cross-instance-data-sharing)
11. [Release Strategy](#release-strategy)
12. [Roadmap](#roadmap)

---

## Overview

OpenEco is an **open-source, cloud-native enterprise application** that companies download, install, and self-host on their own infrastructure.

### Mission: Credible Climate Data

We believe the credibility of climate reporting depends on **transparency of method**, not proprietary systems.

| Principle | Implementation |
|-----------|----------------|
| **GHG Protocol–aligned methodologies** | Full conformance with GHG Protocol Corporate Standard for Scope 1, 2, and 3 |
| **Uses IPCC / DEFRA / EPA factors** | Authoritative, versioned, publicly available emission factor datasets |
| **Designed for third-party assurance** | Every calculation links inputs → factors → outputs with full provenance |
| **Audit-ready by design** | Evidence attachments, approval workflows, locked periods, immutable records |
| **Reproducible, transparent calculations** | Open algorithms — no black boxes — anyone can verify |

### Core Principles

- **Data Sovereignty**: Companies own and control their data
- **Privacy & Security**: Data stays within company-controlled environments
- **Compliance Ready**: Meets enterprise security and regulatory requirements
- **Cost Efficient**: No per-seat or subscription fees
- **Customizable**: Companies can extend and modify the platform
- **Algorithmic Transparency**: Open calculation methodologies with override capabilities

---

## Repository Structure

```
open-eco/
├── web/                           # Next.js application
│   ├── app/                       # Next.js App Router
│   │   └── api/                   # API routes
│   ├── components/                # React components
│   │   └── reports/               # Report UI components
│   ├── lib/                       # Core libraries
│   │   ├── calculations/          # Calculation engine
│   │   │   ├── algorithms/        # Algorithm templates
│   │   │   │   ├── generic/       # Default algorithms
│   │   │   │   └── regional/      # Region-specific algorithms
│   │   │   ├── factors/           # Emission factor management
│   │   │   └── engine.ts          # Calculation orchestrator
│   │   ├── reporting/             # Reporting engine
│   │   │   ├── frameworks/        # TCFD, CSRD, CDP, GRI schemas
│   │   │   ├── templates/         # Report templates
│   │   │   ├── collectors/        # Data collectors
│   │   │   ├── mappers/           # Framework mappers
│   │   │   ├── pdf/               # PDF generation
│   │   │   ├── queue/             # Job queue (BullMQ)
│   │   │   ├── verification/      # Hash, QR, public verification
│   │   │   └── storage/           # S3-compatible storage
│   │   ├── forecasting/           # Forecasting & analytics
│   │   │   ├── models/            # Statistical models
│   │   │   ├── scenarios/         # Scenario analysis
│   │   │   └── projections/       # Emission projections
│   │   └── prisma.ts              # Database client
│   ├── prisma/                    # Database schema
│   └── public/                    # Static assets
│
├── docs/                          # EcoKit design system documentation
│   ├── index.html                 # Homepage
│   ├── components.html            # Component library
│   ├── tokens.html                # Design tokens
│   └── assets/EcoKit/             # Design system CSS/JS
│
├── deploy/                        # Deployment configurations
│   ├── compose.dev.yml            # Podman/Docker Compose for dev
│   └── okd/                       # Kubernetes/OKD manifests
│
└── [root]/                        # Project documentation
    ├── README.md
    ├── ARCHITECTURE.md            # This file
    ├── PLATFORM_FEATURES.md
    ├── INSTALLATION.md
    └── Reporting_enginer.md       # Detailed reporting engine spec
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

## Calculation Engine

The Calculation Engine is the core of OpenEco's emission calculations. It provides **transparent, auditable, and overridable** algorithms for converting activity data into emission results.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Calculation Engine                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Activity   │───▶│  Algorithm   │───▶│   Emission   │          │
│  │     Data     │    │   Resolver   │    │    Result    │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                             │                                        │
│                             ▼                                        │
│         ┌─────────────────────────────────────────┐                 │
│         │         Algorithm Registry              │                 │
│         ├─────────────────────────────────────────┤                 │
│         │  1. Organization Override (highest)     │                 │
│         │  2. Regional Algorithm                  │                 │
│         │  3. Generic Algorithm (fallback)        │                 │
│         └─────────────────────────────────────────┘                 │
│                             │                                        │
│                             ▼                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Factor     │    │     GWP      │    │  Methodology │          │
│  │   Library    │    │    Values    │    │   Metadata   │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Algorithm Template System

Algorithms are defined as **versioned, auditable templates** that can be overridden at multiple levels.

#### Algorithm Interface

```typescript
interface CalculationAlgorithm {
  id: string;                    // "electricity-grid-average"
  version: string;               // "2024.1"
  name: string;                  // "Grid Average Electricity"
  category: string;              // "scope2.electricity"
  region?: string;               // null = generic, "US", "EU", "UK", etc.
  
  // Input specification
  inputs: AlgorithmInput[];
  
  // The calculation function
  calculate(input: CalculationInput): CalculationOutput;
  
  // Metadata for audit trail
  methodology: string;           // "GHG Protocol Scope 2 Guidance"
  references: string[];          // Supporting documentation
  effectiveDate: Date;
  deprecatedDate?: Date;
}

interface AlgorithmInput {
  name: string;                  // "consumption"
  type: 'number' | 'string' | 'date';
  unit: string;                  // "kWh"
  required: boolean;
}

interface CalculationOutput {
  co2e: number;                  // Total CO2e in kg
  breakdown?: {                  // Optional gas breakdown
    co2?: number;
    ch4?: number;
    n2o?: number;
  };
  factor: EmissionFactorRef;     // Factor used
  algorithm: AlgorithmRef;       // Algorithm reference
  confidence: 'high' | 'medium' | 'low';
  warnings?: string[];
}
```

#### Generic Algorithms (`lib/calculations/algorithms/generic/`)

Default algorithms following GHG Protocol guidance:

| Algorithm | Category | Description |
|-----------|----------|-------------|
| `stationary-combustion.ts` | Scope 1 | Fuel combustion in owned equipment |
| `mobile-combustion.ts` | Scope 1 | Company vehicles |
| `fugitive-emissions.ts` | Scope 1 | Refrigerant leaks, etc. |
| `electricity-location.ts` | Scope 2 | Location-based grid electricity |
| `electricity-market.ts` | Scope 2 | Market-based with instruments |
| `purchased-goods.ts` | Scope 3.1 | Spend-based or activity-based |
| `business-travel.ts` | Scope 3.6 | Distance or spend-based |
| `employee-commuting.ts` | Scope 3.7 | Survey or average-based |
| `waste-disposal.ts` | Scope 3.5 | By waste type and treatment |

#### Regional Algorithms (`lib/calculations/algorithms/regional/`)

Region-specific algorithms with localized factors and methodologies:

```
regional/
├── US/
│   ├── epa-egrid-electricity.ts      # EPA eGRID subregion factors
│   ├── epa-fleet-average.ts          # EPA fleet average method
│   └── carb-lcfs.ts                  # California LCFS method
├── EU/
│   ├── aib-residual-mix.ts           # AIB residual mix factors
│   ├── defra-uk.ts                   # UK DEFRA methodology
│   └── ademe-france.ts               # French ADEME factors
├── APAC/
│   ├── nger-australia.ts             # Australian NGER method
│   ├── moe-japan.ts                  # Japan MOE factors
│   └── cec-china.ts                  # China grid factors
└── index.ts                          # Regional registry
```

#### Algorithm Resolution Priority

When calculating emissions, the engine resolves algorithms in this order:

1. **Organization Override** — Custom algorithm defined by the org
2. **Regional Algorithm** — Matches org's country/region
3. **Generic Algorithm** — Default GHG Protocol method

```typescript
class AlgorithmResolver {
  resolve(
    category: string,
    organizationId: string,
    region?: string
  ): CalculationAlgorithm {
    // 1. Check for org-specific override
    const orgOverride = this.getOrgOverride(organizationId, category);
    if (orgOverride) return orgOverride;
    
    // 2. Check for regional algorithm
    if (region) {
      const regional = this.getRegionalAlgorithm(category, region);
      if (regional) return regional;
    }
    
    // 3. Fall back to generic
    return this.getGenericAlgorithm(category);
  }
}
```

### Organization Algorithm Overrides

Organizations can override any algorithm with custom logic while maintaining full audit trail.

#### Override Database Schema

```prisma
model AlgorithmOverride {
  id              String   @id @default(cuid())
  organizationId  String
  algorithmId     String   // Which algorithm to override
  version         String
  name            String
  description     String?
  
  // Override types:
  // 1. Factor adjustment
  factorMultiplier Float?
  
  // 2. Complete custom calculation (stored as code)
  customLogic     String?  @db.Text
  
  // Audit fields
  justification   String   // Why this override exists
  approvedBy      String?
  approvedAt      DateTime?
  effectiveFrom   DateTime
  effectiveTo     DateTime?
  
  // Provenance
  createdBy       String
  createdAt       DateTime @default(now())
  
  organization    Organization @relation(...)
  
  @@index([organizationId, algorithmId])
}
```

#### Override Types

| Type | Use Case | Example |
|------|----------|---------|
| **Factor Adjustment** | Supplier-specific emission factor | Custom EF for electricity contract |
| **Methodology Override** | Industry-specific calculation | Cement industry clinker ratio |
| **Complete Custom** | Unique business process | Proprietary manufacturing |

### Emission Factor Library

Versioned, regionalized emission factors with full provenance:

```typescript
interface EmissionFactor {
  id: string;
  datasetId: string;            // "DEFRA-2024", "EPA-2023", "IPCC-AR6"
  datasetVersion: string;
  
  category: string;             // "electricity", "natural_gas", "diesel"
  subcategory?: string;
  
  factor: number;               // CO2e per unit
  unit: string;                 // "kgCO2e/kWh"
  
  region?: string;              // Country/region code
  
  gwpSet: 'AR4' | 'AR5' | 'AR6';
  gwpTimeframe: '100yr' | '20yr';
  
  source: string;               // Citation
  sourceUrl?: string;
  
  effectiveFrom: Date;
  effectiveTo?: Date;
}
```

### Calculation Audit Trail

Every calculation produces an immutable audit record:

```typescript
interface CalculationRecord {
  id: string;
  timestamp: Date;
  
  // Input
  activityDataId: string;
  input: {
    quantity: number;
    unit: string;
    periodStart: Date;
    periodEnd: Date;
  };
  
  // Algorithm used
  algorithm: {
    id: string;
    version: string;
    type: 'generic' | 'regional' | 'override';
    overrideId?: string;
  };
  
  // Factor used
  factor: {
    id: string;
    dataset: string;
    version: string;
    value: number;
    unit: string;
  };
  
  // Output
  output: {
    co2e: number;
    breakdown?: object;
    confidence: string;
  };
  
  // Engine metadata
  engineVersion: string;
  checksumInput: string;        // Hash of inputs
  checksumOutput: string;       // Hash of outputs
}
```

---

## Reporting Engine

The Reporting Engine generates framework-compliant reports (TCFD, CSRD, CDP, GRI) with async processing, HTML-to-PDF rendering, and public verification artifacts.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Reporting Engine                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │    Report    │───▶│   BullMQ     │───▶│    Worker    │          │
│  │   Request    │    │    Queue     │    │   Process    │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                 │                    │
│                                                 ▼                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Generation Pipeline                       │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │  Data         Framework      Template       PDF              │   │
│  │  Collector ─▶ Mapper     ─▶ Renderer   ─▶ Generator         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                 │                    │
│                                                 ▼                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Storage    │    │ Verification │    │   Database   │          │
│  │   (S3)       │    │ (Hash + QR)  │    │   (Report)   │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Core Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Job Queue** | Async report generation | Redis + BullMQ |
| **Data Collector** | Gather emissions, activity, org data | Prisma queries |
| **Framework Mapper** | Map data to TCFD/CSRD/CDP/GRI fields | JSON schemas |
| **Template Renderer** | Generate HTML from React components | React SSR |
| **PDF Generator** | Convert HTML to PDF | Playwright |
| **Verification** | Hash content, generate QR codes | SHA-256 + qrcode |
| **Storage** | Store report artifacts | S3-compatible |

### Supported Frameworks

| Framework | Status | Description |
|-----------|--------|-------------|
| **TCFD** | Primary | Task Force on Climate-related Financial Disclosures |
| **CSRD** | Planned | Corporate Sustainability Reporting Directive (EU) |
| **CDP** | Planned | Carbon Disclosure Project questionnaire |
| **GRI** | Planned | Global Reporting Initiative (GRI 305) |
| **SEC Climate** | Future | US SEC climate disclosure rules |

### Report Generation Flow

1. **Request** — User selects framework, period, and options
2. **Queue** — Job added to BullMQ with progress tracking
3. **Collect** — Gather all required data from database
4. **Map** — Transform data to framework-specific disclosures
5. **Render** — Generate HTML using React templates
6. **PDF** — Convert HTML to PDF via Playwright
7. **Verify** — Generate content hash and verification code
8. **Store** — Upload artifacts to S3 storage
9. **Complete** — Update database, notify user

### Public Verification

Every report includes verification artifacts:

- **Content Hash** — SHA-256 of PDF content
- **Verification Code** — Short alphanumeric code (e.g., `OE-2024-A7X9`)
- **QR Code** — Embedded in PDF footer, links to verification URL
- **Public Endpoint** — `GET /api/verify/[code]` returns report metadata

> See [Reporting_enginer.md](./Reporting_enginer.md) for detailed implementation specifications.

---

## Forecasting & Analytics Engine

The Forecasting Engine provides **predictive analytics, scenario modeling, and data-driven projections** for emission reduction planning.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Forecasting & Analytics Engine                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Data Ingestion Layer                      │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │  Historical     Activity      External       Market          │   │
│  │  Emissions      Trends        Data (API)     Signals         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     Model Registry                           │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │  Statistical    ML Models    Scenario       Custom           │   │
│  │  Models         (Optional)   Templates      Models           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Projection Engine                         │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │  Baseline       Target        Gap           Pathway          │   │
│  │  Projection     Alignment     Analysis      Generation       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │  Scenarios   │    │    Charts    │    │   Exports    │          │
│  │  Database    │    │    & UI      │    │   (CSV/JSON) │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Statistical Models

Built-in models for emission forecasting:

| Model | Use Case | Method |
|-------|----------|--------|
| **Linear Trend** | Simple baseline projection | Linear regression |
| **Seasonal Decomposition** | Accounts for seasonality | STL decomposition |
| **Exponential Smoothing** | Weighted recent data | Holt-Winters |
| **Growth Curve** | Saturation/maturity curves | Logistic/Gompertz |
| **ARIMA** | Time series with autocorrelation | Auto-ARIMA |

#### Model Interface

```typescript
interface ForecastModel {
  id: string;                      // "linear-trend"
  name: string;                    // "Linear Trend Projection"
  type: 'statistical' | 'ml' | 'scenario' | 'custom';
  
  // Configuration
  parameters: ModelParameter[];
  
  // Methods
  fit(historicalData: TimeSeriesData): FittedModel;
  predict(horizon: number, intervals?: number[]): Projection;
  
  // Metadata
  description: string;
  assumptions: string[];
  limitations: string[];
}

interface Projection {
  timeline: Date[];
  values: number[];                // Point estimates
  confidence: {
    lower: number[];               // e.g., 5th percentile
    upper: number[];               // e.g., 95th percentile
  };
  model: ModelRef;
  generatedAt: Date;
}
```

### Scenario Analysis

Pre-built scenario templates aligned with climate science:

| Scenario | Description | Based On |
|----------|-------------|----------|
| **Business as Usual (BAU)** | No additional action | Historical trend |
| **SBTi 1.5°C Aligned** | Science-based target pathway | SBTi guidance |
| **SBTi Well-Below 2°C** | Less aggressive reduction | SBTi guidance |
| **Net Zero 2050** | Net zero by 2050 pathway | Race to Zero |
| **Custom Target** | User-defined reduction target | Organization goals |

#### Scenario Definition

```typescript
interface ScenarioTemplate {
  id: string;                      // "sbti-1.5c"
  name: string;                    // "SBTi 1.5°C Aligned"
  description: string;
  
  // Target definition
  targetType: 'absolute' | 'intensity';
  baselineYear: number;
  targetYear: number;
  reductionPercent: number;        // e.g., 42% by 2030
  
  // Pathway shape
  pathwayType: 'linear' | 'exponential' | 'custom';
  
  // Scope coverage
  scopes: ('1' | '2' | '3')[];
  
  // Reference
  methodology: string;
  reference: string;
}
```

### Reduction Initiative Modeling

Model impact of specific reduction initiatives:

```typescript
interface ReductionInitiative {
  id: string;
  name: string;                    // "LED Lighting Upgrade"
  category: string;                // "energy_efficiency"
  
  // Scope
  targetScope: '1' | '2' | '3';
  targetCategory?: string;
  facilities?: string[];           // Specific facilities, or all
  
  // Impact modeling
  impactModel: {
    type: 'absolute' | 'percentage';
    value: number;                 // e.g., 500 tCO2e/year or 15%
    unit?: string;
  };
  
  // Timeline
  implementationStart: Date;
  rampUpMonths: number;            // Time to full impact
  
  // Financial (optional)
  capex?: number;
  annualOpex?: number;
  annualSavings?: number;
  
  // Status
  status: 'planned' | 'in_progress' | 'completed';
}
```

### Gap Analysis

Automatic gap analysis between projections and targets:

```typescript
interface GapAnalysis {
  scenarioId: string;
  baselineProjection: Projection;
  targetPathway: number[];
  
  gaps: {
    year: number;
    projected: number;
    target: number;
    gap: number;                   // Positive = above target
    gapPercent: number;
  }[];
  
  summary: {
    totalGap: number;              // Cumulative gap over period
    yearOfAlignment?: number;      // When projection meets target
    additionalReductionNeeded: number;
  };
  
  recommendations: string[];       // Auto-generated suggestions
}
```

### Custom Model Registration

Organizations can register custom forecasting models:

```prisma
model CustomForecastModel {
  id              String   @id @default(cuid())
  organizationId  String
  name            String
  description     String?
  
  // Model type
  modelType       String   // "statistical", "ml", "hybrid"
  
  // Configuration
  parameters      Json     // Model-specific parameters
  
  // For ML models: serialized model weights
  modelArtifact   Bytes?
  
  // Training metadata
  trainingDataStart Date?
  trainingDataEnd   Date?
  metrics           Json?   // R², RMSE, MAPE, etc.
  
  // Audit
  createdBy       String
  createdAt       DateTime @default(now())
  validatedBy     String?
  validatedAt     DateTime?
  
  organization    Organization @relation(...)
}
```

### External Data Integration

Support for incorporating external signals:

| Data Source | Use Case | Integration |
|-------------|----------|-------------|
| **Grid Carbon Intensity** | Real-time Scope 2 | API (ElectricityMaps) |
| **Weather Data** | Energy demand correlation | API (OpenWeather) |
| **Economic Indicators** | Activity-based projections | API or manual |
| **Industry Benchmarks** | Comparative analysis | Dataset upload |

### Forecast Versioning

All forecasts are versioned and immutable for audit purposes:

```typescript
interface ForecastRun {
  id: string;
  organizationId: string;
  
  // Configuration snapshot
  config: {
    model: ModelRef;
    scenario: ScenarioRef;
    initiatives: InitiativeRef[];
    parameters: object;
  };
  
  // Input data snapshot
  inputDataHash: string;
  inputDataRange: { start: Date; end: Date; };
  
  // Results
  projection: Projection;
  gapAnalysis?: GapAnalysis;
  
  // Metadata
  runAt: DateTime;
  runBy: string;
  engineVersion: string;
}
```

### Analytics API

```typescript
// Baseline projection
POST /api/forecasting/project
{
  organizationId: string;
  model: 'linear-trend' | 'seasonal' | 'arima';
  horizon: number;  // months
  scopes?: string[];
}

// Scenario comparison
POST /api/forecasting/scenarios/compare
{
  organizationId: string;
  scenarios: string[];
  initiatives?: string[];
}

// Gap analysis
POST /api/forecasting/gap-analysis
{
  organizationId: string;
  scenarioId: string;
  targetYear: number;
}

// Initiative impact modeling
POST /api/forecasting/initiatives/model
{
  organizationId: string;
  initiative: ReductionInitiative;
  showProjectedImpact: boolean;
}
```

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

- [README.md](./README.md) — Project overview
- [PLATFORM_FEATURES.md](./PLATFORM_FEATURES.md) — Features and roadmap
- [INSTALLATION.md](./INSTALLATION.md) — Setup and deployment guide
- [SECURITY_AND_GOVERNANCE.md](./SECURITY_AND_GOVERNANCE.md) — Security model, trust boundaries, and data governance
- [OPEN_SOURCE_PLAYBOOK.md](./OPEN_SOURCE_PLAYBOOK.md) — Open source governance and community guidelines
- [Reporting_enginer.md](./Reporting_enginer.md) — Detailed reporting engine specifications
- [COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md) — Market analysis and product strategy

---

**Status**: 🚧 In Development  
**Last Updated**: 2024
