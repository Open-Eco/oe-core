# OpenEco Competitive Analysis & Product Strategy

This document synthesizes competitive research on enterprise carbon accounting platforms and translates findings into product decisions for OpenEco.

---

## 1. Competitive Landscape Summary

### Platforms Analyzed

| Platform | Positioning | Key Strength |
|----------|-------------|--------------|
| **Workiva Carbon** | Enterprise compliance + integration control plane | Utility/spend integrations, operational reliability signals |
| **ClimateHound** | Customer success + program management | Engagement-focused, certification funnels, cadence tracking |
| **FRCP** | Compliance + credential artifacts | Trust infrastructure, minting/QR verification, public proof |
| **Envify** | Modular dashboard suite | Multi-lens analytics, clear scope breakdown |
| **ASUENE** | Full enterprise carbon operating system | Factor management, PCF, scenario analysis, supplier surveys |

---

## 2. Converged UI Patterns (Industry Standards)

### Navigation & Information Architecture

All paid platforms converge on a **lifecycle-based IA**:

```
┌─────────────────────────────────────────────────────────┐
│  MEASURE → MANAGE → ANALYZE → ACT → REPORT → ADMIN     │
└─────────────────────────────────────────────────────────┘
```

**OpenEco must-have navigation structure:**

| Module | Purpose |
|--------|---------|
| **Measure** | Data collection (manual entry, imports, integrations) |
| **Manage** | Clean, map, approve, attach evidence |
| **Analyze** | Dashboards, drilldowns, comparisons |
| **Act** | Reduction plans, scenarios, project tracking |
| **Report** | Framework exports, audit packs, public verification |
| **Admin** | Factors, org boundary, users, integrations, settings |

### Dashboard Composition Pattern

The winning analytics pattern is **consistent across all platforms**:

```
┌──────────────────────────────────────────────────────────┐
│  GLOBAL FILTERS: Date range | Location | Scope | Unit   │
├────────────────────────┬─────────────────────────────────┤
│                        │                                 │
│    COMPOSITION         │         TREND                   │
│    (Donut/Pie)         │    (Stacked bars/lines)        │
│                        │                                 │
├────────────────────────┴─────────────────────────────────┤
│                    DRILLDOWN TABLE                       │
│  Category → Subcategory → Activity → Source              │
│  (Expandable hierarchy with "why" context)              │
└──────────────────────────────────────────────────────────┘
```

### Data Entry Pattern (Measurement UI)

**Period-based utility accounting:**
- Start Date | End Date | Quantity | Unit | Category | Source
- Tabs for Waste / Water / Electricity / Fuel / etc.
- Month strip with completeness indicators (0% → 100%)
- Controlled vocabularies (dropdowns for materials, treatments)
- "+ Add period" CTA

### Status & Reliability Signals

| Element | Purpose |
|---------|---------|
| Status badges | OK / Error / Pending / Draft / Approved |
| Upload count | Data freshness signal |
| Last upload timestamp | Operational reliability |
| Coverage % | Completeness at-a-glance |
| Data confidence | Quality scoring overlay |

---

## 3. Feature Gap Analysis: OpenEco vs Paid Leaders

### ✅ OpenEco Strengths (On Track)

- Period-based utility/waste entry with completeness tracking
- Analytics primitives (category breakdown + time series + drilldowns)
- Integration mindset (ERP/utility/spend linkages planned)
- Decarbonization-first philosophy (not offsets-first)
- Open-source transparency as trust differentiator

### ⚠️ Critical Gaps to Address

#### Gap 1: Audit-Grade Calculation Transparency

**What paid tools have:**
- Factor dataset version display
- GWP set selection (AR4/AR5/AR6, 20yr/100yr)
- Activity → factor mapping details
- Change log and approvals
- "Calculation details" drawer on every chart/row

**OpenEco action:**
- [ ] Add "Calculation Details" drawer component
- [ ] Show factor source, version, and citation per emission line
- [ ] Display GWP set and methodology version
- [ ] Implement change log for all calculation-affecting edits

#### Gap 2: Emission Factor Management (First-Class Module)

