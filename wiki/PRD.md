# OpenEco Product Requirements Document (PRD)

**Version**: 1.0  
**Last Updated**: 2024-12-17  
**Status**: Active Development  
**License**: GNU Affero General Public License v3.0 (AGPL-3.0)

---

## Executive Summary

OpenEco is an open-source, enterprise-grade emissions accounting platform that enables small and mid-sized companies to measure, track, and report greenhouse gas emissions through self-hosted deployment. Unlike proprietary SaaS solutions, OpenEco prioritizes transparency, auditability, and data sovereignty while maintaining full compliance with GHG Protocol standards.

**Key Differentiators:**
- **Transparency First**: Every calculation is traceable from input → factor → output
- **Self-Hosted**: Companies maintain full control over their data
- **Audit-Ready**: Built for third-party assurance and regulatory compliance
- **Open Source**: AGPL-3.0 licensed, no vendor lock-in
- **Cost Effective**: No per-seat fees or subscription costs

**Target Market**: Small to mid-sized enterprises (SMEs) requiring credible emissions accounting without the cost and complexity of enterprise SaaS platforms.

---

## Product Vision & Goals

### Vision Statement

> **Climate transparency should not be paywalled.**

OpenEco believes that credible climate reporting depends on transparency of method, not proprietary systems. We're building infrastructure for accountability that any organization can deploy, audit, and trust.

### Strategic Goals

**Short-Term (Q1-Q2 2025):**
1. Establish credibility through transparent, auditable calculations
2. Achieve GHG Protocol alignment and audit-readiness
3. Enable enterprise self-hosting with minimal IT overhead
4. Build core measurement and reporting capabilities

**Medium-Term (Q3-Q4 2025):**
1. Differentiate through transparency and interoperability
2. Enable public verification of emissions reports
3. Support multi-organization deployments
4. Build comprehensive API for integrations

**Long-Term (2026+):**
1. Become the de facto open-source standard for emissions accounting
2. Enable cross-organization data sharing (with consent)
3. Support advanced analytics and forecasting
4. Integrate with supply chain transparency initiatives

### Success Metrics

**Adoption Metrics:**
- Number of organizations deploying OpenEco
- Active users per organization
- Data completeness rates
- Report generation frequency

**Credibility Metrics:**
- Third-party audit success rate
- Factor citation accuracy
- Calculation reproducibility rate
- User trust scores

**Technical Metrics:**
- Deployment success rate (target: >90% first-time success)
- API adoption rate
- Data export usage
- Performance benchmarks (page load, calculation speed)

---

## Target Users & Personas

### Primary Personas

#### 1. Sustainability Manager (Primary User)
**Role**: Manages emissions accounting and reporting  
**Goals**: 
- Track emissions across all scopes accurately
- Generate audit-ready reports
- Identify reduction opportunities
- Ensure compliance with reporting standards

**Pain Points**:
- Expensive SaaS platforms
- Lack of transparency in calculations
- Vendor lock-in
- Limited customization

**Needs**:
- Intuitive measurement entry
- Clear data lineage
- Export capabilities
- Audit trail visibility

---

#### 2. IT Administrator (Deployment Owner)
**Role**: Deploys and maintains OpenEco infrastructure  
**Goals**:
- Self-host on company infrastructure
- Integrate with existing identity systems
- Maintain data sovereignty
- Ensure security and compliance

**Pain Points**:
- Complex deployment processes
- Integration challenges
- Maintenance overhead
- Security concerns

**Needs**:
- Simple deployment (Docker/Podman)
- Federated authentication (OIDC/SAML)
- Clear documentation
- Security best practices

---

#### 3. Executive/CFO (Decision Maker)
**Role**: Approves budgets and reviews reports  
**Goals**:
- Understand emissions trends
- Ensure regulatory compliance
- Make data-driven decisions
- Present to stakeholders

**Pain Points**:
- Lack of visibility into emissions
- Unclear ROI on sustainability initiatives
- Compliance risks
- Reporting complexity

**Needs**:
- Executive dashboards
- Clear visualizations
- Export-ready reports
- Trend analysis

---

#### 4. Auditor/Assurance Provider (External User)
**Role**: Reviews and verifies emissions data  
**Goals**:
- Verify calculation accuracy
- Trace data lineage
- Review evidence
- Provide assurance opinions

**Pain Points**:
- Opaque calculation methods
- Missing audit trails
- Incomplete documentation
- Limited access to source data

**Needs**:
- Complete audit trail
- Factor citations
- Evidence attachments
- Export audit packs

