'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import { PaginatedResponse } from '@/types/api';
import { Project } from '@/types/entities';
import VirtualizedTable from './VirtualizedTable';
import { Column } from './DataTable';
import { SkeletonTable } from '@/app/components/ui/Skeleton';
import ErrorBanner from '@/app/components/ui/ErrorBanner';

const DATASET_SIZE = 10000;

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-neutral-100 text-neutral-600',
  archived: 'bg-amber-100 text-amber-700',
};

export default function AllProjectsView() {
  const t = useTranslations('ProjectsTable');
  const locale = useLocale();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading, isError, error, refetch } = useQuery<PaginatedResponse<Project>>({
    queryKey: ['projects-large', DATASET_SIZE],
    queryFn: async () => {
      const res = await fetch(`/api/projects?count=${DATASET_SIZE}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 min
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
        <div className="truncate">
          <p className="font-medium text-neutral-900 truncate">{row.name}</p>
          {row.description && (
            <p className="text-xs text-neutral-500 truncate mt-0.5">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: t('status'),
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[row.status] ?? ''}`}>
          {t(row.status)}
        </span>
      ),
    },
    {
      key: 'owner',
      label: t('owner'),
      sortable: true,
      render: (row) => <span className="text-neutral-700 truncate">{row.owner}</span>,
    },
    {
      key: 'members',
      label: t('members'),
      render: (row) => <span className="text-neutral-600">{row.members.length}</span>,
    },
    {
      key: 'kpis',
      label: t('kpis'),
      render: (row) => <span className="text-neutral-600">{row.kpis.length}</span>,
    },
    {
      key: 'startDate',
      label: t('startDate'),
      sortable: true,
      render: (row) => (
        <span className="text-neutral-600 text-xs whitespace-nowrap">
          {new Date(row.startDate).toLocaleDateString()}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
          <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse" />
        </div>
        <SkeletonTable rows={10} cols={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorBanner
        title="All Projects"
        message={error?.message ?? 'Unknown error'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <span className="px-2.5 py-0.5 bg-neutral-200 text-neutral-700 rounded-full text-xs font-medium">
            {allProjects.length.toLocaleString()}
          </span>
        </div>
      </div>

      <VirtualizedTable
        data={filtered}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder={t('search')}
        searchFn={(row, q) =>
          row.name.toLowerCase().includes(q) ||
          (row.description?.toLowerCase().includes(q) ?? false) ||
          row.owner.toLowerCase().includes(q)
        }
        filterSlot={
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">{t('filterStatus')}:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
              aria-label={t('filterStatus')}
            >
              <option value="all">{t('all')}</option>
              <option value="active">{t('active')}</option>
              <option value="inactive">{t('inactive')}</option>
              <option value="archived">{t('archived')}</option>
            </select>
          </div>
        }
        showingLabel={t('showing')}
        ofLabel={t('of')}
        resultsLabel={t('results')}
        noResultsMessage={t('noResults')}
        tableHeight={600}
        overscan={10}
      />
    </div>
  );
}
