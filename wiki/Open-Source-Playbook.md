# OpenEco Open Source Playbook: Governance, Auditability & Factor Management

This document provides the practical implementation blueprint for building enterprise-grade governance, auditability, and emission factor management in an open source carbon platform.

---

## 1. Governance: Who Can Change What, When, Why, and With Whose Approval

### Definition

Governance = who can change what, when, why, and with whose approval.

### Must-Have Capabilities

#### A) Org Boundary + Methodology Settings (Explicit & Versioned)

| Setting | Options | Default |
|---------|---------|---------|
| **Organizational boundary** | Equity share / Operational control / Financial control | Operational control |
| **Reporting period** | Fiscal year / Calendar year | Calendar year |
| **Scope 2 method** | Location-based / Market-based / Both | Both |
| **GWP set** | AR4 / AR5 / AR6 | AR6 |
| **GWP time horizon** | 20-year / 100-year | 100-year |

> ⚠️ All "defaults" must be visible, versioned, and logged when changed.

#### B) RBAC (Roles) That Map to Real Workflows

| Role | Permissions |
|------|-------------|
| **Admin** | Settings, users, integrations, org boundary, factor library |
| **Data Contributor** | Create/edit draft activity data, upload evidence |
| **Reviewer/Approver** | Approve submissions, lock periods, request changes |
| **Auditor/Read-only** | View everything + export audit pack |

#### C) Workflow States + Period Locking

```
┌─────────┐     ┌───────────┐     ┌──────────┐     ┌────────┐
│  DRAFT  │ ──▶ │ SUBMITTED │ ──▶ │ APPROVED │ ──▶ │ LOCKED │
└─────────┘     └───────────┘     └──────────┘     └────────┘
     │               │                  │               │
     │  User edits   │  Under review    │  Finalized    │  Immutable
     │  freely       │  Awaiting        │  Ready for    │  Reopen requires
     └───────────────┴──approval────────┴──export───────┴──formal approval
```

**Rules:**
- Once **Locked**, data is immutable
- Reopen requires formal approval (logged + reason required)
- Each state transition is an audit event

#### D) Evidence Requirement Hooks

| Feature | Description |
|---------|-------------|
| Evidence attachments | Per activity line: optional or required (invoice, utility bill, hauler ticket) |
| Attachment types | Invoice, utility bill, meter reading, scale ticket, contract, other |
| Reviewer actions | Approve / Request changes (with comments) / Reject |
| Hash verification | SHA-256 of uploaded files for integrity |

### Open Source Implementation

| Component | OSS Tool | Purpose |
|-----------|----------|---------|
| **Auth/IAM** | Keycloak or Authentik | SSO + role management |
| **Policy layer** | Open Policy Agent (OPA) | Express governance rules |
| **Database** | PostgreSQL + RLS | Row-level security per org |

**OPA Policy Examples:**

```rego
# Only approvers can lock a period
allow {
    input.action == "lock_period"
    input.user.role == "approver"
}

# No edits to approved periods
deny {
    input.action == "edit_activity"
    input.period.status == "approved"
}

# No edits to locked periods (ever)
deny {
    input.action == "edit_activity"
    input.period.status == "locked"
}
```

---

## 2. Auditability: What Auditors Actually Need

### Definition

> Auditability isn't "we have logs." It's **reproducibility + provenance**.

### Must-Have Capabilities

#### A) Append-Only Event Log

Every create/edit/delete is a recorded event with:

| Field | Description |
|-------|-------------|
| `who` | User ID + name |
| `when` | ISO timestamp (UTC) |
| `what_changed` | Field-level diff (before/after) |
| `why` | Reason code or free text |
| `ticket_link` | Optional reference to external system |
| `ip_address` | For security audit |
| `user_agent` | For security audit |

**Implementation:**
- Store events in an **immutable table** (no UPDATE/DELETE)
- Or enforce via database triggers/rules
- Use `INSERT` only, never modify