---

### Secondary Personas

- **Data Contributor**: Enters activity data, limited permissions
- **Compliance Officer**: Ensures regulatory compliance
- **Supply Chain Manager**: Tracks Scope 3 supplier data
- **Developer/Integrator**: Builds integrations via API

---

## Features & Requirements

### Tier 1: Credibility Spine (Critical - Q1 2025)

**Goal**: Build enterprise trust through transparent, auditable calculations.

#### 1.1 Calculation Transparency
**Priority**: P0 (Must Have)  
**Status**: 📅 Planned

**Requirements:**
- Every emission value must be traceable to:
  - Source activity data
  - Emission factor (with version)
  - Calculation methodology
  - Transformation steps
- Calculation Details Drawer showing:
  - Factor source (DEFRA, IPCC, EPA)
  - Factor version
  - GWP (Global Warming Potential) set
  - Methodology reference
  - Calculation formula
- Immutable calculation records (append-only)

**Acceptance Criteria:**
- ✅ User can click any emission value to see full calculation details
- ✅ All factors are versioned and cited
- ✅ Calculations are reproducible from exported data
- ✅ Methodology is documented and accessible

---

#### 1.2 Factor Library & Versioning
**Priority**: P0 (Must Have)  
**Status**: 📅 Planned

**Requirements:**
- Factor library module (`/factors`) with:
  - DEFRA factors (UK)
  - IPCC factors (international)
  - EPA factors (US)
  - Custom factors (organization-specific)
- Factor search and filtering
- Factor versioning:
  - Pin factor versions per reporting period
  - Immutable historical factors
  - Version comparison view
- Factor metadata:
  - Source organization
  - Publication date
  - Geographic applicability
  - Category mapping

**Acceptance Criteria:**
- ✅ Users can browse and search emission factors
- ✅ Factors are versioned and cannot be modified after use
- ✅ Reporting periods reference specific factor versions
- ✅ Factor changes trigger recalculation notifications

---

#### 1.3 Evidence Attachments
**Priority**: P0 (Must Have)  
**Status**: 📅 Planned

**Requirements:**
- Upload evidence per activity record:
  - Invoices
  - Receipts
  - Scale tickets
  - Meter readings
  - Other supporting documents
- File storage (S3-compatible)
- File metadata:
  - Upload date
  - Uploader
  - File type
  - File size
- Evidence viewer in UI
- Evidence export in audit packs

**Acceptance Criteria:**
- ✅ Users can attach multiple files per measurement
- ✅ Files are stored securely and access-controlled
- ✅ Evidence is included in audit exports
- ✅ File metadata is tracked and auditable

---

#### 1.4 Approval Workflow
**Priority**: P0 (Must Have)  
**Status**: 📅 Planned

**Requirements:**
- Measurement states:
  - **Draft**: Being created/edited
  - **Submitted**: Awaiting review
  - **Approved**: Reviewed and accepted
  - **Rejected**: Requires revision
  - **Locked**: Cannot be modified (after period lock)
- Role-based permissions:
  - Data Contributors: Create/edit drafts
  - Reviewers: Approve/reject submissions
  - Admins: Override locks (with audit trail)
- Approval notifications
- Approval history tracking

**Acceptance Criteria:**
- ✅ Measurements follow defined workflow states
- ✅ Role-based permissions are enforced
- ✅ Approval actions are logged
- ✅ Locked periods prevent modifications

---

#### 1.5 Audit Log & Trail
**Priority**: P0 (Must Have)  
**Status**: 📅 Planned

**Requirements:**
- Track all state changes:
  - Data creation/updates/deletes
  - Factor changes
  - Calculation runs
  - Approval actions
  - User actions
- Audit log entries include:
  - Timestamp
  - User (who)
  - Action (what)
  - Resource (which)
  - Before/after values (if applicable)
  - IP address (optional, for security)
- Audit trail UI:
  - Timeline view
  - Filterable by user, action, date
  - Exportable
- Immutable audit records

**Acceptance Criteria:**
- ✅ All data changes are logged
- ✅ Audit trail is searchable and filterable
- ✅ Audit log cannot be modified
- ✅ Audit trail is exportable for external review

---

#### 1.6 Export Audit Pack
**Priority**: P0 (Must Have)  
**Status**: 📅 Planned

**Requirements:**
- ZIP export containing:
  - CSV data files (all measurements)
  - JSON structured data
  - Methodology documentation
  - Factor citations
  - Evidence files
  - Audit trail
  - Report PDFs
