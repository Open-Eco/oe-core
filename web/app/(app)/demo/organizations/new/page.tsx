"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";

export default function NewDemoOrganizationPage() {
  const router = useRouter();
  const { createOrganization } = useDemo();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSlugChange = (value: string) => {
    setSlug(value);
    // Auto-generate slug from name if slug is empty
    if (!slug && name) {
      const autoSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug from name
    if (!slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Organization name is required");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required");
      return;
    }

    // Basic slug validation
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError("Slug can only contain lowercase letters, numbers, and hyphens");
      return;
    }

    setSubmitting(true);

    try {
      const org = createOrganization(name.trim(), slug.trim());
      router.push("/demo/dashboard");
    } catch (err) {
      console.error("Error creating organization:", err);
      setError("Failed to create organization. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="eco-page">
      <header className="eco-page__header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <button
              onClick={() => router.push("/demo/dashboard")}
              className="eco-button eco-button--ghost"
              style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem" }}
            >
              ← Back to dashboard
            </button>
          </div>
          <h2 className="eco-page__title">Create Demo Organization</h2>
          <p className="eco-page__subtitle">
            Set up a demo company profile to explore the platform. This data is
            stored in your browser session only.
          </p>
        </div>
      </header>

      <div className="eco-page__section">
        <form className="eco-form" onSubmit={handleSubmit}>
          <div className="eco-form__group">
            <label className="eco-label" htmlFor="name">
              Organization Name <span className="eco-label__required">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="eco-input"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Acme Corporation"
              required
            />
          </div>

          <div className="eco-form__group">
            <label className="eco-label" htmlFor="slug">
              Slug <span className="eco-label__required">*</span>
            </label>
            <input
              id="slug"
              type="text"
              className="eco-input"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="e.g., acme-corp"
              pattern="[a-z0-9-]+"
              required
            />
            <p className="eco-form__help">
              Used in URLs. Lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          {error && <p className="eco-form__error">{error}</p>}

          <div className="eco-form__actions">
            <button
              type="button"
              className="eco-button eco-button--ghost"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="eco-button eco-button--primary"
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create Organization"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

