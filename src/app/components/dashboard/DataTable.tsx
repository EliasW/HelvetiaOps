'use client';

import { useState, useMemo, ReactNode, useCallback, KeyboardEvent } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  actionsLabel?: string;
  searchPlaceholder?: string;
  searchFn?: (row: T, query: string) => boolean;
  filterSlot?: ReactNode;
  pageSize?: number;
  pageSizeOptions?: number[];
  showingLabel?: string;
  ofLabel?: string;
  resultsLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  rowsPerPageLabel?: string;
  noResultsMessage?: string;
}

type SortDir = 'asc' | 'desc' | null;

export default function DataTable<T>({
  data,
  columns,
  rowKey,
  actions,
  actionsLabel = 'Actions',
  searchPlaceholder = 'Search...',
  searchFn,
  filterSlot,
  pageSize: initialPageSize = 5,
  pageSizeOptions = [5, 10, 20],
  showingLabel = 'Showing',
  ofLabel = 'of',
  resultsLabel = 'results',
  prevLabel = 'Previous',
  nextLabel = 'Next',
  rowsPerPageLabel = 'Rows per page',
  noResultsMessage = 'No results found',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handleSort = useCallback((key: string) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDir((prevDir) => {
          if (prevDir === 'asc') return 'desc';
          if (prevDir === 'desc') { setSortKey(null); return null; }
          return 'asc';
        });
        return key;
      }
      setSortDir('asc');
      return key;
    });
    setPage(1);
  }, []);

  const handleHeaderKeyDown = useCallback((e: KeyboardEvent, key: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(key);
    }
  }, [handleSort]);

  const filtered = useMemo(() => {
    let result = data;
    if (search && searchFn) {
      result = result.filter((row) => searchFn(row, search.toLowerCase()));
    }
    return result;
  }, [data, search, searchFn]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null || bVal == null) return 0;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);
  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, sorted.length);

  const getAriaSortValue = (col: Column<T>): 'ascending' | 'descending' | 'none' | undefined => {
    if (!col.sortable) return undefined;
    if (sortKey === col.key && sortDir === 'asc') return 'ascending';
    if (sortKey === col.key && sortDir === 'desc') return 'descending';
    return 'none';
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between" role="toolbar" aria-label="Table controls">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="px-3 py-2 border rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
        {filterSlot}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="bg-neutral-50 border-b">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  role="columnheader"
                  aria-sort={getAriaSortValue(col)}
                  tabIndex={col.sortable ? 0 : undefined}
                  className={`px-4 py-3 text-left font-medium text-neutral-600 ${
                    col.sortable ? 'cursor-pointer select-none hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-400' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                  onKeyDown={(e) => col.sortable && handleHeaderKeyDown(e, col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-neutral-400" aria-hidden="true">
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th scope="col" className="px-4 py-3 text-left font-medium text-neutral-600">
                  {actionsLabel}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center text-neutral-500"
                  role="status"
                >
                  {noResultsMessage}
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b last:border-b-0 hover:bg-neutral-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">{actions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav aria-label="Pagination" className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="text-neutral-500" aria-live="polite" aria-atomic="true">
          {sorted.length > 0
            ? `${showingLabel} ${startIdx}-${endIdx} ${ofLabel} ${sorted.length} ${resultsLabel}`
            : ''}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="rows-per-page" className="text-neutral-500">{rowsPerPageLabel}:</label>
            <select
              id="rows-per-page"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1" role="group" aria-label="Page navigation">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label={prevLabel}
              className="px-3 py-1 border rounded hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {prevLabel}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, i, arr) => (
                <span key={p} className="flex items-center">
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span className="px-1 text-neutral-400" aria-hidden="true">…</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? 'page' : undefined}
                    className={`px-3 py-1 border rounded transition ${
                      p === page
                        ? 'bg-neutral-800 text-white border-neutral-800'
                        : 'hover:bg-neutral-100'
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label={nextLabel}
              className="px-3 py-1 border rounded hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