```sql
CREATE TABLE change_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,  -- 'create', 'update', 'delete', 'approve', 'lock'
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    changes JSONB,  -- {"field": {"old": x, "new": y}}
    reason TEXT,
    metadata JSONB,
    -- NO UPDATE/DELETE allowed on this table
    CONSTRAINT no_updates CHECK (TRUE)
);

-- Prevent updates and deletes
CREATE RULE no_update AS ON UPDATE TO change_events DO INSTEAD NOTHING;
CREATE RULE no_delete AS ON DELETE TO change_events DO INSTEAD NOTHING;
```

#### B) Reproducible Calculation Runs

Every emissions output must point to:

| Component | How to Version |
|-----------|----------------|
| **Activity dataset** | SHA-256 hash of canonical JSON |
| **Factor dataset** | Version ID + SHA-256 hash |
| **Calculation engine** | Git SHA / release tag |
| **Method settings** | Snapshot ID (GWP, scope 2 method, boundary) |

**Rule:** If any of these change, it's a **new calculation run**, not an overwrite.

```typescript
interface CalculationRun {
  id: string;
  timestamp: string;
  activityDatasetHash: string;  // SHA-256
  factorDatasetVersion: string;
  factorDatasetHash: string;    // SHA-256
  engineVersion: string;        // e.g., "v1.2.3" or git SHA
  configSnapshotId: string;
  results: EmissionResult[];
  // Immutable after creation
}
```

#### C) Audit Pack Export

**One button to generate a zip containing:**

```
audit-pack-2024-Q3.zip
├── activity-data.csv
├── activity-data.json
├── factors-used.csv           # Subset of factors actually used
├── factor-citations.json      # Full citations
├── methodology-config.json    # GWP, scope 2 method, boundary
├── calculation-results.csv
├── change-log.csv             # All events for period
├── evidence-manifest.json     # Filenames + hashes + links
├── README.md                  # Explains the pack
└── checksums.sha256           # Integrity verification
```

> This is the **fastest way to be taken seriously** by auditors.

#### D) Lineage Views ("Explain This Number")

From any dashboard number: **"Show me the inputs + factors that produced this."**

```
┌────────────────────────────────────────────────────────────┐
│  Electricity Emissions: 1,250 tCO₂e                        │
├────────────────────────────────────────────────────────────┤
│  Calculation Details                                       │
│  ─────────────────────────────────────────────────────────│
│  Activity: 2,500,000 kWh                                  │
│  Period: 2024-01-01 to 2024-03-31                         │
│  Facility: HQ Building, San Francisco                     │
│                                                           │
│  Factor Applied                                           │
│  ─────────────────────────────────────────────────────────│
│  Factor: 0.0005 tCO₂e/kWh                                 │
│  Source: DEFRA 2024, Table 1c, Row 23                     │
│  Version: defra-2024-v1.0.2                               │
│  Region: United States                                    │
│  Selection Rule: Country match → US grid average          │
│                                                           │
│  Configuration                                            │
│  ─────────────────────────────────────────────────────────│
│  GWP Set: AR6 (100-year)                                  │
│  Scope 2 Method: Location-based                           │
│  Engine Version: v1.2.3                                   │
│  Calculation Run: calc_run_abc123                         │
│                                                           │
│  Evidence                                                 │
│  ─────────────────────────────────────────────────────────│
│  📎 utility-bill-2024-Q1.pdf (SHA: a1b2c3...)            │
│  📎 meter-reading-march.xlsx (SHA: d4e5f6...)            │
└────────────────────────────────────────────────────────────┘
```

### Open Source Implementation

| Feature | Implementation |
|---------|----------------|
| **Event sourcing (light)** | Keep "current state" tables + separate "event log" table |
| **Hashing** | SHA-256 of canonical JSON for datasets and config snapshots |
| **Release integrity** | Signed releases with Sigstore/cosign (OSS) |
| **SBOM** | Publish CycloneDX or SPDX for supply chain security |

---

## 3. Emission Factor Management: The Hard Part (And The Differentiator)

### Why This Matters

> Paid tools win deals here because **factor disputes are where credibility lives**.

### Must-Have Capabilities

#### A) Factor Library with Versioning

