# EcoKit Integration Guide

## Quick Start

Import the complete EcoKit design system:

```css
@import './assets/EcoKit/ecokit.css';
```

Or import individual modules:

```css
/* Tokens */
@import './assets/EcoKit/tokens/colors.css';
@import './assets/EcoKit/tokens/typography.css';
@import './assets/EcoKit/tokens/spacing.css';
@import './assets/EcoKit/tokens/radius.css';
@import './assets/EcoKit/tokens/elevation.css';
@import './assets/EcoKit/tokens/shadows.css';
@import './assets/EcoKit/tokens/motion.css';
@import './assets/EcoKit/tokens/z-index.css';

/* Components */
@import './assets/EcoKit/components/buttons.css';
@import './assets/EcoKit/components/cards.css';
@import './assets/EcoKit/components/inputs.css';

/* Utilities */
@import './assets/EcoKit/utilities/spacing.css';
@import './assets/EcoKit/utilities/flex.css';
@import './assets/EcoKit/utilities/grid.css';
@import './assets/EcoKit/utilities/typography.css';
```

## Usage Examples

### Buttons
```html
<button class="eco-btn">Primary Button</button>
<button class="eco-btn eco-btn--secondary">Secondary</button>
<button class="eco-btn eco-btn--danger">Delete</button>
<button class="eco-btn eco-btn--outline">Outline</button>
```

### Cards
```html
<div class="eco-card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Inputs
```html
<label class="eco-label">Email</label>
<input type="email" class="eco-input" />
```

### Utilities
```html
<div class="d-flex justify-between align-center gap-4">
  <span>Item 1</span>
  <span>Item 2</span>
</div>
```

## Design Tokens JSON

Access tokens programmatically:

```javascript
import tokens from './assets/EcoKit/tokens.json';

const primaryColor = tokens.colors.brand['blue-600'];
const spacing = tokens.spacing['4'];
```

## File Structure

```
assets/EcoKit/
├── tokens/
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   ├── radius.css
│   ├── elevation.css
│   ├── shadows.css
│   ├── motion.css
│   ├── z-index.css
│   └── tokens.json
├── components/
│   ├── buttons.css
│   ├── cards.css
│   └── inputs.css
├── utilities/
│   ├── spacing.css
│   ├── flex.css
│   ├── grid.css
│   └── typography.css
└── ecokit.css (main import)
```

