"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchOrganizations();
    }
  }, [session]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations || []);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="eco-app-shell__loading">
        <span>Loading dashboard…</span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <section className="eco-page">
      <header className="eco-page__header">
        <div>
          <h2 className="eco-page__title">Dashboard</h2>
          <p className="eco-page__subtitle">
            Welcome back, {session.user?.name || session.user?.email}
          </p>
        </div>
        <a href="/auth/signout" className="eco-button eco-button--ghost">
          Sign Out
        </a>
      </header>

      <div className="eco-page__section">
        <div className="eco-page__section-header">
          <h3 className="eco-page__section-title">Your Organizations</h3>
          {/* Placeholder for filters/actions */}
        </div>

        {organizations.length === 0 ? (
          <div className="eco-empty-state">
            <p className="eco-empty-state__text">No organizations yet.</p>
            <button
              onClick={() => router.push("/organizations/new")}
              className="eco-button eco-button--primary"
            >
              Create Organization
            </button>
          </div>
        ) : (
          <div className="eco-grid eco-grid--gap-lg">
            {organizations.map((org) => (
              <article
                key={org.id}
                className="eco-card eco-card--interactive"
                onClick={() => router.push(`/organizations/${org.id}`)}
              >
                <h4 className="eco-card__title">{org.name}</h4>
                <p className="eco-card__meta">Slug: {org.slug}</p>
                {org.verified && (
                  <span className="eco-badge eco-badge--success">
                    Verified
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


