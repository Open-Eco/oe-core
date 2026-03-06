/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import RolesPage, {
  UserAvatar,
  RolePermissionsPanel,
  InviteUserModal,
  type OrgUser,
  type RoleDefinition,
} from '../app/(app)/roles/page';

// ── UserAvatar ────────────────────────────────────────────────────────────────

describe('UserAvatar', () => {
  const user: Pick<OrgUser, 'avatarInitials' | 'avatarColor' | 'avatarUrl' | 'name'> = {
    name: 'Jane Williams',
    avatarInitials: 'JW',
    avatarColor: '#F4B400',
  };

  it('renders initials when no avatarUrl', () => {
    render(<UserAvatar user={user} />);
    expect(screen.getByText('JW')).toBeInTheDocument();
  });

  it('applies custom background color', () => {
    const { container } = render(<UserAvatar user={user} />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveStyle('background: #F4B400');
  });

  it('renders img when avatarUrl provided', () => {
    const userWithAvatar = { ...user, avatarUrl: '/avatar.png' };
    render(<UserAvatar user={userWithAvatar} />);
    expect(screen.getByAltText('Jane Williams')).toBeInTheDocument();
  });

  it('respects custom size prop', () => {
    const { container } = render(<UserAvatar user={user} size={48} />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveStyle('width: 48px');
    expect(avatar).toHaveStyle('height: 48px');
  });
});

// ── RolePermissionsPanel ──────────────────────────────────────────────────────

describe('RolePermissionsPanel', () => {
  const roles: RoleDefinition[] = [
    { id: 'admin', role: 'Admin', description: 'Full access' },
    { id: 'manager', role: 'Manager', description: 'View, create, and approve data' },
    { id: 'analyst', role: 'Analyst', description: 'View and analyze data' },
    { id: 'viewer', role: 'Viewer', description: 'Read-only access' },
  ];

  it('renders the panel', () => {
    render(<RolePermissionsPanel roles={roles} />);
    expect(screen.getByTestId('role-permissions-panel')).toBeInTheDocument();
  });

  it('renders all role names', () => {
    render(<RolePermissionsPanel roles={roles} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('Analyst')).toBeInTheDocument();
    expect(screen.getByText('Viewer')).toBeInTheDocument();
  });

  it('renders role descriptions', () => {
    render(<RolePermissionsPanel roles={roles} />);
    expect(screen.getByText('Full access')).toBeInTheDocument();
    expect(screen.getByText('Read-only access')).toBeInTheDocument();
  });

  it('renders Add Role button', () => {
    render(<RolePermissionsPanel roles={roles} />);
    expect(screen.getByText('Add Role')).toBeInTheDocument();
  });

  it('calls onAddRole when Add Role button is clicked', () => {
    const onAddRole = jest.fn();
    render(<RolePermissionsPanel roles={roles} onAddRole={onAddRole} />);
    fireEvent.click(screen.getByText('Add Role'));
    expect(onAddRole).toHaveBeenCalledTimes(1);
  });

  it('renders edit and delete buttons for each role', () => {
    render(<RolePermissionsPanel roles={roles} />);
    expect(screen.getAllByLabelText(/Edit .* role/)).toHaveLength(roles.length);
    expect(screen.getAllByLabelText(/Delete .* role/)).toHaveLength(roles.length);
  });
});

// ── InviteUserModal ───────────────────────────────────────────────────────────

describe('InviteUserModal', () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when open=false', () => {
    render(<InviteUserModal open={false} onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.queryByTestId('invite-modal')).not.toBeInTheDocument();
  });

  it('renders when open=true', () => {
    render(<InviteUserModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByTestId('invite-modal')).toBeInTheDocument();
  });

  it('shows the modal title', () => {
    render(<InviteUserModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByText('Invite New User')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<InviteUserModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<InviteUserModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<InviteUserModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with form data when Send Invite is clicked', () => {
    render(<InviteUserModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Full name'), {
      target: { value: 'Alice Test' },
    });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'alice@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Role'), {
      target: { value: 'Analyst' },
    });
    fireEvent.click(screen.getByText('Send Invite'));
    expect(onSubmit).toHaveBeenCalledWith({
      fullName: 'Alice Test',
      email: 'alice@test.com',
      role: 'Analyst',
    });
  });

  it('resets form after submit', () => {
    render(<InviteUserModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Full name'), {
      target: { value: 'Bob' },
    });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'bob@test.com' },
    });
    fireEvent.click(screen.getByText('Send Invite'));
    // After submit, form resets (component re-renders with empty)
    // Since the form is reset, the input should be empty
    expect(screen.queryByDisplayValue('Bob')).not.toBeInTheDocument();
  });
});

// ── RolesPage (integration) ───────────────────────────────────────────────────

describe('RolesPage', () => {
  it('renders the page', () => {
    render(<RolesPage />);
    expect(screen.getByTestId('roles-page')).toBeInTheDocument();
  });

  it('shows the page title', () => {
    render(<RolesPage />);
    expect(screen.getByRole('heading', { name: /Roles & Permissions/i })).toBeInTheDocument();
  });

  it('renders tab buttons', () => {
    render(<RolesPage />);
    expect(screen.getByRole('tab', { name: 'Roles & Permissions' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Audit Log' })).toBeInTheDocument();
  });

  it('renders user list', () => {
    render(<RolesPage />);
    expect(screen.getByText('Jane Williams')).toBeInTheDocument();
    expect(screen.getByText('john@appe.com')).toBeInTheDocument();
  });

  it('renders role permissions panel', () => {
    render(<RolesPage />);
    expect(screen.getByTestId('role-permissions-panel')).toBeInTheDocument();
  });

  it('shows invite button', () => {
    render(<RolesPage />);
    expect(screen.getByTestId('invite-user-btn')).toBeInTheDocument();
  });

  it('opens invite modal when Invite User is clicked', () => {
    render(<RolesPage />);
    fireEvent.click(screen.getByTestId('invite-user-btn'));
    expect(screen.getByTestId('invite-modal')).toBeInTheDocument();
  });

  it('closes invite modal when Close is clicked', () => {
    render(<RolesPage />);
    fireEvent.click(screen.getByTestId('invite-user-btn'));
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByTestId('invite-modal')).not.toBeInTheDocument();
  });

  it('adds a user when invite form is submitted', () => {
    render(<RolesPage />);
    fireEvent.click(screen.getByTestId('invite-user-btn'));
    const modal = screen.getByTestId('invite-modal');
    fireEvent.change(within(modal).getByLabelText('Full name'), {
      target: { value: 'New User' },
    });
    fireEvent.change(within(modal).getByLabelText('Email address'), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.click(within(modal).getByText('Send Invite'));
    // Modal should close
    expect(screen.queryByTestId('invite-modal')).not.toBeInTheDocument();
    // New user email should appear in the table
    expect(screen.getByText('newuser@example.com')).toBeInTheDocument();
  });

  it('filters users by search', () => {
    render(<RolesPage />);
    fireEvent.change(screen.getByLabelText('Search users'), {
      target: { value: 'Jane' },
    });
    expect(screen.getByText('Jane Williams')).toBeInTheDocument();
    expect(screen.queryByText('John Footees')).not.toBeInTheDocument();
  });

  it('filters users by role', () => {
    render(<RolesPage />);
    fireEvent.change(screen.getByLabelText('Filter by role'), {
      target: { value: 'Admin' },
    });
    expect(screen.getByText('Jane Williams')).toBeInTheDocument();
    // Non-admin users should not appear
    expect(screen.queryByText('Ayesha Facteur')).not.toBeInTheDocument();
  });
});
