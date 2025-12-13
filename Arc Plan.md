# Open Climate Transparency Platform

**Version 1.0 — Foundational Architecture**

## 1. Purpose of This Document

This document describes the initial technical architecture for the Open Climate Transparency Platform — a nonprofit, open-source system designed to enable companies, suppliers, researchers, and the public to measure, publish, and analyze climate impact data freely.

This version focuses on:

- Zero-cost access for companies
- Scalability on modern infrastructure
- Transparency and auditability
- Volunteer-friendly development
- Public-good data publishing
- Secure multi-tenancy with immutable records

## 2. Architectural Principles

The architecture is built upon the following core principles:

### 2.1 Zero-Cost for Companies

The software is free to use forever. No subscriptions. No limits.

Operational costs remain minimal through use of efficient cloud providers and open-source tooling.

### 2.2 Open Source by Default

All code, methodologies, emission factors, and calculations are publicly auditable.

Security relies on integrity and authenticity, not secrecy.

### 2.3 Transparent Climate Data

Organizations intentionally publish their climate data to a global public dataset.

This combats greenwashing and democratizes access to environmental information.

### 2.4 Integrity Over Confidentiality

- Identity verification
- Immutable append-only emissions records
- Public audit trails
- Versioned datasets and methodologies

### 2.5 Volunteer-Friendly

The architecture minimizes operational complexity and uses tools that are easy for contributors to adopt.

### 2.6 Scalable, Low-Cost Infrastructure

Starts nearly free → scales to thousands of organizations with minimal cost increases.

## 3. High-Level System Overview

```
┌──────────────────────────┐
│         Frontend          │
│     (Next.js + Vercel)    │
└──────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────┐
│                Backend Platform                 │
│             (Supabase + Edge Functions)         │
│  - Auth                                         │
│  - Postgres DB                                  │
│  - Storage                                      │
│  - Secure Logic (Edge Functions)                │
└────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────┐
│      Background Workers      │
│    (Railway / Fly.io, v2)    │
└─────────────────────────────┘
            │
            ▼
┌─────────────────────────────┐
│    Public Data Layer         │
│      (Cloudflare R2)         │
└─────────────────────────────┘
```

## 4. Core Platform Components

### 4.1 Frontend (Next.js on Vercel)

**Responsibilities:**

- User interface for companies, suppliers, and public viewers
- Client-side and server-side rendering of dashboards and reports
- Public emissions dataset pages
- Upload workflows for CSVs and manual data entry
- Report viewer and report generator interface
- Plugin management UI (future release)

**Why Vercel:**

- Global edge caching
- Scales transparently
- Free or nearly free for nonprofits
- Ideal for open-source PR previews and collaboration

### 4.2 Authentication & Multi-Tenancy (Supabase Auth)

**Features:**

- Managed email/password auth
- OAuth (Google/Microsoft) optional
- API key issuance per organization

**Role-based access:**

- ORG_ADMIN
- ORG_MEMBER
- SUPPLIER
- READ_ONLY

**Multi-Tenancy:**

Supabase Row-Level Security (RLS) ensures users only access records tied to their org_id.

**Organization Verification:**

- Email domain verification
- DNS TXT verification (phase 2)
- Optional document verification for large enterprises

### 4.3 Data Ingestion Service & AI Assistant

**Supported Inputs:**

- Uploaded CSV files
- Manual form entry
- Supplier portal submissions
- API ingestion (ERP/accounting/travel systems)
- **AI Assistant Conversations** (NEW)

**AI Assistant for Low-Barrier Entry:**

- Conversational interface for data entry
- Volunteers or company staff can talk to AI agent
- AI extracts and structures data from conversations
- Handles unstructured documentation and reports
- Automatically indexes company sustainability documentation
- Codifies and transmits data in platform-acceptable format
- Minimal technical knowledge required

**Pipeline:**

1. **Traditional Input**: File stored in Supabase Storage → Edge Function parses & validates → Rows normalized → Calculation jobs triggered
2. **AI Assistant Input**: Conversation → AI processes → Structured data extracted → Validated → Stored → Calculation jobs triggered

**Validation Includes:**

- Units, schema, and category checking
- Outlier detection (phase 2)
- Required field verification
- AI-assisted data quality checks

### 4.4 Emissions Calculation Engine

The core logic for converting activity data → CO₂e.

**Key Features:**

- Open, reproducible algorithms
- Fully versioned:
  - Dataset version
  - Methodology version
  - Calculation engine version

**Supports:**

- Scope 1
- Scope 2 (location- & market-based)
- All 15 Scope 3 categories
- Industry-specific and regional extensions via plugins

**Implementation:**

A reusable library (@openclimate/calculator) executed inside:

- Supabase Edge Functions (small jobs)
- Railway workers (bulk jobs)

**Output:**

Results stored in append-only emissions_results table.

### 4.5 Dataset & Emission Factor Service

**Purpose:**

Central, transparent source for all emissions factors.

**Structure:**

- emission_factors table
- dataset_versions table (immutable)
- Publicly accessible dataset endpoints
- Static JSON/CSV mirrors in GitHub

**Sources:**

- DEFRA
- IPCC
- EPA
- Region-specific datasets (via plugins)

### 4.6 Reporting & ESG Engine

**Capabilities:**

**Generate:**

- Annual emissions summaries
- ESG-aligned reports
- CSRD/ISSB/TCFD structured templates (phase 2)

**Export formats:**

- HTML
- PDF
- JSON
- CSV

