# Writing Guidelines

## Voice & Tone

### Our Voice
The Open Climate Transparency Platform speaks with **clarity, urgency, and optimism**. We communicate complex environmental data in ways that motivate action without inducing despair.

- **Clear**: Plain language over jargon. If a 12-year-old can't understand it, simplify it.
- **Urgent**: Climate change is real and pressing. Our language reflects that without being alarmist.
- **Optimistic**: We focus on what's possible and the progress being made.
- **Trustworthy**: Grounded in science, data, and transparency.

### Tone Shifts by Context

| Context | Tone | Example |
|---------|------|---------|
| Dashboard / data | Precise, neutral | "34.2 tCO₂e recorded this quarter" |
| Onboarding | Warm, encouraging | "Let's set up your first emissions baseline" |
| Success state | Celebratory, brief | "Report submitted — great work!" |
| Error state | Calm, helpful | "Something went wrong. Here's how to fix it." |
| Marketing / hero | Inspiring, bold | "Measure what matters. Act on what you find." |

---

## Call to Action (CTA) Writing Guidelines

### Core Principles

1. **Start with a verb.** CTAs must be action-first. Tell users exactly what will happen.
2. **Be specific.** "Download Report" beats "Click Here."
3. **Match urgency to context.** Primary CTAs use strong verbs; secondary CTAs are softer.
4. **Keep it short.** Aim for 2–4 words. Never exceed 6.

### CTA Verb Hierarchy

#### Primary CTAs (strong, direct)
Use on main conversion points: buttons, hero sections, sign-up flows.

| ✅ Use | ❌ Avoid |
|--------|---------|
| Start Tracking | Begin |
| Submit Report | Click Here |
| Add Emissions | Enter Data |
| Explore Data | See More |
| Join the Platform | Sign Up |
| Set Your Baseline | Configure |
| View Dashboard | Go to Dashboard |

#### Secondary CTAs (softer, exploratory)
Use on cards, inline links, or supporting actions.

| ✅ Use | ❌ Avoid |
|--------|---------|
| Learn more | Read more |
| See how it works | Click to view |
| Compare options | Check it out |
| Download the guide | Get PDF |

#### Destructive CTAs (cautious, specific)
Use for irreversible or high-stakes actions.

| ✅ Use | ❌ Avoid |
|--------|---------|
| Delete report permanently | Remove |
| Revoke access | Cancel |
| Discard changes | Go back |

### CTA Patterns by Screen Type

**Onboarding flow:**
- "Set Up My Organization" → "Add Team Members" → "Import Activity Data" → "Generate First Report"

**Dashboard empty state:**
- "Add Your First Emission Source" / "Import Data Now"

**Report completion:**
- "Submit for Review" / "Export as PDF" / "Share with Stakeholders"

**Error recovery:**
- "Try Again" / "Contact Support" / "Go Back to Dashboard"

---

## Climate-Focused Action Words

### High-Impact Verbs
Use these to describe what users and the platform can do:

| Category | Words |
|----------|-------|
| **Measure** | Track, Capture, Record, Log, Monitor, Quantify, Benchmark |
| **Analyze** | Calculate, Assess, Audit, Evaluate, Model, Compare, Project |
| **Report** | Submit, Publish, Export, Share, Disclose, Certify, Validate |
| **Reduce** | Offset, Cut, Eliminate, Decarbonize, Reduce, Neutralize, Abate |
| **Improve** | Optimize, Transform, Accelerate, Advance, Progress, Build |
| **Collaborate** | Engage, Connect, Align, Coordinate, Partner, Share |

### Climate-Positive Nouns
Use these in headings, labels, and descriptions:

| Category | Words |
|----------|-------|
| **Data** | Emissions, Carbon footprint, GHG inventory, Scope 1/2/3, tCO₂e, Baseline |
| **Progress** | Reduction pathway, Net zero target, Climate action, Milestone, Trajectory |
| **Transparency** | Audit trail, Disclosure, Verification, Traceability, Accountability |
| **Stakeholders** | Sustainability team, ESG officer, Supplier, Auditor, Investor |

### Words to Use Carefully

| Word | Issue | Better Alternative |
|------|-------|--------------------|
| Carbon neutral | Vague, often greenwashed | Net zero, verified offset |
| Green | Overused, imprecise | Sustainable, low-carbon, climate-aligned |
| Eco-friendly | Marketing fluff | Emissions-reduced, measurably lower impact |
| Clean energy | Ambiguous | Renewable energy, zero-emission energy |
| Offset | Implies substitution | Verified carbon removal, compensatory reduction |

### Words to Avoid
- **Alarmist**: catastrophe, crisis (unless citing a specific report), doomed
- **Vague**: sustainable (without metrics), responsible, better for the planet
- **Passive**: carbon is removed, data is collected (prefer active voice)

---

## Content Hierarchy

### Page Titles
- One clear idea
- Active noun or gerund phrase
- Examples: "Emissions Tracker", "Quarterly Report Builder", "Your Carbon Baseline"

### Section Headings
- Describe what the user will find or do
- Sentence case (not Title Case) for body headings
- Examples: "How we calculate your footprint", "Your top emission sources"

### Body Copy
- Lead with the most important information
- One idea per paragraph
- Max 3–4 sentences per paragraph

### Labels & Metadata
- Ultra-concise: ≤ 3 words
- Use nouns: "Scope 1 Emissions", "Report Date", "Verification Status"

---

## Inclusive Language

### Accessibility-First Writing
- Write for plain language (Flesch-Kincaid Grade 8 or lower for general UI copy)
- Avoid idioms that don't translate across cultures
- Use "and/or" sparingly — pick one or rephrase

### Global & Cultural Sensitivity
- Use metric units as default (tCO₂e, km, L)
- Provide unit conversion where users may expect imperial
- Avoid region-specific idioms (e.g., "hit a home run")

### Climate Justice Awareness
- Acknowledge that climate impacts are not equally distributed
- Avoid language that implies only large corporations have responsibility
- Reference communities, not just organizations

### Do/Don't Examples

| ✅ Do | ❌ Don't |
|-------|---------|
| "Organizations of all sizes" | "Big companies" |
| "Your emissions data" | "Your carbon sins" |
| "Communities most affected" | "Third-world countries" |
| "Reduce emissions across your supply chain" | "Make your suppliers go green" |

---

## Microcopy & UI Text

### Tooltips
- Start with a verb or noun — never "This is…"
- Max 1 sentence
- Example: "Total greenhouse gas emissions from direct operations (Scope 1)"

### Empty States
- Say what's missing + what to do
- Example: "No emission sources yet. Add your first source to start tracking."

### Confirmation Messages
- Confirm what happened + what's next
- Example: "Report submitted. Your team will receive a notification."

### Loading States
- Use progressive phrasing
- Examples: "Calculating emissions…", "Building your report…", "Connecting to data source…"

### Form Validation
- Be specific about the error
- Suggest the fix
- Example: "Start date must be before end date. Try adjusting the date range."

---

## Best Practices

### ✅ Do
- Lead with verbs in CTAs
- Use climate-specific vocabulary consistently
- Keep body copy under 80 characters per line
- Test copy with real users before shipping
- Use active voice

### ❌ Don't
- Use jargon without explanation (e.g., "TCFD alignment" without context)
- Write passive CTAs ("Data can be submitted")
- Use emojis in data-critical contexts
- Repeat the same CTA label on the same screen
- Overuse exclamation marks (max one per screen)
