"use client";

import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ColumnDef } from "@tanstack/react-table";
import EcoDataGrid from "@/components/EcoDataGrid";

// ── Types ────────────────────────────────────────────────────────────────────

export interface EmissionKpiProps {
  label: string;
  value: string;
  unit: string;
  sub?: string;
  delta?: string;
  deltaPositive?: boolean;
}

export interface TopEmitter {
  id: string;
  category: string;
  subcategory: string;
  co2e: number;
  unit: string;
  scope: string;
  status: "approved" | "reviewed" | "flagged" | "pending";
}

export interface EmissionsByCategory {
  name: string;
  value: number;
  color: string;
}

export interface EmissionsOverTime {
  month: string;
  scope1: number;
  scope2: number;
  scope3: number;
  other: number;
}

export interface DashboardFilters {
  year: string;
  location: string;
  scope: string;
  unit: string;
}

// ── Static Demo Data ─────────────────────────────────────────────────────────

const CATEGORY_DATA: EmissionsByCategory[] = [
  { name: "Travel", value: 30, color: "#138A4F" },
  { name: "Energy", value: 35, color: "#DB4437" },
  { name: "Scopes", value: 15, color: "#F4B400" },
  { name: "Sypes", value: 20, color: "#1A6F8A" },
];

const TIME_DATA: EmissionsOverTime[] = [
  { month: "Jan", scope1: 30, scope2: 20, scope3: 10, other: 5 },
  { month: "Feb", scope1: 35, scope2: 25, scope3: 15, other: 6 },
  { month: "Mar", scope1: 28, scope2: 22, scope3: 12, other: 4 },
  { month: "Apr", scope1: 40, scope2: 30, scope3: 18, other: 7 },
  { month: "May", scope1: 45, scope2: 35, scope3: 20, other: 8 },
  { month: "Jun", scope1: 50, scope2: 40, scope3: 22, other: 9 },
  { month: "Jul", scope1: 116, scope2: 45, scope3: 23, other: 10 },
  { month: "Aug", scope1: 60, scope2: 48, scope3: 25, other: 11 },
  { month: "Sep", scope1: 55, scope2: 42, scope3: 21, other: 10 },
];

const TOP_EMITTERS: TopEmitter[] = [
  {
    id: "1",
    category: "Utilities",
    subcategory: "Electricity",
    co2e: 330,
    unit: "CO\u2082",
    scope: "Diesel",
    status: "approved",
  },
  {
    id: "2",
    category: "Utilities",
    subcategory: "Diesel",
    co2e: 150,
    unit: "CO\u2082",
    scope: "Travel",
    status: "reviewed",
  },
  {
    id: "3",
    category: "Travel",
    subcategory: "Flights",
    co2e: 150,
    unit: "CO\u2082",
    scope: "Company",
    status: "reviewed",
  },
  {
    id: "4",
    category: "Supplies",
    subcategory: "Company Vehicles",
    co2e: 130,
    unit: "CO\u2082",
    scope: "Travel",
    status: "flagged",
  },
];

// ── Status badge variant map ──────────────────────────────────────────────────

const STATUS_VARIANT: Record<
  TopEmitter["status"],
  "success" | "primary" | "warning" | "neutral"
> = {
  approved: "success",
  reviewed: "primary",
  flagged: "warning",
  pending: "neutral",
};

// ── KPI Card ─────────────────────────────────────────────────────────────────

