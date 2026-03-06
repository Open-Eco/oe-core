'use client';

import React, { useEffect, useState } from 'react';

interface ChangeEvent {
  id: string;
  userId: string;
  userEmail: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: unknown;
  reason: string | null;
  timestamp: string;
}

interface ChangeHistoryProps {
  organizationId: string;
  resourceType?: string;
  resourceId?: string;
}

const actionLabels: Record<string, string> = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  submit: 'Submitted',
  approve: 'Approved',
  reject: 'Rejected',
  lock: 'Locked',
  unlock: 'Unlocked',
};

const actionColors: Record<string, string> = {
  create: 'var(--brand-green-600)',
  update: 'var(--brand-blue-600)',
  delete: 'var(--error-500)',
  submit: 'var(--warning-500)',
  approve: 'var(--success-500)',
  reject: 'var(--error-500)',
  lock: 'var(--neutral-600)',
  unlock: 'var(--brand-blue-600)',
};

export function ChangeHistory({
  organizationId,
  resourceType,
  resourceId,
}: ChangeHistoryProps) {
  const [events, setEvents] = useState<ChangeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const params = new URLSearchParams({ organizationId });
        if (resourceType) params.append('resourceType', resourceType);
        if (resourceId) params.append('resourceId', resourceId);

        const res = await fetch(`/api/change-events?${params}`);
        if (!res.ok) throw new Error('Failed to fetch history');

        const data = await res.json();
        setEvents(data.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [organizationId, resourceType, resourceId]);

  if (loading) {
    return <div className="change-history-loading">Loading history...</div>;
  }

  if (error) {
    return <div className="change-history-error">{error}</div>;
  }

  if (events.length === 0) {
    return <div className="change-history-empty">No history available</div>;
  }

  return (
    <div className="change-history">
      <h4 className="change-history-title">Change History</h4>
      <div className="change-history-list">
        {events.map((event) => (
          <div key={event.id} className="change-history-item">
            <div className="change-history-icon">
              <span
                className="change-history-dot"
                style={{ backgroundColor: actionColors[event.action] || 'var(--neutral-400)' }}
              />
            </div>
            <div className="change-history-content">
              <div className="change-history-header">
                <span className="change-history-action">
                  {actionLabels[event.action] || event.action}
                </span>
                <span className="change-history-time">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="change-history-user">
                by {event.userEmail || event.userId}
              </div>
              {event.reason && (
                <div className="change-history-reason">
                  Reason: {event.reason}
                </div>
              )}
              {event.changes && (
                <details className="change-history-details">
                  <summary>View changes</summary>
                  <pre>{JSON.stringify(event.changes, null, 2)}</pre>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .change-history {
          padding: 1rem;
          background: var(--neutral-50);
          border-radius: 0.5rem;
        }

        .change-history-title {
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-700);
        }

        .change-history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .change-history-item {
          display: flex;
          gap: 0.75rem;
        }

        .change-history-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 0.25rem;
        }

        .change-history-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .change-history-content {
          flex: 1;
          min-width: 0;
        }

        .change-history-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem;
        }

        .change-history-action {
          font-weight: 500;
          color: var(--neutral-900);
        }

        .change-history-time {
          font-size: 0.75rem;
          color: var(--neutral-500);
        }

        .change-history-user {
          font-size: 0.75rem;
          color: var(--neutral-600);
        }

        .change-history-reason {
          font-size: 0.75rem;
          color: var(--neutral-600);
          font-style: italic;
          margin-top: 0.25rem;
        }

        .change-history-details {
          margin-top: 0.5rem;
          font-size: 0.75rem;
        }

        .change-history-details summary {
          cursor: pointer;
          color: var(--brand-blue-600);
        }

        .change-history-details pre {
          margin: 0.5rem 0 0;
          padding: 0.5rem;
          background: white;
          border-radius: 0.25rem;
          overflow-x: auto;
          font-size: 0.625rem;
          max-height: 150px;
          overflow-y: auto;
        }

        .change-history-loading,
        .change-history-error,
        .change-history-empty {
          padding: 1rem;
          text-align: center;
          color: var(--neutral-500);
        }

        .change-history-error {
          color: var(--error-500);
        }
      `}</style>
    </div>
  );
}

