# Color Guidelines

## Brand Colors & Meaning

### Blue (#1A6F8A)
- **Meaning**: Trust, stability, professionalism
- **Use**: Primary actions, links, navigation, data visualization
- **Represents**: Core platform functionality, reliability

### Green (#138A4F)
- **Meaning**: Sustainability, growth, positive impact
- **Use**: Success states, environmental metrics, positive feedback
- **Represents**: Climate action, sustainability achievements

### Brand Gradient
- **Use**: Primary buttons, hero sections, key CTAs
- **Combines**: Both brand colors for maximum impact

## Neutral Scale

Our neutral palette provides structure and hierarchy:

- **900** (#0F1A1C): Primary text, high contrast
- **700** (#415355): Secondary text, medium contrast
- **500** (#7A8C8E): Tertiary text, placeholders
- **300** (#D5DFE1): Borders, dividers
- **100** (#F3F6F7): Backgrounds, cards

## When to Use Green vs Blue

### Use Blue For:
- ✅ Primary actions (buttons, links)
- ✅ Navigation elements
- ✅ Data visualizations
- ✅ Core platform features
- ✅ Trust-building elements

### Use Green For:
- ✅ Success messages
- ✅ Environmental metrics
- ✅ Positive feedback
- ✅ Sustainability achievements
- ✅ Progress indicators

### Use Both (Gradient):
- ✅ Primary CTAs
- ✅ Hero sections
- ✅ Key conversion points

## Do/Don't Examples

### ✅ Do
- Use blue for primary actions
- Use green for success/sustainability metrics
- Maintain sufficient contrast (WCAG AA minimum)
- Use neutrals for text hierarchy

### ❌ Don't
- Use green for primary actions (use blue)
- Use blue for success states (use green)
- Use low contrast text on backgrounds
- Mix brand colors without purpose

## Accessible Contrast Requirements

### WCAG AA (Minimum)
- **Normal text**: 4.5:1 contrast ratio
- **Large text (18pt+)**: 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio

### WCAG AAA (Enhanced)
- **Normal text**: 7:1 contrast ratio
- **Large text (18pt+)**: 4.5:1 contrast ratio

### Examples
- ✅ `--neutral-900` on `--neutral-100`: 12.5:1 (AAA)
- ✅ `--brand-blue-600` on white: 4.8:1 (AA)
- ✅ `--brand-green-600` on white: 4.2:1 (AA)
- ❌ `--neutral-500` on `--neutral-100`: 2.1:1 (Fail)

## Dark Mode Mapping

In dark mode, neutrals are inverted:

```css
/* Light mode */
--neutral-900: #0F1A1C;  /* Dark text */
--neutral-100: #F3F6F7;  /* Light background */

/* Dark mode */
--neutral-900: #F3F6F7;  /* Light text */
--neutral-100: #0F1A1C;  /* Dark background */
```

Brand colors remain consistent in both modes for recognition.

