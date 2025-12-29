"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [oidcEnabled, setOidcEnabled] = useState(false)

  useEffect(() => {
    // Check if organization has OIDC enabled
    const orgId = searchParams.get("organizationId");
    if (orgId) {
      setOrganizationId(orgId);
      checkOIDCStatus(orgId);
    } else {
      // Try to get organization from user's session (if they have one)
      loadUserOrganization();
    }
  }, [searchParams])

  const loadUserOrganization = async () => {
    try {
      const response = await fetch("/api/organizations");
      const data = await response.json();
      if (response.ok && data.organizations && data.organizations.length > 0) {
        const orgId = data.organizations[0].id;
        setOrganizationId(orgId);
        checkOIDCStatus(orgId);
      }
    } catch (err) {
      // Ignore - user not signed in or no organizations
    }
  }

  const checkOIDCStatus = async (orgId: string) => {
    try {
      const response = await fetch(`/api/admin/auth-config?organizationId=${orgId}`);
      const data = await response.json();
      if (response.ok && data.config?.enabled && data.config?.provider === "oidc") {
        setOidcEnabled(true);
      }
    } catch (err) {
      // Ignore errors - OIDC not configured
    }
  }

  const handleOIDCLogin = () => {
    if (!organizationId) {
      setError("Organization ID required for OIDC login");
      return;
    }
    window.location.href = `/api/auth/oidc/authorize?organizationId=${organizationId}`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      width: "100%",
      maxWidth: "400px",
      padding: "2rem",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
        <h1 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
          Sign In
        </h1>

        {oidcEnabled && (
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              type="button"
              onClick={handleOIDCLogin}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
            >
              Sign in with Identity Provider
            </button>
            <div style={{ textAlign: "center", color: "#666", fontSize: "0.875rem" }}>
              or
            </div>
          </div>
        )}
        
        {error && (
          <div style={{
            padding: "0.75rem",
            marginBottom: "1rem",
            backgroundColor: "#fee",
            color: "#c33",
            borderRadius: "4px",
            fontSize: "0.875rem"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email" style={{ 
              display: "block", 
              marginBottom: "0.5rem",
              fontWeight: "500"
            }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="password" style={{ 
              display: "block", 
              marginBottom: "0.5rem",
              fontWeight: "500"
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: loading ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
          Don't have an account?{" "}
          <a href="/auth/signup" style={{ color: "#0070f3" }}>
            Sign up
          </a>
        </p>
      </div>
  )
}

export default function SignInPage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "1rem"
    }}>
      <Suspense fallback={
        <div style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          textAlign: "center"
        }}>
          <div>Loading...</div>
        </div>
      }>
        <SignInContent />
      </Suspense>
    </div>
  )
}

