# Motion Guidelines

## Duration

| Token | Value | Use Case |
|-------|-------|----------|
| fast | 150ms | Hover states, micro-interactions |
| normal | 250ms | Default transitions, state changes |
| slow | 350ms | Complex animations, page transitions |

## Easing

### Ease Out (Default)
- **Token**: `--easing-ease-out`
- **Use**: Most UI interactions, hover states
- **Why**: Feels natural, responsive

### Ease In
- **Token**: `--easing-ease-in`
- **Use**: Exit animations, dismissals
- **Why**: Quick, decisive feel

### Ease In Out
- **Token**: `--easing-ease-in-out`
- **Use**: Complex animations, transforms
- **Why**: Smooth, balanced motion

### Linear
- **Token**: `--easing-linear`
- **Use**: Loading indicators, progress bars
- **Why**: Consistent, predictable

## Usage Examples

### Button Hover
```css
transition: all var(--duration-normal) var(--easing-ease-out);
```

### Modal Entrance
```css
animation: slideIn var(--duration-slow) var(--easing-ease-out);
```

### Loading Spinner
```css
animation: spin 1s var(--easing-linear) infinite;
```

## Best Practices

### ✅ Do
- Keep animations under 350ms for UI interactions
- Use ease-out for most interactions
- Respect user preferences (prefers-reduced-motion)
- Animate transform and opacity (performance)

### ❌ Don't
- Animate layout properties (width, height, top, left)
- Use motion for critical information
- Create jarring or distracting animations
- Ignore accessibility preferences

## Accessibility

Always respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