- Export includes:
  - Complete data lineage
  - Calculation details
  - Approval history
  - Metadata
- Export is timestamped and versioned
- Export can be regenerated (immutable data)

**Acceptance Criteria:**
- ✅ Single-click export generates complete audit pack
- ✅ Export contains all necessary data for external audit
- ✅ Export is self-contained and verifiable
- ✅ Export format is documented

---

### Tier 2: Platform Differentiation (High Priority - Q2-Q3 2025)

**Goal**: Differentiate OpenEco as the "system of proof" through transparency and interoperability.

#### 2.1 Public Verification Artifacts
**Priority**: P1 (Should Have)  
**Status**: 📅 Planned

**Requirements:**
- QR codes on frozen reports
- Shareable verification links (no login required)
- Public verification page showing:
  - Report summary
  - Calculation methodology
  - Factor citations
  - Data completeness
  - Verification hash
- Verification hash (cryptographic)
- Report freezing (immutable snapshot)

**Acceptance Criteria:**
- ✅ Reports can be verified publicly without login
- ✅ Verification links are shareable
- ✅ Verification page shows complete transparency
- ✅ Frozen reports cannot be modified

---

#### 2.2 Scope 2 Dual Reporting
**Priority**: P1 (Should Have)  
**Status**: 📅 Planned

**Requirements:**
- Location-based calculation (grid average)
- Market-based calculation (contracts, RECs)
- Side-by-side comparison
- Methodology documentation for each
- GHG Protocol compliance

**Acceptance Criteria:**
- ✅ Both location-based and market-based calculations available
- ✅ Calculations are clearly labeled and explained
- ✅ Methodology differences are documented
- ✅ Reports can include both methods

---

#### 2.3 Data Quality Scoring
**Priority**: P1 (Should Have)  
**Status**: 📅 Planned

**Requirements:**
- Coverage percentage indicators
- Anomaly detection:
  - Unusual spikes/drops
  - Missing data patterns
  - Inconsistent units
- Completeness tracking:
  - Scope completeness
  - Category completeness
  - Time period completeness
- Quality score visualization
- Quality improvement recommendations

**Acceptance Criteria:**
- ✅ Data quality scores are visible throughout UI
- ✅ Anomalies are automatically flagged
- ✅ Completeness tracking is accurate
- ✅ Quality recommendations are actionable

---

#### 2.4 Interoperability-First API
**Priority**: P1 (Should Have)  
**Status**: 📅 Planned

**Requirements:**
- Full REST API with:
  - Authentication (API keys, OAuth)
  - CRUD operations
  - Bulk operations
  - Webhooks
  - Rate limiting
- API documentation (OpenAPI/Swagger)
- SDK examples (Python, JavaScript)
- Integration guides

**Acceptance Criteria:**
- ✅ All platform features accessible via API
- ✅ API is well-documented
- ✅ API supports bulk operations
- ✅ Webhooks enable real-time integrations

---

### Tier 3: Core Platform Features (Medium Priority - Q2-Q4 2025)

#### 3.1 Dashboard & Visualization
**Priority**: P1 (Should Have)  
**Status**: 🚧 In Progress

**Requirements:**
- Executive dashboard:
  - Total emissions (tCO₂e)
  - Scope 1/2/3 breakdown
  - YoY change percentage
  - Data completeness percentage
- Visualizations:
  - Donut/stacked bar charts (scope breakdown)
  - Line charts (emissions over time)
  - Bar charts (emissions by category)
- Customizable dashboards
- Export charts (PNG, SVG, PDF)

**Acceptance Criteria:**
- ✅ Dashboard shows key metrics at a glance
- ✅ Charts are interactive and exportable
- ✅ Dashboard is responsive (mobile-friendly)
- ✅ Dashboard data is real-time

---

#### 3.2 Measurement Management
**Priority**: P0 (Must Have)  
**Status**: 🚧 In Progress

**Requirements:**
- Measurement matrix table:
  - Category, Location, Quantity, Unit, Factor, Source, Status
  - Filtering, sorting, pagination
  - Bulk operations
- Measurement detail view:
  - Full calculation details
  - Edit history
  - Evidence attachments
  - Reviewer comments
- Add/edit measurement forms
- Import from CSV
- Validation and error handling

**Acceptance Criteria:**
- ✅ Users can create/edit measurements easily
- ✅ Measurements are validated before save
- ✅ Measurement history is tracked
- ✅ Bulk import is supported

---

