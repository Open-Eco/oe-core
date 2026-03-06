"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [step, setStep] = useState<"organization" | "authentication" | "complete">("organization");
  
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationSlug: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch("/api/setup");
      const data = await response.json();
      if (data.isComplete) {
        setSetupComplete(true);
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to check setup status:", err);
      setLoading(false);
    }
  };

  const handleSlugChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData({ ...formData, organizationSlug: slug });
  };

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, organizationName: value });
    if (!formData.organizationSlug) {
      handleSlugChange(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.adminPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.adminPassword && formData.adminPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: formData.organizationName,
          organizationSlug: formData.organizationSlug,
          adminName: formData.adminName,
          adminEmail: formData.adminEmail,
          adminPassword: formData.adminPassword || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Setup failed");
      }

      // Setup complete - redirect to dashboard or auth config
      if (formData.adminPassword) {
        // Sign in the admin user
        router.push(`/auth/signin?email=${encodeURIComponent(formData.adminEmail)}`);
      } else {
        // OIDC only - redirect to auth config
        router.push("/admin/authentication");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Checking setup status...</p>
      </div>
    );
  }

  if (setupComplete) {
    return null; // Will redirect
  }

  return (
    <div className="eco-page" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <header className="eco-page__header">
        <h1 className="eco-page__title">Welcome to OpenEco</h1>
        <p className="eco-page__subtitle">
          Let&apos;s set up your organization. This will only take a few minutes.
        </p>
      </header>

      <div className="eco-page__section">
        <div className="eco-card">
          <h2 className="eco-card__title">Initial Setup</h2>
          <p className="eco-card__meta" style={{ marginBottom: "1.5rem" }}>
            Create your organization and first administrator account.
          </p>

          <form onSubmit={handleSubmit} className="eco-form">
            <div className="eco-form__group">
              <label className="eco-label" htmlFor="organizationName">
                Organization Name <span className="eco-label__required">*</span>
              </label>
              <input
                id="organizationName"
                type="text"
                className="eco-input"
                value={formData.organizationName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Acme Corporation"
                required
              />
            </div>

            <div className="eco-form__group">
              <label className="eco-label" htmlFor="organizationSlug">
                Organization Slug <span className="eco-label__required">*</span>
              </label>
              <input
                id="organizationSlug"
                type="text"
                className="eco-input"
                value={formData.organizationSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="e.g., acme-corp"
                pattern="[a-z0-9-]+"
                required
              />
              <p className="eco-form__help">
                Used in URLs. Lowercase letters, numbers, and hyphens only.
              </p>
            </div>

            <div className="eco-form__group">
              <label className="eco-label" htmlFor="adminName">
                Administrator Name <span className="eco-label__required">*</span>
              </label>
              <input
                id="adminName"
                type="text"
                className="eco-input"
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                placeholder="e.g., John Doe"
                required
              />
            </div>

            <div className="eco-form__group">
              <label className="eco-label" htmlFor="adminEmail">
                Administrator Email <span className="eco-label__required">*</span>
              </label>
              <input
                id="adminEmail"
                type="email"
                className="eco-input"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                placeholder="admin@example.com"
                required
              />
            </div>

            <details className="eco-form__group">
              <summary style={{ cursor: "pointer", marginBottom: "0.5rem" }}>
                Create Password (Optional - Skip if using OIDC)
              </summary>
              <div style={{ marginTop: "1rem" }}>
                <p className="eco-form__help" style={{ marginBottom: "1rem" }}>
                  If you plan to use OIDC/SAML authentication, you can skip password creation
                  and configure authentication in Admin → Authentication after setup.
                </p>

                <div className="eco-form__group">
                  <label className="eco-label" htmlFor="adminPassword">
                    Password
                  </label>
                  <input
                    id="adminPassword"
                    type="password"
                    className="eco-input"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    minLength={8}
                  />
                  <p className="eco-form__help">Must be at least 8 characters</p>
                </div>

                <div className="eco-form__group">
                  <label className="eco-label" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="eco-input"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    minLength={8}
                  />
                </div>
              </div>
            </details>

            {error && (
              <div className="eco-form__error" style={{ marginTop: "1rem" }}>
                {error}
              </div>
            )}

            <div className="eco-form__actions" style={{ marginTop: "1.5rem" }}>
              <button
                type="submit"
                className="eco-button eco-button--primary"
                disabled={submitting}
              >
                {submitting ? "Setting up..." : "Complete Setup"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
