# UX Research Guidelines

## Overview

UX research for the Open Climate Transparency Platform informs design decisions with evidence from the people who use the product — sustainability officers, ESG teams, auditors, suppliers, and executive stakeholders. This document defines our research methods, cadence, personas, and documentation standards.

---

## Research Principles

1. **Research informs, it doesn't dictate.** Data from research is one input into design decisions, alongside technical constraints and business goals.
2. **All research is better than no research.** Even a lightweight guerrilla study beats purely assumption-driven design.
3. **Share findings openly.** Research insights belong to the whole team, not just designers.
4. **Represent underserved voices.** Actively recruit users from smaller organizations, non-English-speaking regions, and sustainability newcomers.
5. **Tie insights to outcomes.** Every research finding should be mapped to a user outcome or product decision.

---

## User Personas

### 1. The Sustainability Lead
**Role**: In-house sustainability or ESG manager  
**Organization size**: 200–5,000 employees  
**Goal**: Build and maintain a credible GHG inventory, satisfy investor and regulatory reporting requirements  
**Pain points**:
- Fragmented data across business units and suppliers
- Manually reconciling spreadsheets
- Explaining scope 3 methodology to leadership

**Design implications**:
- Dashboards should surface data gaps and data quality scores prominently
- Workflow should support multi-step review and approval
- Terminology should align with GHG Protocol and TCFD frameworks

---

### 2. The Data Contributor
**Role**: Operations manager, facilities manager, procurement lead  
**Organization size**: Any  
**Goal**: Submit accurate activity data quickly without learning a new system  
**Pain points**:
- Unclear what data is needed and in what format
- Fear of entering incorrect data
- No feedback on whether submitted data was used

**Design implications**:
- Input forms need inline guidance and example values
- Progress indicators and confirmation messages are essential
- Bulk import (CSV) must be simple and well-documented

---

### 3. The External Auditor
**Role**: Third-party verifier or internal audit team  
**Organization size**: Any  
**Goal**: Verify that reported data is accurate, traceable, and methodology-compliant  
**Pain points**:
- Difficulty tracing a reported figure back to its source activity
- Missing metadata on calculation assumptions
- No standardized export format

**Design implications**:
- Audit trail views must show full data lineage
- Every calculated value should expose its formula and inputs
- Export formats must support standard audit templates

---

### 4. The Executive Stakeholder
**Role**: CEO, CFO, Chief Sustainability Officer  
**Organization size**: Any  
**Goal**: Understand progress against climate targets and make high-level decisions  
**Pain points**:
- Too much detail, not enough narrative
- No easy way to compare performance period-over-period
- Difficulty communicating results to the board

**Design implications**:
- Executive dashboards must emphasize KPIs, trends, and progress-to-target
- One-click export to presentation-ready formats (PDF, slides)
- Plain-language summaries alongside raw data

---

### 5. The Supplier Contact
**Role**: Sustainability or operations contact at a vendor/supplier  
**Organization size**: SME (1–200 employees)  
**Goal**: Respond to data requests from buyers without significant time investment  
**Pain points**:
- Receives multiple, inconsistent data requests from different buyers
- Unfamiliar with GHG accounting methodology
- Limited time and no dedicated sustainability resource

**Design implications**:
- Supplier-facing portal must be extremely simple and guided
- Inline explanations of every field
- Pre-fill where possible from publicly available data

---

## Research Methods

### Generative Research (Discovery)
Used at the start of a project or feature to understand user needs, contexts, and mental models.

| Method | When to use | Time investment |
|--------|-------------|-----------------|
| **Contextual inquiry** | Understanding how users work with data today | High (4–6 hrs/participant) |
| **Stakeholder interviews** | Aligning on goals and constraints with internal teams | Medium (1 hr/session) |
| **Diary studies** | Tracking sustainability reporting workflows over a reporting cycle | High (2–4 weeks) |
| **Competitive analysis** | Understanding the landscape before a major feature | Medium (1–2 days) |
| **Secondary research** | Reviewing GHG Protocol, TCFD, and sector-specific frameworks | Low–Medium |

### Evaluative Research (Validation)
Used to assess whether a design solution works for users.

| Method | When to use | Time investment |
|--------|-------------|-----------------|
| **Usability testing** | Before and after major UI changes | Medium (45–60 min/participant, 5–8 participants) |
| **Cognitive walkthrough** | Early wireframe evaluation without recruiting users | Low (2–4 hrs) |
| **First-click testing** | Validating information architecture and navigation | Low (unmoderated, 20+ participants) |
| **A/B testing** | Comparing two design variants at scale | Medium–High (requires traffic) |
| **Heuristic evaluation** | Quick expert review of design against usability principles | Low (1–2 days) |

### Continuous Research (Ongoing)
Used to maintain a constant pulse on user needs and product performance.