**What paid tools have (especially ASUENE):**
- Factor library UI with search/filter
- Override capabilities with audit trail
- Regionalization support
- Version pinning per calculation period
- Citation and source tracking

**OpenEco action:**
- [ ] Create `/factors` module in app
- [ ] Support DEFRA, IPCC, EPA datasets
- [ ] Allow org-specific overrides with justification
- [ ] Pin factor version per reporting period

#### Gap 3: Workflow & Governance

**What paid tools have:**
- Role-based access (Admin / Contributor / Viewer)
- Data states: Draft → Submitted → Approved → Locked
- Locked reporting periods
- Evidence attachments (invoices, receipts, scale tickets)
- Approval audit trail

**OpenEco action:**
- [ ] Add data status field to activity records
- [ ] Implement approval workflow
- [ ] Lock periods after approval
- [ ] Evidence upload per activity row
- [ ] Audit log for all state changes

#### Gap 4: Scope 2 Market-Based vs Location-Based

**What buyers ask early:**
- Dual reporting: location-based AND market-based
- REC/EAC/GO tracking
- Renewable energy instrument management

**OpenEco action:**
- [ ] Add `scope2Method` field (location | market)
- [ ] Support renewable instrument tracking
- [ ] Show both calculations where applicable

#### Gap 5: Supplier / Scope 3 Collaboration

**What paid tools have:**
- Supplier portal for data submission
- Survey/questionnaire workflows
- Supplier emission profiles
- Supply chain mapping

**OpenEco action:**
- [ ] Supplier data request workflow (MVP)
- [ ] Supplier self-service portal
- [ ] Import supplier emission data
- [ ] Supply chain visualization

#### Gap 6: Framework-Mapped Reporting

**What paid tools have:**
- CSRD/TCFD/CDP/GRI templates
- Field → disclosure mapping layer
- Export packs per framework
- Audit-ready footnotes

**OpenEco action:**
- [ ] Create report template library
- [ ] Map internal data model to framework disclosures
- [ ] Generate framework-specific exports
- [ ] Include factor/methodology footnotes

---

## 4. OpenEco Strategic Differentiation

### The Wedge: System of Proof (Not Just Record)

> Paid platforms monetize by being the "system of record."  
> **OpenEco wins by being the "system of proof."**

| Paid Platform Approach | OpenEco Approach |
|------------------------|------------------|
| Proprietary calculations | Transparent, reproducible methods |
| Lock-in via integrations | Interoperability-first API |
| Certification badges | Public verification artifacts |
| Trust via brand | Trust via transparency |

### Trust Infrastructure Features

1. **Public methodology documentation** - Full calculation logic published
2. **Reproducible calculations** - Test vectors for external validation
3. **Verification artifacts** - QR codes / share links for frozen results
4. **Factor provenance** - Every emission linked to source data
5. **Export everything** - CSV, JSON, audit packs, methodology docs

---

## 5. Prioritized Roadmap

### Tier 1: Credibility Spine (Must-Have for Enterprise Trust)

| Feature | Priority | Effort |
|---------|----------|--------|
| Factor library + versioning | 🔴 Critical | Medium |
| Calculation detail drawer | 🔴 Critical | Low |
| Evidence attachments | 🔴 Critical | Low |
| Approval workflow | 🔴 Critical | Medium |
| Locked periods + audit log | 🔴 Critical | Medium |
| Exports (CSV/JSON + audit pack) | 🔴 Critical | Low |

### Tier 2: Platform Differentiation

| Feature | Priority | Effort |
|---------|----------|--------|
| Interoperability-first API | 🟠 High | Medium |
| Data quality scoring (coverage %, anomalies) | 🟠 High | Medium |
| Public verification artifacts (QR/link) | 🟠 High | Low |
| Scope 2 dual reporting | 🟠 High | Low |

### Tier 3: Big Value Features

| Feature | Priority | Effort |
|---------|----------|--------|
| Scenario analysis (basic) | 🟡 Medium | High |
| Reduction project tracking + ROI | 🟡 Medium | Medium |
| Supplier portal / surveys | 🟡 Medium | High |
| Framework reporting packs | 🟡 Medium | High |

---

## 6. UI Component Requirements

