"use client";

import { useState, useEffect } from "react";

interface RoleMapping {
  id?: string;
  type: "email_domain" | "group" | "attribute";
  matchValue: string;
  role: string;
  priority: number;
}

interface RoleMappingEditorProps {
  organizationId: string;
  authConfigId?: string;
  initialMappings?: RoleMapping[];
}

const ROLE_OPTIONS = [
  { value: "ORG_ADMIN", label: "Organization Administrator" },
  { value: "ORG_MEMBER", label: "Organization Member" },
  { value: "READ_ONLY", label: "Read Only" },
  { value: "SUPPLIER", label: "Supplier" },
];

export function RoleMappingEditor({
  organizationId,
  authConfigId,
  initialMappings = [],
}: RoleMappingEditorProps) {
  const [mappings, setMappings] = useState<RoleMapping[]>(initialMappings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authConfigId) {
      loadMappings();
    }
  }, [authConfigId]);

  const loadMappings = async () => {
    if (!authConfigId) return;
    try {
      const response = await fetch(`/api/admin/role-mappings?authConfigId=${authConfigId}`);
      const data = await response.json();
      if (response.ok) {
        setMappings(data.mappings || []);
      }
    } catch (err) {
      console.error("Failed to load role mappings:", err);
    }
  };

  const handleAdd = () => {
    setMappings([
      ...mappings,
      {
        type: "email_domain",
        matchValue: "",
        role: "ORG_MEMBER",
        priority: mappings.length,
      },
    ]);
  };

  const handleUpdate = (index: number, field: keyof RoleMapping, value: string | number | boolean) => {
    const updated = [...mappings];
    updated[index] = { ...updated[index], [field]: value };
    setMappings(updated);
  };

  const handleDelete = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!authConfigId) {
      setError("Please save OIDC configuration first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/role-mappings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authConfigId,
          organizationId, // Include for fallback lookup
          mappings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save role mappings");
      }

      await loadMappings();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h3 className="eco-form__section-title">Role Mappings</h3>
          <p className="eco-form__help">
            Map users to roles based on email domain, groups, or attributes. Higher priority mappings are checked first.
          </p>
        </div>
        <button
          type="button"
          className="eco-button eco-button--ghost"
          onClick={handleAdd}
        >
          + Add Mapping
        </button>
      </div>

      {mappings.length === 0 ? (
        <div className="eco-card" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ color: "var(--neutral-500)", marginBottom: "1rem" }}>
            No role mappings configured. Add one to get started.
          </p>
          <button
            type="button"
            className="eco-button eco-button--primary"
            onClick={handleAdd}
          >
            Add First Mapping
          </button>
        </div>
      ) : (
        <div className="eco-datagrid__wrapper">
          <table className="eco-datagrid">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Type</th>
                <th>Match Value</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((mapping, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="number"
                      className="eco-input"
                      style={{ width: "60px" }}
                      value={mapping.priority}
                      onChange={(e) =>
                        handleUpdate(index, "priority", parseInt(e.target.value) || 0)
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="eco-select__input"
                      value={mapping.type}
                      onChange={(e) =>
                        handleUpdate(index, "type", e.target.value as RoleMapping["type"])
                      }
                    >
                      <option value="email_domain">Email Domain</option>
                      <option value="group">Group</option>
                      <option value="attribute">Attribute</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="eco-input"
                      value={mapping.matchValue}
                      onChange={(e) => handleUpdate(index, "matchValue", e.target.value)}
                      placeholder={
                        mapping.type === "email_domain"
                          ? "@acme.com"
                          : mapping.type === "group"
                          ? "sustainability-team"
                          : "department=sustainability"
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="eco-select__input"
                      value={mapping.role}
                      onChange={(e) => handleUpdate(index, "role", e.target.value)}
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="eco-button eco-button--ghost"
                      onClick={() => handleDelete(index)}
                      style={{ padding: "0.25rem 0.5rem" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="eco-form__error" style={{ marginTop: "1rem" }}>
          {error}
        </div>
      )}

      {mappings.length > 0 && (
        <div className="eco-form__actions" style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="eco-button eco-button--primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Mappings"}
          </button>
        </div>
      )}
    </div>
  );
}