| Method | When to use | Time investment |
|--------|-------------|-----------------|
| **Session recordings** | Identifying usability issues post-launch | Low (ongoing) |
| **Support ticket analysis** | Finding recurring pain points | Low (weekly triage) |
| **NPS / CSAT surveys** | Tracking satisfaction trends | Low (quarterly) |
| **Feature request analysis** | Understanding demand for roadmap items | Low (monthly) |

---

## Research Cadence

| Frequency | Activity |
|-----------|----------|
| **Weekly** | Review support tickets and session recordings for patterns |
| **Monthly** | Share a research digest with the product team |
| **Per sprint** | Run at least one evaluative study for features in development |
| **Quarterly** | Conduct 3–5 generative interviews to refresh persona knowledge |
| **Annually** | Run a full usability audit of the platform end-to-end |

---

## Recruiting Participants

### Screener Criteria
- Primary role involves sustainability reporting, ESG data management, or environmental compliance
- Has used a spreadsheet or software tool for emissions tracking in the past 12 months
- Available for a [duration] session via video call

### Diversity Targets
- Mix of organization sizes (SME, mid-market, enterprise)
- Mix of industries (manufacturing, finance, retail, energy, tech)
- Mix of GHG reporting experience (beginner to expert)
- Geographic and linguistic diversity (at minimum, include non-native English speakers)

### Participant Sources
- Existing user base (opt-in research panel)
- Community contributors and open-source collaborators
- Partner organizations
- Professional networks (LinkedIn, sustainability associations)

---

## Conducting Research

### Interview Guide Structure
1. **Introduction** (5 min): Explain purpose, recording consent, ground rules
2. **Warm-up** (5 min): Role, org context, day-to-day workflow
3. **Core questions** (30–40 min): Scenario-based, open-ended questions
4. **Prototype/task walkthrough** (if applicable): Think-aloud tasks
5. **Wrap-up** (5 min): Open questions, check for anything missed

### Interviewer Principles
- Ask "why" and "tell me more" liberally
- Avoid leading questions ("Would you say that X was frustrating?")
- Embrace silence — give participants time to think
- Stay curious, not defensive about existing designs

---

## Synthesizing & Documenting Findings

### Affinity Mapping
Group raw observations into themes using sticky notes (physical or digital — Miro, FigJam). Themes should emerge from data, not be imposed in advance.

### Insight Format
Write each insight as:
> **[User type] [does/experiences/believes] [X] because [Y], which means [design implication].**

Example:
> Sustainability leads manually check supplier data against previous years because the platform doesn't surface anomalies automatically, which means we should add automated outlier detection to the data review step.

### Severity Ratings (Usability Issues)
| Rating | Description |
|--------|-------------|
| **Critical** | Prevents task completion; must fix before launch |
| **Major** | Causes significant difficulty; fix in current sprint |
| **Minor** | Causes friction but can be worked around; fix soon |
| **Cosmetic** | Small polish issue; fix when time allows |

---

## Sharing Research

### Research Repository
Store all studies, recordings (with consent), screener templates, and synthesis in the shared research repository folder. Every study should include:
- Research brief (objective, method, participants)
- Discussion guide
- Raw notes or recordings (with consent)
- Synthesis document
- Key findings slide (3–5 slides, shareable)

### Research Readout Format
Present findings within **1 sprint** of completing a study. Keep readouts to **20 minutes**: 10 min findings, 10 min discussion.

Include:
- Top 3–5 insights
- Supporting quotes (anonymized)
- Recommended actions with priority

---

## Climate UX Considerations

### Communicating Uncertainty
Emissions calculations involve estimates, methodological choices, and data quality variations. Design must:
- Surface confidence levels or data quality scores where relevant
- Explain methodology choices in plain language
- Avoid presenting estimates as precise facts

### Avoiding Eco-Anxiety
- Frame data positively where possible: show progress, not just problems
- Use reductions and milestones as narrative anchors
- Avoid red-dominant dashboards; use neutral/positive color framing for data that is improving

### Supporting Non-Expert Users
- Never assume knowledge of GHG Protocol, Scope 1/2/3, or tCO₂e
- Provide contextual glossary links on first use of technical terms
- Offer comparison benchmarks ("Your footprint is X% below the industry average")

### Equity & Accessibility in Research
- Recruit participants from under-resourced organizations who may not have a dedicated sustainability team
- Conduct interviews in participants' preferred language when possible
- Consider async research formats for participants in different time zones

---

## Best Practices

### ✅ Do
- Document all research, even informal conversations
- Involve engineers and product managers in research sessions
- Map findings to product decisions explicitly
- Revisit old research before starting new studies
- Share findings in plain language, not research jargon

### ❌ Don't
- Run research just to validate a decision already made
- Recruit only expert users
- Store research in personal folders — always use shared storage
- Present raw quotes without synthesis
- Let findings sit unread — create action items
