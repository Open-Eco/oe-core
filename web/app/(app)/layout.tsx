import "../globals.css";
import Link from "next/link";
import { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="eco-app-shell">
      <aside className="eco-app-shell__sidebar">
        <div className="eco-app-shell__brand">
          <span className="eco-app-shell__logo-circle" />
          <div className="eco-app-shell__brand-text">
            <span className="eco-app-shell__brand-title">OpenEco</span>
            <span className="eco-app-shell__brand-subtitle">
              Climate Transparency
            </span>
          </div>
        </div>
        <nav className="eco-app-shell__nav">
          <Link href="/demo/dashboard" className="eco-app-shell__nav-link">
            Dashboard
          </Link>
          <Link href="/demo/activity" className="eco-app-shell__nav-link">
            Activity Entry
          </Link>
          <Link href="/periods" className="eco-app-shell__nav-link">
            Reporting Periods
          </Link>
          <Link href="/demo/organizations/new" className="eco-app-shell__nav-link">
            Create Organization
          </Link>
          <Link href="/docs" className="eco-app-shell__nav-link">
            Docs
          </Link>
        </nav>
      </aside>

      <div className="eco-app-shell__main">
        <header className="eco-app-shell__header">
          <div className="eco-app-shell__header-left">
            <h1 className="eco-app-shell__header-title">
              Open Climate Transparency Platform
            </h1>
            <p className="eco-app-shell__header-subtitle">
              Measure, publish, and analyze climate impact across your
              organization.
            </p>
          </div>
          <div className="eco-app-shell__header-right">
            {/* Sign in options temporarily hidden */}
          </div>
        </header>

        <main className="eco-app-shell__content">{children}</main>
      </div>
    </div>
  );
}


