# Documentation Migration Summary

All documentation has been reorganized into the `docs/` directory structure to match the [open-eco.github.io/oe-core](https://open-eco.github.io/oe-core) site.

## New Structure

```
docs/
├── index.md                    # Main docs landing page
├── getting-started.md          # Getting started overview
├── features.md                 # Features overview
├── compliance.md               # Compliance & audit overview
├── upcoming.md                 # Upcoming features overview
├── integrations.md             # Integrations overview
├── roles.md                    # Roles & dashboards overview
├── resources.md                # Resources overview
│
├── deployment/                 # Getting Started section
│   ├── quick-deploy.md         # (from DEPLOY_TLDR.md)
│   ├── quick-start.md          # (from QUICK_START.md)
│   ├── deployment-guide.md     # (from DEPLOYMENT_GUIDE.md)
│   ├── installation.md         # (from INSTALLATION.md)
│   ├── podman-guide.md         # (from PODMAN_GUIDE.md)
│   └── env-setup.md            # (from web/ENV_SETUP.md)
│
├── features/                   # Features section
│   └── platform-features.md    # (from PLATFORM_FEATURES.md)
│
├── compliance/                 # Compliance & Audit section
│   └── security-governance.md  # (from SECURITY_AND_GOVERNANCE.md)
│
├── upcoming/                   # Upcoming Features section
│   └── roadmap.md              # (from ROADMAP.md)
│
├── integrations/               # Integrations section
│   └── authentication.md       # (from AUTHENTICATION.md)
│
├── roles/                      # Roles & Dashboards section
│   (currently empty - content in roles.md)
│
└── resources/                  # Resources section
    ├── architecture.md         # (from ARCHITECTURE.md)
    ├── ui-ux-wireframe.md     # (from UI_UX_WIREFRAME_PLAN.md)
    ├── competitive-analysis.md # (from COMPETITIVE_ANALYSIS.md)
    ├── open-source-playbook.md # (from OPEN_SOURCE_PLAYBOOK.md)
    ├── faq.md                  # (from FAQ.md)
    ├── prd.md                  # (from PRD.md)
    └── reporting-engine.md     # (from Reporting_enginer.md)
```

## Files Kept in Root

- `README.md` - Updated to point to docs site
- `LICENSE` - License file
- `CONTRIBUTING.md` - Contribution guidelines

## Original Files

All original MD files remain in the repository root for backward compatibility. They can be removed or updated to redirect to the docs site in the future.

## Next Steps

1. **Set up static site generator** (Jekyll, Docusaurus, etc.) to render the docs
2. **Configure GitHub Pages** to serve from `docs/` directory
3. **Update internal links** in all MD files to use relative paths
4. **Add redirects** from old file paths to new docs site URLs (optional)
5. **Test all links** to ensure they work correctly

## Documentation Site URLs

When deployed, documentation will be available at:
- Main docs: `https://open-eco.github.io/oe-core`
- Getting Started: `https://open-eco.github.io/oe-core/getting-started`
- Features: `https://open-eco.github.io/oe-core/features`
- Compliance: `https://open-eco.github.io/oe-core/compliance`
- Upcoming: `https://open-eco.github.io/oe-core/upcoming`
- Integrations: `https://open-eco.github.io/oe-core/integrations`
- Roles: `https://open-eco.github.io/oe-core/roles`
- Resources: `https://open-eco.github.io/oe-core/resources`

## Migration Complete

✅ All documentation files copied to organized structure
✅ Section index pages created
✅ README.md updated with links to docs site
✅ Original files preserved for backward compatibility
