# OpenEco Dashboard — UI / UX Wireframe Plan (v1)

## Overview

This document provides a detailed wireframe plan for the OpenEco Dashboard, structured in layers rather than individual screens. The design follows enterprise patterns (IBM Cloud, Carbon, Watershed) and prioritizes transparency, auditability, and multi-organization support.

**Design Principles:**
- **Transparency First**: Every calculation must be traceable
- **Enterprise Usability**: Matches IT mental models and workflows
- **Audit-Defensible**: Every action is logged and reviewable
- **Multi-Org Ready**: Organization selector is critical
- **Export-First**: Data must be exportable in multiple formats

---

## 1️⃣ Global Frame (Always Present)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Top Bar (Fixed, 64px height)                                   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│ │ Org      │ │ Year     │ │ Status   │ │          │ │ User   │ │
│ │ Selector │ │ Selector │ │ Indicator│ │ (spacer) │ │ Menu   │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────┐                                                    │
│ │          │                                                    │
│ │ Left     │  Main Content Area (Dynamic)                       │
│ │ Nav      │                                                    │
│ │ (240px)  │                                                    │
│ │          │                                                    │
│ │          │                                                    │
│ └──────────┘                                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Top Bar Components

#### Organization Selector
**Location**: Top-left, first element
**Width**: 200-280px (responsive)
**Component Type**: Dropdown with search

**States:**
- **Default**: Shows current organization name + icon
- **Hover**: Highlights with border
- **Open**: Dropdown with:
  - Search input (filter organizations)
  - List of accessible organizations
  - "Switch Organization" action
  - "Manage Organizations" link (if admin)

**Data Requirements:**
- Organization ID
- Organization name
- Organization logo/icon (optional)
- User's role in organization
- Last accessed timestamp

**Accessibility:**
- ARIA label: "Select organization"
- Keyboard navigation: Tab to focus, Enter to open, Arrow keys to navigate
- Screen reader: Announces current org and available options

---

#### Reporting Year Selector
**Location**: Next to organization selector
**Width**: 120-150px
**Component Type**: Dropdown

**States:**
- **Default**: Shows current reporting year (e.g., "2024")
- **Open**: Dropdown with:
  - List of available years (current + past 5 years)
  - "Create New Year" option (if admin)
  - Year status indicators (Draft, Locked, Approved)

**Data Requirements:**
- Current reporting year
- Available reporting years
- Year status (draft/locked/approved)
- Year period (start/end dates)

**Accessibility:**
- ARIA label: "Select reporting year"
- Keyboard navigation support

---

#### Status Indicator
**Location**: Center-right of top bar
**Width**: Auto (120-200px)
**Component Type**: Badge/Pill with icon

**States:**
- **Green**: Data completeness ≥ 90%, audit-ready
- **Yellow**: Data completeness 50-89%, needs attention
- **Red**: Data completeness < 50%, incomplete
- **Gray**: No data yet

**Visual Design:**
```
┌─────────────────────┐
│ 🟢 Audit Ready      │
│ 94% Complete        │
└─────────────────────┘
```

**Click Action**: Opens data completeness modal with:
- Scope breakdown (1/2/3 completeness)
- Missing categories list
- Action items to improve completeness

**Data Requirements:**
- Overall data completeness percentage
- Scope-specific completeness
- Missing data categories
- Audit readiness status

**Accessibility:**
- Color + icon + text (not color-only)
- ARIA live region for status changes
- Tooltip with detailed status on hover

---

#### User Menu
**Location**: Top-right
**Width**: Auto (user name + avatar)
**Component Type**: Dropdown menu

**Menu Items:**
- User name + email
- Divider
- "My Profile" (if implemented)
- "Preferences" (if implemented)
- "Help & Documentation"
- Divider
- "Sign Out"

**Role-Aware Display:**
- Show user's role(s) in current organization
- Highlight if user has admin privileges
- Show organization count if multi-org user

**Data Requirements:**
- User name
- User email
- User avatar (optional)
- User roles (current org + all orgs)
- Organization count

**Accessibility:**
- ARIA label: "User menu"
- Keyboard: Tab to focus, Enter to open, Arrow keys to navigate

---

### Left Navigation

