import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="eco-landing">
      <header className="eco-landing__header">
        <div className="eco-landing__brand">
          <Image
            src="/logo.png"
            alt="OpenEco leaf logo"
            width={26}
            height={26}
            className="eco-landing__brand-logo"
          />
          <Image
            src="/wordmark.png"
            alt="OpenEco"
            width={120}
            height={26}
            className="eco-landing__brand-wordmark"
          />
        </div>
        <nav className="eco-landing__nav">
          <span className="eco-landing__nav-link" style={{ opacity: 0.6, cursor: 'default' }}>
            Demo (Coming Soon!)
          </span>
          <Link href="/docs" className="eco-landing__nav-link">
            Docs
          </Link>
          <a
            href="https://github.com/Open-Eco/oe-core"
            className="eco-landing__nav-link"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main className="eco-landing__main">
        <section className="eco-landing__hero">
          <div className="eco-landing__hero-text">
            <h1 className="eco-landing__title">
              Climate transparency should not be paywalled.
            </h1>
            <p className="eco-landing__subtitle">
              OpenEco is a FREE, completely open-source platform for organizations to measure,
              publish, and analyze climate impact data, self-hosted on their own
              infrastructure. The future of our planet is priceless.
            </p>
            <div className="eco-landing__actions">
              <button
                className="eco-button eco-button--primary"
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              >
                Try the demo (Coming Soon!)
              </button>
              <a
                href="https://open-eco.org/docs/INSTALLATION.html"
                className="eco-button eco-button--ghost"
              >
                Get started (self-hosted)
              </a>
            </div>
            <p className="eco-landing__footnote">
              GNU Affero General Public License v3.0, OCI containers, Podman/Buildah and OKD friendly.
            </p>
          </div>

          <div className="eco-landing__hero-panel">
            <div className="eco-card eco-landing__hero-card">
              <h2 className="eco-card__title">Designed for enterprises</h2>
              <ul className="eco-landing__list">
                <li>Self-hosted on your own Kubernetes/OKD clusters</li>
                <li>One isolated PostgreSQL database per company</li>
                <li>Transparent company and supplier emissions data</li>
                <li>Searchable metrics and reporting</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="eco-landing__section">
          <h2 className="eco-landing__section-title">What you get</h2>
          <div className="eco-landing__grid">
            <article className="eco-card">
              <h3 className="eco-card__title">Measurement</h3>
              <p className="eco-card__meta">
                Capture activity data, emissions factors, and calculated
                emissions across scopes and locations.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Publication</h3>
              <p className="eco-card__meta">
                Publish climate impact data to internal stakeholders or the
                public using a consistent, comparable data model.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Analysis</h3>
              <p className="eco-card__meta">
                Build dashboards and reports to understand trends, hotspots, and
                opportunities to reduce emissions.
              </p>
            </article>
            <article className="eco-card">
              <h3 className="eco-card__title">Self-hosted by design</h3>
              <p className="eco-card__meta">
                Install on your own infra with OCI containers, Helm charts, and
                a clear installation guide for SRE/infra teams.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
