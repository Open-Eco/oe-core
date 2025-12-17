# OpenEco Security & Governance

This document describes the security model, trust boundaries, data governance, and auditability guarantees for OpenEco deployments.

---

## Table of Contents

1. [Threat Model & Trust Boundaries](#1-threat-model--trust-boundaries)
2. [Emission Factor Governance & Versioning](#2-emission-factor-governance--versioning)
3. [Data Provenance, Evidence & Auditability](#3-data-provenance-evidence--auditability)
4. [Authentication & Identity](#4-authentication--identity)
5. [Roles & Permissions](#5-roles--permissions)

---

## 1. Threat Model & Trust Boundaries

OpenEco is designed to be deployed and operated within a company's own infrastructure. As such, the **primary trust boundary is the organization's environment**, not a centralized SaaS platform.

### Threats Explicitly Considered

| Threat | Description |
|--------|-------------|
| **External API attacks** | Attackers attempting to access exposed APIs or dashboards |
| **Malicious supplier data** | Compromised supplier instances providing incorrect or manipulated shared data |
| **Network attacks** | Network-level attacks on cross-instance data exchange |
| **Input tampering** | Tampering with calculation inputs or emission factors |
| **Replay/substitution attacks** | Replay or substitution attacks on public data endpoints |

### Threats Explicitly Out of Scope

| Threat | Rationale |
|--------|-----------|
| **Insider misuse** | Authorized organizational users acting maliciously |
| **Intentional misreporting** | Deliberate misreporting of business activity data |
| **Fraudulent data entry** | Fraudulent data entered by company personnel |

> **Note**: OpenEco provides **auditability and traceability**, not enforcement of data honesty. The platform ensures that *what was reported* is traceable and verifiable, but cannot prevent intentional misrepresentation by authorized users.

### Trust Boundaries

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRUST BOUNDARY: Organization A                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     OpenEco Instance                           │  │
│  │  - All data controlled by org                                  │  │
│  │  - All calculations auditable                                  │  │
│  │  - All access via org's IdP                                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              │ Cross-instance sharing                │
│                              │ (explicit, pull-based, scoped)        │
│                              ▼                                       │
└─────────────────────────────────────────────────────────────────────┘
                               │
            ╔══════════════════╧══════════════════╗
            ║   UNTRUSTED ZONE: External Network   ║
            ╚══════════════════╤══════════════════╝
                               │
┌─────────────────────────────────────────────────────────────────────┐
│                    TRUST BOUNDARY: Organization B                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     OpenEco Instance                           │  │
│  │  - Separate database                                           │  │
│  │  - Separate admin                                              │  │
│  │  - No implicit trust                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Principles:**

- Each OpenEco instance is a **trusted boundary** controlled by the deploying organization
- Cross-instance data sharing is:
  - **Explicit** — requires configuration and consent
  - **Pull-based** — receiving org initiates data retrieval
  - **Scoped** — limited to public, consented datasets only
- **No instance is implicitly trusted by another**

---

## 2. Emission Factor Governance & Versioning

All emission factors used by OpenEco are **open, versioned, and immutable** once published.

### Factor Sources

| Source Type | Description | Example |
|-------------|-------------|---------|
| **Authoritative Public Datasets** | Official government and scientific sources | IPCC, DEFRA, EPA, IEA |
| **Community-Reviewed Contributions** | OpenEco community-submitted factors | Regional grid factors |
| **Organization-Defined Custom Factors** | Local overrides for specific use cases | Supplier-specific EFs |

### Versioning Rules

Each factor set includes:

| Field | Description | Example |
|-------|-------------|---------|
| `version` | Semantic version | `2024.1.0` |
| `source` | Authoritative source reference | `DEFRA 2024 GHG Conversion Factors` |
| `effectiveFrom` | Date factor becomes active | `2024-01-01` |
| `effectiveTo` | Date factor is superseded (optional) | `2024-12-31` |
| `gwpSet` | Global Warming Potential set used | `AR6` |
| `gwpTimeframe` | GWP timeframe | `100yr` |

**Immutability Guarantees:**

- Historical factors are **never overwritten**
- Recalculations **always reference the factor version** used at the time of computation
- Deprecated factors **remain available** for audit purposes

### Governance Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Factor Update Workflow                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Proposal   │───▶│    Review    │───▶│   Publish    │          │
│  │              │    │              │    │              │          │
│  │ - Source doc │    │ - Maintainer │    │ - Version    │          │
│  │ - Rationale  │    │   approval   │    │ - Changelog  │          │
│  │ - Diff       │    │ - Validation │    │ - Effective  │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Change Requirements:**

| Requirement | Description |
|-------------|-------------|
| **Documented Source** | Link to authoritative publication |
| **Rationale** | Explanation of why the change is needed |
| **Change Log Entry** | Record of what changed and when |
| **Maintainer Approval** | Review by designated factor maintainers |

This ensures **long-term report reproducibility** and **regulatory defensibility**.

---

## 3. Data Provenance, Evidence & Auditability

OpenEco treats every calculation as a **verifiable event**, not a mutable dashboard value.

### Data Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Data Lifecycle                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐        │
│  │  Ingest  │──▶│ Validate │──▶│Calculate │──▶│  Store   │        │
│  │          │   │          │   │          │   │          │        │
│  │ Raw data │   │ Normalize│   │ Apply    │   │ Immutable│        │
│  │ entered  │   │ & check  │   │ factors  │   │ record   │        │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘        │
│       │                              │              │               │
│       │                              │              │               │
│       ▼                              ▼              ▼               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Permanent Linkage                         │   │
│  │  Inputs ←──── Factors ←──── Outputs ←──── Evidence          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Provenance Guarantees

Each calculation run records:

| Field | Description |
|-------|-------------|
| **Input Data Snapshot** | Hash of input data at calculation time |
| **Factor Versions** | Exact factor IDs and versions used |
| **Calculation Timestamp** | When the calculation was performed |
| **Software Version** | OpenEco engine version |
| **Algorithm Reference** | Which algorithm (generic/regional/override) was applied |

### Evidence Management

| Evidence Type | Description | Use Case |
|---------------|-------------|----------|
| **Utility Bills** | Scanned invoices, PDF statements | Electricity, gas consumption |
| **Meter Readings** | Photos, exports from monitoring systems | Energy data validation |
| **Receipts** | Travel receipts, fuel purchases | Business travel, fleet |
| **Contracts** | Renewable energy certificates, PPAs | Market-based Scope 2 |
| **Scale Tickets** | Waste manifests, weight tickets | Waste disposal |
| **Exports** | System exports from ERP, fleet management | Activity data sources |

**Evidence Integrity:**

- Files are hashed (SHA-256) on upload
- Hash stored with activity record
- Tampering is detectable

### Recalculation Policy

- Recalculations **create new runs**
- Prior results are **never overwritten**
- Full history is preserved for audit

### Audit Use Case

An auditor can reconstruct:

> "What data was used, with which factors, using which algorithm, at what time."

**Without relying on proprietary or opaque systems.**

Example audit query:

```typescript
// Retrieve full provenance for an emission result
const auditTrail = await getCalculationProvenance(emissionResultId);

// Returns:
{
  calculationId: "calc_abc123",
  timestamp: "2024-03-15T10:30:00Z",
  engineVersion: "1.2.0",
  
  inputs: {
    activityDataId: "act_xyz789",
    quantity: 50000,
    unit: "kWh",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    inputHash: "sha256:a1b2c3..."
  },
  
  factor: {
    id: "ef_uk_grid_2024",
    dataset: "DEFRA-2024",
    version: "2024.1.0",
    value: 0.20705,
    unit: "kgCO2e/kWh"
  },
  
  algorithm: {
    id: "electricity-location",
    version: "2024.1",
    type: "generic"
  },
  
  output: {
    co2e: 10352.5,
    unit: "kgCO2e",
    outputHash: "sha256:d4e5f6..."
  },
  
  evidence: [
    { type: "utility_bill", fileHash: "sha256:g7h8i9...", uploadedAt: "2024-02-01" }
  ]
}
```

---

## 4. Authentication & Identity

OpenEco **does not manage identity as a standalone authority**. Instead, it integrates with enterprise identity systems configured during deployment.

### Supported Identity Providers

| Provider Type | Examples | Protocol |
|---------------|----------|----------|
| **SSO** | Okta, Auth0, Azure AD | OIDC, SAML 2.0 |
| **Enterprise Directory** | Active Directory, OpenLDAP | LDAP, LDAPS |
| **Cloud IAM** | Azure AD, Google Workspace, AWS IAM | OIDC |
| **Local Auth** | Built-in (dev/pilot only) | Email/password |

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   User                OpenEco              Identity Provider         │
│    │                     │                        │                  │
│    │──── Login ─────────▶│                        │                  │
│    │                     │──── Auth Request ─────▶│                  │
│    │                     │                        │                  │
│    │◀─────────────────── Redirect ───────────────▶│                  │
│    │                     │                        │                  │
│    │────── Credentials ──────────────────────────▶│                  │
│    │                     │                        │                  │
│    │                     │◀─── Token/Assertion ───│                  │
│    │                     │                        │                  │
│    │◀─── Session ────────│                        │                  │
│    │                     │                        │                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Principles

| Principle | Description |
|-----------|-------------|
| **Delegated Authentication** | Authentication is delegated to the organization's IdP |
| **Trusted Assertions** | OpenEco trusts identity assertions from the configured IdP |
| **No Global Accounts** | No global OpenEco user accounts exist across instances |
| **Session Management** | Sessions managed via NextAuth.js with configurable expiry |

This aligns OpenEco with **standard enterprise security and compliance expectations**.

### Configuration Example

```typescript
// Environment variables for IdP configuration
NEXTAUTH_URL="https://climate.yourcompany.com"
NEXTAUTH_SECRET="..."

// OIDC Provider (e.g., Azure AD)
AZURE_AD_CLIENT_ID="..."
AZURE_AD_CLIENT_SECRET="..."
AZURE_AD_TENANT_ID="..."

// Or SAML Provider
SAML_ISSUER="https://idp.yourcompany.com"
SAML_CALLBACK_URL="https://climate.yourcompany.com/api/auth/callback/saml"
SAML_CERT="..."
```

---

## 5. Roles & Permissions

> **Note**: Roles and permissions are expected to be defined during deployment by the organization's IT or security team.

OpenEco provides a **role-based access control (RBAC) framework**, but does not enforce a single default model. The specific role definitions, permissions, and group mappings are **configurable at provisioning time** to align with internal governance and compliance requirements.

### Reference Role Model

Typical roles may include:

| Role | Description | Typical Permissions |
|------|-------------|---------------------|
| **Organization Administrator** | Full system access, user management | All permissions |
| **Sustainability / ESG Manager** | Manage data, run calculations, generate reports | Read/write activity data, run calculations, create reports |
| **Data Contributor** | Enter and edit activity data | Read/write activity data for assigned facilities |
| **Auditor** | Read-only access for verification | Read all data, view audit trails, no modifications |
| **External Verifier** | Limited read access for third-party verification | Read approved reports and supporting evidence |
| **Supplier User** | Scoped access for supply chain data | Read/write own supplier data only |

### Permission Matrix (Reference)

| Permission | Admin | ESG Manager | Contributor | Auditor | Verifier | Supplier |
|------------|:-----:|:-----------:|:-----------:|:-------:|:--------:|:--------:|
| Manage users | ✓ | | | | | |
| Configure system | ✓ | | | | | |
| View all data | ✓ | ✓ | | ✓ | | |
| Edit activity data | ✓ | ✓ | ✓ | | | |
| Run calculations | ✓ | ✓ | | | | |
| Approve periods | ✓ | ✓ | | | | |
| Lock periods | ✓ | | | | | |
| Generate reports | ✓ | ✓ | | | | |
| View audit trail | ✓ | ✓ | | ✓ | ✓ | |
| View own facility | ✓ | ✓ | ✓ | ✓ | | |
| Submit supplier data | | | | | | ✓ |

### Implementation

Roles are stored in the `OrganizationUser` model:

```prisma
model OrganizationUser {
  id             String   @id @default(cuid())
  userId         String
  organizationId String
  role           String   // "ORG_ADMIN", "ESG_MANAGER", "CONTRIBUTOR", "AUDITOR", etc.
  
  // Optional: granular permissions override
  permissions    Json?    // Custom permission set if role-based is insufficient
  
  // Facility-level scoping (optional)
  facilityIds    String[] // If empty, access to all facilities
  
  user           User         @relation(...)
  organization   Organization @relation(...)
}
```

### IdP Group Mapping

Organizations can map IdP groups to OpenEco roles:

```typescript
// Example: Map Azure AD groups to OpenEco roles
const groupRoleMapping = {
  "sustainability-admins": "ORG_ADMIN",
  "sustainability-team": "ESG_MANAGER",
  "facility-managers": "CONTRIBUTOR",
  "external-auditors": "AUDITOR",
};
```

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical architecture and system design
- [INSTALLATION.md](./INSTALLATION.md) — Deployment and configuration guide
- [OPEN_SOURCE_PLAYBOOK.md](./OPEN_SOURCE_PLAYBOOK.md) — Governance and community guidelines

---

**Document Status**: Living document  
**Last Updated**: 2024  
**Review Cycle**: Quarterly or upon significant changes
