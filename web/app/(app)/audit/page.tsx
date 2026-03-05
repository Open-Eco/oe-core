"use client";

import React, { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Static Demo Data ──────────────────────────────────────────────────────────

const AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "1",
    activity: "Electricity – HQ",
    category: "DEFRA 2023",
    factor: "DEFRA 2023",
    method: "Location-based",
    result: "320 t CO₂e",
    status: "approved",
    detail: {
      rows: [
        {
          label: "Quantity",
          source: "120,000 KWh",
          factor: "Jan–Dec 2024",
          method: "Location-based",
          status: "approved",
        },
        {
          label: "Location",
          source: "HQ – Berlin",
          factor: "Utility invoices",
          method: "uploaded",
          status: "approved",
        },
        {
          label: "Electricity — HQ",
          source: "2024-2023",
          factor: "",
          method: "",
          status: "approved",
          result: "",
        },
        { label: "Activity Data", source: "Source", factor: "DEFRA 2023", method: "DEFRA" },
        { label: "Transformation", source: "L. hWh", factor: "Stup × 2. kWh", method: "DEFRA" },
        { label: "Emission Factor", source: "Source", factor: "DEFRA  2023", method: "DEFRA" },
        {
          label: "Calculation",
          source: "› Activity × Factor",
          factor: "320 t CO₂e",
          method: "",
          result: "330 t CO₂e",
        },
        {
          label: "Approval",
          source: "J. Smith",
          factor: "J. Smith",
          method: "",
          status: "approved",
        },
        {
          label: "Approved",
          source: "A. Patel",
          factor: "2024-03-12",
          method: "",
          status: "flagged",
        },
      ],
    },
  },
  {
    id: "2",
    activity: "Fleet Diesel",
    category: "Fuel",
    factor: "EPA 2022",
    method: "Combustion",
    result: "180 t CO₂e",
    status: "approved",
  },
  {
    id: "3",
    activity: "Business Flights",
    category: "Travel",
    factor: "DEFRA 2023",
    method: "Distance-based",
    result: "95 t CO₂e",
    status: "reviewed",
  },
  {
    id: "4",
    activity: "Employee Commute",
    category: "Travel",
    factor: "Modeled",
    method: "Survey-based",
    result: "45 t CO₂e",
    status: "flagged",
  },
];

const EVIDENCE_ATTACHMENTS: EvidenceAttachment[] = [
  {
    id: "1",
    filename: "Electricity_Invoice_Jan2024.pdf",
    uploadedBy: "J. Smith",
    uploadedAt: "2024-02-01",
    ago: "Last.kgo",
  },
  {
    id: "2",
    filename: "Electricity_Invoice_Feb2024.pdf",
    uploadedBy: "J. Smith",
    uploadedAt: "2024-02-31",
    ago: "Last.ago",
  },
  {
    id: "3",
    filename: "Meter_Readings_2024.xlsx",
    uploadedBy: "A. Patel",
    uploadedAt: "2024-02-01",
    ago: "Last.lgo",
  },
];

const CHANGE_HISTORY: ChangeHistoryEntry[] = [
  {
    id: "1",
    description: "Quantity updated",
    detail: "(00300 → (20,009)",
  },
  {
    id: "2",
    description: "Emission factor updated",
    detail: "(DEFRA 2022 -1-DEFRA 3546)",
  },
  {
    id: "3",
    description: "Approved by Admin",
    date: "2024-03-12",
  },
];

// ── Status Badge ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AuditStatus,
  { label: string; bg: string; color: string }
> = {
  approved: { label: "Approved", bg: "#138A4F", color: "#fff" },
  reviewed: { label: "Reviewed", bg: "#1A6F8A", color: "#fff" },
  flagged: { label: "Flagged", bg: "#F4B400", color: "#0F1A1C" },
  pending: { label: "Pending", bg: "#7A8C8E", color: "#fff" },
};

