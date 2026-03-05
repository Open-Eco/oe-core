"use client";

import React, { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserRole = "Admin" | "Manager" | "Analyst" | "Viewer";

export interface OrgUser {
  id: string;
  name: string;
  subtitle: string;
  email: string;
  role: UserRole;
  lastActive: string;
  avatarUrl?: string;
  avatarInitials: string;
  avatarColor: string;
}

export interface RoleDefinition {
  id: string;
  role: UserRole;
  description: string;
}

export interface InviteFormData {
  fullName: string;
  email: string;
  role: UserRole;
}

// ── Static Demo Data ──────────────────────────────────────────────────────────

const ORG_USERS: OrgUser[] = [
  {
    id: "1",
    name: "Jane Williams",
    subtitle: "Williams",
    email: "jane@appe.com",
    role: "Admin",
    lastActive: "5 minutes ago",
    avatarInitials: "JW",
    avatarColor: "#F4B400",
  },
  {
    id: "2",
    name: "John Footees",
    subtitle: "Footees",
    email: "john@appe.com",
    role: "Manager",
    lastActive: "5 minutes ago",
    avatarInitials: "JF",
    avatarColor: "#1A6F8A",
  },
  {
    id: "3",
    name: "Ayesha Facteur",
    subtitle: "Facteur",
    email: "ayesha@appe.com",
    role: "Analyst",
    lastActive: "1 day ago",
    avatarInitials: "AF",
    avatarColor: "#DB4437",
  },
  {
    id: "4",
    name: "Emma Brown",
    subtitle: "Brown",
    email: "emma@appe.com",
    role: "Manager",
    lastActive: "3 day ago",
    avatarInitials: "EB",
    avatarColor: "#138A4F",
  },
  {
    id: "5",
    name: "Daniel Teoncut",
    subtitle: "Teoncut",
    email: "daniel@appe.com",
    role: "Analyst",
    lastActive: "1 day ago",
    avatarInitials: "DT",
    avatarColor: "#7A8C8E",
  },
  {
    id: "6",
    name: "Alex Catter",
    subtitle: "Catter",
    email: "alex@appe.com",
    role: "Viewer",
    lastActive: "1 day ago",
    avatarInitials: "AC",
    avatarColor: "#0F9D58",
  },
  {
    id: "7",
    name: "Lisa Marting",
    subtitle: "Marting",
    email: "lissa@appe.com",
    role: "Viewer",
    lastActive: "1 day ago",
    avatarInitials: "LM",
    avatarColor: "#DB4437",
  },
  {
    id: "8",
    name: "Olivia Filmeper",
    subtitle: "Filmeper",
    email: "olivia@appe.com",
    role: "Manager",
    lastActive: "1 day ago",
    avatarInitials: "OF",
    avatarColor: "#1A6F8A",
  },
];

const ROLE_DEFINITIONS: RoleDefinition[] = [
  { id: "admin", role: "Admin", description: "Full access" },
  { id: "manager", role: "Manager", description: "View, create, and approve data" },
  { id: "analyst", role: "Analyst", description: "View and analyze data" },
  { id: "viewer", role: "Viewer", description: "Read-only access" },
];

// ── Avatar ────────────────────────────────────────────────────────────────────

export function UserAvatar({
  user,
  size = 36,
}: {
  user: Pick<OrgUser, "avatarInitials" | "avatarColor" | "avatarUrl" | "name">;
  size?: number;
}) {
  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt={user.name}
        width={size}
        height={size}
        className="roles-avatar"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="roles-avatar roles-avatar--initials"
      style={{
        width: size,
        height: size,
        background: user.avatarColor,
        fontSize: size * 0.36,
      }}
      aria-label={user.name}
    >
      {user.avatarInitials}
    </div>
  );
}

// ── Role Permissions Panel ────────────────────────────────────────────────────

interface RolePermissionsPanelProps {
  roles: RoleDefinition[];
  onAddRole?: () => void;
}