#### 3.3 Scopes View
**Priority**: P1 (Should Have)  
**Status**: 📅 Planned

**Requirements:**
- Separate views for Scope 1, 2, 3
- Category breakdown per scope
- Methodology documentation
- Assumptions and exclusions
- GHG Protocol alignment indicators

**Acceptance Criteria:**
- ✅ Each scope has dedicated view
- ✅ Scope methodology is documented
- ✅ Assumptions/exclusions are visible
- ✅ GHG Protocol compliance is clear

---

#### 3.4 Reports Generation
**Priority**: P1 (Should Have)  
**Status**: 📅 Planned

**Requirements:**
- Prebuilt report templates:
  - Annual GHG Inventory
  - Supplier Disclosure
  - Compliance Export (CSRD, SEC, etc.)
  - Grant Application Export
- Export formats:
  - PDF (formatted)
  - CSV (data)
  - JSON (structured)
  - Excel (multi-sheet)
- Custom report builder
- Report scheduling (future)

**Acceptance Criteria:**
- ✅ Reports are exportable in multiple formats
- ✅ Reports include methodology and citations
- ✅ Reports are audit-ready
- ✅ Custom reports can be created

---

#### 3.5 Targets & Actions
**Priority**: P2 (Nice to Have)  
**Status**: 📅 Planned

**Requirements:**
- Set reduction targets:
  - Percentage or absolute
  - Baseline year
  - Target year
- Progress tracking:
  - Current vs. target
  - On-track indicators
  - Projections
- Action plans (future):
  - Reduction initiatives
  - ROI calculations
  - Implementation tracking

**Acceptance Criteria:**
- ✅ Users can set and track targets
- ✅ Progress is visualized
- ✅ Targets are exportable
- ✅ Projections are available

---

### Tier 4: Enterprise Features (Lower Priority - 2026+)

#### 4.1 Multi-Organization Support
**Priority**: P2 (Nice to Have)  
**Status**: 📅 Future

**Requirements:**
- Organization selector in UI
- Organization-level isolation
- Cross-organization reporting (if permitted)
- Organization templates

---

#### 4.2 Advanced Analytics & Forecasting
**Priority**: P2 (Nice to Have)  
**Status**: 📅 Future

**Requirements:**
- Statistical forecasting models
- Scenario analysis
- Trend projections
- Anomaly detection
- Predictive analytics

---

#### 4.3 AI Assistant (Self-Hosted)
**Priority**: P2 (Nice to Have)  
**Status**: 📅 Planned

**Requirements:**
- Self-hosted LLM (LLaMA, Mistral)
- Read-only data access
- Explain reports
- Summarize emissions changes
- Draft CSRD narratives
- Data hygiene checks
- Query interface (read-only)
- Never generates/modifies emissions values
- Audit trail for all AI interactions

**Acceptance Criteria:**
- ✅ AI runs entirely self-hosted
- ✅ AI never modifies calculation data
- ✅ AI interactions are logged
- ✅ AI provides helpful explanations

---

#### 4.4 Supply Chain Transparency
**Priority**: P2 (Nice to Have)  
**Status**: 📅 Future

**Requirements:**
- Supplier emissions tracking
- Supplier data collection
- Scope 3 category management
- Supplier disclosure reports
- Cross-organization data sharing (with consent)

---

## User Stories

### Epic 1: Measurement Entry

**Story 1.1: As a Sustainability Manager, I want to enter activity data so that I can track our emissions.**
- **Given**: I am logged in as a Data Contributor
- **When**: I navigate to Measurements and click "Add Measurement"
- **Then**: I can enter category, location, quantity, unit, and period
- **And**: The system calculates emissions using the appropriate factor
- **And**: I can attach evidence files

**Story 1.2: As a Sustainability Manager, I want to see calculation details so that I can verify accuracy.**
- **Given**: I have created a measurement
- **When**: I click on the emission value
- **Then**: I see a drawer showing factor source, version, methodology, and calculation steps
- **And**: I can verify the calculation is correct

**Story 1.3: As a Sustainability Manager, I want to import data from CSV so that I can bulk-enter measurements.**
- **Given**: I have a CSV file with activity data
- **When**: I upload the file via the import feature
- **Then**: The system validates and imports the data
- **And**: I can review and approve imported measurements

---

### Epic 2: Reporting & Compliance

**Story 2.1: As an Executive, I want to view an executive dashboard so that I can understand our emissions at a glance.**
- **Given**: I am logged in
- **When**: I navigate to the Overview dashboard
- **Then**: I see total emissions, scope breakdown, YoY change, and completeness
- **And**: I can export the dashboard data