export function EmissionKpiCard({
  label,
  value,
  unit,
  sub,
  delta,
  deltaPositive,
}: EmissionKpiProps) {
  return (
    <div className="eco-kpi-card" data-testid="kpi-card">
      <div className="eco-kpi-card__header">
        <span className="eco-kpi-card__label">{label}</span>
        {delta && (
          <span
            className={`eco-kpi-card__delta ${
              deltaPositive
                ? "eco-kpi-card__delta--up"
                : "eco-kpi-card__delta--down"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="eco-kpi-card__value">
        {value}{" "}
        <span className="eco-kpi-card__unit">{unit}</span>
      </div>
      {sub && <div className="eco-kpi-card__sub">{sub}</div>}
    </div>
  );
}

// ── Filter Bar ────────────────────────────────────────────────────────────────

interface FilterBarProps {
  filters: DashboardFilters;
  onChange: (f: DashboardFilters) => void;
  onApply: () => void;
}

export function DashboardFilterBar({ filters, onChange, onApply }: FilterBarProps) {
  return (
    <div className="eco-filter-bar" data-testid="dashboard-filter-bar">
      <select
        className="eco-filter-bar__select"
        aria-label="Year"
        value={filters.year}
        onChange={(e) => onChange({ ...filters, year: e.target.value })}
      >
        <option value="2024">Year</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
      </select>

      <select
        className="eco-filter-bar__select"
        aria-label="Location"
        value={filters.location}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
      >
        <option value="all">All Locations</option>
        <option value="hq">HQ</option>
        <option value="remote">Remote</option>
      </select>

      <div className="eco-filter-bar__group">
        <span className="eco-filter-bar__group-label">Scope</span>
        <select
          className="eco-filter-bar__select"
          aria-label="Scope"
          value={filters.scope}
          onChange={(e) => onChange({ ...filters, scope: e.target.value })}
        >
          <option value="all">All Scopes</option>
          <option value="1">Scope 1</option>
          <option value="2">Scope 2</option>
          <option value="3">Scope 3</option>
        </select>
      </div>

      <div className="eco-filter-bar__group">
        <span className="eco-filter-bar__group-label">Unit</span>
        <select
          className="eco-filter-bar__select"
          aria-label="Unit"
          value={filters.unit}
          onChange={(e) => onChange({ ...filters, unit: e.target.value })}
        >
          <option value="tco2e">tCO\u2082e</option>
          <option value="kgco2e">kgCO\u2082e</option>
        </select>
      </div>

      <button
        className="eco-filter-bar__apply"
        type="button"
        onClick={onApply}
        data-testid="filter-apply"
      >
        Apply
      </button>
    </div>
  );
}

// ── TanStack top-emitters columns ─────────────────────────────────────────────

const TOP_EMITTER_COLUMNS: ColumnDef<TopEmitter>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory",
  },
  {
    accessorKey: "co2e",
    header: "CO\u2082e",
    cell: ({ row }) => (
      <>
        {row.original.co2e}{" "}
        <sub style={{ fontSize: "0.7em" }}>{row.original.unit}</sub>
      </>
    ),
  },
  {
    accessorKey: "scope",
    header: "Scope",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const label = status.charAt(0).toUpperCase() + status.slice(1);
      const variant = STATUS_VARIANT[status];
      return (
        <span
          className={`eco-badge eco-badge--${variant}`}
          data-testid={`status-pill-${status}`}
        >
          {label}
        </span>
      );
    },
  },
];

// ── Top Emitters Table (via EcoDataGrid / TanStack Table) ─────────────────────

interface TopEmittersTableProps {
  data: TopEmitter[];
}

export function TopEmittersTable({ data }: TopEmittersTableProps) {
  return (
    <div className="eco-card" style={{ padding: "1.5rem" }} data-testid="top-emitters-table">
      <div className="eco-page__section-header" style={{ marginBottom: "1rem" }}>
        <h3 className="eco-page__section-title">Top Emitters</h3>
        <a
          href="#"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--brand-green-600)",
            textDecoration: "none",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          See All \u2192
        </a>
      </div>

      <EcoDataGrid<TopEmitter>
        data={data}
        columns={TOP_EMITTER_COLUMNS}
        enableSorting
        enablePagination
        pageSize={5}
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
  );
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>({
    year: "2024",
    location: "all",
    scope: "all",
    unit: "tco2e",
  });

  // Memoise so the grid reference stays stable on filter changes
  const emitterData = useMemo(() => TOP_EMITTERS, []);

  return (
    <section className="eco-page" data-testid="dashboard-page">
      {/* Page Header */}
      <header className="eco-page__header">
        <h2 className="eco-page__title">Dashboard</h2>
        <button className="eco-btn eco-btn--outline" type="button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M10 6v4l3 3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Make report
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {/* Filter Bar */}
      <DashboardFilterBar filters={filters} onChange={setFilters} onApply={() => {}} />

      {/* KPI Cards */}
      <div className="eco-kpi-row">
        <EmissionKpiCard
          label="Total Emissions"
          value="1,203"
          unit="CO\u2082e"
          sub="3,1 t,120\u2082e"
        />
        <div className="eco-kpi-card" data-testid="kpi-card">
          <div className="eco-kpi-card__header">
            <span className="eco-kpi-card__label">Scope 1</span>
            <span className="eco-kpi-card__delta eco-kpi-card__delta--up">
              +77%
            </span>
          </div>
          <div className="eco-kpi-card__value">
            500t <span className="eco-kpi-card__unit">CO\u2082</span>
          </div>
          <div className="eco-kpi-card__sub">10%</div>
          <div className="eco-kpi-card__detail-row">
            <div className="eco-kpi-card__detail-item">
              <span className="eco-kpi-card__dot eco-kpi-card__dot--blue" />
              10%, TOY{" "}
              <strong className="eco-kpi-card__highlight">1 100%</strong>
            </div>
            <div className="eco-kpi-card__detail-item">
              Coverage &gt; 2{" "}
              <strong className="eco-kpi-card__highlight--green">60%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Emissions by Category */}
        <div className="eco-card">
          <h3 className="eco-page__section-title" style={{ marginBottom: "1rem" }}>
            Emissions by Category
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="45%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ percent }: { percent: number }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
                labelLine
              >
                {CATEGORY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <a
            href="/analyze"
            style={{
              display: "block",
              marginTop: "0.75rem",
              fontSize: "var(--text-sm)",
              color: "var(--brand-blue-600)",
              textDecoration: "none",
            }}
          >
            View Full Analysis \u2192
          </a>
        </div>

        {/* Emissions Over Time */}
        <div className="eco-card">
          <h3 className="eco-page__section-title" style={{ marginBottom: "1rem" }}>
            Emissions Over Time
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={TIME_DATA}
              margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="t" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="scope1"
                name="Scope 1"
                fill="#7ECEC4"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="scope2"
                name="Scope 2"
                fill="#1A6F8A"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="scope3"
                name="Scope 3"
                fill="#415355"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="other"
                name="Other"
                fill="#D5DFE1"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Emitters - TanStack Table via EcoDataGrid */}
      <TopEmittersTable data={emitterData} />
    </section>
  );
}
