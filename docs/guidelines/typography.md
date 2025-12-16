# Typography Guidelines

## Font Families

### Sans Serif (Primary)
- **Font**: Inter, system-ui, sans-serif
- **Use**: Body text, UI elements, headings
- **Why**: Excellent readability, modern, professional

### Monospace (Code/Data)
- **Font**: IBM Plex Mono, monospace
- **Use**: Code snippets, data tables, technical content
- **Why**: Clear character distinction, technical feel

## Font Sizes

| Size | Value | Use Case |
|------|-------|----------|
| xs | 0.75rem (12px) | Captions, labels, fine print |
| sm | 0.875rem (14px) | Secondary text, metadata |
| md | 1rem (16px) | Body text, default |
| lg | 1.25rem (20px) | Subheadings, emphasis |
| xl | 1.5rem (24px) | Section headings |
| 2xl | 2rem (32px) | Page titles, hero text |

## Font Weights

- **Regular (400)**: Body text, default
- **Medium (500)**: Buttons, labels, emphasis
- **Bold (600)**: Headings, strong emphasis

## Hierarchy

### Page Title
```css
font-size: var(--text-2xl);
font-weight: var(--font-weight-bold);
```

### Section Heading
```css
font-size: var(--text-xl);
font-weight: var(--font-weight-bold);
```

### Body Text
```css
font-size: var(--text-md);
font-weight: var(--font-weight-regular);
line-height: 1.6;
```

### Caption
```css
font-size: var(--text-sm);
font-weight: var(--font-weight-regular);
color: var(--neutral-500);
```

## Best Practices

### ✅ Do
- Use consistent font sizes from the scale
- Maintain proper line height (1.5-1.6 for body)
- Use weight to create hierarchy, not size alone
- Keep line length between 45-75 characters

### ❌ Don't
- Mix multiple font families unnecessarily
- Use more than 3 font sizes per page
- Use font weight > 600
- Create custom font sizes outside the scale

