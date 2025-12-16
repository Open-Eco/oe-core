'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { StatusBadge, Status } from '@/components/StatusBadge';
import { ApprovalActions } from '@/components/ApprovalActions';
import { ChangeHistory } from '@/components/ChangeHistory';

interface ReportingPeriod {
  id: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  status: Status;
  submittedAt: string | null;
  approvedAt: string | null;
  lockedAt: string | null;
  _count: {
    activityData: number;
  };
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

export default function PeriodsPage() {
  const { data: session } = useSession();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [periods, setPeriods] = useState<ReportingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('ORG_MEMBER');

  // Form state
  const [newPeriod, setNewPeriod] = useState({
    name: '',
    periodStart: '',
    periodEnd: '',
  });

  // Fetch organizations
  useEffect(() => {
    async function fetchOrgs() {
      try {
        const res = await fetch('/api/organizations');
        if (res.ok) {
          const data = await res.json();
          setOrganizations(data.organizations || []);
          if (data.organizations?.length > 0) {
            setSelectedOrg(data.organizations[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    }
    fetchOrgs();
  }, []);

  // Fetch periods when org changes
  useEffect(() => {
    async function fetchPeriods() {
      if (!selectedOrg) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/reporting-periods?organizationId=${selectedOrg}`);
        if (res.ok) {
          const data = await res.json();
          setPeriods(data.periods || []);
        }
      } catch (error) {
        console.error('Error fetching periods:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPeriods();
  }, [selectedOrg]);

  const handleCreatePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reporting-periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: selectedOrg,
          ...newPeriod,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPeriods([data.period, ...periods]);
        setShowCreateForm(false);
        setNewPeriod({ name: '', periodStart: '', periodEnd: '' });
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create period');
      }
    } catch (error) {
      console.error('Error creating period:', error);
      alert('Failed to create period');
    }
  };

  const handlePeriodAction = async (periodId: string, action: string, comment?: string) => {
    try {
      const res = await fetch(`/api/reporting-periods/${periodId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });

      if (res.ok) {
        const data = await res.json();
        setPeriods(periods.map((p) => (p.id === periodId ? { ...p, ...data.period } : p)));
      } else {
        const error = await res.json();
        alert(error.error || `Failed to ${action} period`);
      }
    } catch (error) {
      console.error(`Error ${action} period:`, error);
      alert(`Failed to ${action} period`);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="periods-page">
      <div className="page-header">
        <div>
          <h1>Reporting Periods</h1>
          <p>Manage your reporting periods and approval workflow</p>
        </div>
        <div className="header-actions">
          <select
            className="eco-select__input"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <button
            className="eco-btn eco-btn--primary"
            onClick={() => setShowCreateForm(true)}
          >
            + New Period
          </button>
        </div>
      </div>

      {/* Create Period Form */}
      {showCreateForm && (
        <div className="create-form-card">
          <h3>Create Reporting Period</h3>
          <form onSubmit={handleCreatePeriod}>
            <div className="form-row">
              <label className="eco-label">
                Period Name
                <input
                  type="text"
                  className="eco-input"
                  placeholder="e.g., Q1 2024, FY 2024"
                  value={newPeriod.name}
                  onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className="form-row form-row--inline">
              <label className="eco-label">
                Start Date
                <input
                  type="date"
                  className="eco-input eco-date-input"
                  value={newPeriod.periodStart}
                  onChange={(e) => setNewPeriod({ ...newPeriod, periodStart: e.target.value })}
                  required
                />
              </label>
              <label className="eco-label">
                End Date
                <input
                  type="date"
                  className="eco-input eco-date-input"
                  value={newPeriod.periodEnd}
                  onChange={(e) => setNewPeriod({ ...newPeriod, periodEnd: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="eco-btn eco-btn--secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="eco-btn eco-btn--primary">
                Create Period
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Periods List */}
      {loading ? (
        <div className="loading">Loading periods...</div>
      ) : periods.length === 0 ? (
        <div className="empty-state">
          <p>No reporting periods yet.</p>
          <button
            className="eco-btn eco-btn--primary"
            onClick={() => setShowCreateForm(true)}
          >
            Create your first period
          </button>
        </div>
      ) : (
        <div className="periods-grid">
          {periods.map((period) => (
            <div
              key={period.id}
              className={`period-card ${selectedPeriod === period.id ? 'period-card--selected' : ''}`}
            >
              <div className="period-header">
                <h3>{period.name}</h3>
                <StatusBadge status={period.status} />
              </div>
              <div className="period-dates">
                {formatDate(period.periodStart)} — {formatDate(period.periodEnd)}
              </div>
              <div className="period-stats">
                <span>{period._count.activityData} activities</span>
              </div>
              <div className="period-timestamps">
                {period.submittedAt && (
                  <div className="timestamp">
                    Submitted: {formatDate(period.submittedAt)}
                  </div>
                )}
                {period.approvedAt && (
                  <div className="timestamp">
                    Approved: {formatDate(period.approvedAt)}
                  </div>
                )}
                {period.lockedAt && (
                  <div className="timestamp">
                    Locked: {formatDate(period.lockedAt)}
                  </div>
                )}
              </div>
              <div className="period-actions">
                <ApprovalActions
                  resourceType="reporting_period"
                  resourceId={period.id}
                  currentStatus={period.status}
                  userRole={userRole}
                  onAction={(action, comment) => handlePeriodAction(period.id, action, comment)}
                />
                <button
                  className="eco-btn eco-btn--ghost eco-btn--sm"
                  onClick={() => setSelectedPeriod(selectedPeriod === period.id ? null : period.id)}
                >
                  {selectedPeriod === period.id ? 'Hide History' : 'View History'}
                </button>
              </div>
              {selectedPeriod === period.id && (
                <div className="period-history">
                  <ChangeHistory
                    organizationId={selectedOrg}
                    resourceType="reporting_period"
                    resourceId={period.id}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .periods-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .page-header h1 {
          margin: 0 0 0.25rem 0;
        }

        .page-header p {
          margin: 0;
          color: var(--neutral-600);
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .create-form-card {
          background: white;
          border: 1px solid var(--neutral-200);
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .create-form-card h3 {
          margin: 0 0 1rem 0;
        }

        .form-row {
          margin-bottom: 1rem;
        }

        .form-row--inline {
          display: flex;
          gap: 1rem;
        }

        .form-row--inline > label {
          flex: 1;
        }

        .form-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        .loading,
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--neutral-500);
        }

        .empty-state button {
          margin-top: 1rem;
        }

        .periods-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        }

        .period-card {
          background: white;
          border: 1px solid var(--neutral-200);
          border-radius: 0.5rem;
          padding: 1.25rem;
          transition: box-shadow 0.2s;
        }

        .period-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .period-card--selected {
          border-color: var(--brand-blue-400);
        }

        .period-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .period-header h3 {
          margin: 0;
          font-size: 1.125rem;
        }

        .period-dates {
          color: var(--neutral-600);
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .period-stats {
          font-size: 0.75rem;
          color: var(--neutral-500);
          margin-bottom: 0.75rem;
        }

        .period-timestamps {
          font-size: 0.75rem;
          color: var(--neutral-500);
          margin-bottom: 1rem;
        }

        .timestamp {
          margin-bottom: 0.25rem;
        }

        .period-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .period-history {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--neutral-200);
        }
      `}</style>
    </div>
  );
}

