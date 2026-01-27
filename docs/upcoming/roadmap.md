# OpenEco Roadmap

This roadmap outlines the development priorities and timeline for OpenEco, organized by enterprise credibility requirements and strategic differentiation.

> **See also:** [ARCHITECTURE.md](./ARCHITECTURE.md#roadmap) for technical details, [COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md) for market context.

---

## 🎯 Current Status (Q4 2024)

**✅ Completed:**
- Core Next.js application with App Router
- EcoKit design system
- Prisma data model (basic)
- Basic authentication (NextAuth.js)
- Basic API routes
- Dashboard with charts (pie, bar, line)
- Basic activity data entry
- Organization and facility management
- Comprehensive documentation (ARCHITECTURE.md, SECURITY_AND_GOVERNANCE.md, AI Assistant spec)

**🚧 In Progress:**
- Contributor onboarding automation
- Setup scripts (Windows complete, macOS/Linux in progress)

---

## 🔴 Tier 1: Credibility Spine (Critical)

**Timeline:** Q1 2025  
**Goal:** Build enterprise trust through transparent, auditable calculations and governance.

### Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Calculation Details Drawer** | Show factor source, version, GWP set, and methodology for every emission value | 📅 Planned |
| **Factor Library MVP** | `/factors` module with DEFRA, IPCC, EPA datasets, search/filter | 📅 Planned |
| **Factor Versioning** | Pin factor versions per reporting period, immutable historical factors | 📅 Planned |
| **Evidence Attachments** | Upload invoices, receipts, scale tickets per activity record | 📅 Planned |
| **Approval Workflow** | Draft → Submitted → Approved → Locked states with role-based permissions | 📅 Planned |
| **Locked Periods** | Prevent edits to approved reporting periods | 📅 Planned |
| **Audit Log** | Track all state changes, factor updates, calculation runs | 📅 Planned |
| **Export Audit Pack** | ZIP export with CSV, JSON, methodology documentation | 📅 Planned |

### Success Criteria

- ✅ Every emission value can be traced to source data + factor version
- ✅ All data changes are logged and auditable
- ✅ Reports include factor citations and methodology footnotes
- ✅ Organizations can trust OpenEco for audit-grade emissions accounting

---

## 🟠 Tier 2: Platform Differentiation (High Priority)

**Timeline:** Q2-Q3 2025  
**Goal:** Differentiate OpenEco as the "system of proof" through transparency and interoperability.

### Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Public Verification Artifacts** | QR codes and shareable links for frozen reports | 📅 Planned |
| **Scope 2 Dual Reporting** | Location-based + market-based calculations side-by-side | 📅 Planned |
| **Data Quality Scoring** | Coverage % indicators, anomaly detection, completeness tracking | 📅 Planned |
| **Interoperability-First API** | Full REST API with authentication, webhooks, bulk operations | 📅 Planned |
| **Completeness Tracking UI** | Month-by-month data coverage visualization | 📅 Planned |
| **Status Badges** | Draft/Pending/OK/Error/Approved indicators throughout UI | 📅 Planned |
| **Hierarchy Table** | Expandable category → subcategory → activity drilldown | 📅 Planned |

### Success Criteria

- ✅ Reports can be publicly verified without login
- ✅ API enables full platform integration
- ✅ Data quality issues are automatically flagged
- ✅ OpenEco differentiates through transparency and interoperability

---

## 🟡 Tier 3: Big Value Features (Medium Priority)

**Timeline:** Q4 2025 - Q2 2026  
**Goal:** Enable advanced analytics, forecasting, and collaboration.

### 3.1. Reporting Engine (Full Implementation)

| Feature | Description | Status |
|---------|-------------|--------|
| **Framework Mapping Layer** | Map internal data to TCFD, CSRD, CDP, GRI disclosure requirements | 📅 Planned |
| **Report Template Library** | Pre-built templates for major frameworks | 📅 Planned |
| **PDF Generation** | HTML-to-PDF pipeline with Playwright | 📅 Planned |
| **Async Job Queue** | Background report generation with BullMQ + Redis | 📅 Planned |
| **S3-Compatible Storage** | Store generated reports in MinIO/S3 | 📅 Planned |

### 3.2. Forecasting & Analytics Engine

| Feature | Description | Status |
|---------|-------------|--------|
| **Statistical Models** | Linear Trend, ARIMA, Seasonal forecasting | 📅 Planned |
| **Scenario Analysis** | SBTi-aligned scenarios (1.5°C, Well-Below 2°C, Net Zero 2050) | 📅 Planned |
| **Reduction Initiative Modeling** | Project impact of specific reduction initiatives | 📅 Planned |
| **Gap Analysis** | Compare projections vs. targets, identify gaps | 📅 Planned |

### 3.3. AI Assistant (MVP)

| Feature | Description | Status |
|---------|-------------|--------|
| **Self-Hosted Model Integration** | LLaMA/Mistral inference (no external APIs) | 📅 Planned |
| **Context Builder** | Aggregate emission summaries, factors, audit logs, docs | 📅 Planned |
| **Prompt Template** | Single, well-tested prompt structure | 📅 Planned |
| **UI Panel** | "OpenEco Assistant" chat interface | 📅 Planned |
| **Audit Logging** | Log all AI interactions for transparency | 📅 Planned |

**Capabilities:**
- ✅ Explain reports and calculations
- ✅ Summarize emissions changes
- ✅ Draft ESG narratives (requires human review)
- ✅ Flag data quality issues
- ✅ Answer methodology questions

**Hard Boundaries:**
- ❌ Never generates emissions values
- ❌ Never modifies data directly
- ❌ Never changes factor versions
- ❌ Never makes compliance claims
- ❌ Always requires human confirmation

### 3.4. Supplier Collaboration

| Feature | Description | Status |
|---------|-------------|--------|
| **Supplier Portal** | Self-service data entry for suppliers | 📅 Planned |
| **Survey Workflows** | Questionnaire builder for Scope 3 data collection | 📅 Planned |
| **Supply Chain Mapping** | Visualize supplier network and emissions | 📅 Planned |
| **Cross-Instance Data Sharing** | Secure data exchange between OpenEco instances | 📅 Planned |

---

## 🛠️ Infrastructure & DevOps

**Timeline:** Ongoing

| Feature | Description | Status |
|---------|-------------|--------|
| **OCI Containerization** | Single OCI image for all deployments | 📅 Planned |
| **Podman/Docker Compose** | Single-host deployment configuration | 📅 Planned |
| **Helm Charts** | Kubernetes/OKD/OpenShift package | 📅 Planned |
| **Installation Documentation** | End-user deployment guides | ✅ In Progress |
| **Demo Site** | Public demo on Vercel | 📅 Planned |
| **High Availability Setup** | Multi-node, load-balanced deployment | 📅 Future |
| **SBOM + Signed Releases** | Software Bill of Materials for security | 📅 Q1 2025 |

---

## 👨‍💻 Developer Experience

**Timeline:** Q2-Q3 2025

| Feature | Description | Status |
|---------|-------------|--------|
| **Setup Scripts** | Automated dev environment setup | ✅ Windows done |
| **`openeco` CLI** | Command-line wrapper for common operations | 📅 Planned |
| **Local Dev with Podman** | Containerized local development | 📅 Planned |
| **Test Suite** | Comprehensive unit and integration tests | 📅 Planned |
| **API Documentation** | OpenAPI/Swagger documentation | 📅 Planned |

---

## 🎯 Key Milestones

### Milestone 1: Credibility MVP (Q1 2025)
**Goal:** Enterprise-ready calculation transparency

**Deliverables:**
- Factor library with versioning
- Calculation details drawer
- Approval workflow
- Audit log
- Export audit pack

**Outcome:** Organizations can trust OpenEco for audit-grade emissions accounting.

---

### Milestone 2: Platform Differentiation (Q2-Q3 2025)
**Goal:** "System of proof" capabilities

**Deliverables:**
- Public verification artifacts
- Scope 2 dual reporting
- Data quality scoring
- Full REST API

**Outcome:** OpenEco differentiates through transparency and interoperability.

---

### Milestone 3: Advanced Analytics (Q4 2025 - Q1 2026)
**Goal:** Forecasting and framework reporting

**Deliverables:**
- Reporting Engine (full implementation)
- Forecasting & Analytics Engine
- Framework-mapped reports (CSRD, TCFD)
- AI Assistant MVP

**Outcome:** OpenEco enables strategic planning and regulatory compliance.

---

### Milestone 4: Ecosystem (Q2-Q3 2026)
**Goal:** Collaboration and extensibility

**Deliverables:**
- Supplier portal
- Cross-instance data sharing
- Plugin system
- Sector-specific modules

**Outcome:** OpenEco becomes the platform for supply chain transparency.

---

## 📊 Priority Rationale

**Tier 1 (Critical):** Without calculation transparency, factor management, and audit trails, OpenEco cannot compete with enterprise platforms. These features are **table stakes** for credibility.

**Tier 2 (High):** Public verification and interoperability differentiate OpenEco as the "system of proof" rather than just another carbon accounting tool.

**Tier 3 (Medium):** Advanced features (forecasting, AI, supplier collaboration) provide long-term value but are not required for initial enterprise adoption.

---

## ⚠️ Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **Factor data quality** | Start with authoritative sources (DEFRA, IPCC, EPA), version everything |
| **Calculation accuracy** | Publish test vectors, enable external validation |
| **Performance at scale** | Async job queues, caching, database optimization |
| **Security vulnerabilities** | Security-first architecture, regular audits, SBOM |
| **Adoption barriers** | Clear documentation, easy setup, demo site |

---

## 📅 Timeline Summary

```
Q4 2024 ────────────────────────────────────────────────┐
  ✅ Foundation (Core app, design system, docs)         │
                                                         │
Q1 2025 ────────────────────────────────────────────────┤
  🔴 Tier 1: Credibility Spine                          │
  • Factor library + versioning                         │
  • Calculation details drawer                           │
  • Approval workflow                                    │
  • Audit log                                           │
                                                         │
Q2-Q3 2025 ─────────────────────────────────────────────┤
  🟠 Tier 2: Platform Differentiation                   │
  • Public verification                                  │
  • Scope 2 dual reporting                              │
  • Data quality scoring                                │
  • Full REST API                                       │
                                                         │
Q4 2025 - Q1 2026 ─────────────────────────────────────┤
  🟡 Tier 3: Big Value Features                        │
  • Reporting Engine (full)                              │
  • Forecasting & Analytics                             │
  • AI Assistant MVP                                    │
                                                         │
Q2-Q3 2026 ─────────────────────────────────────────────┤
  🟡 Tier 3: Ecosystem                                  │
  • Supplier portal                                     │
  • Cross-instance sharing                              │
  • Plugin system                                       │
```

---

## 🤝 Contributing

Want to help build OpenEco? See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- How to get started
- Development environment setup
- Contribution guidelines
- Community Discord: [discord.gg/3MgJ8vXW](https://discord.gg/3MgJ8vXW)

---

**Last Updated:** December 2024  
**Next Review:** Quarterly  
**Status:** 🚧 In Active Development