**Width**: 240px (fixed)
**Background**: Light gray (#F5F5F5) or white with border
**Scrollable**: Yes (if content exceeds viewport)

#### Navigation Structure

```
┌────────────────────────┐
│ Overview               │ ← Active state (blue bg + border-left)
│ Measurements           │
│ Scopes                 │
│   ├─ Scope 1          │ ← Nested items (indented)
│   ├─ Scope 2          │
│   └─ Scope 3          │
│ Data Sources           │
│ Reports                │
│ Targets & Actions      │
│ Audit & Lineage        │
│ Settings               │
│                        │
│ (spacer)               │
│                        │
│ Help                   │ ← Bottom section
│ Documentation          │
└────────────────────────┘
```

#### Navigation Item States

**Default:**
- Text color: #333
- Background: Transparent
- Hover: Light gray background (#F0F0F0)

**Active:**
- Text color: #0066CC (brand blue)
- Background: #E6F2FF (light blue)
- Border-left: 3px solid #0066CC
- Font weight: 600

**Disabled:**
- Text color: #999
- Cursor: not-allowed
- Opacity: 0.6

#### Navigation Items Detail

**1. Overview**
- Icon: 📊 (dashboard/chart icon)
- Route: `/dashboard`
- Badge: None (or data completeness % if needed)

**2. Measurements**
- Icon: 📏 (ruler/measure icon)
- Route: `/measurements`
- Badge: Count of pending reviews (if any)

**3. Scopes**
- Icon: 🎯 (target/scope icon)
- Route: `/scopes`
- Expandable: Yes
  - Scope 1 (route: `/scopes/1`)
  - Scope 2 (route: `/scopes/2`)
  - Scope 3 (route: `/scopes/3`)

**4. Data Sources**
- Icon: 📥 (import/upload icon)
- Route: `/data-sources`
- Badge: Count of active sources

**5. Reports**
- Icon: 📄 (document icon)
- Route: `/reports`
- Badge: Count of available reports

**6. Targets & Actions**
- Icon: 🎯 (target/goal icon)
- Route: `/targets`
- Badge: None (or progress indicator)

**7. Audit & Lineage**
- Icon: 🔍 (search/audit icon)
- Route: `/audit`
- Badge: Count of pending approvals (if any)

**8. Settings**
- Icon: ⚙️ (gear icon)
- Route: `/settings`
- Badge: None
- Access: Admin only (hide if not admin)

**Bottom Section:**
- Help (route: `/help` or external link)
- Documentation (route: `/docs` or external link)

**Accessibility:**
- ARIA navigation landmark
- Keyboard navigation: Tab through items, Enter to activate
- Screen reader announces current page
- Skip link to main content

---

## 2️⃣ Overview Dashboard

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Overview Dashboard                    [Export] [Refresh] │ │
│ │ Reporting Year: 2024 | Organization: Acme Corp          │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Core Tiles (Top Row)                                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │ Total    │ │ Scope 1  │ │ Scope 2  │ │ Scope 3  │      │
│ │ Emissions│ │          │ │          │ │          │      │
│ │          │ │          │ │          │ │          │      │
│ │ 1,234    │ │ 456      │ │ 567      │ │ 211      │      │
│ │ tCO₂e    │ │ tCO₂e    │ │ tCO₂e    │ │ tCO₂e    │      │
│ │          │ │          │ │          │ │          │      │
│ │ +12.3%   │ │ +5.2%    │ │ +8.1%    │ │ +25.4%   │      │
│ │ YoY      │ │ YoY      │ │ YoY      │ │ YoY      │      │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│ Secondary Metrics Row                                       │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│ │ Data     │ │ Audit    │ │ Last     │                    │
│ │ Complete │ │ Ready    │ │ Updated  │                    │
│ │          │ │          │ │          │                    │
│ │ 94%      │ │ ✅ Yes   │ │ 2h ago   │                    │
│ └──────────┘ └──────────┘ └──────────┘                    │
│                                                             │
│ Primary Visualization Block                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Emissions by Scope                                       │ │
│ │                                                           │ │
│ │     [Donut Chart or Stacked Bar Chart]                    │ │
│ │                                                           │ │
│ │     Scope 1: 456 tCO₂e (37%)                             │ │
│ │     Scope 2: 567 tCO₂e (46%)                             │ │
│ │     Scope 3: 211 tCO₂e (17%)                             │ │
│ │                                                           │ │
│ │     [View Details] [Export Chart]                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Secondary Insight Block                                     │
│ ┌──────────────────────────┐ ┌──────────────────────────┐ │
│ │ Emissions Over Time      │ │ Emissions by Category     │ │
│ │                          │ │                          │ │
│ │   [Line Chart]           │ │   [Bar Chart]            │ │
│ │                          │ │                          │ │
│ │   Monthly/Quarterly      │ │   Electricity            │ │
│ │   trend visualization    │ │   Fuel                   │ │
│ │                          │ │   Travel                 │ │
│ │                          │ │   Procurement            │ │
│ │                          │ │   Waste                  │ │
│ └──────────────────────────┘ └──────────────────────────┘ │
│                                                             │
│ Quick Actions / Recent Activity                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Recent Measurements | Quick Actions                     │ │
│ │ • Electricity - HQ (2h ago)                             │ │
│ │ • Business Travel (1d ago)                              │ │
│ │ • Waste Disposal (3d ago)                               │ │
│ │                                                          │ │
│ │ [Add Measurement] [View All]                            │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Core Tiles Specification

#### Total Emissions Tile
**Size**: 280px × 160px (responsive: 4-column grid)
**Background**: White with subtle border
**Content:**
- **Top**: Label "Total Emissions" (small, gray text)
- **Center**: Large number (e.g., "1,234") in bold, 36-48px
- **Unit**: "tCO₂e" (smaller, gray text)
- **Bottom**: YoY change with arrow icon
  - Green arrow ↑ for increase (if expected)
  - Red arrow ↓ for decrease (if reduction goal)
  - Percentage: "+12.3% YoY"
  - Tooltip: "Compared to 2023"

**Interactions:**
- Click: Navigate to detailed emissions breakdown
- Hover: Show tooltip with breakdown by scope
- Export: Right-click or icon to export data

**Data Requirements:**
- Total emissions (tCO₂e)
- Previous year total
- YoY change percentage
- Scope breakdown (for tooltip)

**Accessibility:**
- ARIA label: "Total emissions: [value] tCO₂e, [change]% change from previous year"
- Keyboard: Tab to focus, Enter to navigate

---

#### Scope Tiles (1, 2, 3)
**Size**: Same as Total Emissions (280px × 160px)
**Layout**: Identical structure
**Color Coding:**
- Scope 1: Blue accent (#0066CC)
- Scope 2: Green accent (#00AA44)
- Scope 3: Orange accent (#FF6600)

**Content:**
- **Top**: "Scope [1/2/3]" label
- **Center**: Large number (tCO₂e)
- **Bottom**: YoY change percentage

**Interactions:**
- Click: Navigate to scope detail page
- Hover: Show category breakdown tooltip

---

### Primary Visualization Block

#### Emissions by Scope Chart
**Type**: Donut chart (preferred) or stacked bar chart
**Size**: Full width, 400-500px height
**Chart Library**: Recharts or similar

**Donut Chart Design:**
- Center: Total emissions number
- Segments: Three segments (Scope 1, 2, 3)
- Colors: Match scope tile colors
- Legend: Below chart with interactive items
- Tooltip: Show scope name, value, percentage on hover

**Interactions:**
- Click segment: Navigate to scope detail
- Hover segment: Highlight and show tooltip
- Legend click: Toggle scope visibility
- Export: Button to export as PNG/SVG/CSV

**Data Requirements:**
- Scope 1 total
- Scope 2 total
- Scope 3 total
- Total (for center)
- Previous year data (for comparison toggle)

**Accessibility:**
- ARIA label describing chart
- Data table alternative (hidden, screen-reader accessible)
- Keyboard navigation for interactive elements

---

### Secondary Insight Blocks

#### Emissions Over Time Chart
**Type**: Line chart
**Size**: 50% width (responsive: full width on mobile)
**X-Axis**: Time (months or quarters)
**Y-Axis**: Emissions (tCO₂e)
**Lines**: 
- Current year (solid, blue)
- Previous year (dashed, gray) - optional toggle
- Target line (dotted, green) - if targets set

**Interactions:**
- Hover data point: Show exact value and date
- Click data point: Navigate to period detail
- Toggle previous year: Show/hide comparison
- Time range selector: Monthly/Quarterly/Annual

**Data Requirements:**
- Time series data (monthly/quarterly)
- Previous year data (optional)
- Target data (if available)

---

#### Emissions by Category Chart
**Type**: Horizontal bar chart or vertical bar chart
**Size**: 50% width (responsive: full width on mobile)
**Categories**: 
- Electricity
- Fuel
- Travel
- Procurement
- Waste
- Other

**Design:**
- Bars sorted by value (descending)
- Color coding by scope (if applicable)
- Value labels on bars
- Percentage of total shown

**Interactions:**
- Click bar: Navigate to category detail
- Hover: Show detailed breakdown tooltip
- Export: Export category data

**Data Requirements:**
- Category names
- Category emissions (tCO₂e)
- Category percentage of total
- Scope breakdown per category (for tooltip)

---

### Quick Actions / Recent Activity

**Layout**: Card with two sections
**Size**: Full width, auto height

**Recent Measurements:**
- List of 3-5 most recent measurements
- Each item: Category name, location, timestamp
- Click item: Navigate to measurement detail
- "View All" link: Navigate to measurements page

**Quick Actions:**
- "Add Measurement" button (primary)
- "Import Data" button (secondary)
- "Generate Report" button (secondary)

**Data Requirements:**
- Recent measurement IDs
- Measurement metadata (category, location, timestamp)
- User permissions (to show/hide actions)

---

## 3️⃣ Measurements (Core Work Area)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Measurements                          [Add] [Import] [Export] │
│ │ Filter: [All Categories ▼] [All Locations ▼] [Status ▼] │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Measurement Matrix (Table)                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Table with columns: Category | Location | Quantity |   │ │
│ │  Unit | Factor | Source | Status | Actions]             │ │
│ │                                                           │ │
│ │ ┌──────┐┌────────┐┌─────────┐┌──────┐┌──────┐┌──────┐  │ │
│ │ │ Cat  ││Location││Quantity ││ Unit ││Factor││Source│  │ │
│ │ ├──────┤├────────┤├─────────┤├──────┤├──────┤├──────┤  │ │
│ │ │ Elec ││HQ      ││ 10,000  ││ kWh  ││0.5   ││Manual│  │ │
│ │ │      ││        ││         ││      ││      ││      │  │ │
│ │ └──────┘└────────┘└─────────┘└──────┘└──────┘└──────┘  │ │
│ │                                                           │ │
│ │ [Pagination] [Rows per page: 25 ▼]                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Measurement Matrix Table

#### Column Specifications

**1. Category**
- **Width**: 150px
- **Content**: Category name (e.g., "Electricity", "Business Travel")
- **Format**: Text with optional icon
- **Sortable**: Yes
- **Filterable**: Yes (dropdown)

**2. Location**
- **Width**: 150px
- **Content**: Facility/location name
- **Format**: Text
- **Sortable**: Yes
- **Filterable**: Yes (dropdown)

**3. Quantity**
- **Width**: 120px
- **Content**: Numeric value
- **Format**: Number with thousand separators
- **Alignment**: Right-aligned
- **Sortable**: Yes
- **Editable**: Yes (inline edit or modal)

**4. Unit**
- **Width**: 80px
- **Content**: Unit abbreviation (kWh, km, kg, etc.)
- **Format**: Text
- **Sortable**: No
- **Editable**: Yes (dropdown)

**5. Factor**
- **Width**: 100px
- **Content**: Emission factor value
- **Format**: Number (decimal)
- **Alignment**: Right-aligned
- **Sortable**: Yes
- **Tooltip**: Show factor source and version

**6. Source**
- **Width**: 120px
- **Content**: Data source type
- **Format**: Badge/pill
- **Options**: Manual, CSV Upload, API, AI Assistant
- **Sortable**: Yes
- **Filterable**: Yes

**7. Status**
- **Width**: 100px
- **Content**: Status badge
- **Format**: Colored badge
- **States**:
  - Draft (gray)
  - Under Review (yellow)
  - Approved (green)
  - Rejected (red)
- **Sortable**: Yes
- **Filterable**: Yes

**8. Actions**
- **Width**: 120px
- **Content**: Action buttons
- **Format**: Icon buttons
- **Actions**:
  - View/Edit (pencil icon)
  - History (clock icon)
  - Delete (trash icon) - if draft
  - Approve/Reject (checkmark/X) - if reviewer

#### Row Interactions

**Click Row:**
- Opens measurement detail drawer/sidebar
- Shows full measurement data
- Edit history
- Source citation
- Reviewer comments

**Hover Row:**
- Highlights row
- Shows quick preview tooltip

**Inline Edit:**
- Click quantity/factor: Inline edit mode
- Save/Cancel buttons appear
- Validation on save

**Bulk Actions:**
- Checkbox column for multi-select
- Bulk edit, bulk delete, bulk approve

#### Table Features

**Sorting:**
- Click column header to sort
- Multi-column sort (Shift+Click)
- Sort indicator (arrow up/down)

**Filtering:**
- Filter bar above table
- Category dropdown
- Location dropdown
- Status dropdown
- Date range picker
- Search box (full-text)

**Pagination:**
- Page size selector (25/50/100)
- Page navigation (First, Prev, Next, Last)
- Page number input
- Total count display

**Export:**
- Export button (top-right)
- Options: CSV, Excel, JSON
- Respects current filters/sorting

**Accessibility:**
- ARIA table role
- Column headers as `<th>` with scope
- Keyboard navigation (Arrow keys, Tab)
- Screen reader announcements

---

### Measurement Detail Drawer

**Position**: Right side (slide-in)
**Width**: 600px (responsive: full width on mobile)
**Trigger**: Click measurement row

**Content Sections:**

**1. Header**
- Measurement title (Category + Location)
- Status badge
- Close button (X)

**2. Basic Information**
- Category
- Location
- Quantity
- Unit
- Period (start/end dates)

**3. Calculation Details**
- Emission factor
- Factor source (with link)
- Factor version
- Calculation method
- Result: Emissions (tCO₂e)

**4. Source Information**
- Source type
- Uploaded by
- Upload date
- Source file (if applicable)
- Data quality score

**5. Edit History**
- Timeline of changes
- Each entry: User, date, change description
- Expandable to show full change details

**6. Reviewer Comments**
- List of comments
- Add comment (if reviewer)
- Comment thread (if replies enabled)

**7. Actions**
- Edit button
- Delete button (if draft)
- Approve/Reject buttons (if reviewer)
- Export button

**Interactions:**
- Click outside: Close drawer
- ESC key: Close drawer
- Save changes: Update and close
- Cancel: Discard changes and close

---

## 4️⃣ Scopes View (GHG Protocol-Aligned)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Scope 1: Direct Emissions              [Export] [Help]  │ │
│ │ Scope 2: Indirect Emissions (Energy)                    │ │
│ │ Scope 3: Other Indirect Emissions                       │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Scope Tabs (if showing all scopes)                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│ │ Scope 1  │ │ Scope 2  │ │ Scope 3  │                    │
│ │ (Active) │ │          │ │          │                    │
│ └──────────┘ └──────────┘ └──────────┘                    │
│                                                             │
│ Scope Overview Card                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Scope 1: Direct Emissions                               │ │
│ │                                                           │ │
│ │ Total: 456 tCO₂e (37% of total)                         │ │
│ │                                                           │ │
│ │ Included Categories:                                     │ │
│ │ • Stationary Combustion (furnaces, boilers)              │ │
│ │ • Mobile Combustion (company vehicles)                   │ │
│ │ • Fugitive Emissions (refrigerants, leaks)               │ │
│ │                                                           │ │
│ │ Methodology: GHG Protocol Corporate Standard              │ │
│ │ Calculation Method: Activity Data × Emission Factor      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Categories Table                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Category | Emissions | % of Scope | Methodology | Actions│ │
│ │                                                           │ │
│ │ Stationary | 234 tCO₂e | 51% | Activity × Factor | [View]│ │
│ │ Mobile     | 189 tCO₂e | 41% | Activity × Factor | [View]│ │
│ │ Fugitive  | 33 tCO₂e  | 7%  | Activity × Factor | [View]│ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Assumptions & Exclusions                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Assumptions:                                             │ │
│ │ • Grid factors from [source] for electricity             │ │
│ │ • Vehicle emissions based on DEFRA factors               │ │
│ │                                                           │ │
│ │ Exclusions:                                              │ │
│ │ • Employee commuting (reported in Scope 3)               │ │
│ │ • Leased assets (reported by lessor)                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Scope Overview Card

**Content:**
- Scope number and name
- Total emissions for scope
- Percentage of total emissions
- Included categories (list)
- Methodology reference
- Calculation method summary

**Visual Design:**
- Card with border
- Scope color accent (left border)
- Icon representing scope type

---

### Categories Table

**Columns:**
1. **Category**: Category name
2. **Emissions**: Total tCO₂e for category
3. **% of Scope**: Percentage breakdown
4. **Methodology**: Calculation method used
5. **Actions**: View detail button

**Interactions:**
- Click category row: Navigate to category detail
- Sort by emissions (default: descending)
- Export category breakdown

---

### Assumptions & Exclusions Section

**Purpose**: Audit-defensible documentation

**Assumptions:**
- List of assumptions made in calculations
- Factor sources
- Data quality notes
- Estimation methods (if any)

**Exclusions:**
- List of excluded activities
- Rationale for exclusion
- Reference to where excluded data is reported (if applicable)

**Editable**: Yes (by admin/reviewer)
**Versioned**: Yes (track changes to assumptions)

---

## 5️⃣ Data Lineage & Audit (Differentiator)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Audit & Lineage                        [Export] [Filter] │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Lineage Table                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Input → Transformation → Factor → Output → Reviewer      │ │
│ │                                                           │ │
│ │ ┌──────┐  ┌──────────┐  ┌──────┐  ┌──────┐  ┌────────┐│ │
│ │ │Input │→ │Transform │→ │Factor│→ │Output│→ │Reviewer││ │
│ │ │      │  │          │  │      │  │      │  │        ││ │
│ │ │10,000│  │× 0.5     │  │DEFRA │  │5,000 │  │John D. ││ │
│ │ │kWh   │  │          │  │v2.1  │  │tCO₂e │  │(2d ago)││ │
│ │ └──────┘  └──────────┘  └──────┘  └──────┘  └────────┘│ │
│ │                                                           │ │
│ │ [Expand] to show:                                        │ │
│ │ • Raw data source file                                   │ │
│ │ • Transformation steps (detailed)                        │ │
│ │ • Factor metadata (version, source, date)                │ │
│ │ • Calculation formula                                    │ │
│ │ • Approval workflow                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Audit Trail Timeline                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Timeline View                                            │ │
│ │                                                           │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ 2024-01-15 10:30 | John Doe | Created measurement    │ │ │
│ │ │ 2024-01-15 14:20 | Jane Smith | Reviewed measurement │ │ │
│ │ │ 2024-01-15 14:25 | Jane Smith | Approved measurement  │ │ │
│ │ │ 2024-01-16 09:10 | John Doe | Updated factor version │ │ │
│ │ │ 2024-01-16 09:15 | System | Recalculated emissions   │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                           │ │
│ │ [Filter by user] [Filter by action] [Filter by date]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Pending Approvals (if reviewer)                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Items Requiring Review                                   │ │
│ │                                                           │ │
│ │ • Electricity - HQ (created 2h ago) [Approve] [Reject]  │ │
│ │ • Business Travel Q1 (created 1d ago) [Approve] [Reject]│ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Lineage Table Specification

**Purpose**: Show complete data flow from input to output

**Columns:**

**1. Input**
- Raw data value
- Unit
- Source file/entry
- Upload timestamp
- Data quality indicator

**2. Transformation**
- Transformation steps applied
- Formula used
- Intermediate calculations
- Expandable to show details

**3. Factor**
- Emission factor value
- Factor source (DEFRA, IPCC, etc.)
- Factor version
- Factor date
- Link to factor metadata

**4. Output**
- Final emissions value (tCO₂e)
- Calculation timestamp
- Version number

**5. Reviewer**
- Reviewer name
- Review date
- Review status (Pending/Approved/Rejected)
- Review comments (expandable)

**Row Expansion:**
- Click "Expand" to show detailed view
- Shows:
  - Full raw data source
  - Step-by-step transformation
  - Factor metadata (full)
  - Calculation formula
  - Approval workflow history

**Interactions:**
- Sort by any column
- Filter by status, date range, reviewer
- Export lineage data
- Print-friendly view

**Accessibility:**
- ARIA table with detailed labels
- Screen reader describes data flow
- Keyboard navigation

---

### Audit Trail Timeline

**Purpose**: Chronological view of all changes

**Layout**: Vertical timeline

**Timeline Entry:**
- Date and time
- User name (with avatar if available)
- Action description
- Affected resource
- Change details (expandable)
- Before/after values (if applicable)

**Filtering:**
- By user
- By action type (Create, Update, Delete, Approve, Reject)
- By date range
- By resource type

**Export:**
- Export audit trail as CSV/PDF
- Include all filters applied

---

## 6️⃣ Reports (Export-First Design)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Reports                                  [Create Report] │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Report Templates                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Prebuilt Reports                                         │ │
│ │                                                           │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │ │
│ │ │ Annual GHG   │ │ Supplier     │ │ Compliance   │     │ │
│ │ │ Inventory    │ │ Disclosure   │ │ Export       │     │ │
│ │ │              │ │              │ │              │     │ │
│ │ │ [Generate]   │ │ [Generate]   │ │ [Generate]   │     │ │
│ │ │ [Preview]   │ │ [Preview]   │ │ [Preview]   │     │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Generated Reports                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Recent Reports                                           │ │
│ │                                                           │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Annual GHG Inventory 2024          [PDF] [CSV] [JSON]│ │ │
│ │ │ Generated: 2024-01-15 | Status: Approved             │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                           │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Supplier Disclosure Q1 2024        [PDF] [CSV] [JSON]│ │ │
│ │ │ Generated: 2024-01-10 | Status: Draft                │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Custom Report Builder (Advanced)                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Create Custom Report                                    │ │
│ │                                                           │ │
│ │ Report Name: [________________]                         │ │
│ │                                                           │ │
│ │ Include:                                                 │ │
│ │ ☑ Scope 1                                               │ │
│ │ ☑ Scope 2                                               │ │
│ │ ☑ Scope 3                                               │ │
│ │                                                           │ │
│ │ Format: ○ PDF  ○ CSV  ○ JSON  ○ Excel                   │ │
│ │                                                           │ │
│ │ [Generate Report]                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Report Template Cards

**Design:**
- Card layout (3-column grid, responsive)
- Report icon/thumbnail
- Report name
- Description (brief)
- Action buttons: Generate, Preview

**Prebuilt Reports:**

**1. Annual GHG Inventory**
- Purpose: Complete emissions inventory for reporting year
- Includes: All scopes, categories, methodology, assumptions
- Format: PDF (formatted), CSV (data), JSON (structured)
- Use case: Regulatory reporting, public disclosure

**2. Supplier Disclosure**
- Purpose: Scope 3 supplier emissions data
- Includes: Supplier list, emissions by supplier, category breakdown
- Format: PDF, CSV, JSON
- Use case: Supply chain transparency, customer requests

**3. Compliance Export**
- Purpose: Export for specific compliance frameworks
- Includes: Framework-specific format (CSRD, SEC, etc.)
- Format: PDF, CSV, JSON, Excel
- Use case: Regulatory compliance submissions

**4. Grant Application Export**
- Purpose: Data for grant/funding applications
- Includes: Emissions data, reduction plans, methodology
- Format: PDF, Excel
- Use case: Grant applications, funding requests

---

### Generated Reports List

**Table/List View:**
- Report name
- Generation date
- Status (Draft, Final, Approved)
- Format badges (PDF, CSV, JSON)
- Actions: Download, Regenerate, Delete

**Interactions:**
- Click report: Preview or download
- Download format selector: Choose format
- Regenerate: Create new version
- Delete: Remove report (with confirmation)

**Export Formats:**

**PDF:**
- Formatted document
- Company branding (if configured)
- Charts and visualizations
- Methodology section
- Audit trail summary

**CSV:**
- Raw data export
- All measurements
- Calculations
- Metadata columns

**JSON:**
- Machine-readable format
- Complete data structure
- API-compatible
- Includes metadata

**Excel:**
- Multi-sheet workbook
- Formatted tables
- Charts (if applicable)
- Summary sheet

---

## 7️⃣ Targets & Actions (MVP-Light)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Targets & Actions                      [Set Target]     │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Current Targets                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Target: Reduce emissions by 25% by 2025                 │ │
│ │ Baseline: 2023 (1,000 tCO₂e)                             │ │
│ │ Target: 2025 (750 tCO₂e)                                 │ │
│ │                                                           │ │
│ │ Progress: ████████░░░░░░░░░░ 45%                         │ │
│ │ Current: 550 tCO₂e                                       │ │
│ │ On Track: ✅ Yes (ahead of schedule)                     │ │
│ │                                                           │ │
│ │ [Edit Target] [View Details]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Progress Chart                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Line chart showing: Baseline, Target, Actual, Projected]│ │
│ │                                                           │ │
│ │ X-axis: Time (years)                                     │ │
│ │ Y-axis: Emissions (tCO₂e)                                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Actions (Future - Placeholder)                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Action Plans                                             │ │
│ │                                                           │ │
│ │ [This section will be expanded in future versions]       │ │
│ │                                                           │ │
│ │ Planned features:                                         │ │
│ │ • Action plan creation                                    │ │
│ │ • Reduction initiatives tracking                         │ │
│ │ • ROI calculations                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Target Card Specification

**Content:**
- Target description
- Baseline year and value
- Target year and value
- Reduction percentage or absolute value
- Progress bar/indicator
- Current status (On Track/At Risk/Behind)
- Current emissions value

**Interactions:**
- Edit: Modify target (if admin)
- View Details: See detailed breakdown
- Delete: Remove target (if admin, with confirmation)

**Data Requirements:**
- Target ID
- Target type (% reduction or absolute)
- Baseline year
- Baseline value
- Target year
- Target value
- Current progress
- Status calculation

---

## 8️⃣ Settings (IT-Provisioned)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Settings                                                │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Settings Navigation (Left Sidebar or Tabs)                  │
│ ┌──────────┐ ┌──────────────────────────────────────────┐  │
│ │ • Org    │ │ Organization Profile                     │  │
│ │   Profile│ │                                          │  │
│ │ • Report │ │ Company Name: [Acme Corp________]        │  │
│ │   Bound  │ │                                          │  │
│ │ • Factors│ │ Industry: [Manufacturing________]         │  │
│ │ • Import │ │ Country: [United States________]         │  │
│ │ • Roles  │ │                                          │  │
│ │          │ │ [Save Changes]                           │  │
│ └──────────┘ └──────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Settings Sections

#### 1. Organization Profile
**Content:**
- Company name
- Industry sector
- Country/Region
- Organization logo
- Contact information
- Reporting standards (GHG Protocol, ISO 14064, etc.)

**Editable**: Admin only
**Validation**: Required fields marked

---

#### 2. Reporting Boundaries
**Content:**
- Organizational boundary (equity share, operational control)
- Reporting period settings
- Scope inclusion/exclusion rules
- Geographic boundaries
- Facility inclusion rules

**Editable**: Admin only
**Impact**: Affects calculations and reports

---

#### 3. Emission Factors
**Content:**
- Default factor sources (DEFRA, IPCC, EPA, custom)
- Factor version preferences
- Custom factor library
- Factor update settings (auto-update vs manual)

**Editable**: Admin only
**Versioning**: Track factor changes

---

#### 4. Data Import Methods
**Content:**
- CSV import templates
- API configuration (if applicable)
- Data validation rules
- Auto-import schedules (if applicable)

**Editable**: Admin only

---

#### 5. Roles & Permissions (Placeholder)
**Content:**
- Role list (Org Admin, Sustainability Admin, Data Contributor, Auditor)
- Permission matrix (read-only view)
- Note: "Full role management coming in future version"
- SAML/OIDC integration settings (if applicable)

**Editable**: System admin only (future)
**Current State**: Roles assigned during user creation/invitation

---

## 🧩 Roles & Permissions (Placeholder Design)

### Role Definitions

**Org Admin:**
- Full access to all features
- Can manage organization settings
- Can manage users and roles
- Can approve/reject measurements
- Can export all data

**Sustainability Admin:**
- Can create/edit measurements
- Can generate reports
- Can view audit trail
- Cannot modify organization settings
- Cannot manage users

**Data Contributor:**
- Can create/edit own measurements
- Can view own measurements
- Can view reports (read-only)
- Cannot approve measurements
- Cannot access settings

**Auditor / Read-Only:**
- Can view all data (read-only)
- Can view audit trail
- Can export data
- Cannot create/edit measurements
- Cannot approve/reject

### Permission Matrix (Future)

**Design for future implementation:**
- Table showing roles vs permissions
- Checkboxes for each permission
- Visual indicator of current user's permissions
- Note: "Full implementation planned for v2"

---

## Responsive Design Considerations

### Breakpoints

**Desktop**: 1280px+ (full layout)
**Tablet**: 768px - 1279px (collapsible sidebar, stacked cards)
**Mobile**: < 768px (hamburger menu, single column, bottom navigation)

### Mobile Adaptations

**Top Bar:**
- Organization selector: Icon only, dropdown on tap
- Year selector: Icon only
- Status indicator: Icon only, tooltip on tap
- User menu: Avatar only

**Left Navigation:**
- Hidden by default
- Hamburger menu to toggle
- Overlay on mobile
- Bottom navigation bar (alternative)

**Tables:**
- Horizontal scroll
- Card view alternative
- Stacked layout for detail views

**Charts:**
- Full width
- Simplified legends
- Touch-friendly interactions

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text: 4.5:1 minimum
- UI components: 3:1 minimum
- Status indicators: Color + icon + text

**Keyboard Navigation:**
- All interactive elements keyboard accessible
- Tab order logical
- Skip links for main content
- Focus indicators visible

**Screen Readers:**
- ARIA labels on all interactive elements
- Landmark regions (nav, main, aside)
- Live regions for dynamic content
- Descriptive link text

**Alternative Text:**
- Images have alt text
- Charts have data tables
- Icons have text labels or ARIA labels

---

## Design System Integration

### EcoKit Components

**Use existing EcoKit components:**
- Buttons (primary, secondary, ghost)
- Cards
- Tables
- Forms (inputs, selects, checkboxes)
- Badges/Pills
- Icons
- Typography scale
- Color palette

**Custom Components:**
- Measurement matrix table
- Lineage visualization
- Audit trail timeline
- Scope breakdown charts

---

## Implementation Phases

### Phase 1: Core Frame + Overview
- Global frame (top bar + navigation)
- Overview dashboard (tiles + charts)
- Basic routing

### Phase 2: Measurements
- Measurement matrix table
- Measurement detail drawer
- Add/edit measurement forms

### Phase 3: Scopes & Reports
- Scopes view
- Reports generation
- Export functionality

### Phase 4: Audit & Advanced
- Data lineage table
- Audit trail
- Settings pages

### Phase 5: Targets & Polish
- Targets & Actions
- Responsive optimizations
- Accessibility improvements

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Create detailed mockups** for each section
3. **Build component library** (reuse EcoKit where possible)
4. **Implement Phase 1** (Global frame + Overview)
5. **Iterate based on feedback**

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-XX  
**Status**: Planning Phase
