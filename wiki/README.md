# Wiki Files

This directory contains all the markdown files that should be added to the [GitHub Wiki](https://github.com/Open-Eco/oe-core/wiki).

## Files in this directory

All markdown files in this directory are formatted for the GitHub wiki:
- File names use Title-Case-With-Dashes.md format
- The `Home.md` file serves as the wiki homepage with navigation links
- Each file corresponds to documentation from the repository

## How to sync to GitHub Wiki

### Option 1: Manual Upload (Simple)

1. Go to https://github.com/Open-Eco/oe-core/wiki
2. Click "New Page" or edit existing pages
3. Copy the content from the corresponding file in this directory
4. Save the page

### Option 2: Using Git (Recommended for bulk updates)

GitHub wikis are actually separate git repositories. You can clone and update them:

```bash
# Clone the wiki repository
git clone https://github.com/Open-Eco/oe-core.wiki.git

# Copy files from this directory
cp wiki/*.md oe-core.wiki/

# Commit and push
cd oe-core.wiki
git add -A
git commit -m "Add/update documentation files"
git push origin master
```

### Option 3: Using the sync script

A helper script is provided in `scripts/sync-wiki.sh` to automate the process:

```bash
# From the repository root
./scripts/sync-wiki.sh
```

## File Mapping

The following files from the repository root have been added to the wiki:

| Repository File | Wiki File |
|----------------|-----------|
| ARCHITECTURE.md | Architecture.md |
| AUTHENTICATION.md | Authentication.md |
| COMPETITIVE_ANALYSIS.md | Competitive-Analysis.md |
| CONTRIBUTING.md | Contributing.md |
| DEPLOYMENT_GUIDE.md | Deployment-Guide.md |
| DEPLOY_TLDR.md | Deploy-TLDR.md |
| DOCS_MIGRATION.md | Docs-Migration.md |
| FAQ.md | FAQ.md |
| INSTALLATION.md | Installation.md |
| OPEN_SOURCE_PLAYBOOK.md | Open-Source-Playbook.md |
| PLATFORM_FEATURES.md | Platform-Features.md |
| PODMAN_GUIDE.md | Podman-Guide.md |
| PRD.md | PRD.md |
| QUICK_START.md | Quick-Start.md |
| README.md | Home.md (navigation) |
| ROADMAP.md | Roadmap.md |
| Reporting_enginer.md | Reporting-Engine.md |
| SECURITY_AND_GOVERNANCE.md | Security-And-Governance.md |
| UI_UX_WIREFRAME_PLAN.md | UI-UX-Wireframe-Plan.md |
| VERCEL_DEPLOYMENT.md | Vercel-Deployment.md |

## Maintaining the Wiki

To keep the wiki up-to-date:

1. When updating documentation files in the repository root, also update the corresponding file in this `wiki/` directory
2. Run the sync script or manually update the wiki
3. The `Home.md` file provides navigation - update it if you add new pages
