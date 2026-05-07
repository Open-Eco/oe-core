"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

// Types

export type AuditStatus = "approved" | "reviewed" | "flagged" | "pending";

export interface AuditEntry {
  id: string;
  activity: string;
  category: string;
  factor: string;
  method: string;
  result: string;
  status: AuditStatus;
  detail?: AuditDetail;
}

export interface AuditDetail {
  rows: AuditDetailRow[];
}

export interface AuditDetailRow {
  label: string;
  source?: string;
  factor?: string;
  method?: string;
  result?: string;
  status?: AuditStatus;
}

export interface EvidenceAttachment {
  id: string;
  filename: string;
  uploadedBy: string;
  uploadedAt: string;
  ago: string;
}

export interface ChangeHistoryEntry {
  id: string;
  description: string;
  detail?: string;
  date?: string;
}

// Static Demo Data

const AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "1",
    activity: "Electricity \u2013 HQ",
    category: "DEFRA 2023",
    factor: "DEFRA 2023",
    method: "Location-based",
    result: "320 t CO\u2082e",
    status: "approved",
    detail: {
      rows: [
        { label: "Quantity", source: "120,000 KWh", factor: "Jan\u2013Dec 2024", method: "Location-based", status: "approved" },
        { label: "Location", source: "HQ \u2013 Berlin", factor: "Utility invoices", method: "uploaded", status: "approved" },
        { label: "Electricity \u2014 HQ", source: "2024-2023", factor: "", method: "", status: "approved", result: "" },
        { label: "Activity Data", source: "Source", factor: "DEFRA 2023", method: "DEFRA" },
        { label: "Transformation", source: "L. hWh", factor: "Stup \u00d7 2. kWh", method: "DEFRA" },
        { label: "Emission Factor", source: "Source", factor: "DEFRA 2023", method: "DEFRA" },
        { label: "Calculation", source: "\u203a Activity \u00d7 Factor", factor: "320 t CO\u2082e", method: "", result: "330 t CO\u2082e" },
        { label: "Approval", source: "J. Smith", factor: "J. Smith", method: "", status: "approved" },
        { label: "Approved", source: "A. Patel", factor: "2024-03-12", method: "", status: "flagged" },
      ],
    },
  },
  { id: "2", activity: "Fleet Diesel", category: "Fuel", factor: "EPA 2022", method: "Combustion", result: "180 t CO\u2082e", status: "approved" },
  { id: "3", activity: "Business Flights", category: "Travel", factor: "DEFRA 2023", method: "Distance-based", result: "95 t CO\u2082e", status: "reviewed" },
  { id: "4", activity: "Employee Commute", category: "Travel", factor: "Modeled", method: "Survey-based", result: "45 t CO\u2082e", status: "flagged" },
];

const EVIDENCE_ATTACHMENTS: EvidenceAttachment[] = [
  { id: "1", filename: "Electricity_Invoice_Jan2024.pdf", uploadedBy: "J. Smith", uploadedAt: "2024-02-01", ago: "Last.kgo" },
  { id: "2", filename: "Electricity_Invoice_Feb2024.pdf", uploadedBy: "J. Smith", uploadedAt: "2024-02-31", ago: "Last.ago" },
  { id: "3", filename: "Meter_Readings_2024.xlsx", uploadedBy: "A. Patel", uploadedAt: "2024-02-01", ago: "Last.lgo" },
];

const CHANGE_HISTORY: ChangeHistoryEntry[] = [
  { id: "1", description: "Quantity updated", detail: "(00300 \u2192 (20,009)" },
  { id: "2", description: "Emission factor updated", detail: "(DEFRA 2022 -1-DEFRA 3546)" },
  { id: "3", description: "Approved by Admin", date: "2024-03-12" },
];

// Status variant map (maps to eco-badge variants)

const STATUS_VARIANT: Record<AuditStatus, string> = {
  approved: "success",
  reviewed: "primary",
  flagged: "warning",
  pending: "neutral",
};

// Status Badge using eco-badge from EcoKit

