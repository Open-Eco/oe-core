# Accessibility Guidelines

## WCAG Compliance

We follow WCAG 2.1 Level AA standards as a minimum.

## Color Contrast

### Text Contrast Requirements

| Text Size | WCAG AA | WCAG AAA |
|-----------|---------|----------|
| Normal (16px) | 4.5:1 | 7:1 |
| Large (18pt+) | 3:1 | 4.5:1 |
| UI Components | 3:1 | - |

### Examples
- ✅ `--neutral-900` on `--neutral-100`: 12.5:1 (AAA)
- ✅ `--brand-blue-600` on white: 4.8:1 (AA)
- ❌ `--neutral-500` on `--neutral-100`: 2.1:1 (Fail)

## Keyboard Navigation

### Focus Indicators
- All interactive elements must be keyboard accessible
- Visible focus indicators required
- Focus order must be logical

### Tab Order
- Follow visual reading order
- Skip decorative elements
- Group related controls

## Screen Readers

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (nav, main, article, section)
- Provide alt text for images
- Use ARIA labels when needed

### Form Labels
- All inputs must have associated labels
- Use `for` attribute or wrap input in label
- Provide error messages with `aria-describedby`

## Motion

### Reduced Motion
Always respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## Best Practices

### ✅ Do
- Test with keyboard navigation
- Test with screen readers
- Maintain proper contrast ratios
- Use semantic HTML
- Provide text alternatives
- Test with color blindness simulators

### ❌ Don't
- Rely on color alone for information
- Create keyboard traps
- Hide focus indicators
- Use images for text
- Ignore screen reader users
- Auto-play media without controls

## Cognitive Accessibility

### Plain Language
- Write at a Flesch-Kincaid Grade 8 or lower for all UI copy
- Avoid jargon without inline explanations (e.g., provide glossary tooltips for "Scope 3", "tCO₂e")
- Break long tasks into clearly labeled steps with progress indicators

### Reducing Cognitive Load
- Limit choices per screen — use progressive disclosure for advanced options
- Group related controls and data into clearly labeled sections
- Surface the most important action first; deprioritize secondary actions visually
- Provide sensible defaults so users rarely need to configure from scratch
- Show confirmation before irreversible actions (delete, revoke, submit final)

### Error Prevention
- Validate inputs inline before form submission
- Use clear placeholder text and helper text on every input
- Prevent the user from entering invalid data formats (date pickers, numeric masks)

### Memory Support
- Persist filter and view preferences across sessions
- Surface "last saved" or "last submitted" timestamps near relevant actions
- Show history or audit logs so users can reconstruct what happened

## Testing Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader announces content correctly
- [ ] Forms have proper labels
- [ ] Images have alt text
- [ ] Motion respects user preferences
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] UI copy meets plain language standard (Grade 8 or lower)
- [ ] Technical terms have inline glossary support
- [ ] Multi-step flows have clear progress indicators
- [ ] Confirmation dialogs shown before irreversible actions
- [ ] Charts and data visualizations have accessible text alternatives
