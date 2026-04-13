'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { PaginatedResponse } from '@/types/api';
import { Project } from '@/types/entities';
import DataTable, { Column } from './DataTable';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-neutral-100 text-neutral-600',
  archived: 'bg-amber-100 text-amber-700',
};

export default function ProjectsTable() {
  const t = useTranslations('ProjectsTable');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery<PaginatedResponse<Project>>({
    queryKey: ['projects-all'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const allProjects = data?.data ?? [];
  const filtered = statusFilter === 'all'
    ? allProjects
    : allProjects.filter((p) => p.status === statusFilter);

  const columns: Column<Project>[] = [
    {
      key: 'name',
      label: t('name'),
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-900">{row.name}</p>
          {row.description && (
            <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: t('status'),
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status] ?? ''}`}>
          {t(row.status as 'active' | 'inactive' | 'archived')}
        </span>
      ),
    },
    {
      key: 'owner',
      label: t('owner'),
      sortable: true,
      render: (row) => (
        <span className="text-neutral-700">{row.owner}</span>
      ),
    },
    {
      key: 'members',
      label: t('members'),
      render: (row) => (
        <div className="flex -space-x-2">
          {row.members.slice(0, 3).map((m) => (
            <div
              key={m.id}
              className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white"
              title={m.name || m.email}
            >
              {(m.name || m.email).charAt(0).toUpperCase()}
            </div>
          ))}
          {row.members.length > 3 && (
            <div className="w-7 h-7 rounded-full bg-neutral-300 text-neutral-700 text-xs flex items-center justify-center border-2 border-white">
              +{row.members.length - 3}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'kpis',
      label: t('kpis'),
      render: (row) => (
        <span className="text-neutral-600">{row.kpis.length}</span>
      ),
    },
    {
      key: 'startDate',
      label: t('startDate'),
      sortable: true,
      render: (row) => (
        <span className="text-neutral-600 text-xs">
          {new Date(row.startDate).toLocaleDateString()}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-neutral-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-neutral-200 rounded animate-pulse"></div>
        <div className="bg-white rounded-lg border overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3 border-b animate-pulse">
              <div className="h-4 bg-neutral-200 rounded flex-1"></div>
              <div className="h-4 bg-neutral-200 rounded w-16"></div>
              <div className="h-4 bg-neutral-200 rounded w-20"></div>
              <div className="h-4 bg-neutral-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 mb-3">{error?.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          {t('noResults')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder={t('search')}
        searchFn={(row, q) =>
          row.name.toLowerCase().includes(q) ||
          (row.description?.toLowerCase().includes(q) ?? false)
        }
        filterSlot={
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">{t('filterStatus')}:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="all">{t('all')}</option>
              <option value="active">{t('active')}</option>
              <option value="inactive">{t('inactive')}</option>
              <option value="archived">{t('archived')}</option>
            </select>
          </div>
        }
        actionsLabel={t('actions')}
        actions={(row) => (
          <div className="relative">
            <button
              onClick={() => setActionMenuId(actionMenuId === row.id ? null : row.id)}
              className="p-1 rounded hover:bg-neutral-100 transition"
              aria-label="Actions"
            >
              <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>
            {actionMenuId === row.id && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
                <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg z-20 py-1">
                  <button
                    onClick={() => { alert(`View: ${row.name}`); setActionMenuId(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition"
                  >
                    {t('view')}
                  </button>
                  <button
                    onClick={() => { alert(`Edit: ${row.name}`); setActionMenuId(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => { alert(`Archive: ${row.name}`); setActionMenuId(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition"
                  >
                    {t('archive')}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t('confirmDelete'))) alert(`Deleted: ${row.name}`);
                      setActionMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    {t('delete')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        showingLabel={t('showing')}
        ofLabel={t('of')}
        resultsLabel={t('results')}
        prevLabel={t('prev')}
        nextLabel={t('next')}
        rowsPerPageLabel={t('rowsPerPage')}
        noResultsMessage={t('noResults')}
      />
    </div>
  );
}