**Rules:**
- Factors are **never "edited in place"**
- New versions are created with full metadata

| Field | Description |
|-------|-------------|
| `factor_id` | Stable ID across versions |
| `version` | Semantic version (e.g., 1.0.0) |
| `effective_date` | When this factor becomes valid |
| `expiry_date` | When this factor is superseded |
| `region` | Geographic applicability |
| `unit` | Unit of measurement (e.g., kgCO₂e/kWh) |
| `value` | The emission factor value |
| `source_dataset` | Dataset name (DEFRA, IPCC, EPA) |
| `source_year` | Publication year |
| `source_citation` | Full citation with page/table/row |
| `source_url` | Link to source document |
| `uncertainty` | ±% or confidence interval (optional) |
| `gwp_set` | Which GWP values were used |
| `category` | Scope, category, activity type |

```sql
CREATE TABLE emission_factor_versions (
    id UUID PRIMARY KEY,
    factor_id TEXT NOT NULL,
    version TEXT NOT NULL,
    effective_date DATE NOT NULL,
    expiry_date DATE,
    region TEXT,
    category TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    value DECIMAL NOT NULL,
    unit TEXT NOT NULL,
    source_dataset TEXT NOT NULL,
    source_year INTEGER NOT NULL,
    source_citation TEXT,
    source_url TEXT,
    uncertainty_pct DECIMAL,
    gwp_set TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT,
    UNIQUE(factor_id, version)
);
```

#### B) Factor Selection Rules (Deterministic Priority)

```
Priority Order:
1. Facility/location exact match
2. Country match
3. Region match (e.g., "Europe")
4. Global default
5. Industry-specific match (where available)
6. Time validity (factor year closest to activity year)

If no match: Use fallback + flag as "low confidence"
```

```typescript
interface FactorSelectionResult {
  factorId: string;
  factorVersion: string;
  matchType: 'exact' | 'country' | 'region' | 'global' | 'fallback';
  confidence: 'high' | 'medium' | 'low';
  ruleTrace: string[];  // ["Matched on country: US", "No facility-specific factor found"]
}
```

#### C) Overrides + Approvals

| Feature | Description |
|---------|-------------|
| **Override proposal** | Users can propose a factor override with justification |
| **Approval required** | Overrides require reviewer approval |
| **Scope of override** | Org-wide / Facility / Single activity line |
| **Audit trail** | All overrides logged with reason and approver |

```sql
CREATE TABLE factor_overrides (
    id UUID PRIMARY KEY,
    original_factor_id TEXT NOT NULL,
    override_value DECIMAL NOT NULL,
    override_unit TEXT NOT NULL,
    scope TEXT NOT NULL,  -- 'org', 'facility', 'activity'
    scope_id TEXT,        -- Facility ID or activity ID if scoped
    justification TEXT NOT NULL,
    evidence_artifact_id UUID,
    proposed_by TEXT NOT NULL,
    proposed_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
    FOREIGN KEY (original_factor_id) REFERENCES emission_factor_versions(factor_id)
);
```

#### D) Factor "Explainability"

For each calculation line item, show:

- Factor ID and version
- Source dataset and citation
- Why it was chosen (rule trace)
- Confidence level
- Any overrides applied

### Open Source Factor Strategy

> **Important:** Many factor datasets have licensing restrictions.

**Your OSS engine should be:**
- **Dataset-agnostic** - Works with any factor source
- **Support pluggable factor packs** - Users bring their own

**Options:**

| Approach | Description |
|----------|-------------|
| **Public datasets** | Support importers for freely available datasets (some EPA, some IPCC) |
| **BYO factors** | Allow organizations to import their licensed factors (DEFRA, ecoinvent) |
| **Citation-only** | Store metadata and citations without the actual values (compliance) |
| **Community packs** | Optional community-contributed factor packs (clearly licensed) |

---

## 4. MVP Credibility Spine: The Minimum "Enterprise-Ready" Set

**If you want the smallest set that still screams "governed + auditable":**

### Do These First