**Story 2.2: As a Sustainability Manager, I want to generate an Annual GHG Inventory report so that I can submit to regulators.**
- **Given**: I have completed measurements for the reporting year
- **When**: I navigate to Reports and select "Annual GHG Inventory"
- **Then**: The system generates a PDF with all required sections
- **And**: The report includes methodology, factor citations, and audit trail

**Story 2.3: As an Auditor, I want to export an audit pack so that I can verify emissions data.**
- **Given**: I have been granted auditor access
- **When**: I navigate to Audit & Lineage and click "Export Audit Pack"
- **Then**: I receive a ZIP file with all data, calculations, evidence, and audit trail
- **And**: I can verify all calculations are reproducible

---

### Epic 3: Data Quality & Transparency

**Story 3.1: As a Sustainability Manager, I want to see data completeness so that I know what data is missing.**
- **Given**: I am viewing the dashboard
- **When**: I check the status indicator
- **Then**: I see overall completeness percentage
- **And**: I can drill down to see missing categories

**Story 3.2: As a Sustainability Manager, I want to trace data lineage so that I can verify calculations.**
- **Given**: I have a measurement
- **When**: I navigate to Audit & Lineage
- **Then**: I see the complete flow from input → transformation → factor → output
- **And**: I can see all transformation steps and approvals

**Story 3.3: As a Public Stakeholder, I want to verify a public report so that I can trust the emissions data.**
- **Given**: I have a QR code or verification link
- **When**: I scan/click the link
- **Then**: I see the report summary and methodology
- **And**: I can verify the report hash matches

---

## Technical Requirements

### Architecture Requirements

**Deployment:**
- Self-hosted on company infrastructure
- Docker/Podman container support
- Kubernetes/OKD deployment options
- Single-host deployment for SMEs
- Multi-tenant support (future)

**Database:**
- PostgreSQL 14+ (required)
- Prisma ORM
- Migration support
- Backup/restore capabilities

**Authentication:**
- NextAuth.js integration
- Federated authentication (OIDC/SAML via Keycloak)
- Role-based access control (RBAC)
- Multi-organization support

**API:**
- RESTful API design
- OpenAPI/Swagger documentation
- Authentication (API keys, OAuth)
- Rate limiting
- Webhooks

**Security:**
- Data encryption at rest
- TLS/HTTPS for data in transit
- Role-based access control
- Audit logging
- Security best practices documentation

---

### Performance Requirements

**Page Load:**
- Dashboard: < 2 seconds
- Measurement table: < 3 seconds (1000 rows)
- Report generation: < 30 seconds

**Calculation:**
- Single measurement: < 1 second
- Bulk calculation (100 measurements): < 10 seconds
- Full reporting period: < 60 seconds

**Scalability:**
- Support 1000+ measurements per organization
- Support 100+ concurrent users
- Support 10+ organizations per instance (future)

---

### Browser Support

**Desktop:**
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

**Mobile:**
- iOS Safari (latest 2 versions)
- Chrome Mobile (latest 2 versions)

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast requirements

---

## Timeline & Milestones

### Q1 2025: Credibility Spine

**Milestone 1.1: Calculation Transparency** (Week 1-4)
- Calculation Details Drawer
- Factor citations
- Methodology documentation

**Milestone 1.2: Factor Library** (Week 5-8)
- Factor library module
- Factor versioning
- Factor search/filter

**Milestone 1.3: Approval Workflow** (Week 9-12)
- Measurement states
- Role-based permissions
- Approval UI

**Milestone 1.4: Audit Trail** (Week 13-16)
- Audit logging
- Audit trail UI
- Export audit pack

---

### Q2 2025: Platform Differentiation

**Milestone 2.1: Public Verification** (Week 17-20)
- QR codes
- Verification links
- Public verification page

**Milestone 2.2: Data Quality** (Week 21-24)
- Completeness tracking
- Anomaly detection
- Quality scoring

**Milestone 2.3: API** (Week 25-28)
- REST API
- API documentation
- SDK examples

---

### Q3-Q4 2025: Core Features & Polish

**Milestone 3.1: Dashboard Enhancement** (Week 29-32)
- Executive dashboard
- Advanced visualizations
- Custom dashboards

**Milestone 3.2: Reports** (Week 33-36)
- Report templates
- Export formats
- Custom report builder

**Milestone 3.3: Targets** (Week 37-40)
- Target setting
- Progress tracking
- Projections

