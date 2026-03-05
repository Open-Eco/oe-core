"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

// Types

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

// Static Demo Data

const ORG_USERS: OrgUser[] = [
  { id: "1", name: "Jane Williams", subtitle: "Williams", email: "jane@appe.com", role: "Admin", lastActive: "5 minutes ago", avatarInitials: "JW", avatarColor: "#F4B400" },
  { id: "2", name: "John Footees", subtitle: "Footees", email: "john@appe.com", role: "Manager", lastActive: "5 minutes ago", avatarInitials: "JF", avatarColor: "#1A6F8A" },
  { id: "3", name: "Ayesha Facteur", subtitle: "Facteur", email: "ayesha@appe.com", role: "Analyst", lastActive: "1 day ago", avatarInitials: "AF", avatarColor: "#DB4437" },
  { id: "4", name: "Emma Brown", subtitle: "Brown", email: "emma@appe.com", role: "Manager", lastActive: "3 day ago", avatarInitials: "EB", avatarColor: "#138A4F" },
  { id: "5", name: "Daniel Teoncut", subtitle: "Teoncut", email: "daniel@appe.com", role: "Analyst", lastActive: "1 day ago", avatarInitials: "DT", avatarColor: "#7A8C8E" },
  { id: "6", name: "Alex Catter", subtitle: "Catter", email: "alex@appe.com", role: "Viewer", lastActive: "1 day ago", avatarInitials: "AC", avatarColor: "#0F9D58" },
  { id: "7", name: "Lisa Marting", subtitle: "Marting", email: "lissa@appe.com", role: "Viewer", lastActive: "1 day ago", avatarInitials: "LM", avatarColor: "#DB4437" },
  { id: "8", name: "Olivia Filmeper", subtitle: "Filmeper", email: "olivia@appe.com", role: "Manager", lastActive: "1 day ago", avatarInitials: "OF", avatarColor: "#1A6F8A" },
];

const ROLE_DEFINITIONS: RoleDefinition[] = [
  { id: "admin", role: "Admin", description: "Full access" },
  { id: "manager", role: "Manager", description: "View, create, and approve data" },
  { id: "analyst", role: "Analyst", description: "View and analyze data" },
  { id: "viewer", role: "Viewer", description: "Read-only access" },
];

// Avatar - uses eco-avatar from EcoKit

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
        className="eco-avatar"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="eco-avatar"
      style={{
        width: size,
        height: size,
        background: user.avatarColor,
        color: "#fff",
        fontSize: size * 0.36,
      }}
      aria-label={user.name}
    >
      {user.avatarInitials}
    </div>
  );
}

// Role badge variant map

const ROLE_VARIANT: Record<UserRole, string> = {
  Admin: "error",
  Manager: "primary",
  Analyst: "warning",
  Viewer: "neutral",
};

// Role Permissions Panel - uses eco-card from EcoKit

interface RolePermissionsPanelProps {
  roles: RoleDefinition[];
  onAddRole?: () => void;
}

