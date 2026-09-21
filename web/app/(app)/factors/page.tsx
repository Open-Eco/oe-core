"use client";

import React, { useState, useEffect, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface DatasetVersion {
  id: string;
  name: string;
  version: string;
  description?: string;
  publishedAt: string;
  isActive: boolean;
  _count: { emissionFactors: number };
}

interface EmissionFactor {
  id: string;
  datasetVersionId: string;
  category: string;
  subcategory?: string;
  activityType: string;
  factor: number;
  unit: string;
  region?: string;
  source?: string;
  createdAt: string;
  datasetVersion: { name: string; version: string };
}

// ── Factor Library Page ───────────────────────────────────────────────────────

export default function FactorsPage() {
  const [datasets, setDatasets] = useState<DatasetVersion[]>([]);
  const [factors, setFactors] = useState<EmissionFactor[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Load datasets on mount ───────────────────────────────────────────────

  useEffect(() => {
    async function loadDatasets() {
      try {
        const res = await fetch("/api/factors?datasets=true");
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json() as { datasets: DatasetVersion[] };
        setDatasets(json.datasets);
        if (json.datasets.length > 0) {
          setSelectedDataset(json.datasets[0].id);
        }
      } catch (err) {
        setError("Failed to load datasets.");
        console.error(err);
      }
    }
    void loadDatasets();
  }, []);

  // ── Load factors when filters change ────────────────────────────────────

  const loadFactors = useCallback(async () => {
    if (!selectedDataset) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ datasetVersionId: selectedDataset });
      if (categoryFilter) params.set("category", categoryFilter);
      if (activityFilter) params.set("activityType", activityFilter);
      const res = await fetch(`/api/factors?${params.toString()}`);
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json() as { factors: EmissionFactor[] };
      setFactors(json.factors);
    } catch (err) {
      setError("Failed to load emission factors.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDataset, categoryFilter, activityFilter]);

  useEffect(() => {
    void loadFactors();
  }, [loadFactors]);

  // ── Delete a factor ──────────────────────────────────────────────────────

  async function deleteFactor(id: string) {
    if (!confirm("Delete this emission factor? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/factors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setFactors((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert("Failed to delete factor.");
      console.error(err);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  const activeDataset = datasets.find((d) => d.id === selectedDataset);

  return (
    <div style={{ padding: "var(--space-6)" }}>
      {/* Page header */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-bold)", margin: 0 }}>
          Factor Library
        </h1>
        <p style={{ color: "var(--neutral-500)", marginTop: "var(--space-2)" }}>
          Emission factors used to calculate CO₂e values. All factors are versioned
          and immutable within a dataset.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "var(--error-50, #fef2f2)",
            border: "1px solid var(--error-200, #fecaca)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-4)",
            marginBottom: "var(--space-4)",
            color: "var(--error-700, #b91c1c)",
          }}
        >
          {error}
        </div>
      )}

      {/* Dataset selector */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-4)",
          flexWrap: "wrap",
          marginBottom: "var(--space-6)",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <label
            htmlFor="dataset-select"
            style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", marginBottom: "var(--space-2)" }}
          >
            Dataset
          </label>
          <select
            id="dataset-select"
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            style={{
              width: "100%",
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--neutral-300)",
              background: "var(--background)",
              fontSize: "var(--text-md)",
            }}
          >
            {datasets.length === 0 && (
              <option value="">No datasets loaded</option>
            )}
            {datasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} v{d.version} ({d._count.emissionFactors} factors)
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: "1 1 180px" }}>
          <label
            htmlFor="category-filter"
            style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", marginBottom: "var(--space-2)" }}
          >
            Category
          </label>
          <input
            id="category-filter"
            type="text"
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--neutral-300)",
              fontSize: "var(--text-md)",
            }}
          />
        </div>

        <div style={{ flex: "1 1 180px" }}>
          <label
            htmlFor="activity-filter"
            style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", marginBottom: "var(--space-2)" }}
          >
            Activity Type
          </label>
          <input
            id="activity-filter"
            type="text"
            placeholder="Filter by activity type"
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--neutral-300)",
              fontSize: "var(--text-md)",
            }}
          />
        </div>
      </div>

      {/* Dataset info banner */}
      {activeDataset && (
        <div
          style={{
            background: "var(--brand-green-50, #f0fdf4)",
            border: "1px solid var(--brand-green-200, #bbf7d0)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-4)",
            marginBottom: "var(--space-4)",
            fontSize: "var(--text-sm)",
            color: "var(--brand-green-800, #166534)",
          }}
        >
          <strong>{activeDataset.name} v{activeDataset.version}</strong>
          {activeDataset.description && (
            <span style={{ marginLeft: "var(--space-2)" }}>— {activeDataset.description}</span>
          )}
          <span style={{ marginLeft: "var(--space-4)", color: "var(--neutral-500)" }}>
            Published {new Date(activeDataset.publishedAt).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* Factors table */}
      {loading ? (
        <p style={{ color: "var(--neutral-500)" }}>Loading factors…</p>
      ) : factors.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "var(--space-16)",
            color: "var(--neutral-400)",
            border: "2px dashed var(--neutral-200)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          No emission factors found.{" "}
          {datasets.length === 0
            ? "Create a dataset first via the API (POST /api/factors)."
            : "Adjust filters or import factors via the API."}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "var(--text-sm)",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--neutral-50)",
                  borderBottom: "2px solid var(--neutral-200)",
                }}
              >
                {[
                  "Category",
                  "Subcategory",
                  "Activity Type",
                  "Factor",
                  "Unit",
                  "Region",
                  "Source",
                  "Dataset",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      textAlign: "left",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--neutral-600)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {factors.map((f) => (
                <tr
                  key={f.id}
                  style={{ borderBottom: "1px solid var(--neutral-100)" }}
                >
                  <td style={{ padding: "var(--space-3) var(--space-4)" }}>{f.category}</td>
                  <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--neutral-500)" }}>
                    {f.subcategory ?? "—"}
                  </td>
                  <td style={{ padding: "var(--space-3) var(--space-4)" }}>{f.activityType}</td>
                  <td
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      fontFamily: "var(--font-mono)",
                      textAlign: "right",
                    }}
                  >
                    {f.factor.toFixed(6)}
                  </td>
                  <td style={{ padding: "var(--space-3) var(--space-4)" }}>{f.unit}</td>
                  <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--neutral-500)" }}>
                    {f.region ?? "—"}
                  </td>
                  <td
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      color: "var(--neutral-500)",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={f.source ?? ""}
                  >
                    {f.source ?? "—"}
                  </td>
                  <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--neutral-500)" }}>
                    {f.datasetVersion.name} v{f.datasetVersion.version}
                  </td>
                  <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                    <button
                      onClick={() => void deleteFactor(f.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--error-500, #ef4444)",
                        fontSize: "var(--text-sm)",
                        padding: "var(--space-1) var(--space-2)",
                      }}
                      aria-label={`Delete factor ${f.activityType}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: "var(--space-4)", color: "var(--neutral-400)", fontSize: "var(--text-sm)" }}>
            Showing {factors.length} factor{factors.length !== 1 ? "s" : ""}
            {factors.length === 200 ? " (limit reached — refine your filters)" : ""}.
          </p>
        </div>
      )}
    </div>
  );
}
