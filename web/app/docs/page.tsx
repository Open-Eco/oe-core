import Link from "next/link";

const sections = [
  { id: "getting-started", label: "Getting Started" },
  { id: "features", label: "Features" },
  { id: "compliance", label: "Compliance & Audit" },
  { id: "upcoming", label: "Upcoming Features" },
  { id: "integrations", label: "Integrations" },
  { id: "roles", label: "Roles & Dashboards" },
  { id: "resources", label: "Resources" },
];

export default function DocsPage() {
  return (
    <div className="eco-docs">
      <aside className="eco-docs__sidebar">
        <div className="eco-docs__sidebar-header">
          <h1 className="eco-docs__title">OpenEco Docs</h1>
          <p className="eco-docs__subtitle">
            Self-hosted climate transparency for enterprises.
          </p>
        </div>
        <nav className="eco-docs__nav">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="eco-docs__nav-link"
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="eco-docs__nav-footer">
          <Link
            href="https://github.com/Open-Eco/oe-core"
            className="eco-docs__nav-link eco-docs__nav-link--muted"
          >
            GitHub repository
          </Link>
          <Link
            href="/auth/signup"
            className="eco-button eco-button--primary eco-docs__cta"
          >
            Install OpenEco
          </Link>
        </div>
      </aside>

      <main className="eco-docs__content">
        <section id="getting-started" className="eco-docs__section">
          <h2>Getting Started</h2>
          <div className="eco-docs__grid">
            <article className="eco-card">
              <h3 className="eco-card__title">1. Choose your deployment</h3>
              <p className="eco-card__meta">
                Decide between a single-host container runtime (Podman/Docker +
                Compose) or a Kubernetes/OKD cluster for production.
              </p>
              <p className="eco-card__meta">
                See <code>INSTALLATION.md</code> for step-by-step instructions.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">2. Configure PostgreSQL</h3>
              <p className="eco-card__meta">
                Each enterprise deployment uses its own PostgreSQL database via{" "}
                <code>DATABASE_URL</code>. Point the app at your managed
                database or containerized Postgres.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">3. Seed an organization</h3>
              <p className="eco-card__meta">
                Create your first user and organization, then configure
                facilities and suppliers to begin capturing activity data.
              </p>
            </article>
          </div>
        </section>

        <section id="features" className="eco-docs__section">
          <h2>Features</h2>
          <div className="eco-docs__grid">
            <article className="eco-card">
              <h3 className="eco-card__title">Activity Data</h3>
              <p className="eco-card__meta">
                Capture raw activity for waste, water, fuel, electricity,
                installations, marketing initiatives, and supply-chain
                emissions. Each record is time-bounded and facility-aware.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Emissions Calculation</h3>
              <p className="eco-card__meta">
                Link activity data to emission factors and record immutable
                emission results, tagged by scope, category, and methodology.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Reports</h3>
              <p className="eco-card__meta">
                Generate reports (annual summaries, ESG, CSRD, TCFD) and
                associate them with the underlying activity and emission
                records for traceability.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Searchable Metrics</h3>
              <p className="eco-card__meta">
                A search index lets you query and filter metrics across time,
                facilities, suppliers, and categories.
              </p>
            </article>
          </div>
        </section>

        <section id="compliance" className="eco-docs__section">
          <h2>Compliance & Audit</h2>
          <div className="eco-docs__stack">
            <article className="eco-card">
              <h3 className="eco-card__title">Audit-ready data model</h3>
              <p className="eco-card__meta">
                The schema is designed so every emission result can be traced
                back to raw activity, emission factors, and the report that
                used it.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Append-only logs</h3>
              <p className="eco-card__meta">
                Audit logs record who did what and when, including resource
                changes, IP, and user agent, to support internal and external
                reviews.
              </p>
            </article>
          </div>
        </section>

        <section id="upcoming" className="eco-docs__section">
          <h2>Upcoming Features</h2>
          <ul className="eco-docs__list">
            <li>Interactive activity input UI with dropdowns and calendars.</li>
            <li>Role-based dashboards for admins, members, and suppliers.</li>
            <li>Report linking for explicit activity/emission ↔ report joins.</li>
            <li>Supply-chain specific workflows and invitations for vendors.</li>
          </ul>
        </section>

        <section id="integrations" className="eco-docs__section">
          <h2>Integrations</h2>
          <div className="eco-docs__grid">
            <article className="eco-card">
              <h3 className="eco-card__title">Data sources</h3>
              <p className="eco-card__meta">
                CSV uploads, manual entry, APIs, and future AI-assisted input
                flows will all land in the same `RawActivityData` table.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Infrastructure</h3>
              <p className="eco-card__meta">
                OCI images compatible with Podman, Docker, containerd, and
                deployable on OKD/OpenShift or any Kubernetes cluster.
              </p>
            </article>
          </div>
        </section>

        <section id="roles" className="eco-docs__section">
          <h2>Roles & Dashboards</h2>
          <div className="eco-docs__stack">
            <article className="eco-card">
              <h3 className="eco-card__title">Organization roles</h3>
              <p className="eco-card__meta">
                Use <code>OrganizationUser.role</code> to define admins,
                members, suppliers, and read-only users, each with tailored
                dashboards.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Trickle-up reporting</h3>
              <p className="eco-card__meta">
                Activity and emissions can be scoped to facilities or suppliers,
                but reports and dashboards aggregate naturally at the
                organization level.
              </p>
            </article>
          </div>
        </section>

        <section id="resources" className="eco-docs__section">
          <h2>Resources</h2>
          <div className="eco-docs__grid">
            <article className="eco-card">
              <h3 className="eco-card__title">Architecture</h3>
              <p className="eco-card__meta">
                See <code>ARCHITECTURE.md</code> for monorepo layout, public
                sites, and deployment topology.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Installation</h3>
              <p className="eco-card__meta">
                See <code>INSTALLATION.md</code> for enterprise setup and{" "}
                <code>ENV_SETUP.md</code> for environment variables.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Next steps</h3>
              <p className="eco-card__meta">
                See <code>NEXT_STEPS.md</code> for the implementation roadmap
                around containerization, demo pages, and UI components.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}


