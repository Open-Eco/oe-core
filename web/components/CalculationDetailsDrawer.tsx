'use client';

import React, { useEffect } from 'react';

export interface EmissionResult {
  id: string;
  scope: string;
  category: string;
  co2e: number;
  periodStart: string | Date;
  periodEnd: string | Date;
  methodology: string;
  datasetVersion: string;
  calculationVersion?: string;
  createdAt: string | Date;
  activityDataId?: string;
  activityData?: {
    id: string;
    activityType: string;
    quantity: number;
    unit: string;
    category: string;
    subcategory?: string;
  };
}

interface CalculationDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  emission: EmissionResult | null;
}

export function CalculationDetailsDrawer({
  isOpen,
  onClose,
  emission,
}: CalculationDetailsDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!emission) return null;

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="calculation-drawer__backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`calculation-drawer ${isOpen ? 'calculation-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calculation-drawer-title"
      >
        {/* Header */}
        <div className="calculation-drawer__header">
          <h2 id="calculation-drawer-title" className="calculation-drawer__title">
            Calculation Details
          </h2>
          <button
            className="calculation-drawer__close"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="calculation-drawer__content">
          {/* Emission Summary */}
          <section className="calculation-drawer__section">
            <h3 className="calculation-drawer__section-title">Emission Summary</h3>
            <div className="calculation-drawer__grid">
              <div className="calculation-drawer__field">
                <span className="calculation-drawer__label">Scope</span>
                <span className="calculation-drawer__value">Scope {emission.scope}</span>
              </div>
              <div className="calculation-drawer__field">
                <span className="calculation-drawer__label">Category</span>
                <span className="calculation-drawer__value">{emission.category}</span>
              </div>
              <div className="calculation-drawer__field">
                <span className="calculation-drawer__label">CO₂e</span>
                <span className="calculation-drawer__value calculation-drawer__value--emission">
                  {emission.co2e.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  tCO₂e
                </span>
              </div>
              <div className="calculation-drawer__field">
                <span className="calculation-drawer__label">Period</span>
                <span className="calculation-drawer__value">
                  {formatDate(emission.periodStart)} - {formatDate(emission.periodEnd)}
                </span>
              </div>
            </div>
          </section>

          {/* Activity Data */}
          {emission.activityData && (
            <section className="calculation-drawer__section">
              <h3 className="calculation-drawer__section-title">Activity Data</h3>
              <div className="calculation-drawer__grid">
                <div className="calculation-drawer__field">
                  <span className="calculation-drawer__label">Activity Type</span>
                  <span className="calculation-drawer__value">
                    {emission.activityData.activityType}
                  </span>
                </div>
                <div className="calculation-drawer__field">
                  <span className="calculation-drawer__label">Quantity</span>
                  <span className="calculation-drawer__value">
                    {emission.activityData.quantity.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    {emission.activityData.unit}
                  </span>
                </div>
                {emission.activityData.subcategory && (
                  <div className="calculation-drawer__field">
                    <span className="calculation-drawer__label">Subcategory</span>
                    <span className="calculation-drawer__value">
                      {emission.activityData.subcategory}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Methodology & Factors */}
          <section className="calculation-drawer__section">
            <h3 className="calculation-drawer__section-title">Methodology & Factors</h3>
            <div className="calculation-drawer__grid">
              <div className="calculation-drawer__field">
                <span className="calculation-drawer__label">Methodology</span>
                <span className="calculation-drawer__value">{emission.methodology}</span>
              </div>
              <div className="calculation-drawer__field">
                <span className="calculation-drawer__label">Factor Dataset</span>
                <span className="calculation-drawer__value">{emission.datasetVersion}</span>
              </div>
              {emission.calculationVersion && (
                <div className="calculation-drawer__field">
                  <span className="calculation-drawer__label">Calculation Engine</span>
                  <span className="calculation-drawer__value">
                    v{emission.calculationVersion}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Metadata */}
          <section className="calculation-drawer__section">
            <h3 className="calculation-drawer__section-title">Metadata</h3>
            <div className="calculation-drawer__grid">
              <div className="calculation-drawer__field">
                <span className="calculation-drawer__label">Calculated At</span>
                <span className="calculation-drawer__value">
                  {formatDateTime(emission.createdAt)}
                </span>
              </div>
              <div className="calculation-drawer__field">
                <span className="calculation-drawer__label">Calculation ID</span>
                <span className="calculation-drawer__value calculation-drawer__value--mono">
                  {emission.id}
                </span>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="calculation-drawer__section">
            <div className="calculation-drawer__actions">
              <a
                href={`/factors?dataset=${encodeURIComponent(emission.datasetVersion)}`}
                className="eco-button eco-button--ghost"
              >
                View Factor Library
              </a>
              <button
                className="eco-button eco-button--primary"
                onClick={() => {
                  // TODO: Implement export calculation details
                  console.log('Export calculation details', emission.id);
                }}
              >
                Export Details
              </button>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .calculation-drawer__backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn var(--duration-normal) var(--easing-ease-out);
        }

        .calculation-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 600px;
          background: var(--background);
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform var(--duration-normal) var(--easing-ease-out);
        }

        .calculation-drawer--open {
          transform: translateX(0);
        }

        .calculation-drawer__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-6);
          border-bottom: 1px solid var(--neutral-300);
        }

        .calculation-drawer__title {
          font-size: var(--text-xl);
          font-weight: var(--font-weight-bold);
          color: var(--foreground);
          margin: 0;
        }

        .calculation-drawer__close {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-2);
          color: var(--neutral-500);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          transition: background-color var(--duration-fast);
        }

        .calculation-drawer__close:hover {
          background: var(--neutral-100);
          color: var(--foreground);
        }

        .calculation-drawer__content {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-6);
        }

        .calculation-drawer__section {
          margin-bottom: var(--space-8);
        }

        .calculation-drawer__section:last-child {
          margin-bottom: 0;
        }

        .calculation-drawer__section-title {
          font-size: var(--text-lg);
          font-weight: var(--font-weight-medium);
          color: var(--foreground);
          margin: 0 0 var(--space-4) 0;
        }

        .calculation-drawer__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
        }

        .calculation-drawer__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .calculation-drawer__label {
          font-size: var(--text-sm);
          color: var(--neutral-500);
          font-weight: var(--font-weight-medium);
        }

        .calculation-drawer__value {
          font-size: var(--text-md);
          color: var(--foreground);
        }

        .calculation-drawer__value--emission {
          font-size: var(--text-lg);
          font-weight: var(--font-weight-bold);
          color: var(--brand-green-600);
        }

        .calculation-drawer__value--mono {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--neutral-500);
        }

        .calculation-drawer__actions {
          display: flex;
          gap: var(--space-4);
          margin-top: var(--space-4);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .calculation-drawer {
            max-width: 100%;
          }

          .calculation-drawer__grid {
            grid-template-columns: 1fr;
          }

          .calculation-drawer__actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