Based on competitive analysis, these UI components are **table stakes**:

### Already Have ✅
- [x] Data grid with sorting/filtering/pagination
- [x] Inline editing
- [x] Charts (pie, bar, line)
- [x] Form components (inputs, selects, date pickers)
- [x] Cards, badges, buttons

### Need to Add 🔲

| Component | Purpose | Priority |
|-----------|---------|----------|
| **Calculation Drawer** | Show factor details per row | 🔴 Critical |
| **Approval Workflow UI** | Draft/Submit/Approve states | 🔴 Critical |
| **File Upload** | Evidence attachments | 🔴 Critical |
| **Completeness Strip** | Month-by-month data coverage | 🟠 High |
| **Status Badges** | Draft/Pending/OK/Error/Approved | 🟠 High |
| **Hierarchy Table** | Expandable category → subcategory | 🟠 High |
| **Comparison View** | Year-over-year side-by-side | 🟡 Medium |
| **QR/Verification Card** | Public proof artifact | 🟡 Medium |
| **Survey Builder** | Supplier questionnaires | 🟡 Medium |

---

## 7. Credentialing Strategy

### A) Methodology Credibility

| Credential | Status | Action |
|------------|--------|--------|
| GHG Protocol alignment | Planned | Document conformance statement |
| TÜV Rheinland validation | Future | Pursue when calc engine stable |
| ISO 14064-1 alignment | Future | Structure inventory accordingly |
| Published methodology | **Do Now** | Full docs + test vectors |

### B) Security & Operational Trust

| Credential | Status | Action |
|------------|--------|--------|
| SOC 2 Type II | Future | Pursue when orgs pilot seriously |
| ISO 27001 | Future | Alternative to SOC 2 |
| GDPR-ready controls | Planned | DPA templates, deletion, retention |
| SBOM + signed releases | **Do Now** | Critical for OSS adoption |

### C) Accessibility & Ethics

| Credential | Status | Action |
|------------|--------|--------|
| WCAG 2.1 AA | In progress | Continue accessibility focus |
| B Corp | Optional | Consider for mission alignment |
| Carbon-aware hosting | Optional | Good transparency narrative |

### Pragmatic Sequence

1. **Now**: Publish methodology + audit trail + test vectors
2. **Soon**: Build security baseline practices
3. **Later**: Pursue SOC2/ISO27001 + third-party method validation

---

## 8. Key Takeaways

### What OpenEco Must Do

1. **Factor management is not optional** - It's where accuracy disputes are won/lost
2. **"Calculation details" everywhere** - Every number must be explainable
3. **Evidence attachments** - Data is not done until it has proof
4. **Approval workflow** - Multi-user accountability is enterprise table stakes
5. **Dual Scope 2** - Buyers ask immediately
6. **Export everything** - CSV is non-negotiable; audit packs win deals

### What Makes OpenEco Different

1. **Transparent methods** - Open-source calculation logic
2. **Reproducible results** - Anyone can validate
3. **Verification artifacts** - Public proof, not just private dashboards
4. **Interoperability** - API-first, not lock-in
5. **Decarbonization focus** - Reductions over offsets

### Biggest Risk

> If OpenEco is "decarbonization-first," don't drift into "badge-first."  
> CTAs should emphasize reductions over neutrality claims.

---

## 9. Immediate Next Steps

### This Week
- [ ] Add `status` field to activity data model (draft/submitted/approved)
- [ ] Create "Calculation Details" drawer component
- [ ] Add evidence upload field to activity entry

### This Month
- [ ] Factor library MVP (DEFRA dataset + versioning)
- [ ] Approval workflow (submit for review, approve, lock)
- [ ] Completeness tracking visualization
- [ ] Export audit pack (CSV + methodology doc)

### This Quarter
- [ ] Public verification artifacts (shareable link + QR)
- [ ] Scope 2 dual reporting
- [ ] Data quality scoring
- [ ] Framework mapping layer (start with TCFD)

---

**Document Status**: Living document - update as competitive landscape evolves  
**Last Updated**: 2024  
**Sources**: Workiva, ClimateHound, FRCP, Envify, ASUENE dashboard analysis

