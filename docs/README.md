# Documentation Site

Static documentation site for design system, architecture guides, and developer documentation.

## Overview

This site is deployed to `docs.open-eco.org` via GitHub Pages.

## Tech Stack Options

Choose one:

- **Jekyll** (GitHub Pages native) - Simplest
- **Docusaurus** (React-based) - Most features
- **Next.js Static Export** - Consistent with web app
- **VitePress** - Fast, Vue-based
- **MkDocs** - Python-based, simple

**Recommendation**: Start with **Jekyll** for simplicity, or **Docusaurus** for a full-featured docs site.

## Getting Started

### Option 1: Jekyll (Recommended for GitHub Pages)

```bash
# Install Jekyll
gem install bundler jekyll

# Initialize (if starting fresh)
jekyll new . --force

# Install dependencies
bundle install

# Run locally
bundle exec jekyll serve
```

### Option 2: Docusaurus

```bash
# Create Docusaurus site
npx create-docusaurus@latest . classic

# Install dependencies
npm install

# Run locally
npm start
```

### Option 3: Next.js Static Export

```bash
# Initialize Next.js
npx create-next-app@latest . --typescript --app

# Configure for static export
# In next.config.js:
# module.exports = { output: 'export' }

# Run locally
npm run dev
```

## Project Structure

```
docs/
├── _config.yml      # Jekyll config (if using Jekyll)
├── _docs/           # Documentation pages
│   ├── design-system/
│   ├── architecture/
│   └── guides/
├── assets/          # Documentation assets
└── index.md         # Homepage
```

## Deployment

### GitHub Pages

1. **Enable GitHub Pages** in repository settings:
   - Settings → Pages
   - Source: `main` branch, `/docs` folder (or root)

2. **Configure Custom Domain**:
   - Add `docs.open-eco.org` in Pages settings
   - Add CNAME file: `echo "docs.open-eco.org" > CNAME`

3. **Update DNS** at domain registrar:
   ```
   CNAME: docs → your-username.github.io
   ```

### GitHub Actions (Recommended)

Create `.github/workflows/docs.yml`:

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: |
          cd docs
          npm install
          npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/build
```

## Design Assets

Reference shared assets from `../EcoKit/`:

```markdown
![Logo](../../EcoKit/logo.png)
```

## Content Structure

### Design System Documentation

- Component library
- Design tokens (colors, typography, spacing)
- Usage guidelines
- Asset library

### Architecture Documentation

- System architecture
- API documentation
- Database schema
- Deployment guides

### Developer Guides

- Setup instructions
- Contributing guidelines
- Development workflow
- Troubleshooting

---

See parent [README.md](../README.md) for monorepo overview.

