/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/navigation for Link usage
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/audit',
}));

import AuditPage, {
  AuditStatusBadge,
  EvidencePanel,
  AuditExpandedRow,
  type AuditEntry,
  type EvidenceAttachment,
  type ChangeHistoryEntry,
} from '../app/(app)/audit/page';

// ── AuditStatusBadge ──────────────────────────────────────────────────────────

describe('AuditStatusBadge', () => {
  it('renders "Approved" badge', () => {
    render(<AuditStatusBadge status="approved" />);
    const badge = screen.getByTestId('audit-status-approved');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Approved');
  });

  it('renders "Reviewed" badge', () => {
    render(<AuditStatusBadge status="reviewed" />);
    expect(screen.getByTestId('audit-status-reviewed')).toHaveTextContent('Reviewed');
  });

  it('renders "Flagged" badge', () => {
    render(<AuditStatusBadge status="flagged" />);
    const badge = screen.getByTestId('audit-status-flagged');
    expect(badge).toHaveTextContent('Flagged');
    // Uses eco-badge--warning class from EcoKit design system
    expect(badge.className).toContain('eco-badge--warning');
  });

  it('shows dropdown chevron when dropdown=true', () => {
    const { container } = render(<AuditStatusBadge status="approved" dropdown />);
    // chevron SVG is rendered
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

// ── EvidencePanel ─────────────────────────────────────────────────────────────

describe('EvidencePanel', () => {
  const attachments: EvidenceAttachment[] = [
    {
      id: '1',
      filename: 'Invoice_Jan2024.pdf',
      uploadedBy: 'J. Smith',
      uploadedAt: '2024-02-01',
      ago: 'Last.kgo',
    },
    {
      id: '2',
      filename: 'Invoice_Feb2024.pdf',
      uploadedBy: 'A. Patel',
      uploadedAt: '2024-03-01',
      ago: '3 days ago',
    },
  ];

  const history: ChangeHistoryEntry[] = [
    { id: '1', description: 'Quantity updated', detail: '(100 → 200)' },
    { id: '2', description: 'Approved by Admin', date: '2024-03-12' },
  ];

  it('renders the panel', () => {
    render(<EvidencePanel attachments={attachments} history={history} />);
    expect(screen.getByTestId('evidence-panel')).toBeInTheDocument();
  });

  it('shows Evidence Attachments heading', () => {
    render(<EvidencePanel attachments={attachments} history={history} />);
    expect(screen.getByText('Evidence Attachments')).toBeInTheDocument();
  });

  it('renders attachment filenames', () => {
    render(<EvidencePanel attachments={attachments} history={history} />);
    expect(screen.getByText('Invoice_Jan2024.pdf')).toBeInTheDocument();
    expect(screen.getByText('Invoice_Feb2024.pdf')).toBeInTheDocument();
  });

  it('shows Change History heading', () => {
    render(<EvidencePanel attachments={attachments} history={history} />);
    expect(screen.getByText('Change History')).toBeInTheDocument();
  });

  it('renders change history entries', () => {
    render(<EvidencePanel attachments={attachments} history={history} />);
    expect(screen.getByText('Quantity updated')).toBeInTheDocument();
    expect(screen.getByText('Approved by Admin')).toBeInTheDocument();
  });

  it('renders history entry detail', () => {
    render(<EvidencePanel attachments={attachments} history={history} />);
    expect(screen.getByText('(100 → 200)')).toBeInTheDocument();
  });

  it('renders history entry date', () => {
    render(<EvidencePanel attachments={attachments} history={history} />);
    expect(screen.getByText('2024-03-12')).toBeInTheDocument();
  });
});

// ── AuditPage ─────────────────────────────────────────────────────────────────

describe('AuditPage', () => {
  it('renders the page', () => {
    render(<AuditPage />);
    expect(screen.getByTestId('audit-page')).toBeInTheDocument();
  });

  it('shows the page title', () => {
    render(<AuditPage />);
    expect(screen.getByText('Audit & Data Lineage')).toBeInTheDocument();
  });

  it('renders Export Audit Pack button', () => {
    render(<AuditPage />);
    // Multiple buttons with this text exist (header + toolbar)
    const btns = screen.getAllByText('Export Audit Pack');
    expect(btns.length).toBeGreaterThanOrEqual(1);
  });

  it('renders search input', () => {
    render(<AuditPage />);
    expect(screen.getByLabelText('Search audit entries')).toBeInTheDocument();
  });

  it('shows audit entries in the table', () => {
    render(<AuditPage />);
    // First occurrence of each entry in the table body
    expect(screen.getAllByText('Electricity – HQ').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Fleet Diesel')).toBeInTheDocument();
    expect(screen.getByText('Business Flights')).toBeInTheDocument();
    expect(screen.getByText('Employee Commute')).toBeInTheDocument();
  });

  it('filters entries by search text', () => {
    render(<AuditPage />);
    const searchInput = screen.getByLabelText('Search audit entries');
    fireEvent.change(searchInput, { target: { value: 'Fleet' } });
    expect(screen.queryByText('Electricity – HQ')).not.toBeInTheDocument();
    expect(screen.getByText('Fleet Diesel')).toBeInTheDocument();
  });

  it('shows evidence panel for first expanded entry', () => {
    render(<AuditPage />);
    // The first row (id=1) starts expanded
    expect(screen.getByTestId('evidence-panel')).toBeInTheDocument();
  });

  it('collapses expanded row on click', () => {
    render(<AuditPage />);
    // Row for Electricity-HQ is initially expanded
    const rows = screen.getAllByRole('row');
    // Click the Electricity-HQ row (index 1, since 0 is the header)
    fireEvent.click(rows[1]);
    expect(screen.queryByTestId('evidence-panel')).not.toBeInTheDocument();
  });

  it('renders pagination controls', () => {
    render(<AuditPage />);
    // TanStack Table renders Previous/Next page controls
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });
});