| Feature | Why It Matters |
|---------|----------------|
| ✅ RBAC roles + period locking | Control who changes what |
| ✅ Append-only change log | Who/what/when/why for everything |
| ✅ Calculation runs are immutable + versioned | Reproducibility |
| ✅ Factor library is versioned (no in-place edits) | Factor credibility |
| ✅ "Explain this number" panel | Inputs + factors + config |
| ✅ Audit pack export | One-click auditor package |

> **That's enough to outperform a surprising number of shiny dashboards.**

---

## 5. Open Source Architecture for Trust & Adoption

### Product Architecture Choices

#### A) Core Calc Engine as Standalone Library

```
openeco-calc/
├── src/
│   ├── calculate.ts      # Main calculation logic
│   ├── factors.ts        # Factor selection
│   └── types.ts          # Interfaces
├── test/
│   └── vectors/          # Test inputs → expected outputs
└── README.md             # API documentation
```

**Properties:**
- Deterministic inputs → deterministic outputs
- Includes test vectors and expected outputs
- Can be used independently of UI

#### B) UI + API as Separate Layers

```
┌─────────────────────────────────────────────────┐
│                    UI Layer                      │
│              (Next.js / React)                   │
├─────────────────────────────────────────────────┤
│                   API Layer                      │
│            (REST / GraphQL / tRPC)               │
├─────────────────────────────────────────────────┤
│               Calc Engine Library                │
│           (openeco-calc, standalone)             │
├─────────────────────────────────────────────────┤
│                  Data Layer                      │
│          (PostgreSQL + Prisma ORM)               │
└─────────────────────────────────────────────────┘
```

#### C) Plugin System

| Plugin Type | Examples |
|-------------|----------|
| **Factor packs** | defra-2024, epa-egrid, ipcc-ar6 |
| **Integrations** | utility-api, xero-connector, sap-connector |
| **Report exports** | csrd-template, tcfd-template, cdp-template |

#### D) Community Governance

| File | Purpose |
|------|---------|
| `CONTRIBUTING.md` | How to contribute |
| `CODEOWNERS` | Required reviewers for core logic |
| `docs/rfcs/` | RFC process for methodology changes |
| `SECURITY.md` | Security policy + responsible disclosure |
| `CHANGELOG.md` | Versioned changes |
| `migrations/` | Database schema migrations |

---

## 6. Data Model Blueprint

### Core Entities

