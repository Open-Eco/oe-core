"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Dummy emissions data by category
const generateDummyEmissions = () => {
  const categories = [
    { name: "Electricity", value: 1250, color: "#1A6F8A" },
    { name: "Fuel", value: 890, color: "#138A4F" },
    { name: "Water", value: 320, color: "#0F9D58" },
    { name: "Waste", value: 450, color: "#F4B400" },
    { name: "Supply Chain", value: 2100, color: "#DB4437" },
    { name: "Installations", value: 180, color: "#7A8C8E" },
    { name: "Marketing", value: 95, color: "#1A6F8A" },
    { name: "Corporate Travel", value: 680, color: "#138A4F" },
  ];
  return categories;
};

// Dummy T-chart data (spend vs savings)
const generateDummyTChart = () => {
  return [
    { category: "Electricity", spend: 45000, savings: -12000 },
    { category: "Fuel", spend: 32000, savings: -8500 },
    { category: "Water", spend: 12000, savings: -3200 },
    { category: "Waste", spend: 18000, savings: -4500 },
    { category: "Supply Chain", spend: 125000, savings: -35000 },
    { category: "Installations", spend: 8500, savings: 12000 },
    { category: "Marketing", spend: 4500, savings: -1200 },
    { category: "Corporate Travel", spend: 28000, savings: -15000 },
  ];
};