**Architecture:**

1. Frontend triggers a report job
2. Backend aggregates emissions data
3. Worker generates final PDF
4. File stored in Supabase or R2
5. Public URL attached to reports table

### 4.7 Supplier Portal

**Features:**

- Supplier invitations
- Supplier identity verification
- Data entry for Scope 3 upstream categories
- Customer/supplier linkage

**Purpose:**

Provide a way for suppliers to directly contribute verified data into customers' Scope 3 accounting.

### 4.8 Public Data Layer & Searchable Metrics Database

**Deliverables:**

- **Searchable Metrics Database**: Global, queryable database of all company emissions and sustainability metrics
- **Public Company Profile Pages**: Open-source, self-hosted profile pages that companies can curate
- **Public Emissions Datasets**: Annual snapshots posted to:
  - Cloudflare R2
  - GitHub
  - CSV/Parquet formats

**Searchable Metrics Database:**

- Full-text search across all published metrics
- Filter by industry, region, scope, year
- Compare companies and benchmarks
- Export search results
- API access for researchers and analysts

**Company Profile Pages:**

- Open-source template system
- Companies can host their own sustainability documentation
- Curate articles, reports, and sustainability stories
- Minimal setup - fork template, customize, deploy
- Integrated with main platform metrics
- Companies maintain full control of their content

**Why:**

Transparent climate data must be open, downloadable, analyzable, remixable, and searchable.

## 5. Data Model (High-Level Tables)

**Core Tables:**

- organizations
- organization_users
- facilities
- raw_activity_data
- emission_factors
- dataset_versions
- emissions_results (append-only)
- reports
- suppliers
- supplier_activity_data
- audit_log

**New Tables (v1.0+):**

- **search_index** - Full-text search index for metrics database
- **company_profiles** - Links to company-hosted profile pages
- **ai_conversations** - Store AI assistant conversations (optional, for improvement)
- **profile_templates** - Template metadata for company profile system
- **metrics_queries** - Track popular searches and queries

Append-only tables ensure historical integrity.

## 6. Security Model

**Security Priorities:**

- **Integrity** — data cannot be silently changed
- **Authenticity** — only verified orgs submit data
- **Auditability** — all changes publicly traceable
- **Minimal secrecy** — only identities and credentials are private

**Key Mechanisms:**

- Supabase RLS for multi-tenancy
- Append-only emissions logs
- Public revision histories
- API rate limiting
- Secure secret management (no secrets in repo)
- Input validation in backend functions
- Public methodologies to remove "black-box" vulnerabilities

## 7. Deployment Architecture

### 7.1 Environments

- **local** — developer environment
- **staging** — Vercel + Supabase (test data)
- **production** — Vercel + Supabase + R2 + Railway

### 7.2 Deployment Workflow

1. Developer opens PR → GitHub Actions test/lint
2. Vercel creates preview URL
3. Supabase migration applied via CI or manual
4. Merge → auto-deploy to production

## 8. Scaling Strategy

### Phase 1 — MVP

- Free Vercel plan
- Supabase free tier
- Small data ingestion
- No workers required

### Phase 2 — Growth

- Supabase Pro tier
- Railway worker services for heavy processing
- Public dataset snapshots

### Phase 3 — Global Adoption

- CDN-backed static pages for heavy reads
- Partitioned Postgres or read replicas
- Queue-based ingestion pipelines
- Distributed dataset hosting

## 9. Governance & Open Source Structure

**GitHub Organization Repos:**

- core-platform (frontend)
- backend (edge functions + workers)
- calculator-engine
- datasets
- plugins
- docs (RFCs, methodology, governance)

**Governance Model:**

- Open RFC process
- Public discussions
- Transparent financial reporting (Open Collective)

## 10. Core Features (v1.0+)

### 10.1 Searchable Metrics Database

- Full-text search across all published company metrics
- Advanced filtering (industry, region, scope, year, size)
- Comparison tools and benchmarking
- Export capabilities (CSV, JSON, API)
- Real-time updates as companies publish data

### 10.2 Company Profile Pages (Open Source)

- **Template System**: Ready-made, customizable templates for company profiles
- **Self-Hosted**: Companies fork template, customize, and deploy
- **Content Curation**: Companies can add:
  - Sustainability articles and stories
  - Annual reports and documentation
  - Progress updates and milestones
  - Custom branding and messaging
- **Integration**: Profile pages link to main platform metrics
- **Minimal Setup**: Fork → Customize → Deploy (GitHub Pages, Vercel, etc.)

### 10.3 AI Assistant for Data Entry

- **Conversational Interface**: Natural language data entry
- **Document Processing**: AI reads and extracts data from:
  - PDF reports
  - Sustainability documentation
  - Spreadsheets
  - Unstructured text
- **Low Barrier**: Volunteers or non-technical staff can use
- **Automatic Structuring**: AI codifies data into platform format
- **Validation**: AI-assisted quality checks before submission

### 10.4 Future Enhancements (v2 and Beyond)

- Automated utility and travel integrations
- Supplier scoring
- Industry-specific plugin marketplace
- Carbon intensity benchmarking
- API for regulators and auditors
- Distributed dataset mirrors via IPFS (long term)

## 11. License

All code and data are published under permissive open-source licenses to maximize global utility.

**Suggested:**

- MIT or Apache-2.0 for code
- CC-BY or CC0 for dataset exports

## 12. Contact / Maintainers

This section will list core maintainers once the Foundation or working group is established.

---

**End of Architecture v1.0**
