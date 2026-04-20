'use client';

import { useState, useMemo, useRef, useCallback, KeyboardEvent, ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Column } from './DataTable';

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  actionsLabel?: string;
  searchPlaceholder?: string;
  searchFn?: (row: T, query: string) => boolean;
  filterSlot?: ReactNode;
  rowHeight?: number;
  tableHeight?: number;
  overscan?: number;
  showingLabel?: string;
  ofLabel?: string;
  resultsLabel?: string;
  noResultsMessage?: string;
}

type SortDir = 'asc' | 'desc' | null;

export default function VirtualizedTable<T>({
  data,
  columns,
  rowKey,
  actions,
  actionsLabel = 'Actions',
  searchPlaceholder = 'Search...',
  searchFn,
  filterSlot,
  rowHeight = 52,
  tableHeight = 600,
  overscan = 10,
  showingLabel = 'Showing',
  ofLabel = 'of',
  resultsLabel = 'results',
  noResultsMessage = 'No results found',
}: VirtualizedTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
  }, []);

  const handleHeaderKeyDown = useCallback((e: KeyboardEvent, key: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(key);
    }
  }, [handleSort]);

  const filtered = useMemo(() => {
    if (!search || !searchFn) return data;
    return data.filter((row) => searchFn(row, search.toLowerCase()));
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

  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const getAriaSortValue = (col: Column<T>): 'ascending' | 'descending' | 'none' | undefined => {
    if (!col.sortable) return undefined;
    if (sortKey === col.key && sortDir === 'asc') return 'ascending';
    if (sortKey === col.key && sortDir === 'desc') return 'descending';
    return 'none';
  };

  const colCount = columns.length + (actions ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between" role="toolbar" aria-label="Table controls">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="px-3 py-2 border rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
        <div className="flex items-center gap-4">
          {filterSlot}
          <span className="text-sm text-neutral-500" aria-live="polite">
            {sorted.length.toLocaleString()} {resultsLabel}
          </span>
        </div>
      </div>

      {/* Virtualized Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        {/* Fixed header */}
        <div className="bg-neutral-50 border-b">
          <div className="flex">
            {columns.map((col) => (
              <div
                key={col.key}
                role="columnheader"
                aria-sort={getAriaSortValue(col)}
                tabIndex={col.sortable ? 0 : undefined}
                className={`px-4 py-3 text-left text-sm font-medium text-neutral-600 flex-1 min-w-[120px] ${
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
              </div>
            ))}
            {actions && (
              <div className="px-4 py-3 text-left text-sm font-medium text-neutral-600 w-20">
                {actionsLabel}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div
          ref={scrollRef}
          style={{ height: tableHeight, overflow: 'auto' }}
          role="table"
          aria-rowcount={sorted.length}
        >
          {sorted.length === 0 ? (
            <div className="flex items-center justify-center text-neutral-500 py-12" role="status">
              {noResultsMessage}
            </div>
          ) : (
            <div
              style={{
                height: virtualizer.getTotalSize(),
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = sorted[virtualRow.index];
                return (
                  <div
                    key={rowKey(row)}
                    role="row"
                    aria-rowindex={virtualRow.index + 1}
                    className="flex border-b last:border-b-0 hover:bg-neutral-50 transition-colors absolute w-full"
                    style={{
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {columns.map((col) => (
                      <div
                        key={col.key}
                        role="cell"
                        className="px-4 py-3 flex items-center text-sm flex-1 min-w-[120px] overflow-hidden"
                      >
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[col.key] ?? '')}
                      </div>
                    ))}
                    {actions && (
                      <div role="cell" className="px-4 py-3 flex items-center w-20">
                        {actions(row)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