export function RolePermissionsPanel({ roles, onAddRole }: RolePermissionsPanelProps) {
  return (
    <div className="eco-card" data-testid="role-permissions-panel">
      <h3 style={{ fontSize: "var(--text-md)", fontWeight: "var(--font-weight-bold)", color: "var(--neutral-900)", marginBottom: "1rem" }}>
        Role Permissions
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {roles.map((r) => (
          <li key={r.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--neutral-300)" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ color: "var(--neutral-500)", flexShrink: 0 }}>
              <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 18c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: "var(--text-sm)", color: "var(--neutral-900)", display: "block" }}>{r.role}</strong>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--neutral-500)" }}>{r.description}</span>
            </div>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button type="button" aria-label={`Edit ${r.role} role`} className="eco-btn eco-btn--secondary" style={{ padding: "0.25rem 0.5rem", minWidth: "auto" }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 14l1-3L11 3l2 2-8 8-3 1ZM11 3l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" aria-label={`Delete ${r.role} role`} className="eco-btn eco-btn--secondary" style={{ padding: "0.25rem 0.5rem", minWidth: "auto" }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 5h10M6 5V3h4v2M7 8v4M9 8v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="4" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="eco-btn" style={{ marginTop: "1rem", width: "100%" }} onClick={onAddRole}>
        Add Role
      </button>
    </div>
  );
}

// Invite User Modal - uses eco-modal from EcoKit

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
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
      data-testid="invite-modal"
    >
      <div
        className="eco-modal eco-modal--sm"
        style={{ display: "flex", flexDirection: "column", position: "static", transform: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="eco-modal__header">
          <h2 id="invite-modal-title" className="eco-modal__title">Invite New User</h2>
          <button type="button" className="eco-modal__close" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="eco-modal__body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="eco-label" htmlFor="invite-full-name">Full name</label>
              <div style={{ position: "relative" }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                  style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--neutral-500)" }}>
                  <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M4 18c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <input
                  id="invite-full-name"
                  type="text"
                  placeholder="Full name"
                  className="eco-input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                  aria-label="Full name"
                />
              </div>
            </div>

            <div>
              <label className="eco-label" htmlFor="invite-email">Email address</label>
              <div style={{ position: "relative" }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                  style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--neutral-500)" }}>
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <input
                  id="invite-email"
                  type="email"
                  placeholder="email@example.com"
                  className="eco-input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  aria-label="Email address"
                />
              </div>
            </div>

            <div>
              <label className="eco-label" htmlFor="invite-role">Role</label>
              <select
                id="invite-role"
                className="eco-select__input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                aria-label="Role"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <p style={{ fontSize: "var(--text-sm)", color: "var(--neutral-500)", margin: 0 }}>
              An invitation will be sent to this user by email with instructions for setting their password.
            </p>
          </div>

          <div className="eco-modal__footer">
            <button type="submit" className="eco-btn">Send Invite</button>
            <button type="button" className="eco-btn eco-btn--secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Roles Page

type RolesTab = "roles-permissions" | "audit-log";

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState<RolesTab>("roles-permissions");
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [users, setUsers] = useState<OrgUser[]>(ORG_USERS);

  const filteredData = useMemo(
    () =>
      users.filter((u) => {
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesRole;
      }),
    [users, roleFilter]
  );

  const columns = useMemo<ColumnDef<OrgUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <UserAvatar user={row.original} size={36} />
            <div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--neutral-900)" }}>
                {row.original.name}
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--neutral-500)" }}>
                {row.original.subtitle}
              </div>
            </div>
          </div>
        ),
      },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => {
          const role = getValue<UserRole>();
          return (
            <span className={`eco-badge eco-badge--${ROLE_VARIANT[role]}`}>{role}</span>
          );
        },
      },
      {
        accessorKey: "lastActive",
        header: "Last Active",
        cell: ({ getValue }) => (
          <span style={{ fontSize: "var(--text-sm)", color: "var(--neutral-500)" }}>
            {getValue<string>()}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25, pageIndex: 0 } },
  });

  const handleInvite = (data: InviteFormData) => {
    const newUser: OrgUser = {
      id: String(users.length + 1),
      name: data.fullName,
      subtitle: data.fullName.split(" ")[1] || "",
      email: data.email,
      role: data.role,
      lastActive: "Just now",
      avatarInitials: data.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      avatarColor: "#1A6F8A",
    };
    setUsers((prev) => [...prev, newUser]);
    setInviteOpen(false);
  };

  return (
    <section className="eco-page" data-testid="roles-page">
      <header className="eco-page__header">
        <div>
          <h2 className="eco-page__title">Roles &amp; Permissions</h2>
          <p className="eco-page__subtitle">
            Manage user access and permissions for your organisation.
          </p>
        </div>
        <div className="eco-page__header-actions">
          <button className="eco-btn" type="button" onClick={() => setInviteOpen(true)} data-testid="invite-user-btn">
            Invite User
          </button>
          <button className="eco-btn eco-btn--secondary" style={{ padding: "0.5rem", minWidth: "auto" }} type="button" aria-label="Group view">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="14" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M1 18c0-2.8 2.2-5 5-5h3c1.1 0 2.1.4 2.9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M13 16c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button className="eco-btn eco-btn--secondary" style={{ padding: "0.5rem", minWidth: "auto" }} type="button" aria-label="More options">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="4" r="1.5" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="10" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {/* Tabs - eco-tabs from EcoKit */}
      <div className="eco-tabs" role="tablist" aria-label="Roles sections">
        <div className="eco-tabs__list">
          {(["roles-permissions", "audit-log"] as RolesTab[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className="eco-tabs__trigger"
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab === "roles-permissions" ? "Roles & Permissions" : "Audit Log"}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="eco-page__two-col">
        {/* Main Users Table */}
        <div role="tabpanel">
          {/* Toolbar - eco-datagrid__toolbar from EcoKit */}
          <div className="eco-datagrid__wrapper">
            <div className="eco-datagrid__toolbar" style={{ marginBottom: "0.75rem" }}>
              <div className="eco-datagrid__search">
                <svg className="eco-datagrid__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  placeholder="Search"
                  className="eco-input eco-datagrid__search-input"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  aria-label="Search users"
                />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <div className="eco-filter-bar__group">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M4 5h8M4 8h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <select
                    className="eco-filter-bar__select"
                    aria-label="Filter by role"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as "all" | UserRole)}
                  >
                    <option value="all">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <select className="eco-filter-bar__select" aria-label="Actions">
                  <option>Next</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <button className="eco-btn eco-btn--secondary" type="button">
                Bulk Actions
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <button className="eco-btn eco-btn--secondary" type="button">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M12 12l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Search
              </button>
            </div>

            {/* Users table - eco-datagrid CSS + TanStack Table */}
            <div className="eco-datagrid__container">
              <table className="eco-datagrid" aria-label="Users and roles">
                <thead className="eco-datagrid__head">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((header) => (
                        <th
                          key={header.id}
                          className={`eco-datagrid__cell eco-datagrid__cell--header ${header.column.getCanSort() ? "eco-datagrid__cell--sortable" : ""}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="eco-datagrid__header-content">
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <span className="eco-datagrid__sort-indicator">
                                {{ asc: " \u2191", desc: " \u2193" }[header.column.getIsSorted() as string] ?? " \u2195"}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="eco-datagrid__body">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="eco-datagrid__row">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="eco-datagrid__cell">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="eco-datagrid__pagination">
              <div className="eco-datagrid__pagination-info">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="eco-datagrid__pagination-buttons">
                <button className="eco-btn eco-btn--secondary eco-datagrid__pagination-btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page">\u2039</button>
                <span className="eco-datagrid__pagination-page">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button className="eco-btn eco-btn--secondary eco-datagrid__pagination-btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page">\u203a</button>
              </div>
            </div>
          </div>
        </div>

        {/* Role Permissions Side Panel */}
        <RolePermissionsPanel roles={ROLE_DEFINITIONS} />
      </div>

      {/* Invite User Modal */}
      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} onSubmit={handleInvite} />

      {/* Footer */}
      <footer style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "var(--text-sm)", color: "var(--neutral-500)", paddingTop: "1rem", borderTop: "1px solid var(--neutral-300)" }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 9v5M10 7v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>All emissions shown here are calculated using open emission factors and deterministic formulas. N.xl A\u2026 no estimates are hidden.</span>
      </footer>
    </section>
  );
}