export function AuditStatusBadge({
  status,
  dropdown = false,
}: {
  status: AuditStatus;
  dropdown?: boolean;
}) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`eco-badge eco-badge--${STATUS_VARIANT[status]}`}
      data-testid={`audit-status-${status}`}
    >
      {label}
      {dropdown && (
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4 }} aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

// Clock Icon component - defined at module level to avoid "cannot create components during render" issue
function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Evidence & History Panel - uses eco-card from EcoKit

export function EvidencePanel({
  attachments,
  history,
}: {
  attachments: EvidenceAttachment[];
  history: ChangeHistoryEntry[];
}) {
  return (
    <div className="eco-card" style={{ minWidth: 260, flexShrink: 0 }} data-testid="evidence-panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "var(--text-md)", fontWeight: "var(--font-weight-bold)", color: "var(--neutral-900)", margin: 0 }}>
          Evidence &amp; History
        </h3>
        <button className="eco-btn eco-btn--secondary" style={{ padding: "0.25rem 0.5rem", minWidth: "auto" }} type="button" aria-label="Collapse">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <section style={{ marginBottom: "1.25rem" }}>
        <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--neutral-900)", marginBottom: "0.75rem" }}>
          Evidence Attachments
        </h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {attachments.map((a) => (
            <li key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
              <span style={{ color: "var(--brand-blue-600)", marginTop: 2 }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 4h8l4 4v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 4v4h4" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <div>
                <a href="#" style={{ fontSize: "var(--text-sm)", color: "var(--brand-blue-600)", textDecoration: "none" }}>
                  {a.filename}
                </a>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--neutral-500)", display: "flex", alignItems: "center", gap: 4 }}>
                  <ClockIcon /> {a.uploadedBy} {a.uploadedAt} {a.ago}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" style={{ marginTop: "0.5rem", fontSize: "var(--text-xs)", color: "var(--brand-blue-600)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
          <ClockIcon /> 4 Chaing Fislory new
        </button>
      </section>

      <section>
        <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--neutral-900)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: 6 }}>
          <ClockIcon /> Change History
        </h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {history.map((h) => (
            <li key={h.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "var(--text-sm)" }}>
              <span style={{ color: "var(--neutral-500)", marginTop: 2 }}><ClockIcon /></span>
              <div>
                <span style={{ color: "var(--neutral-700)" }}>{h.description}</span>
                {h.detail && <span style={{ color: "var(--neutral-500)" }}> {h.detail}</span>}
                {h.date && <div style={{ fontSize: "var(--text-xs)", color: "var(--neutral-500)" }}>{h.date}</div>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// Expanded row – sub-table uses eco-datagrid CSS classes from EcoKit

export function AuditExpandedRow({ entry }: { entry: AuditEntry }) {
  if (!entry.detail) return null;
  return (
    <div
      style={{ display: "flex", gap: "1.5rem", padding: "1.5rem", background: "var(--neutral-100)" }}
      data-testid={`audit-expanded-${entry.id}`}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <input type="checkbox" checked readOnly aria-label="Selected" />
          <strong style={{ fontSize: "var(--text-md)", color: "var(--neutral-900)" }}>{entry.activity}</strong>
          <AuditStatusBadge status={entry.status} dropdown />
        </div>

        <div className="eco-datagrid__container">
          <table className="eco-datagrid" aria-label="Activity details">
            <thead className="eco-datagrid__head">
              <tr>
                {["Activity Data", "Transformation", "Factor", "Method", "Result", "Status"].map((h) => (
                  <th key={h} className="eco-datagrid__cell eco-datagrid__cell--header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="eco-datagrid__body">
              {entry.detail.rows.map((row, i) => (
                <tr key={i} className="eco-datagrid__row">
                  <td className="eco-datagrid__cell" style={{ fontWeight: "var(--font-weight-medium)" }}>{row.label}</td>
                  <td className="eco-datagrid__cell">{row.source || ""}</td>
                  <td className="eco-datagrid__cell">{row.factor || ""}</td>
                  <td className="eco-datagrid__cell">{row.method || ""}</td>
                  <td className="eco-datagrid__cell">{row.result || ""}</td>
                  <td className="eco-datagrid__cell">
                    {row.status && <AuditStatusBadge status={row.status} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <EvidencePanel attachments={EVIDENCE_ATTACHMENTS} history={CHANGE_HISTORY} />
    </div>
  );
}

// Main Audit Page

export default function AuditPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("1");

  const columns = useMemo<ColumnDef<AuditEntry>[]>(
    () => [
      {
        id: "select",
        header: "",
        size: 40,
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label={`Select ${row.original.activity}`}
            onChange={() => {}}
          />
        ),
      },
      {
        accessorKey: "activity",
        header: "Activity",
        cell: ({ getValue }) => <strong>{getValue<string>()}</strong>,
      },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "factor", header: "Factor" },
      { accessorKey: "method", header: "Method" },
      { accessorKey: "result", header: "Result" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <AuditStatusBadge status={getValue<AuditStatus>()} />,
      },
      {
        id: "status-action",
        header: "Status",
        cell: ({ row }) => <AuditStatusBadge status={row.original.status} dropdown />,
      },
    ],
    []
  );

  const table = useReactTable({
    data: AUDIT_ENTRIES,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
  });

  return (
    <section className="eco-page" data-testid="audit-page">
      <header className="eco-page__header">
        <div>
          <h2 className="eco-page__title">Audit &amp; Data Lineage</h2>
          <p className="eco-page__subtitle">
            Track the full journey from raw activity data to final emissions numbers.
          </p>
        </div>
        <div className="eco-page__header-actions">
          <button className="eco-btn" type="button">Export Audit Pack</button>
          <button className="eco-btn eco-btn--secondary" type="button">Download Evidence Index</button>
        </div>
      </header>

      <div className="eco-datagrid__wrapper">
        <div className="eco-datagrid__toolbar">
          <div className="eco-datagrid__search">
            <svg className="eco-datagrid__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              className="eco-input eco-datagrid__search-input"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              aria-label="Search audit entries"
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button className="eco-btn eco-btn--secondary" type="button">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M6 10h8M10 6v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Export Audit Pack
            </button>
            <button className="eco-btn eco-btn--secondary" style={{ padding: "0.5rem", minWidth: "auto" }} type="button" aria-label="Refresh">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10a6 6 0 1 1 1.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 14v-4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="eco-btn eco-btn--secondary" style={{ padding: "0.5rem", minWidth: "auto" }} type="button" aria-label="Grid view">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
                <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
                <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
                <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--neutral-700)", fontWeight: "var(--font-weight-medium)", padding: "0 0.25rem" }}>
              {table.getState().pagination.pageIndex + 1}
            </span>
            <select className="eco-filter-bar__select" aria-label="Next actions">
              <option>Next</option>
            </select>
          </div>
        </div>

        <div className="eco-datagrid__container">
          <table className="eco-datagrid" aria-label="Audit entries">
            <thead className="eco-datagrid__head">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th key={header.id} className="eco-datagrid__cell eco-datagrid__cell--header">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="eco-datagrid__body">
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    className={`eco-datagrid__row eco-datagrid__row--clickable${expandedId === row.original.id ? " eco-datagrid__row--expanded" : ""}`}
                    onClick={() => setExpandedId(expandedId === row.original.id ? null : row.original.id)}
                    aria-expanded={expandedId === row.original.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="eco-datagrid__cell"
                        onClick={cell.column.id === "select" ? (e) => e.stopPropagation() : undefined}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {expandedId === row.original.id && row.original.detail && (
                    <tr>
                      <td colSpan={columns.length} style={{ padding: 0, borderBottom: "2px solid var(--brand-green-600)" }}>
                        <AuditExpandedRow entry={row.original} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="eco-datagrid__pagination">
          <div className="eco-datagrid__pagination-info">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, AUDIT_ENTRIES.length)} of {AUDIT_ENTRIES.length} entries
          </div>
          <div className="eco-datagrid__pagination-buttons">
            <button className="eco-btn eco-btn--secondary eco-datagrid__pagination-btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page">\u2039</button>
            <span className="eco-datagrid__pagination-page">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button className="eco-btn eco-btn--secondary eco-datagrid__pagination-btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page">\u203a</button>
          </div>
        </div>
      </div>
    </section>
  );
}
