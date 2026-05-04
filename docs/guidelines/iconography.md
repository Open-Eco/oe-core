# Iconography Guidelines

## Icon System

EcoKit uses a consistent icon vocabulary built on [Phosphor Icons](https://phosphoricons.com/) as the primary icon library, supplemented by a set of custom climate-specific icons.

### Why Phosphor Icons
- Open source (MIT license)
- Consistent stroke weight across all icons
- Multiple weights (thin, light, regular, bold, fill, duotone)
- Large, actively maintained set
- Works well at all EcoKit sizes

---

## Icon Sizes

| Size token | Pixel value | Use case |
|------------|-------------|----------|
| `icon-xs` | 12px | Inline text decorations, tight UI |
| `icon-sm` | 16px | Buttons, form fields, table rows |
| `icon-md` | 20px | Default — navigation, list items |
| `icon-lg` | 24px | Cards, section headers |
| `icon-xl` | 32px | Feature highlights, empty states |
| `icon-2xl` | 48px | Hero sections, onboarding illustrations |

---

## Icon Weights

Use icon weight to match visual context:

| Weight | Use case |
|--------|----------|
| **Regular** | Default for all UI icons |
| **Bold** | High-emphasis icons, primary actions |
| **Fill** | Active/selected states (e.g., active nav item) |
| **Duotone** | Illustrations, feature cards, empty states |

---

## Climate Icon Vocabulary

The following icons have specific meanings within the platform. Use them consistently.

### Emissions & Data

| Icon | Phosphor name | Meaning |
|------|---------------|---------|
| 🏭 | `factory` | Scope 1 — direct emissions |
| ⚡ | `lightning` | Scope 2 — energy / electricity |
| 🔗 | `link-chain` | Scope 3 — value chain emissions |
| 📊 | `chart-bar` | Emissions data / reporting |
| 🌡️ | `thermometer` | Temperature / climate target |
| ☁️ | `cloud` | Carbon / atmosphere |
| 🌿 | `leaf` | Sustainability / green metric |
| 🔄 | `arrows-clockwise` | Carbon cycle / offsets |

### Actions & Status

| Icon | Phosphor name | Meaning |
|------|---------------|---------|
| ✅ | `check-circle` | Verified / complete |
| ⚠️ | `warning` | Data quality issue / warning |
| ❌ | `x-circle` | Error / failed verification |
| 🔒 | `lock-simple` | Locked / audit-frozen data |
| 📋 | `clipboard-text` | Report / submission |
| 📤 | `upload-simple` | Import data |
| 📥 | `download-simple` | Export / download report |
| 🕐 | `clock` | Pending / in review |

### Navigation & Structure

| Icon | Phosphor name | Meaning |
|------|---------------|---------|
| 🏠 | `house` | Home / dashboard |
| 👤 | `user` | Profile / account |
| 🏢 | `buildings` | Organization |
| ⚙️ | `gear` | Settings |
| 🔔 | `bell` | Notifications |
| 🔍 | `magnifying-glass` | Search |
| ➕ | `plus` | Add / create |
| ✏️ | `pencil-simple` | Edit |

---

## Usage Rules

### ✅ Do
- Use icons to reinforce meaning, not replace text in critical UI
- Pair icons with labels in navigation and buttons
- Use consistent icon weight within a single component
- Maintain icon color as a single flat color (no gradients on icons)
- Use the `aria-label` attribute on icon-only buttons

### ❌ Don't
- Use icons as the only means of conveying meaning (accessibility)
- Mix icon libraries on the same page
- Resize icons outside the defined scale
- Rotate icons to create new meanings (use the correct icon instead)
- Apply multiple colors to a single icon (except duotone)

---

## Accessibility

### Icon-Only Buttons
Always provide an accessible label:

```html
<button aria-label="Export report as PDF">
  <i class="ph-download-simple" aria-hidden="true"></i>
</button>
```

### Decorative Icons
Icons that are purely decorative must be hidden from screen readers:

```html
<i class="ph-leaf" aria-hidden="true"></i>
<span>Sustainability score</span>
```

### Informational Icons
Icons that convey meaning must have a text equivalent:

```html
<i class="ph-warning" aria-label="Data quality warning"></i>
```

---

## Color Usage for Icons

| Context | Icon color |
|---------|-----------|
| Default UI | `--neutral-700` |
| Primary action | `--brand-blue-600` |
| Success / positive | `--brand-green-600` |
| Warning | `--semantic-warning` |
| Error | `--semantic-error` |
| Disabled | `--neutral-300` |
| On dark background | `--neutral-100` |

---

## Custom Climate Icons

When a climate-specific concept isn't covered by Phosphor Icons, create or commission custom icons that match:
- Same stroke width as Phosphor Regular weight (1.5px at 24px)
- Same corner radius treatment
- Pixel-perfect at 16px, 20px, and 24px
- Exported as SVG with a 24×24 viewBox

Submit new custom icons as PRs to `docs/assets/icons/custom/`.