export function RolePermissionsPanel({
  roles,
  onAddRole,
}: RolePermissionsPanelProps) {
  return (
    <div className="roles-permissions-panel" data-testid="role-permissions-panel">
      <h3 className="roles-permissions-panel__title">Role Permissions</h3>
      <ul className="roles-permissions-list">
        {roles.map((r) => (
          <li key={r.id} className="roles-permissions-item">
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="roles-permissions-item__icon"
            >
              <circle
                cx="10"
                cy="7"
                r="3"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M4 18c0-3.31 2.69-6 6-6s6 2.69 6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <div className="roles-permissions-item__info">
              <strong className="roles-permissions-item__name">{r.role}</strong>
              <span className="roles-permissions-item__desc">{r.description}</span>
            </div>
            <div className="roles-permissions-item__actions">
              <button
                type="button"
                aria-label={`Edit ${r.role} role`}
                className="roles-icon-btn"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 14l1-3L11 3l2 2-8 8-3 1ZM11 3l2 2"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label={`Delete ${r.role} role`}
                className="roles-icon-btn"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 5h10M6 5V3h4v2M7 8v4M9 8v4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="4"
                    y="5"
                    width="8"
                    height="8"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="roles-permissions-panel__add-btn"
        onClick={onAddRole}
      >
        Add Role
      </button>
    </div>
  );
}

// ── Invite Modal ──────────────────────────────────────────────────────────────

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InviteFormData) => void;
}

export function InviteUserModal({ open, onClose, onSubmit }: InviteModalProps) {
  const [form, setForm] = useState<InviteFormData>({
    fullName: "",
    email: "",
    role: "Manager",
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ fullName: "", email: "", role: "Manager" });
  };

  return (
    <div
      className="roles-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
      data-testid="invite-modal"
    >
      <div
        className="roles-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="roles-modal__header">
          <h2 id="invite-modal-title" className="roles-modal__title">
            Invite New User
          </h2>
          <button
            type="button"
            className="roles-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="roles-modal__form">
          <div className="roles-modal__field">
            <div className="roles-modal__input-wrap">
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="roles-modal__input-icon"
              >
                <circle
                  cx="10"
                  cy="7"
                  r="3"
                  stroke="#7A8C8E"
                  strokeWidth="1.6"
                />
                <path
                  d="M4 18c0-3.31 2.69-6 6-6s6 2.69 6 6"
                  stroke="#7A8C8E"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Full name"
                className="roles-modal__input"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
                aria-label="Full name"
              />
            </div>
          </div>

          <div className="roles-modal__field">
            <div className="roles-modal__input-wrap">
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="roles-modal__input-icon"
              >
                <rect
                  x="2"
                  y="4"
                  width="16"
                  height="12"
                  rx="2"
                  stroke="#7A8C8E"
                  strokeWidth="1.6"
                />
                <path
                  d="M2 7l8 5 8-5"
                  stroke="#7A8C8E"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="email"
                placeholder="email@example.com"
                className="roles-modal__input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                aria-label="Email address"
              />
            </div>
          </div>

          <div className="roles-modal__field">
            <div className="roles-modal__role-wrap">
              <span className="roles-modal__role-label">Role</span>
              <select
                className="roles-modal__role-select"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as UserRole })
                }
                aria-label="Role"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>

          <p className="roles-modal__help">
            An invitation will be sent to this user by email with instructions
            for setting their password.
          </p>

          <div className="roles-modal__actions">
            <button
              type="submit"
              className="dash-btn dash-btn--primary"
            >
              Send Invite
            </button>
            <button
              type="button"
              className="dash-btn dash-btn--outline"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Roles Page ───────────────────────────────────────────────────────────

