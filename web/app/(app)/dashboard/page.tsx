"use client";

import React, { useState } from "react";
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
    unit: "CO₂",
    scope: "Diesel",
    status: "approved",
  },
  {
    id: "2",
    category: "Utilities",
    subcategory: "Diesel",
    co2e: 150,
    unit: "CO₂",
    scope: "Travel",
    status: "reviewed",
  },
  {
    id: "3",
    category: "Travel",
    subcategory: "Flights",
    co2e: 150,
    unit: "CO₂",
    scope: "Company",
    status: "reviewed",
  },
  {
    id: "4",
    category: "Supplies",
    subcategory: "Company Vehicles",
    co2e: 130,
    unit: "CO₂",
    scope: "Travel",
    status: "flagged",
  },
];

const STATUS_COLORS: Record<TopEmitter["status"], string> = {
  approved: "#138A4F",
  reviewed: "#1A6F8A",
  flagged: "#DB4437",
  pending: "#F4B400",
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
    <div className="dash-kpi-card" data-testid="kpi-card">
      <div className="dash-kpi-card__header">
        <span className="dash-kpi-card__label">{label}</span>
        {delta && (
          <span
            className={`dash-kpi-card__delta ${
              deltaPositive
                ? "dash-kpi-card__delta--up"
                : "dash-kpi-card__delta--down"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="dash-kpi-card__value">
        {value}{" "}
        <span className="dash-kpi-card__unit">{unit}</span>
      </div>
      {sub && <div className="dash-kpi-card__sub">{sub}</div>}
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
    <div className="dash-filter-bar" data-testid="dashboard-filter-bar">
      <select
        className="dash-filter-bar__select"
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
        className="dash-filter-bar__select"
        aria-label="Location"
        value={filters.location}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
      >
        <option value="all">All Locations</option>
        <option value="hq">HQ</option>
        <option value="remote">Remote</option>
      </select>

      <div className="dash-filter-bar__group">
        <span className="dash-filter-bar__group-label">Scope</span>
        <select
          className="dash-filter-bar__select"
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

      <div className="dash-filter-bar__group">
        <span className="dash-filter-bar__group-label">Unit</span>
        <select
          className="dash-filter-bar__select"
          aria-label="Unit"
          value={filters.unit}
          onChange={(e) => onChange({ ...filters, unit: e.target.value })}
        >
          <option value="tco2e">tCO₂e</option>
          <option value="kgco2e">kgCO₂e</option>
        </select>
      </div>

      <button
        className="dash-filter-bar__apply"
        type="button"
        onClick={onApply}
        data-testid="filter-apply"
      >
        Apply
      </button>
    </div>
  );
}

// ── Status Pill ───────────────────────────────────────────────────────────────

export function StatusPill({ status }: { status: TopEmitter["status"] }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className="dash-status-pill"
      style={{ background: STATUS_COLORS[status] }}
      data-testid={`status-pill-${status}`}
    >
      {label}
    </span>
  );
}

// ── Top Emitters Table ────────────────────────────────────────────────────────

interface TopEmittersTableProps {
  data: TopEmitter[];
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function TopEmittersTable({
  data,
  page,
  totalPages,
  onPageChange,
}: TopEmittersTableProps) {
  return (
    <div className="dash-card" data-testid="top-emitters-table">
      <div className="dash-card__header">
        <h3 className="dash-card__title">Top Emitters</h3>
        <a href="#" className="dash-card__see-all">
          See All →
        </a>
      </div>

      <table className="dash-table" aria-label="Top emitters">
        <thead>
          <tr>
            <th>Category</th>
            <th>Subcategory</th>
            <th>CO₂e</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="dash-table__category">{row.category}</td>
              <td>{row.subcategory}</td>
              <td className="dash-table__co2e">
                {row.co2e} <sub>{row.unit}</sub>
              </td>
              <td>{row.scope}</td>
              <td>
                <StatusPill status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="dash-table__footer">
        <span className="dash-table__info">
          Showing 1 to {data.length} of {data.length * totalPages} emitters
        </span>
        <div className="dash-pagination">
          <button
            className="dash-pagination__btn"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`dash-pagination__btn ${
                p === page ? "dash-pagination__btn--active" : ""
              }`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ))}
          <button
            className="dash-pagination__btn"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
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
  const [page, setPage] = useState(1);

  return (
    <section className="dash-page" data-testid="dashboard-page">
      {/* Page Header */}
      <header className="dash-page__header">
        <h2 className="dash-page__title">Dashboard</h2>
        <button className="dash-btn dash-btn--outline" type="button">
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
          Meske report
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
      <div className="dash-kpi-row">
        <EmissionKpiCard
          label="Total Emissions"
          value="1,203"
          unit="CO₂e"
          sub="3,1 t,120₂e"
        />
        <div className="dash-kpi-card" data-testid="kpi-card">
          <div className="dash-kpi-card__header">
            <span className="dash-kpi-card__label">Scope 1</span>
            <span className="dash-kpi-card__delta dash-kpi-card__delta--up">
              +·77%
            </span>
          </div>
          <div className="dash-kpi-card__value">
            500t <span className="dash-kpi-card__unit">CO₂</span>
          </div>
          <div className="dash-kpi-card__sub">10%</div>
          <div className="dash-kpi-card__scope-row">
            <div className="dash-kpi-card__scope-item">
              <span className="dash-kpi-card__scope-dot dash-kpi-card__scope-dot--blue" />
              10%, TOY{" "}
              <strong style={{ color: "#1A6F8A", marginLeft: 4 }}>
                1 100%
              </strong>
            </div>
            <div className="dash-kpi-card__scope-item">
              Coverage &gt; 2{" "}
              <strong style={{ color: "#138A4F", marginLeft: 4 }}>60%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dash-charts-row">
        {/* Emissions by Category */}
        <div className="dash-card dash-card--chart">
          <h3 className="dash-card__title">Emissions by Category</h3>
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
          <a href="/analyze" className="dash-card__link">
            View Full Analysis →
          </a>
        </div>

        {/* Emissions Over Time */}
        <div className="dash-card dash-card--chart">
          <h3 className="dash-card__title">Emissions Over Time</h3>
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

      {/* Top Emitters */}
      <TopEmittersTable
        data={TOP_EMITTERS}
        page={page}
        totalPages={2}
        onPageChange={setPage}
      />
    </section>
  );
}
