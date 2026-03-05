/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import AnalyzePage, {
  AnalyzeExportCard,
  AnalyzeTabs,
  type ExportCard,
} from '../app/(app)/analyze/page';

// ── AnalyzeExportCard ─────────────────────────────────────────────────────────

describe('AnalyzeExportCard', () => {
  const card: ExportCard = {
    id: 'utilities',
    icon: <span>icon</span>,
    title: 'Utilities',
    description: 'Export this area 1 and activities',
    progress: 65,
    primaryAction: 'Details',
    badge: '£ CSQ + CO₂·e',
  };

  it('renders the card title', () => {
    render(<AnalyzeExportCard card={card} />);
    expect(screen.getByText('Utilities')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<AnalyzeExportCard card={card} />);
    expect(screen.getByText('Export this area 1 and activities')).toBeInTheDocument();
  });

  it('renders primary action button', () => {
    render(<AnalyzeExportCard card={card} />);
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('renders badge text', () => {
    render(<AnalyzeExportCard card={card} />);
    expect(screen.getByText('£ CSQ + CO₂·e')).toBeInTheDocument();
  });

  it('renders progress bar with correct aria attributes', () => {
    render(<AnalyzeExportCard card={card} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '65');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders secondary action when provided', () => {
    const cardWithSecondary: ExportCard = {
      ...card,
      id: 'crrd',
      title: 'CRRD Export',
      description: 'Export to CSRD format',
      primaryAction: 'CSV + PDF',
      secondaryAction: 'Share',
      badge: undefined,
    };
    render(<AnalyzeExportCard card={cardWithSecondary} />);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('does not render secondary action when not provided', () => {
    render(<AnalyzeExportCard card={card} />);
    expect(screen.queryByText('Share')).not.toBeInTheDocument();
    expect(screen.queryByText('Export')).not.toBeInTheDocument();
  });

  it('has accessible data-testid', () => {
    render(<AnalyzeExportCard card={card} />);
    expect(screen.getByTestId('export-card-utilities')).toBeInTheDocument();
  });
});

// ── AnalyzeTabs ───────────────────────────────────────────────────────────────

describe('AnalyzeTabs', () => {
  it('renders all tabs', () => {
    render(<AnalyzeTabs active="reduction-plans" onChange={jest.fn()} />);
    expect(screen.getByRole('tab', { name: 'Reduction Plans' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Scenarios' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Projects' })).toBeInTheDocument();
  });

  it('marks active tab with aria-selected=true', () => {
    render(<AnalyzeTabs active="scenarios" onChange={jest.fn()} />);
    expect(
      screen.getByRole('tab', { name: 'Scenarios' })
    ).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('tab', { name: 'Reduction Plans' })
    ).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange with correct tab id when clicked', () => {
    const onChange = jest.fn();
    render(<AnalyzeTabs active="reduction-plans" onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Scenarios' }));
    expect(onChange).toHaveBeenCalledWith('scenarios');
  });

  it('calls onChange when Projects tab is clicked', () => {
    const onChange = jest.fn();
    render(<AnalyzeTabs active="reduction-plans" onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Projects' }));
    expect(onChange).toHaveBeenCalledWith('projects');
  });
});

// ── AnalyzePage (integration) ─────────────────────────────────────────────────

describe('AnalyzePage', () => {
  it('renders the page', () => {
    render(<AnalyzePage />);
    expect(screen.getByTestId('analyze-page')).toBeInTheDocument();
  });

  it('shows page title', () => {
    render(<AnalyzePage />);
    expect(screen.getByText('Analyze')).toBeInTheDocument();
  });

  it('renders all export cards', () => {
    render(<AnalyzePage />);
    expect(screen.getByTestId('export-card-utilities')).toBeInTheDocument();
    expect(screen.getByTestId('export-card-crrd-export')).toBeInTheDocument();
    expect(screen.getByTestId('export-card-tcd-export')).toBeInTheDocument();
    expect(screen.getByTestId('export-card-travel')).toBeInTheDocument();
    expect(screen.getByTestId('export-card-cp-export')).toBeInTheDocument();
    expect(screen.getByTestId('export-card-gri-export')).toBeInTheDocument();
  });

  it('renders tabs', () => {
    render(<AnalyzePage />);
    expect(screen.getByRole('tab', { name: 'Reduction Plans' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Scenarios' })).toBeInTheDocument();
  });

  it('switches tab on click', () => {
    render(<AnalyzePage />);
    const scenariosTab = screen.getByRole('tab', { name: 'Scenarios' });
    fireEvent.click(scenariosTab);
    expect(scenariosTab).toHaveAttribute('aria-selected', 'true');
  });
});
