"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// Emissions by category (tCO₂e) – matched to seed activities
const EMISSIONS_BY_CATEGORY = [
  { name: "Supply Chain", value: 2100, color: "#DB4437" },
  { name: "Electricity", value: 1250, color: "#1A6F8A" },
  { name: "Corporate Travel", value: 680, color: "#138A4F" },
  { name: "Fuel", value: 890, color: "#0F9D58" },
  { name: "Waste", value: 450, color: "#F4B400" },
  { name: "Installations", value: 180, color: "#7A8C8E" },
  { name: "Water", value: 320, color: "#415355" },
];

// Monthly emissions over time (tCO₂e) – Jan–Mar 2024
const EMISSIONS_OVER_TIME = [
  { month: "Jan", scope1: 120, scope2: 310, scope3: 540 },
  { month: "Feb", scope1: 110, scope2: 295, scope3: 580 },
  { month: "Mar", scope1: 130, scope2: 325, scope3: 560 },
];

// Carbon spend vs savings (£)
const T_CHART_DATA = [
  { category: "Electricity", spend: 45000, savings: -12000 },
  { category: "Fuel", spend: 32000, savings: -8500 },
  { category: "Water", spend: 12000, savings: -3200 },
  { category: "Waste", spend: 18000, savings: -4500 },
  { category: "Supply Chain", spend: 125000, savings: -35000 },
  { category: "Installations", spend: 8500, savings: 12000 },
  { category: "Corporate Travel", spend: 28000, savings: -15000 },
];

