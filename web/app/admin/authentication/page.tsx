"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthConfigForm } from "@/components/admin/AuthConfigForm";
import { RoleMappingEditor } from "@/components/admin/RoleMappingEditor";

export default function AuthenticationConfigPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authConfig, setAuthConfig] = useState<any>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      loadOrganization();
    }
  }, [status, session]);

  const loadOrganization = async () => {
    try {
      // Get user's organization (simplified - in production, get from session/context)
      const response = await fetch("/api/organizations");
      const data = await response.json();
      
      if (data.organizations && data.organizations.length > 0) {
        const orgId = data.organizations[0].id;
        setOrganizationId(orgId);
        
        // Load auth config
        const configResponse = await fetch(`/api/admin/auth-config?organizationId=${orgId}`);
        const configData = await configResponse.json();
        if (configResponse.ok) {
          setAuthConfig(configData.config);
        }
      }
    } catch (err) {
      console.error("Failed to load organization:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !organizationId) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="eco-page">
      <header className="eco-page__header">
        <div>
          <h1 className="eco-page__title">Authentication Configuration</h1>
          <p className="eco-page__subtitle">
            Configure federated authentication (OIDC) for your organization. OpenEco does not manage
            user identities - it federates with your existing identity provider.
          </p>
        </div>
      </header>

      <div className="eco-page__section">
        <div className="eco-card">
          <h2 className="eco-card__title">OIDC Configuration</h2>
          <p className="eco-card__meta" style={{ marginBottom: "1.5rem" }}>
            Configure OpenID Connect (OIDC) to allow users to sign in via your identity provider
            (Keycloak, Azure AD, Okta, etc.).
          </p>
          <AuthConfigForm organizationId={organizationId} initialConfig={authConfig} />
        </div>
      </div>

      <div className="eco-page__section" style={{ marginTop: "2rem" }}>
        <div className="eco-card">
          <h2 className="eco-card__title">Role Mappings</h2>
          <p className="eco-card__meta" style={{ marginBottom: "1.5rem" }}>
            Configure how users are assigned roles when they sign in via OIDC. Mappings are checked
            in priority order (higher priority first).
          </p>
          <RoleMappingEditor
            organizationId={organizationId}
            authConfigId={authConfig?.id}
            initialMappings={authConfig?.roleMappings || []}
          />
        </div>
      </div>
    </div>
  );
}
