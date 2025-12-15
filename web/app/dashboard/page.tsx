"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchOrganizations()
    }
  }, [session])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations")
      if (response.ok) {
        const data = await response.json()
        setOrganizations(data.organizations || [])
      }
    } catch (error) {
      console.error("Error fetching organizations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading...
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Dashboard
          </h1>
          <p style={{ color: "#666" }}>
            Welcome back, {session.user?.name || session.user?.email}
          </p>
        </div>
        <a
          href="/auth/signout"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f0f0f0",
            color: "#333",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          Sign Out
        </a>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Your Organizations
        </h2>
        
        {organizations.length === 0 ? (
          <div style={{
            padding: "2rem",
            border: "1px dashed #ccc",
            borderRadius: "8px",
            textAlign: "center",
            color: "#666"
          }}>
            <p style={{ marginBottom: "1rem" }}>No organizations yet</p>
            <button
              onClick={() => router.push("/organizations/new")}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              Create Organization
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {organizations.map((org) => (
              <div
                key={org.id}
                style={{
                  padding: "1.5rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s"
                }}
                onClick={() => router.push(`/organizations/${org.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  {org.name}
                </h3>
                <p style={{ color: "#666", fontSize: "0.875rem" }}>
                  Slug: {org.slug}
                </p>
                {org.verified && (
                  <span style={{
                    display: "inline-block",
                    marginTop: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    borderRadius: "4px",
                    fontSize: "0.75rem"
                  }}>
                    Verified
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

