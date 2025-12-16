'use client';

import React from 'react';

export type Status = 'draft' | 'submitted' | 'approved' | 'locked' | 'open';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'eco-badge eco-badge--neutral',
  },
  open: {
    label: 'Open',
    className: 'eco-badge eco-badge--neutral',
  },
  submitted: {
    label: 'Submitted',
    className: 'eco-badge eco-badge--warning',
  },
  approved: {
    label: 'Approved',
    className: 'eco-badge eco-badge--success',
  },
  locked: {
    label: 'Locked',
    className: 'eco-badge eco-badge--info',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;
  const sizeClass = size === 'sm' ? 'eco-badge--sm' : size === 'lg' ? 'eco-badge--lg' : '';

  return (
    <span className={`${config.className} ${sizeClass}`}>
      {config.label}
    </span>
  );
}

// Inline styles for badges (add to globals.css if not present)
const badgeStyles = `
.eco-badge--info {
  background: var(--brand-blue-100, #e0f2fe);
  color: var(--brand-blue-700, #0369a1);
}
`;