```sql
-- Activity data (what happened)
CREATE TABLE activity_records (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    facility_id UUID,
    category TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    quantity DECIMAL NOT NULL,
    unit TEXT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    source TEXT,  -- 'manual', 'csv', 'api', 'integration'
    status TEXT DEFAULT 'draft',  -- 'draft', 'submitted', 'approved'
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence attachments
CREATE TABLE evidence_artifacts (
    id UUID PRIMARY KEY,
    activity_record_id UUID,
    file_name TEXT NOT NULL,
    file_hash TEXT NOT NULL,  -- SHA-256
    file_type TEXT NOT NULL,  -- 'invoice', 'utility_bill', 'meter_reading', etc.
    file_url TEXT,
    uploader_id TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    period_id UUID,
    FOREIGN KEY (activity_record_id) REFERENCES activity_records(id)
);

-- Emission factors (versioned)
CREATE TABLE emission_factors (
    id UUID PRIMARY KEY,
    factor_id TEXT NOT NULL,  -- Stable ID
    version TEXT NOT NULL,
    category TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    value DECIMAL NOT NULL,
    unit TEXT NOT NULL,
    region TEXT,
    effective_date DATE,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Factor sources (citations)
CREATE TABLE factor_sources (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,  -- 'DEFRA 2024', 'EPA eGRID 2023'
    version TEXT NOT NULL,
    publication_date DATE,
    citation TEXT,
    url TEXT,
    license TEXT,
    imported_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calculation config snapshots
CREATE TABLE calculation_config_snapshots (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    gwp_set TEXT NOT NULL,  -- 'AR4', 'AR5', 'AR6'
    gwp_horizon TEXT NOT NULL,  -- '20yr', '100yr'
    scope2_method TEXT NOT NULL,  -- 'location', 'market', 'both'
    boundary_approach TEXT NOT NULL,  -- 'operational', 'equity', 'financial'
    config_hash TEXT NOT NULL,  -- SHA-256 of canonical JSON
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calculation runs (immutable)
CREATE TABLE calculation_runs (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    period_id UUID NOT NULL,
    activity_dataset_hash TEXT NOT NULL,
    factor_dataset_version TEXT NOT NULL,
    factor_dataset_hash TEXT NOT NULL,
    config_snapshot_id UUID NOT NULL,
    engine_version TEXT NOT NULL,
    total_emissions DECIMAL,
    results JSONB,  -- Detailed results
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (config_snapshot_id) REFERENCES calculation_config_snapshots(id)
);

-- Change events (append-only audit trail)
CREATE TABLE change_events (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id TEXT NOT NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    changes JSONB,
    reason TEXT,
    ip_address TEXT,
    user_agent TEXT
);

-- Approvals
CREATE TABLE approvals (
    id UUID PRIMARY KEY,
    resource_type TEXT NOT NULL,  -- 'activity_record', 'reporting_period', 'factor_override'
    resource_id UUID NOT NULL,
    action TEXT NOT NULL,  -- 'approve', 'reject', 'request_changes'
    approved_by TEXT NOT NULL,
    approved_at TIMESTAMPTZ DEFAULT NOW(),
    comment TEXT
);

-- Reporting periods
CREATE TABLE reporting_periods (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    name TEXT NOT NULL,  -- 'Q1 2024', 'FY 2024'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'open',  -- 'open', 'submitted', 'approved', 'locked'
    locked_at TIMESTAMPTZ,
    locked_by TEXT,
    lock_reason TEXT
);
```

---

## 7. Sprint Sequence: What to Build Next

### Sprint 1: Period Locking + Approvals
- [ ] Add `status` field to activity records (draft/submitted/approved)
- [ ] Create `reporting_periods` table with status
- [ ] Implement period locking UI + API
- [ ] Add approval workflow (submit → approve)
- [ ] Block edits to locked periods

### Sprint 2: Append-Only Event Log + History
- [ ] Create `change_events` table (append-only)
- [ ] Add database triggers/middleware to log all changes
- [ ] Build "History" UI for any record
- [ ] Show who changed what, when, why

### Sprint 3: Calculation Runs + Versioning
- [ ] Create `calculation_runs` table
- [ ] Implement dataset hashing (SHA-256)
- [ ] Tag each run with engine version
- [ ] Store config snapshots
- [ ] Never overwrite—always create new runs

### Sprint 4: Explainability Drawer
- [ ] "Explain this number" component
- [ ] Show inputs → factors → config → result
- [ ] Link to evidence artifacts
- [ ] Show factor selection rule trace

### Sprint 5: Factor Library v1
- [ ] Create `emission_factors` + `factor_sources` tables
- [ ] Build factor importer (CSV/JSON)
- [ ] Implement versioning (no in-place edits)
- [ ] Add citations and source tracking
- [ ] Implement selection rules (priority-based)

### Sprint 6: Audit Pack Export
- [ ] Generate activity data CSV/JSON
- [ ] Export factors used with citations
- [ ] Include methodology config snapshot
- [ ] Include change log for period
- [ ] Generate evidence manifest
- [ ] Package as zip with checksums

---

## 8. Summary: The Trust Equation

```
TRUST = Transparency × Reproducibility × Provenance
```

| Dimension | How OpenEco Delivers |
|-----------|----------------------|
| **Transparency** | Open source code, published methodology, visible defaults |
| **Reproducibility** | Versioned calc runs, test vectors, deterministic engine |
| **Provenance** | Factor citations, evidence attachments, append-only audit log |

> **This is your wedge against proprietary platforms.**

---

**Document Status**: Implementation blueprint  
**Last Updated**: 2024  
**Related**: [PLATFORM_FEATURES.md](./PLATFORM_FEATURES.md), [COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md)

