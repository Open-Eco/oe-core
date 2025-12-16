# Spacing Guidelines

## Spacing Scale

Our spacing system uses a consistent 4px base unit:

| Token | Value | Pixels | Use Case |
|-------|-------|--------|----------|
| space-1 | 0.25rem | 4px | Tight spacing, icons |
| space-2 | 0.5rem | 8px | Small gaps, compact UI |
| space-3 | 0.75rem | 12px | Default padding, buttons |
| space-4 | 1rem | 16px | Standard padding, gaps |
| space-6 | 1.5rem | 24px | Section spacing |
| space-8 | 2rem | 32px | Large gaps, sections |
| space-12 | 3rem | 48px | Major sections |
| space-16 | 4rem | 64px | Page sections |
| space-20 | 5rem | 80px | Hero sections |
| space-24 | 6rem | 96px | Large hero sections |

## Usage Patterns

### Component Internal Spacing
```css
/* Button padding */
padding: var(--space-3) var(--space-4);

/* Card padding */
padding: var(--space-6);
```

### Layout Spacing
```css
/* Section spacing */
margin-bottom: var(--space-8);

/* Grid gaps */
gap: var(--space-4);
```

### Vertical Rhythm
Maintain consistent vertical spacing between related elements:
- Related items: `space-2` to `space-4`
- Sections: `space-6` to `space-8`
- Major breaks: `space-12` to `space-16`

## Best Practices

### ✅ Do
- Use spacing tokens, not arbitrary values
- Maintain consistent spacing within components
- Use larger spacing for visual separation
- Align spacing with 4px grid

### ❌ Don't
- Mix spacing units (px, rem, em)
- Use arbitrary spacing values
- Create inconsistent gaps
- Ignore vertical rhythm

