# Layout Guidelines

## Grid System

Use CSS Grid for layout structure:

```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
}
```

## Flexbox Utilities

Use flexbox for component-level layouts:

```css
.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
```

## Responsive Breakpoints

| Breakpoint | Value | Use Case |
|------------|-------|----------|
| Mobile | < 768px | Single column, stacked |
| Tablet | 768px - 1024px | 2 columns, adjusted spacing |
| Desktop | > 1024px | Full layout, optimal spacing |

## Container Widths

- **Narrow**: 640px (forms, cards)
- **Standard**: 1024px (content, articles)
- **Wide**: 1280px (dashboards, data tables)
- **Full**: 100% (hero sections, backgrounds)

## Spacing in Layouts

### Section Spacing
- Between major sections: `space-12` to `space-16`
- Between related sections: `space-8`
- Within sections: `space-4` to `space-6`

### Component Spacing
- Internal padding: `space-4` to `space-6`
- External margins: `space-6` to `space-8`

## Best Practices

### ✅ Do
- Use consistent container widths
- Maintain proper spacing between sections
- Design mobile-first
- Use CSS Grid for complex layouts
- Use Flexbox for component alignment

### ❌ Don't
- Mix layout systems unnecessarily
- Create inconsistent spacing
- Ignore responsive design
- Use fixed pixel widths
- Overcomplicate simple layouts