type RolesTab = "roles-permissions" | "audit-log";

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState<RolesTab>("roles-permissions");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [users, setUsers] = useState<OrgUser[]>(ORG_USERS);
  const [page, setPage] = useState(1);
  const totalPages = 3;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInvite = (data: InviteFormData) => {
    const newUser: OrgUser = {
      id: String(users.length + 1),
      name: data.fullName,
      subtitle: data.fullName.split(" ")[1] || "",
      email: data.email,
      role: data.role,
      lastActive: "Just now",
      avatarInitials: data.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      avatarColor: "#1A6F8A",
    };
    setUsers((prev) => [...prev, newUser]);
    setInviteOpen(false);
  };

  return (
    <section className="dash-page" data-testid="roles-page">
      {/* Page Header */}
      <header className="dash-page__header">
        <div>
          <h2 className="dash-page__title">Roles &amp; Permissions</h2>
          <p className="dash-page__subtitle">
            Track the full journey from raw activity data to final emissions numbers.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            className="dash-btn dash-btn--primary"
            type="button"
            onClick={() => setInviteOpen(true)}
            data-testid="invite-user-btn"
          >
            Invite User
          </button>
          <button
            className="dash-btn dash-btn--icon"
            type="button"
            aria-label="Group view"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="14" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M1 18c0-2.8 2.2-5 5-5h3c1.1 0 2.1.4 2.9 1"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M13 16c0-1.7 1.3-3 3-3s3 1.3 3 3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            className="dash-btn dash-btn--icon"
            type="button"
            aria-label="More options"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="10" cy="4" r="1.5" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="10" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav
        className="analyze-tabs"
        role="tablist"
        aria-label="Roles sections"
      >
        <button
          role="tab"
          className={`analyze-tab ${
            activeTab === "roles-permissions" ? "analyze-tab--active" : ""
          }`}
          aria-selected={activeTab === "roles-permissions"}
          onClick={() => setActiveTab("roles-permissions")}
          type="button"
        >
          Roles &amp; Permissions
        </button>
        <button
          role="tab"
          className={`analyze-tab ${
            activeTab === "audit-log" ? "analyze-tab--active" : ""
          }`}
          aria-selected={activeTab === "audit-log"}
          onClick={() => setActiveTab("audit-log")}
          type="button"
        >
          Audit Log
        </button>
      </nav>

      <div className="roles-layout">
        {/* Main Users Table */}
        <div className="roles-main" role="tabpanel">
          {/* Users Toolbar */}
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
                <circle cx="9" cy="9" r="6" stroke="#7A8C8E" strokeWidth="1.8" />
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
                aria-label="Search users"
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <div className="dash-filter-bar__group">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="1"
                    y="1"
                    width="14"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M4 5h8M4 8h5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                <select
                  className="dash-filter-bar__select"
                  aria-label="Filter by role"
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value as "all" | UserRole)
                  }
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <select className="dash-filter-bar__select" aria-label="Actions">
                <option>Next</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions Row */}
          <div className="roles-bulk-row">
            <div className="roles-bulk-actions">
              <button className="dash-btn dash-btn--outline" type="button">
                Bulk Actions
                <svg
                  width="12"
                  height="12"
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
              <button className="dash-btn dash-btn--outline" type="button">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M12 12l2.5 2.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="audit-table-wrap">
            <table
              className="audit-table"
              aria-label="Users and roles"
            >
              <thead>
                <tr>
                  <th>
                    Name
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
                  <th>Email</th>
                  <th>Role</th>
                  <th>
                    Last Active
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="audit-table__row">
                    <td>
                      <div className="roles-user-cell">
                        <UserAvatar user={user} size={36} />
                        <div>
                          <div className="roles-user-name">{user.name}</div>
                          <div className="roles-user-sub">{user.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="roles-user-active">{user.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="dash-table__footer">
              <span className="dash-table__info">
                Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries
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
        </div>

        {/* Role Permissions Panel */}
        <RolePermissionsPanel roles={ROLE_DEFINITIONS} />
      </div>

      {/* Invite User Modal */}
      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInvite}
      />

      {/* Footer */}
      <footer className="roles-footer">
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M10 9v5M10 7v.01"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <span>
          All emissions shown here are calculated using open emission factors and
          deterministic formulas. N.xl A… no estimates are hidden.
        </span>
      </footer>
    </section>
  );
}
