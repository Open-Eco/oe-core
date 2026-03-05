"use client";

import React, { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ExportCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  progress?: number;
  primaryAction: string;
  secondaryAction?: string;
  badge?: string;
}

type AnalyzeTab = "reduction-plans" | "scenarios" | "projects";

// ── Static Data ───────────────────────────────────────────────────────────────

const BarChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="12" width="4" height="9" fill="#1A6F8A" />
    <rect x="10" y="7" width="4" height="14" fill="#138A4F" />
    <rect x="17" y="4" width="4" height="17" fill="#0F9D58" />
  </svg>
);

const CloudIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 15a4 4 0 0 0 4 4h9.5A4.5 4.5 0 0 0 21 14.5c0-2.33-1.79-4.24-4.08-4.46A7 7 0 0 0 4.13 12"
      stroke="#1A6F8A"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
      stroke="#138A4F"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 2v6h6" stroke="#138A4F" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 13h8M8 17h5" stroke="#138A4F" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"
      stroke="#F4B400"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EXPORT_CARDS: ExportCard[] = [
  {
    id: "utilities",
    icon: <BarChartIcon />,
    title: "Utilities",
    description: "Exportthis acaea 1 and activities",
    progress: 65,
    primaryAction: "Details",
    badge: "£ CSQ + CO₂·e",
  },
  {
    id: "crrd-export",
    icon: <FileIcon />,
    title: "CRRD Export",
    description: "Export to CSRD format",
    progress: 80,
    primaryAction: "CSV + PDF",
    secondaryAction: "Share",
  },
  {
    id: "tcd-export",
    icon: <FileIcon />,
    title: "TCD Export",
    description: "Export to TCPD format",
    progress: 72,
    primaryAction: "CSV + PDF",
    secondaryAction: "Export",
  },
  {
    id: "travel",
    icon: <CloudIcon />,
    title: "Travel",
    description: "Export to Comage Vehicles",
    progress: 55,
    primaryAction: "Details",
    badge: "£ CSQ + CO₂·e",
  },
  {
    id: "cp-export",
    icon: <FileIcon />,
    title: "CP Export",
    description: "Export to CDP format",
    progress: 90,
    primaryAction: "CSV + PDF",
    secondaryAction: "Share",
  },
  {
    id: "gri-export",
    icon: <ZapIcon />,
    title: "GRI Export",
    description: "Export to TCPD format",
    progress: 68,
    primaryAction: "CSV + PDF",
    secondaryAction: "Share",
  },
];

// ── Export Card Component ──────────────────────────────────────────────────────

export function AnalyzeExportCard({ card }: { card: ExportCard }) {
  return (
    <div className="analyze-card" data-testid={`export-card-${card.id}`}>
      <div className="analyze-card__header">
        <div className="analyze-card__icon">{card.icon}</div>
        <h4 className="analyze-card__title">{card.title}</h4>
        <button className="analyze-card__expand" aria-label="Expand" type="button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <p className="analyze-card__desc">{card.description}</p>
      {card.progress !== undefined && (
        <div className="analyze-card__progress">
          <div
            className="analyze-card__progress-bar"
            role="progressbar"
            aria-valuenow={card.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: `${card.progress}%` }}
          />
        </div>
      )}
      <div className="analyze-card__actions">
        {card.badge && (
          <span className="analyze-card__badge">{card.badge}</span>
        )}
        <button className="analyze-card__btn analyze-card__btn--primary" type="button">
          {card.primaryAction}
        </button>
        {card.secondaryAction && (
          <button className="analyze-card__btn analyze-card__btn--secondary" type="button">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 2v8M5 7l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect
                x="2"
                y="12"
                width="12"
                height="2"
                rx="1"
                fill="currentColor"
              />
            </svg>
            {card.secondaryAction}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Tab Component ─────────────────────────────────────────────────────────────

interface AnalyzeTabsProps {
  active: AnalyzeTab;
  onChange: (t: AnalyzeTab) => void;
}

export function AnalyzeTabs({ active, onChange }: AnalyzeTabsProps) {
  const tabs: { id: AnalyzeTab; label: string }[] = [
    { id: "reduction-plans", label: "Reduction Plans" },
    { id: "scenarios", label: "Scenarios" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <nav className="analyze-tabs" role="tablist" aria-label="Analyze sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          className={`analyze-tab ${active === tab.id ? "analyze-tab--active" : ""}`}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

// ── Main Analyze Page ─────────────────────────────────────────────────────────

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState<AnalyzeTab>("reduction-plans");

  return (
    <section className="dash-page" data-testid="analyze-page">
      <header className="dash-page__header">
        <h2 className="dash-page__title">Analyze</h2>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button className="dash-btn dash-btn--outline" type="button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 14V6M6 10l4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect
                x="3"
                y="16"
                width="14"
                height="1.5"
                rx="0.75"
                fill="currentColor"
              />
            </svg>
            Export
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
          <button
            className="dash-btn dash-btn--icon"
            type="button"
            aria-label="More options"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="4" r="1.5" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="10" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      <AnalyzeTabs active={activeTab} onChange={setActiveTab} />

      <div
        className="analyze-grid"
        role="tabpanel"
        aria-label={activeTab}
      >
        {EXPORT_CARDS.map((card) => (
          <AnalyzeExportCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
