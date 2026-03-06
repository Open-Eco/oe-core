"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  CellContext,
} from "@tanstack/react-table";

// Types for editable cells
export type EditInputType = "text" | "number" | "select" | "date" | "checkbox";

export interface EditableCellMeta {
  editable?: boolean;
  editInputType?: EditInputType;
  selectOptions?: { value: string; label: string }[];
  validate?: (value: unknown) => boolean | string;
  min?: number;
  max?: number;
  step?: number;
}

export interface CellEditEvent<TData> {
  rowIndex: number;
  rowId: string;
  columnId: string;
  oldValue: unknown;
  newValue: unknown;
  row: TData;
}

export interface EcoDataGridProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableEditing?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  onCellEdit?: (event: CellEditEvent<TData>) => void;
  className?: string;
}

// Editable Cell Component
interface EditableCellProps<TData> {
  value: unknown;
  row: TData;
  rowIndex: number;
  rowId: string;
  columnId: string;
  meta?: EditableCellMeta;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (value: unknown) => void;
  onCancel: () => void;
  renderDisplay?: (props: CellContext<TData, unknown>) => React.ReactNode;
  cellContext: CellContext<TData, unknown>;
}

function EditableCell<TData>({
  value,
  row,
  rowIndex,
  rowId,
  columnId,
  meta,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  renderDisplay,
  cellContext,
}: EditableCellProps<TData>) {
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement && inputRef.current.type !== "checkbox") {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Tab") {
      handleSave();
    }
  };

  const handleSave = () => {
    // Validate if validator provided
    if (meta?.validate) {
      const result = meta.validate(editValue);
      if (result !== true) {
        setError(typeof result === "string" ? result : "Invalid value");
        return;
      }
    }

    setError(null);
    onSave(editValue);
  };

  const handleCancel = () => {
    setEditValue(value);
    setError(null);
    onCancel();
  };

  const handleBlur = () => {
    // Small delay to allow click events to fire first
    setTimeout(() => {
      if (isEditing) {
        handleSave();
      }
    }, 100);
  };

  if (!isEditing) {
    return (
      <div
        className="eco-datagrid__cell-content eco-datagrid__cell-content--editable"
        onClick={(e) => {
          e.stopPropagation();
          onStartEdit();
        }}
        title="Click to edit"
      >
        {renderDisplay ? renderDisplay(cellContext) : String(value ?? "")}
        <span className="eco-datagrid__edit-icon">✎</span>
      </div>
    );
  }

  const inputType = meta?.editInputType || "text";

  return (
    <div className="eco-datagrid__cell-edit" onClick={(e) => e.stopPropagation()}>
      {inputType === "select" && meta?.selectOptions ? (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          className="eco-datagrid__edit-input eco-datagrid__edit-select"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        >
          {meta.selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : inputType === "checkbox" ? (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="checkbox"
          className="eco-datagrid__edit-input eco-datagrid__edit-checkbox"
          checked={Boolean(editValue)}
          onChange={(e) => {
            setEditValue(e.target.checked);
            onSave(e.target.checked);
          }}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={inputType}
          className={`eco-datagrid__edit-input ${error ? "eco-datagrid__edit-input--error" : ""}`}
          value={editValue ?? ""}
          onChange={(e) => {
            const val = inputType === "number" ? parseFloat(e.target.value) || 0 : e.target.value;
            setEditValue(val);
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          min={meta?.min}
          max={meta?.max}
          step={meta?.step}
        />
      )}
      {error && <span className="eco-datagrid__edit-error">{error}</span>}
      <div className="eco-datagrid__edit-actions">
        <button
          type="button"
          className="eco-datagrid__edit-btn eco-datagrid__edit-btn--save"
          onClick={handleSave}
          title="Save (Enter)"
        >
          ✓
        </button>
        <button
          type="button"
          className="eco-datagrid__edit-btn eco-datagrid__edit-btn--cancel"
          onClick={handleCancel}
          title="Cancel (Escape)"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function EcoDataGrid<TData>({
  data,
  columns,
  enableSorting = true,
  enableFiltering = false,
  enablePagination = true,
  enableEditing = false,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  striped = false,
  bordered = false,
  compact = false,
  stickyHeader = false,
  emptyMessage = "No data available",
  onRowClick,
  onCellEdit,
  className = "",
}: EcoDataGridProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  // Track which cell is being edited: "rowId:columnId" or null
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
  });

  const handleCellEdit = useCallback(
    (rowIndex: number, rowId: string, columnId: string, oldValue: unknown, newValue: unknown, row: TData) => {
      if (oldValue !== newValue && onCellEdit) {
        onCellEdit({
          rowIndex,
          rowId,
          columnId,
          oldValue,
          newValue,
          row,
        });
      }
      setEditingCell(null);
    },
    [onCellEdit]
  );

  const gridClasses = [
    "eco-datagrid",
    striped && "eco-datagrid--striped",
    bordered && "eco-datagrid--bordered",
    compact && "eco-datagrid--compact",
    stickyHeader && "eco-datagrid--sticky-header",
    enableEditing && "eco-datagrid--editable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="eco-datagrid__wrapper">
      {/* Global Filter */}
      {enableFiltering && (
        <div className="eco-datagrid__toolbar">
          <div className="eco-datagrid__search">
            <input
              type="text"
              className="eco-input eco-datagrid__search-input"
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <svg
              className="eco-datagrid__search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="eco-datagrid__container">
        <table className={gridClasses}>
          <thead className="eco-datagrid__head">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="eco-datagrid__row eco-datagrid__row--header">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`eco-datagrid__cell eco-datagrid__cell--header ${
                      header.column.getCanSort() ? "eco-datagrid__cell--sortable" : ""
                    }`}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="eco-datagrid__header-content">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="eco-datagrid__sort-indicator">
                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted() as string] ?? " ↕"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="eco-datagrid__body">
            {table.getRowModel().rows.length === 0 ? (
              <tr className="eco-datagrid__row eco-datagrid__row--empty">
                <td
                  className="eco-datagrid__cell eco-datagrid__cell--empty"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`eco-datagrid__row ${
                    onRowClick && !enableEditing ? "eco-datagrid__row--clickable" : ""
                  }`}
                  onClick={() => {
                    if (!enableEditing && onRowClick) {
                      onRowClick(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as EditableCellMeta | undefined;
                    const isEditable = enableEditing && meta?.editable !== false;
                    const cellKey = `${row.id}:${cell.column.id}`;
                    const isEditingThis = editingCell === cellKey;

                    return (
                      <td
                        key={cell.id}
                        className={`eco-datagrid__cell ${isEditable ? "eco-datagrid__cell--editable" : ""}`}
                      >
                        {isEditable ? (
                          <EditableCell
                            value={cell.getValue()}
                            row={row.original}
                            rowIndex={rowIndex}
                            rowId={row.id}
                            columnId={cell.column.id}
                            meta={meta}
                            isEditing={isEditingThis}
                            onStartEdit={() => setEditingCell(cellKey)}
                            onSave={(newValue) =>
                              handleCellEdit(
                                rowIndex,
                                row.id,
                                cell.column.id,
                                cell.getValue(),
                                newValue,
                                row.original
                              )
                            }
                            onCancel={() => setEditingCell(null)}
                            renderDisplay={
                              cell.column.columnDef.cell &&
                              typeof cell.column.columnDef.cell === "function"
                                ? cell.column.columnDef.cell
                                : undefined
                            }
                            cellContext={cell.getContext()}
                          />
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && data.length > 0 && (
        <div className="eco-datagrid__pagination">
          <div className="eco-datagrid__pagination-info">
            <span>
              Showing{" "}
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                data.length
              )}{" "}
              of {data.length} entries
            </span>
          </div>

          <div className="eco-datagrid__pagination-controls">
            <select
              className="eco-select__input eco-datagrid__page-size"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>

            <div className="eco-datagrid__pagination-buttons">
              <button
                className="eco-button eco-button--ghost eco-datagrid__pagination-btn"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                ««
              </button>
              <button
                className="eco-button eco-button--ghost eco-datagrid__pagination-btn"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                «
              </button>
              <span className="eco-datagrid__pagination-page">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <button
                className="eco-button eco-button--ghost eco-datagrid__pagination-btn"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                »
              </button>
              <button
                className="eco-button eco-button--ghost eco-datagrid__pagination-btn"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                »»
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components for common cell renderers
export const CellRenderers = {
  // Currency cell
  currency: (value: number, currency = "USD") => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
    return <span className="eco-datagrid__cell--currency">{formatted}</span>;
  },

  // Number with +/- coloring
  delta: (value: number) => {
    const isNegative = value < 0;
    return (
      <span
        className={`eco-datagrid__cell--delta ${
          isNegative ? "eco-datagrid__cell--negative" : "eco-datagrid__cell--positive"
        }`}
      >
        {isNegative ? "" : "+"}
        {value.toLocaleString()}
      </span>
    );
  },

  // Percentage
  percentage: (value: number, decimals = 1) => {
    return <span className="eco-datagrid__cell--percentage">{value.toFixed(decimals)}%</span>;
  },

  // Badge/status
  badge: (value: string, variant: "default" | "success" | "warning" | "error" = "default") => {
    return <span className={`eco-badge eco-badge--${variant}`}>{value}</span>;
  },

  // Date
  date: (value: string | Date, format: "short" | "long" = "short") => {
    const date = typeof value === "string" ? new Date(value) : value;
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: format === "long" ? "long" : "short",
      day: "numeric",
    });
    return <span className="eco-datagrid__cell--date">{formatted}</span>;
  },

  // Progress bar
  progress: (value: number, max = 100) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="eco-datagrid__progress">
        <div className="eco-datagrid__progress-bar" style={{ width: `${percentage}%` }} />
        <span className="eco-datagrid__progress-text">{percentage.toFixed(0)}%</span>
      </div>
    );
  },
};

export default EcoDataGrid;
