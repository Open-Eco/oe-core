"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthConfigFormProps {
  organizationId: string;
  initialConfig?: {
    provider: string;
    enabled: boolean;
    issuer?: string;
    clientId?: string;
    clientSecret?: string;
    authorizationEndpoint?: string;
    tokenEndpoint?: string;
    userInfoEndpoint?: string;
    audience?: string;
  };
}

export function AuthConfigForm({ organizationId, initialConfig }: AuthConfigFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    provider: initialConfig?.provider || "oidc",
    enabled: initialConfig?.enabled || false,
    issuer: initialConfig?.issuer || "",
    clientId: initialConfig?.clientId || "",
    clientSecret: initialConfig?.clientSecret || "",
    authorizationEndpoint: initialConfig?.authorizationEndpoint || "",
    tokenEndpoint: initialConfig?.tokenEndpoint || "",
    userInfoEndpoint: initialConfig?.userInfoEndpoint || "",
    audience: initialConfig?.audience || "",
  });

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const redirectUri = `${baseUrl}/api/auth/oidc/callback?organizationId=${organizationId}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save configuration");
      }

      router.refresh();
      setTestResult("Configuration saved successfully!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth-config/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Connection test failed");
      }

      setTestResult("Connection successful! OIDC configuration is valid.");
    } catch (err: unknown) {
      setTestResult(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="eco-form">
      <div className="eco-form__section">
        <h3 className="eco-form__section-title">Connection Information</h3>
        <p className="eco-form__help">
          Use these values when configuring your identity provider (Keycloak, Azure AD, etc.)
        </p>
        <div className="eco-card" style={{ marginTop: "1rem", padding: "1rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <strong>Redirect URI:</strong>
            <code style={{ display: "block", marginTop: "0.25rem", wordBreak: "break-all" }}>
              {redirectUri}
            </code>
          </div>
          <div>
            <strong>Audience (if required):</strong>
            <code style={{ display: "block", marginTop: "0.25rem" }}>
              {formData.clientId || "openeco"}
            </code>
          </div>
        </div>
      </div>

      <div className="eco-form__group">
        <label className="eco-label" htmlFor="issuer">
          Issuer URL <span className="eco-label__required">*</span>
        </label>
        <input
          id="issuer"
          type="url"
          className="eco-input"
          value={formData.issuer}
          onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
          placeholder="https://keycloak.example.com/realms/my-realm"
          required
        />
        <p className="eco-form__help">
          Your OIDC provider&apos;s issuer URL (usually ends with /realms/your-realm)
        </p>
      </div>

      <div className="eco-form__group">
        <label className="eco-label" htmlFor="clientId">
          Client ID <span className="eco-label__required">*</span>
        </label>
        <input
          id="clientId"
          type="text"
          className="eco-input"
          value={formData.clientId}
          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
          placeholder="openeco"
          required
        />
      </div>

      <div className="eco-form__group">
        <label className="eco-label" htmlFor="clientSecret">
          Client Secret <span className="eco-label__required">*</span>
        </label>
        <input
          id="clientSecret"
          type="password"
          className="eco-input"
          value={formData.clientSecret}
          onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
          placeholder="your-client-secret"
          required
        />
        <p className="eco-form__help">
          Keep this secret secure. It&apos;s stored encrypted in the database.
        </p>
      </div>

      <div className="eco-form__group">
        <label className="eco-label" htmlFor="audience">
          Audience (Optional)
        </label>
        <input
          id="audience"
          type="text"
          className="eco-input"
          value={formData.audience}
          onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
          placeholder="openeco"
        />
        <p className="eco-form__help">
          Required by some providers. Usually matches Client ID.
        </p>
      </div>

      <details className="eco-form__group">
        <summary style={{ cursor: "pointer", marginBottom: "0.5rem" }}>
          Advanced Settings (Optional)
        </summary>
        <div style={{ marginTop: "1rem" }}>
          <div className="eco-form__group">
            <label className="eco-label" htmlFor="authorizationEndpoint">
              Authorization Endpoint
            </label>
            <input
              id="authorizationEndpoint"
              type="url"
              className="eco-input"
              value={formData.authorizationEndpoint}
              onChange={(e) =>
                setFormData({ ...formData, authorizationEndpoint: e.target.value })
              }
              placeholder="Auto-discovered if not provided"
            />
          </div>

          <div className="eco-form__group">
            <label className="eco-label" htmlFor="tokenEndpoint">
              Token Endpoint
            </label>
            <input
              id="tokenEndpoint"
              type="url"
              className="eco-input"
              value={formData.tokenEndpoint}
              onChange={(e) => setFormData({ ...formData, tokenEndpoint: e.target.value })}
              placeholder="Auto-discovered if not provided"
            />
          </div>

          <div className="eco-form__group">
            <label className="eco-label" htmlFor="userInfoEndpoint">
              User Info Endpoint
            </label>
            <input
              id="userInfoEndpoint"
              type="url"
              className="eco-input"
              value={formData.userInfoEndpoint}
              onChange={(e) =>
                setFormData({ ...formData, userInfoEndpoint: e.target.value })
              }
              placeholder="Auto-discovered if not provided"
            />
          </div>
        </div>
      </details>

      <div className="eco-form__group">
        <label className="eco-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={formData.enabled}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
          />
          Enable OIDC Authentication
        </label>
        <p className="eco-form__help">
          When enabled, users will sign in via your identity provider instead of email/password.
        </p>
      </div>

      {error && (
        <div className="eco-form__error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {testResult && (
        <div
          className={testResult.includes("successful") ? "eco-form__success" : "eco-form__error"}
          style={{ marginBottom: "1rem" }}
        >
          {testResult}
        </div>
      )}

      <div className="eco-form__actions">
        <button
          type="button"
          className="eco-button eco-button--ghost"
          onClick={handleTest}
          disabled={testing || !formData.issuer || !formData.clientId || !formData.clientSecret}
        >
          {testing ? "Testing..." : "Test Connection"}
        </button>
        <button
          type="submit"
          className="eco-button eco-button--primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Configuration"}
        </button>
      </div>
    </form>
  );
}