export function AuditStatusBadge({
  status,
  dropdown = false,
}: {
  status: AuditStatus;
  dropdown?: boolean;
}) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="audit-status-badge"
      style={{ background: cfg.bg, color: cfg.color }}
      data-testid={`audit-status-${status}`}
    >
      {cfg.label}
      {dropdown && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          style={{ marginLeft: 4 }}
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
}

// ── Evidence & History Panel ──────────────────────────────────────────────────

interface EvidencePanelProps {
  attachments: EvidenceAttachment[];
  history: ChangeHistoryEntry[];
  onClose?: () => void;
}

export function EvidencePanel({ attachments, history }: EvidencePanelProps) {
  return (
    <div className="audit-evidence-panel" data-testid="evidence-panel">
      <div className="audit-evidence-panel__header">
        <h3 className="audit-evidence-panel__title">Evidence &amp; History</h3>
        <button
          className="audit-evidence-panel__more"
          type="button"
          aria-label="More options"
        >
          <svg
            width="16"
            height="16"
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
      </div>

      {/* Evidence Attachments */}
      <section className="audit-evidence-section">
        <h4 className="audit-evidence-section__title">Evidence Attachments</h4>
        <ul className="audit-evidence-list">
          {attachments.map((a) => (
            <li key={a.id} className="audit-evidence-item">
              <div className="audit-evidence-item__icon" aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M4 4h8l4 4v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path d="M12 4v4h4" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
              <div className="audit-evidence-item__info">
                <span className="audit-evidence-item__name">{a.filename}</span>
                <span className="audit-evidence-item__meta">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="10"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path d="M4 6h4M4 8h2" stroke="currentColor" strokeWidth="1.2" />
                  </svg>{" "}
                  {a.uploadedBy} {a.uploadedAt} {a.ago}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <button
          className="audit-evidence-see-more"
          type="button"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M8 5v3l2 2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>{" "}
          4 Chaing Fislory new
        </button>
      </section>

      {/* Change History */}
      <section className="audit-evidence-section">
        <h4 className="audit-evidence-section__title">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            style={{ marginRight: 6 }}
          >
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M8 5v3l2 2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          Change History
        </h4>
        <ul className="audit-history-list">
          {history.map((h) => (
            <li key={h.id} className="audit-history-item">
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="audit-history-item__icon"
              >
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
                <path
                  d="M8 5v3l2 2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <span className="audit-history-item__desc">{h.description}</span>
                {h.detail && (
                  <span className="audit-history-item__detail"> {h.detail}</span>
                )}
                {h.date && (
                  <div className="audit-history-item__date">{h.date}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ── Expanded Row ──────────────────────────────────────────────────────────────

interface ExpandedRowProps {
  entry: AuditEntry;
}

export function AuditExpandedRow({ entry }: ExpandedRowProps) {
  if (!entry.detail) return null;
  return (
    <div className="audit-expanded" data-testid={`audit-expanded-${entry.id}`}>
      <div className="audit-expanded__main">
        <div className="audit-expanded__row-header">
          <input type="checkbox" checked readOnly className="audit-expanded__checkbox" />
          <strong className="audit-expanded__title">{entry.activity}</strong>
          <AuditStatusBadge status={entry.status} dropdown />
        </div>
        <table className="audit-expanded__table" aria-label="Activity details">
          <thead>
            <tr>
              <th>Activity Data</th>
              <th>Transformation</th>
              <th>Factor</th>
              <th>Method</th>
              <th>Result</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {entry.detail.rows.map((row, i) => (
              <tr key={i}>
                <td className="audit-expanded__label">{row.label}</td>
                <td>{row.source || ""}</td>
                <td>{row.factor || ""}</td>
                <td>{row.method || ""}</td>
                <td>{row.result || ""}</td>
                <td>
                  {row.status && <AuditStatusBadge status={row.status} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="audit-expanded__footer">
          <span>Showing 1</span>
          <button type="button">▼</button>
          <span>1 to 4 of 20 entries</span>
          <div className="dash-pagination">
            <button type="button" className="dash-pagination__btn">‹</button>
            <button type="button" className="dash-pagination__btn dash-pagination__btn--active">1</button>
            <button type="button" className="dash-pagination__btn">›</button>
          </div>
        </div>
      </div>
      <EvidencePanel
        attachments={EVIDENCE_ATTACHMENTS}
        history={CHANGE_HISTORY}
      />
    </div>
  );
}

// ── Main Audit Page ───────────────────────────────────────────────────────────

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>("1");
  const [page, setPage] = useState(1);
  const totalPages = 2;
  const totalEntries = 20;

  const filteredEntries = AUDIT_ENTRIES.filter(
    (e) =>
      search === "" ||
      e.activity.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="dash-page" data-testid="audit-page">
      {/* Page Header */}
      <header className="dash-page__header">
        <div>
          <h2 className="dash-page__title">Audit &amp; Data Lineage</h2>
          <p className="dash-page__subtitle">
            Track the full journey from raw activity data to final emissions numbers.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="dash-btn dash-btn--primary" type="button">
            Export Audit Pack
          </button>
          <button className="dash-btn dash-btn--outline" type="button">
            Download Evidence Index
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="audit-toolbar">
        <div className="audit-toolbar__search">
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="audit-toolbar__search-icon"
          >
            <circle
              cx="9"
              cy="9"
              r="6"
              stroke="#7A8C8E"
              strokeWidth="1.8"
            />
            <path
              d="M15 15l-3.5-3.5"
              stroke="#7A8C8E"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            placeholder="Search"
            className="audit-toolbar__search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search audit entries"
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button className="dash-btn dash-btn--outline" type="button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="2"
                width="16"
                height="16"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M6 10h8M10 6v8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            Export Audit Pack
          </button>
          <button
            className="dash-btn dash-btn--icon"
            type="button"
            aria-label="Refresh"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 10a6 6 0 1 1 1.5 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M4 14v-4h4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="dash-btn dash-btn--icon"
            type="button"
            aria-label="Grid view"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
              <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
              <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
              <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <span className="audit-toolbar__count">1</span>
          <select className="dash-filter-bar__select" aria-label="Next actions">
            <option>Next</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="audit-table-wrap">
        <table className="audit-table" aria-label="Audit entries">
          <thead>
            <tr>
              <th className="audit-table__th-check" />
              <th>
                Activity
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  style={{ marginLeft: 4 }}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </th>
              <th>Category</th>
              <th>Factor</th>
              <th>Method</th>
              <th>Result</th>
              <th>Status</th>
              <th>
                Status
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  style={{ marginLeft: 4 }}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <React.Fragment key={entry.id}>
                <tr
                  className={`audit-table__row ${
                    expandedId === entry.id ? "audit-table__row--expanded" : ""
                  }`}
                  onClick={() =>
                    setExpandedId(expandedId === entry.id ? null : entry.id)
                  }
                  aria-expanded={expandedId === entry.id}
                >
                  <td
                    className="audit-table__td-check"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(entry.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(entry.id)}
                      onChange={() => toggleSelect(entry.id)}
                      aria-label={`Select ${entry.activity}`}
                    />
                  </td>
                  <td className="audit-table__activity">
                    <strong>{entry.activity}</strong>
                  </td>
                  <td>{entry.category}</td>
                  <td>{entry.factor}</td>
                  <td>{entry.method}</td>
                  <td className="audit-table__result">{entry.result}</td>
                  <td>
                    <AuditStatusBadge status={entry.status} />
                  </td>
                  <td>
                    <AuditStatusBadge status={entry.status} dropdown />
                  </td>
                </tr>
                {expandedId === entry.id && entry.detail && (
                  <tr className="audit-table__expand-row">
                    <td colSpan={8} className="audit-table__expand-cell">
                      <AuditExpandedRow entry={entry} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Table Footer */}
        <div className="dash-table__footer">
          <span className="dash-table__info">
            Showing 1 to {filteredEntries.length} of {totalEntries} entries
          </span>
          <div className="dash-pagination">
            <button
              className="dash-pagination__btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setPage(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            ))}
            <button
              className="dash-pagination__btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
