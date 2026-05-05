# Data Visualization Guidelines

## Overview

The Open Climate Transparency Platform is data-dense by nature. Charts, graphs, and visual indicators must communicate emissions data accurately, accessibly, and without distorting the underlying science.

---

## Principles

1. **Accuracy over aesthetics.** Never modify scales, truncate axes, or select chart types that distort data.
2. **Context is mandatory.** Every chart needs a title, unit labels, and a time period.
3. **Accessibility first.** Charts must be readable without relying on color alone.
4. **Minimize cognitive load.** Show only what the user needs to act. Avoid chartjunk.
5. **Be honest about uncertainty.** Show error bars, confidence intervals, or data quality indicators where the underlying data is estimated.

---

## Chart Type Selection

### When to Use What

| Data type | Recommended chart | Avoid |
|-----------|-------------------|-------|
| Emissions over time | Line chart, area chart | Pie chart |
| Emissions by source/scope | Stacked bar, grouped bar | 3D charts |
| Progress to target | Progress bar, bullet chart | Donut with complex legend |
| Benchmark comparison | Grouped bar, lollipop chart | Radar chart |
| Geographic distribution | Choropleth map | Bubble map (without context) |
| Single KPI | Big number + sparkline | Gauge chart |
| Part-to-whole (≤ 5 categories) | Donut chart | Pie chart (always prefer donut) |
| Distribution | Histogram, box plot | Bar chart |
| Correlation | Scatter plot | Line chart |

### Climate-Specific Chart Types

#### Emissions Trajectory Chart
Shows historical emissions alongside a target reduction pathway (e.g., 1.5°C aligned pathway).

- **X-axis**: Year
- **Y-axis**: tCO₂e
- **Elements**: Historical line (solid), target pathway (dashed), current year marker, net-zero target point

#### Scope Breakdown Chart
Shows Scope 1, 2, and 3 as a stacked bar or treemap.

- Always label each scope
- Include percentage of total
- Include absolute value (tCO₂e)

#### Year-over-Year Comparison
Shows change in emissions between reporting periods.

- Use color only to signal direction: green = decrease, amber = flat, red = increase
- Include absolute change AND percentage change
- Label each bar with the value

---

## Color Encoding

### Semantic Colors for Emissions Data

| State | Color | Token | Meaning |
|-------|-------|-------|---------|
| Decreasing (good) | Green | `--brand-green-600` | Emissions are reducing |
| Increasing (concern) | Amber/Red | `--semantic-warning` / `--semantic-error` | Emissions are rising |
| Neutral / baseline | Blue | `--brand-blue-600` | Current or reference data |
| Target / pathway | Teal dashed | `--brand-blue-400` | Reduction target line |
| Estimated data | Gray | `--neutral-500` | Lower confidence data |

### Multi-Series Color Palette
When showing multiple categories (e.g., emission sources), use:

1. `--brand-blue-600`
2. `--brand-green-600`
3. `--data-teal` (#2A9D8F)
4. `--data-amber` (#E9C46A)
5. `--data-orange` (#F4A261)
6. `--data-coral` (#E76F51)
7. `--neutral-500`

Never use more than 7 distinct categories in a single chart. Aggregate remaining categories as "Other."

### Colorblind-Safe Usage
- Test all charts with Deuteranopia and Protanopia simulators
- Never rely on red/green distinction alone — always add icons, patterns, or labels
- Use pattern fills as a secondary encoding for printed or monochrome contexts

---

## Axis & Labeling Standards

### Axes
- Always start bar chart Y-axes at zero
- Line charts may use a non-zero origin only when explicitly justified and labeled
- Label units on the axis (e.g., "Emissions (tCO₂e)")
- Use clean, rounded tick marks (1,000 not 1,247 as a tick)

### Titles
Every chart must have a title that describes what it shows:
- ✅ "Scope 1 Emissions by Quarter (2024)"
- ❌ "Chart 3" or "Emissions"

### Data Labels
- Show direct labels on chart elements where space allows (beats legends)
- Format numbers consistently: use thousands separators, consistent decimal places
- For tCO₂e values: show 1 decimal place under 1,000; round to nearest integer above 1,000

### Legends
- Place legends above or below the chart, not inside the plot area
- Use the same color swatches as the chart series
- Always pair color with a text label

---

## Accessibility

### Non-Color Encoding
In addition to color, encode data using:
- Shape (circle vs. square markers on line charts)
- Pattern (stripe, dots for print contexts)
- Direct labels (eliminating the need to match color to legend)

### Screen Reader Support
Every chart must have:
1. A visible title
2. An `aria-label` on the chart container describing what it shows
3. A `<caption>` or hidden accessible description with the key data point
4. A data table alternative accessible to keyboard/screen reader users

```html
<figure aria-label="Scope 1 emissions by quarter, 2024. Emissions decreased from 120 tCO₂e in Q1 to 98 tCO₂e in Q4.">
  <!-- chart canvas -->
  <figcaption class="sr-only">
    Data table: Q1: 120 tCO₂e, Q2: 115 tCO₂e, Q3: 104 tCO₂e, Q4: 98 tCO₂e
  </figcaption>
</figure>
```

### Keyboard Interaction
Charts built with Chart.js must support:
- Tab to focus the chart
- Arrow keys to move between data points
- Enter/Space to reveal tooltip data
- Announced data point values via `aria-live`

---

## Data Quality Indicators

Always surface data quality information alongside charts:

| Indicator | Display | Meaning |
|-----------|---------|---------|
| ✅ Verified | Green badge | Data verified by auditor |
| 📋 Reported | Blue badge | Self-reported, not yet verified |
| ⚠️ Estimated | Amber badge | Calculated from secondary factors |
| ❓ Incomplete | Gray badge | Missing data for period |

Use striped or faded fills on chart sections representing estimated or incomplete data.

---

## Interactivity

### Tooltips
Tooltips should show on hover/focus and include:
- Series name
- Exact value with unit (tCO₂e)
- Period (date, quarter, year)
- Data quality status (if applicable)

### Drill-down
Support click-to-drill for:
- Total → Scope 1/2/3 breakdown
- Annual → Quarterly → Monthly
- Organization → Business unit → Emission source

Always provide a clear "back" navigation when drilling down.

### Export
Every chart must offer:
- Download as PNG (for presentations)
- Download underlying data as CSV
- Share link with current filter state

---

## Responsive Behavior

| Viewport | Behavior |
|----------|----------|
| Desktop (> 1024px) | Full chart with labels, legend, interactivity |
| Tablet (768–1024px) | Condensed labels, legend below chart |
| Mobile (< 768px) | Simplified chart, key metric as big number + sparkline, link to full view |

Never hide important data on mobile — simplify the presentation instead.

---

## Best Practices

### ✅ Do
- Label axes with units
- Start bar chart axes at zero
- Use direct labels instead of legends where possible
- Surface data quality alongside data
- Test with colorblind simulators
- Provide a data table alternative

### ❌ Don't
- Use 3D charts (they distort perception)
- Use pie charts with more than 5 segments
- Truncate axes without a clear label
- Use color as the only means of encoding information
- Show precision that doesn't exist in the underlying data
- Use animations that can't be disabled (respect `prefers-reduced-motion`)
