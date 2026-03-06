/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock recharts to avoid canvas issues in jsdom
jest.mock('recharts', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    PieChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
    Pie: () => null,
    Cell: () => null,
    BarChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
    ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

import DashboardPage, {
  EmissionKpiCard,
  DashboardFilterBar,
  TopEmittersTable,
  type DashboardFilters,
  type TopEmitter,
} from '../app/(app)/dashboard/page';

// ── EmissionKpiCard ───────────────────────────────────────────────────────────

describe('EmissionKpiCard', () => {
  it('renders label and value', () => {
    render(
      <EmissionKpiCard label="Total Emissions" value="1,203" unit="CO₂e" />
    );
    expect(screen.getByText('Total Emissions')).toBeInTheDocument();
    expect(screen.getByText('1,203')).toBeInTheDocument();
    expect(screen.getByText('CO₂e')).toBeInTheDocument();
  });

  it('renders optional subtitle', () => {
    render(
      <EmissionKpiCard label="Total" value="500" unit="tCO₂e" sub="3.1 t,120₂e" />
    );
    expect(screen.getByText('3.1 t,120₂e')).toBeInTheDocument();
  });

  it('renders positive delta badge', () => {
    render(
      <EmissionKpiCard label="Scope 1" value="500" unit="CO₂" delta="+10%" deltaPositive />
    );
    const badge = screen.getByText('+10%');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('delta--up');
  });

  it('renders negative delta badge', () => {
    render(
      <EmissionKpiCard
        label="Scope 2"
        value="300"
        unit="CO₂"
        delta="-5%"
        deltaPositive={false}
      />
    );
    const badge = screen.getByText('-5%');
    expect(badge.className).toContain('delta--down');
  });

  it('has accessible data-testid', () => {
    render(<EmissionKpiCard label="Scope 3" value="200" unit="CO₂e" />);
    expect(screen.getByTestId('kpi-card')).toBeInTheDocument();
  });
});

// ── Status Badge (rendered inside TopEmittersTable via EcoDataGrid) ───────────

describe('Status badges in TopEmittersTable', () => {
  const emitters: TopEmitter[] = [
    { id: '1', category: 'Utilities', subcategory: 'Electricity', co2e: 330, unit: 'CO₂', scope: 'Diesel', status: 'approved' },
  ];

  it('renders "Approved" badge with correct testid', () => {
    render(<TopEmittersTable data={emitters} />);
    expect(screen.getByTestId('status-pill-approved')).toHaveTextContent('Approved');
  });

  it('renders "Flagged" badge', () => {
    const flaggedEmitter: TopEmitter[] = [
      { id: '2', category: 'Travel', subcategory: 'Flights', co2e: 150, unit: 'CO₂', scope: 'Company', status: 'flagged' },
    ];
    render(<TopEmittersTable data={flaggedEmitter} />);
    expect(screen.getByText('Flagged')).toBeInTheDocument();
  });

  it('renders "Reviewed" badge', () => {
    const reviewedEmitter: TopEmitter[] = [
      { id: '3', category: 'Utilities', subcategory: 'Diesel', co2e: 150, unit: 'CO₂', scope: 'Travel', status: 'reviewed' },
    ];
    render(<TopEmittersTable data={reviewedEmitter} />);
    expect(screen.getByText('Reviewed')).toBeInTheDocument();
  });
});

// ── DashboardFilterBar ────────────────────────────────────────────────────────

describe('DashboardFilterBar', () => {
  const defaultFilters: DashboardFilters = {
    year: '2024',
    location: 'all',
    scope: 'all',
    unit: 'tco2e',
  };

  it('renders all filter controls', () => {
    render(
      <DashboardFilterBar
        filters={defaultFilters}
        onChange={jest.fn()}
        onApply={jest.fn()}
      />
    );
    expect(screen.getByLabelText('Year')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Scope')).toBeInTheDocument();
    expect(screen.getByLabelText('Unit')).toBeInTheDocument();
    expect(screen.getByTestId('filter-apply')).toBeInTheDocument();
  });

  it('calls onApply when Apply button is clicked', () => {
    const onApply = jest.fn();
    render(
      <DashboardFilterBar
        filters={defaultFilters}
        onChange={jest.fn()}
        onApply={onApply}
      />
    );
    fireEvent.click(screen.getByTestId('filter-apply'));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when year filter changes', () => {
    const onChange = jest.fn();
    render(
      <DashboardFilterBar
        filters={defaultFilters}
        onChange={onChange}
        onApply={jest.fn()}
      />
    );
    fireEvent.change(screen.getByLabelText('Year'), { target: { value: '2023' } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, year: '2023' });
  });

  it('calls onChange when scope filter changes', () => {
    const onChange = jest.fn();
    render(
      <DashboardFilterBar
        filters={defaultFilters}
        onChange={onChange}
        onApply={jest.fn()}
      />
    );
    fireEvent.change(screen.getByLabelText('Scope'), { target: { value: '1' } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, scope: '1' });
  });

  it('has accessible data-testid', () => {
    render(
      <DashboardFilterBar
        filters={defaultFilters}
        onChange={jest.fn()}
        onApply={jest.fn()}
      />
    );
    expect(screen.getByTestId('dashboard-filter-bar')).toBeInTheDocument();
  });
});

// ── TopEmittersTable ──────────────────────────────────────────────────────────

describe('TopEmittersTable', () => {
  const emitters: TopEmitter[] = [
    {
      id: '1',
      category: 'Utilities',
      subcategory: 'Electricity',
      co2e: 330,
      unit: 'CO₂',
      scope: 'Diesel',
      status: 'approved',
    },
    {
      id: '2',
      category: 'Travel',
      subcategory: 'Flights',
      co2e: 150,
      unit: 'CO₂',
      scope: 'Company',
      status: 'flagged',
    },
  ];

  it('renders table heading', () => {
    render(<TopEmittersTable data={emitters} />);
    expect(screen.getByTestId('top-emitters-table')).toBeInTheDocument();
    expect(screen.getByText('Top Emitters')).toBeInTheDocument();
  });

  it('renders all emitter rows', () => {
    render(<TopEmittersTable data={emitters} />);
    expect(screen.getByText('Utilities')).toBeInTheDocument();
    expect(screen.getByText('Electricity')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Flights')).toBeInTheDocument();
  });

  it('renders status badges', () => {
    render(<TopEmittersTable data={emitters} />);
    expect(screen.getByTestId('status-pill-approved')).toBeInTheDocument();
    expect(screen.getByTestId('status-pill-flagged')).toBeInTheDocument();
  });

  it('renders TanStack Table column headers', () => {
    render(<TopEmittersTable data={emitters} />);
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Subcategory')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
});

// ── DashboardPage (integration smoke test) ────────────────────────────────────

describe('DashboardPage', () => {
  it('renders without crashing', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('shows the page title', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders kpi cards', () => {
    render(<DashboardPage />);
    const cards = screen.getAllByTestId('kpi-card');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  it('renders the top emitters table', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('top-emitters-table')).toBeInTheDocument();
  });

  it('renders filter bar', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-filter-bar')).toBeInTheDocument();
  });
});