**Milestone 3.4: Polish & Optimization** (Week 41-48)
- Performance optimization
- UI/UX improvements
- Documentation updates

---

## Dependencies

### External Dependencies

**Emission Factor Sources:**
- DEFRA (UK government)
- IPCC (United Nations)
- EPA (US government)
- Custom factors (organization-provided)

**Standards & Frameworks:**
- GHG Protocol Corporate Standard
- ISO 14064 (future)
- CSRD (EU)
- SEC Climate Disclosure (US)

**Technology:**
- Next.js 16+
- PostgreSQL 14+
- Prisma 7+
- Node.js 18+

---

### Internal Dependencies

**Design System:**
- EcoKit components
- Design tokens
- UI patterns

**Infrastructure:**
- Docker/Podman
- Kubernetes (optional)
- Keycloak (for federated auth)

**Documentation:**
- Architecture documentation
- Installation guides
- API documentation

---

## Risks & Mitigation

### Risk 1: Deployment Complexity
**Risk**: Companies struggle with self-hosting deployment  
**Impact**: High - Blocks adoption  
**Probability**: Medium  
**Mitigation**:
- Comprehensive installation guides
- Automated setup scripts
- Docker Compose templates
- Community support channels

---

### Risk 2: Data Quality Issues
**Risk**: Users enter incorrect data, leading to inaccurate emissions  
**Impact**: High - Undermines credibility  
**Probability**: Medium  
**Mitigation**:
- Data validation rules
- Data quality scoring
- Anomaly detection
- User training materials

---

### Risk 3: Factor Updates
**Risk**: Emission factors change, requiring recalculation  
**Impact**: Medium - Maintenance overhead  
**Probability**: High  
**Mitigation**:
- Factor versioning
- Immutable historical factors
- Recalculation notifications
- Automated factor updates (optional)

---

### Risk 4: Regulatory Changes
**Risk**: Reporting standards change, requiring platform updates  
**Impact**: Medium - Compliance risk  
**Probability**: Medium  
**Mitigation**:
- Standards-agnostic architecture
- Framework mappers
- Regular updates
- Community contributions

---

### Risk 5: Limited Resources
**Risk**: Development team is small, slowing feature delivery  
**Impact**: Medium - Delayed roadmap  
**Probability**: High  
**Mitigation**:
- Focus on core features first
- Community contributions
- Clear contribution guidelines
- Phased releases

---

## Success Criteria

### Phase 1: Credibility (Q1 2025)
- ✅ Every emission value is traceable to source + factor
- ✅ All data changes are logged and auditable
- ✅ Reports include factor citations and methodology
- ✅ Organizations can trust OpenEco for audit-grade accounting

### Phase 2: Differentiation (Q2-Q3 2025)
- ✅ Reports can be publicly verified without login
- ✅ API enables full platform integration
- ✅ Data quality issues are automatically flagged
- ✅ OpenEco differentiates through transparency

### Phase 3: Adoption (Q4 2025)
- ✅ 10+ organizations successfully deploy OpenEco
- ✅ Deployment success rate >90%
- ✅ User satisfaction score >4.0/5.0
- ✅ Community contributions begin

---

## Appendices

### A. Glossary

- **GHG Protocol**: Greenhouse Gas Protocol, international standard for emissions accounting
- **Scope 1**: Direct emissions from owned/controlled sources
- **Scope 2**: Indirect emissions from purchased energy
- **Scope 3**: Other indirect emissions in value chain
- **tCO₂e**: Tonnes of carbon dioxide equivalent
- **GWP**: Global Warming Potential
- **DEFRA**: UK Department for Environment, Food and Rural Affairs
- **IPCC**: Intergovernmental Panel on Climate Change
- **EPA**: US Environmental Protection Agency
- **CSRD**: Corporate Sustainability Reporting Directive (EU)
- **OIDC**: OpenID Connect (authentication protocol)
- **SAML**: Security Assertion Markup Language

### B. References

- [GHG Protocol Corporate Standard](https://ghgprotocol.org/corporate-standard)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [PLATFORM_FEATURES.md](./PLATFORM_FEATURES.md)
- [ROADMAP.md](./ROADMAP.md)
- [UI_UX_WIREFRAME_PLAN.md](./UI_UX_WIREFRAME_PLAN.md)

### C. Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-17 | Initial PRD creation |

---

**Document Owner**: Product Team  
**Reviewers**: Engineering, Design, Community  
**Next Review**: Q1 2025