export default function DemoDashboardPage() {
  const router = useRouter();
  const {
    organizations,
    currentOrgId,
    setCurrentOrgId,
    getActivitiesByOrg,
    getFacilitiesByOrg,
    clearDemo,
  } = useDemo();

  const currentOrg = organizations.find((o) => o.id === currentOrgId);
  const orgActivities = currentOrg ? getActivitiesByOrg(currentOrg.id) : [];
  const orgFacilities = currentOrg ? getFacilitiesByOrg(currentOrg.id) : [];

  const emissionsData = useMemo(() => EMISSIONS_BY_CATEGORY, []);
  const tChartData = useMemo(() => T_CHART_DATA, []);

  // Ensure a current org is selected
  useEffect(() => {
    if (!currentOrgId && organizations.length > 0) {
      setCurrentOrgId(organizations[0].id);
    }
  }, [organizations, currentOrgId, setCurrentOrgId]);

  // Loading state while seed data is being hydrated from sessionStorage
  if (organizations.length === 0) {
    return (
      <div className="eco-app-shell__loading">
        <span>Loading demo…</span>
      </div>
    );
  }

  // KPI calculations
  const totalActivities = orgActivities.length;
  const totalEmissions = emissionsData.reduce((sum, e) => sum + e.value, 0);
  const totalSpend = tChartData.reduce((sum, item) => sum + item.spend, 0);
  const totalSavings = tChartData.reduce((sum, item) => sum + item.savings, 0);

  return (
    <section className="eco-page">
      {/* Demo info banner */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "0.75rem 1rem",
          background: "#fffbeb",
          border: "1px solid var(--warning-500)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontSize: "var(--text-sm)",
          color: "var(--neutral-700)",
        }}
        data-testid="demo-banner"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: "var(--warning-500)" }}>
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10 6v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="14" r="1" fill="currentColor" />
        </svg>
        <span>
          <strong>Demo Mode</strong> — Exploring with pre-loaded data for{" "}
          <strong>{currentOrg?.name ?? "Acme Corporation"}</strong>. Data is
          stored in your browser session and resets when you close the tab.{" "}
          <button
            type="button"
            onClick={() => { clearDemo(); router.push("/"); }}
            style={{ background: "none", border: "none", padding: 0, color: "var(--brand-green-600)", cursor: "pointer", fontWeight: "var(--font-weight-medium)", textDecoration: "underline" }}
          >
            Exit demo
          </button>
        </span>
      </div>

      {/* Page Header */}
      <header className="eco-page__header">
        <div>
          <h2 className="eco-page__title">
            {currentOrg ? currentOrg.name : "Demo Dashboard"}
          </h2>
          <p className="eco-page__subtitle">
            {orgFacilities.length} facilit{orgFacilities.length === 1 ? "y" : "ies"} · Reporting period: Jan–Mar 2024
          </p>
        </div>
        <button
          onClick={() => router.push("/demo/activity")}
          className="eco-button eco-button--primary"
        >
          + Add Activity
        </button>
      </header>

      {/* KPI Cards */}
      <div className="eco-grid eco-grid--gap-lg" style={{ marginBottom: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <article className="eco-card">
          <h4 className="eco-card__title">Total Emissions</h4>
          <p style={{ fontSize: "1.75rem", fontWeight: "700", marginTop: "0.5rem", color: "var(--neutral-900)" }}>
            {totalEmissions.toLocaleString()}
          </p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--neutral-500)" }}>tCO₂e year-to-date</p>
        </article>

        <article className="eco-card">
          <h4 className="eco-card__title">Logged Activities</h4>
          <p style={{ fontSize: "1.75rem", fontWeight: "700", marginTop: "0.5rem", color: "var(--neutral-900)" }}>
            {totalActivities}
          </p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--neutral-500)" }}>across {orgFacilities.length} facilit{orgFacilities.length === 1 ? "y" : "ies"}</p>
        </article>

        <article className="eco-card">
          <h4 className="eco-card__title">Carbon Spend</h4>
          <p style={{ fontSize: "1.75rem", fontWeight: "700", marginTop: "0.5rem", color: "var(--neutral-900)" }}>
            £{totalSpend.toLocaleString()}
          </p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--neutral-500)" }}>estimated carbon cost</p>
        </article>

        <article className="eco-card">
          <h4 className="eco-card__title">Reduction Potential</h4>
          <p style={{ fontSize: "1.75rem", fontWeight: "700", marginTop: "0.5rem", color: "var(--brand-green-600)" }}>
            £{Math.abs(totalSavings).toLocaleString()}
          </p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--neutral-500)" }}>estimated savings available</p>
        </article>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Emissions by Category */}
        <div className="eco-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "var(--text-md)", fontWeight: "var(--font-weight-bold)", marginBottom: "1rem" }}>
            Emissions by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emissionsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {emissionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString()} tCO₂e`, "Emissions"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid var(--neutral-300)",
                  borderRadius: "var(--radius-md)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Emissions Over Time */}
        <div className="eco-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "var(--text-md)", fontWeight: "var(--font-weight-bold)", marginBottom: "1rem" }}>
            Emissions Over Time (tCO₂e)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={EMISSIONS_OVER_TIME} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit="t" />
              <Tooltip formatter={(v: number) => `${v} tCO₂e`} />
              <Legend />
              <Bar dataKey="scope1" name="Scope 1" fill="#138A4F" radius={[2, 2, 0, 0]} />
              <Bar dataKey="scope2" name="Scope 2" fill="#1A6F8A" radius={[2, 2, 0, 0]} />
              <Bar dataKey="scope3" name="Scope 3" fill="#DB4437" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Carbon Spend T-Chart */}
      <div className="eco-page__section" style={{ marginBottom: "2rem" }}>
        <div className="eco-page__section-header">
          <h3 className="eco-page__section-title">Carbon Spend Analysis</h3>
        </div>
        <div className="eco-card" style={{ padding: "1.5rem" }}>
          <div className="eco-table">
            <div className="eco-table__header">
              <div style={{ flex: "2" }}>Category</div>
              <div style={{ flex: "1", textAlign: "right" }}>Carbon Cost (£)</div>
              <div style={{ flex: "1", textAlign: "right" }}>Savings Potential (£)</div>
              <div style={{ flex: "1", textAlign: "right" }}>Net (£)</div>
            </div>
            <div className="eco-table__body">
              {tChartData.map((item, index) => {
                const net = item.spend + item.savings;
                return (
                  <div key={index} className="eco-table__row">
                    <div style={{ flex: "2" }}>{item.category}</div>
                    <div style={{ flex: "1", textAlign: "right" }}>
                      £{item.spend.toLocaleString()}
                    </div>
                    <div style={{ flex: "1", textAlign: "right", color: "var(--brand-green-600)", fontWeight: "600" }}>
                      £{Math.abs(item.savings).toLocaleString()}
                    </div>
                    <div style={{ flex: "1", textAlign: "right", fontWeight: "600" }}>
                      £{net.toLocaleString()}
                    </div>
                  </div>
                );
              })}
              <div
                className="eco-table__row"
                style={{
                  borderTop: "2px solid var(--neutral-300)",
                  paddingTop: "0.75rem",
                  marginTop: "0.5rem",
                  fontWeight: "700",
                }}
              >
                <div style={{ flex: "2" }}>Total</div>
                <div style={{ flex: "1", textAlign: "right" }}>£{totalSpend.toLocaleString()}</div>
                <div style={{ flex: "1", textAlign: "right", color: "var(--brand-green-600)" }}>
                  £{Math.abs(totalSavings).toLocaleString()}
                </div>
                <div style={{ flex: "1", textAlign: "right" }}>
                  £{(totalSpend + totalSavings).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="eco-page__section">
        <div className="eco-page__section-header">
          <h3 className="eco-page__section-title">Recent Activities</h3>
          <button
            type="button"
            onClick={() => router.push("/demo/activity")}
            className="eco-button eco-button--ghost"
            style={{ fontSize: "var(--text-sm)" }}
          >
            + Add Activity
          </button>
        </div>

        {orgActivities.length === 0 ? (
          <div className="eco-empty-state">
            <p className="eco-empty-state__text">
              No activities logged yet.{" "}
              <a href="/demo/activity" className="eco-link">
                Add your first activity
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="eco-card" style={{ padding: "1.5rem" }}>
            <div className="eco-table eco-table--compact">
              <div className="eco-table__header">
                <div>Category</div>
                <div>Activity Type</div>
                <div>Quantity</div>
                <div>Period</div>
              </div>
              <div className="eco-table__body">
                {orgActivities.slice(0, 10).map((a) => (
                  <div key={a.id} className="eco-table__row">
                    <div style={{ textTransform: "capitalize" }}>{a.category.replace(/_/g, " ")}</div>
                    <div style={{ textTransform: "capitalize" }}>{a.activityType.replace(/_/g, " ")}</div>
                    <div>
                      {a.quantity.toLocaleString()} {a.unit}
                    </div>
                    <div>
                      {new Date(a.periodStart).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