export default function DemoDashboardPage() {
  const router = useRouter();
  const {
    organizations,
    activities,
    currentOrgId,
    setCurrentOrgId,
    getActivitiesByOrg,
  } = useDemo();

  const currentOrg = organizations.find((o) => o.id === currentOrgId);
  const orgActivities = currentOrg
    ? getActivitiesByOrg(currentOrg.id)
    : [];

  const emissionsData = useMemo(() => generateDummyEmissions(), []);
  const tChartData = useMemo(() => generateDummyTChart(), []);

  // If no organizations, redirect to create one
  useEffect(() => {
    if (organizations.length === 0) {
      router.push("/demo/organizations/new");
    } else if (!currentOrgId && organizations.length > 0) {
      setCurrentOrgId(organizations[0].id);
    }
  }, [organizations, currentOrgId, router, setCurrentOrgId]);

  if (organizations.length === 0) {
    return (
      <div className="eco-app-shell__loading">
        <span>Redirecting…</span>
      </div>
    );
  }

  // Calculate some basic stats
  const totalActivities = orgActivities.length;
  const categories = new Set(orgActivities.map((a) => a.category));
  const totalQuantity = orgActivities.reduce((sum, a) => sum + a.quantity, 0);
  const totalEmissions = emissionsData.reduce((sum, e) => sum + e.value, 0);
  const totalSpend = tChartData.reduce((sum, item) => sum + item.spend, 0);
  const totalSavings = tChartData.reduce((sum, item) => sum + item.savings, 0);

  return (
    <section className="eco-page">
      <header className="eco-page__header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <button
              onClick={() => router.push("/")}
              className="eco-button eco-button--ghost"
              style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem" }}
            >
              ← Back to home
            </button>
          </div>
          <h2 className="eco-page__title">Demo Dashboard</h2>
          <p className="eco-page__subtitle">
            {currentOrg
              ? `Welcome to ${currentOrg.name}`
              : "Select an organization to view data"}
          </p>
        </div>
        <button
          onClick={() => router.push("/demo/organizations/new")}
          className="eco-button eco-button--primary"
        >
          Create Organization
        </button>
      </header>

      {currentOrg && (
        <>
          {/* Summary Cards */}
          <div className="eco-grid eco-grid--gap-lg" style={{ marginBottom: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <article className="eco-card">
              <h4 className="eco-card__title">Total Emissions</h4>
              <p className="eco-card__meta" style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "0.5rem" }}>
                {totalEmissions.toLocaleString()} tCO₂e
              </p>
            </article>

            <article className="eco-card">
              <h4 className="eco-card__title">Total Activities</h4>
              <p className="eco-card__meta" style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "0.5rem" }}>
                {totalActivities}
              </p>
            </article>

            <article className="eco-card">
              <h4 className="eco-card__title">Total Spend</h4>
              <p className="eco-card__meta" style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "0.5rem" }}>
                ${totalSpend.toLocaleString()}
              </p>
            </article>

            <article className="eco-card">
              <h4 className="eco-card__title">Net Savings</h4>
              <p className="eco-card__meta" style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "0.5rem", color: totalSavings < 0 ? "var(--error-500)" : "var(--success-500)" }}>
                ${totalSavings.toLocaleString()}
              </p>
            </article>
          </div>

          {/* Emissions by Category Pie Chart */}
          <div className="eco-page__section">
            <div className="eco-page__section-header">
              <h3 className="eco-page__section-title">Emissions by Category</h3>
            </div>
            <div className="eco-card" style={{ padding: "2rem" }}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={emissionsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {emissionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toLocaleString()} tCO₂e`}
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
          </div>

          {/* T-Chart: Spend vs Savings */}
          <div className="eco-page__section">
            <div className="eco-page__section-header">
              <h3 className="eco-page__section-title">Spend Analysis (T-Chart)</h3>
            </div>
            <div className="eco-card" style={{ padding: "1.5rem" }}>
              <div className="eco-table">
                <div className="eco-table__header">
                  <div style={{ flex: "2" }}>Category</div>
                  <div style={{ flex: "1", textAlign: "right" }}>Spend</div>
                  <div style={{ flex: "1", textAlign: "right" }}>Savings</div>
                  <div style={{ flex: "1", textAlign: "right" }}>Net</div>
                </div>
                <div className="eco-table__body">
                  {tChartData.map((item, index) => {
                    const net = item.spend + item.savings;
                    return (
                      <div key={index} className="eco-table__row">
                        <div style={{ flex: "2" }}>{item.category}</div>
                        <div style={{ flex: "1", textAlign: "right" }}>
                          ${item.spend.toLocaleString()}
                        </div>
                        <div
                          style={{
                            flex: "1",
                            textAlign: "right",
                            color: item.savings < 0 ? "var(--error-500)" : "var(--success-500)",
                            fontWeight: item.savings < 0 ? "600" : "normal",
                          }}
                        >
                          {item.savings < 0 ? "-" : "+"}${Math.abs(item.savings).toLocaleString()}
                        </div>
                        <div
                          style={{
                            flex: "1",
                            textAlign: "right",
                            color: net < 0 ? "var(--error-500)" : "var(--success-500)",
                            fontWeight: "600",
                          }}
                        >
                          ${net.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                  <div className="eco-table__row" style={{ borderTop: "2px solid var(--neutral-300)", paddingTop: "0.75rem", marginTop: "0.5rem", fontWeight: "600" }}>
                    <div style={{ flex: "2" }}>Total</div>
                    <div style={{ flex: "1", textAlign: "right" }}>
                      ${totalSpend.toLocaleString()}
                    </div>
                    <div
                      style={{
                        flex: "1",
                        textAlign: "right",
                        color: totalSavings < 0 ? "var(--error-500)" : "var(--success-500)",
                      }}
                    >
                      {totalSavings < 0 ? "-" : "+"}${Math.abs(totalSavings).toLocaleString()}
                    </div>
                    <div
                      style={{
                        flex: "1",
                        textAlign: "right",
                        color: (totalSpend + totalSavings) < 0 ? "var(--error-500)" : "var(--success-500)",
                      }}
                    >
                      ${(totalSpend + totalSavings).toLocaleString()}
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
            </div>

            {orgActivities.length === 0 ? (
              <div className="eco-empty-state">
                <p className="eco-empty-state__text">
                  No activities yet.{" "}
                  <a
                    href="/demo/activity"
                    className="eco-link"
                  >
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
                    <div>Activity</div>
                    <div>Quantity</div>
                    <div>Period</div>
                  </div>
                  <div className="eco-table__body">
                    {orgActivities.slice(0, 10).map((a) => (
                      <div key={a.id} className="eco-table__row">
                        <div>{a.category}</div>
                        <div>{a.activityType}</div>
                        <div>
                          {a.quantity} {a.unit}
                        </div>
                        <div>
                          {new Date(a.periodStart).toLocaleDateString()} –{" "}
                          {new Date(a.periodEnd).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
