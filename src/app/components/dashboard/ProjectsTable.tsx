'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { PaginatedResponse } from '@/types/api';
import { Project } from '@/types/entities';
import DataTable, { Column } from './DataTable';
import { Skeleton, SkeletonTable } from '@/app/components/ui/Skeleton';
import ErrorBanner from '@/app/components/ui/ErrorBanner';

type ProjectActionMenuProps = Readonly<{
  row: Project;
  isOpen: boolean;
  locale: string;
  onToggle: () => void;
  onClose: () => void;
  translate: (key: string) => string;
}>;

function ProjectActionMenu({ row, isOpen, locale, onToggle, onClose, translate }: ProjectActionMenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 176;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < menuHeight;

      setMenuPos({
        top: openUpward ? rect.top - menuHeight : rect.bottom + 4,
        left: rect.right - 144,
      });
    }
  }, [isOpen]);

  // Focus first menu item when menu opens
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstItem = menuRef.current.querySelector<HTMLElement>('[role="menuitem"]');
      firstItem?.focus();
    }
  }, [isOpen]);

  // Return focus to trigger when menu closes
  const handleClose = () => {
    onClose();
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (!items?.length) return;
    const currentIndex = Array.from(items).findIndex((el) => el === document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        items[(currentIndex + 1) % items.length].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length].focus();
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
      case 'Tab':
        handleClose();
        break;
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        className="p-1 rounded hover:bg-neutral-100 transition focus:outline-none focus:ring-2 focus:ring-neutral-400"
        aria-label="Actions"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
        </svg>
      </button>

      {isOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={handleClose} aria-hidden="true" />
          <div
            ref={menuRef}
            role="menu"
            aria-label={`Actions for ${row.name}`}
            className="fixed w-36 bg-white border rounded-lg shadow-lg z-[9999] py-1"
            style={{ top: menuPos.top, left: menuPos.left }}
            onKeyDown={handleMenuKeyDown}
          >
            <Link
              href={`/${locale}/dashboard/projects/${row.id}`}
              role="menuitem"
              tabIndex={-1}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none transition"
              onClick={handleClose}
            >
              {translate('view')}
            </Link>
            <Link
              href={`/${locale}/dashboard/projects/${row.id}/edit`}
              role="menuitem"
              tabIndex={-1}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none transition"
              onClick={handleClose}
            >
              {translate('edit')}
            </Link>
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => { alert(`Archive: ${row.name}`); handleClose(); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none transition"
            >
              {translate('archive')}
            </button>
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => { if (confirm(translate('confirmDelete'))) alert(`Deleted: ${row.name}`); handleClose(); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none transition"
            >
              {translate('delete')}
            </button>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-neutral-100 text-neutral-600',
  archived: 'bg-amber-100 text-amber-700',
};

function renderProjectActions(
  row: Project,
  actionMenuId: string | null,
  locale: string,
  setActionMenuId: (id: string | null) => void,
  translate: (key: string) => string
) {
  return (
    <ProjectActionMenu
      row={row}
      isOpen={actionMenuId === row.id}
      locale={locale}
      onToggle={() => setActionMenuId(actionMenuId === row.id ? null : row.id)}
      onClose={() => setActionMenuId(null)}
      translate={translate}
    />
  );
}

export default function ProjectsTable() {
  const t = useTranslations('ProjectsTable');
  const params = useParams() as { locale: string };
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
          {t(row.status)}
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
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorBanner
        title={t('title')}
        message={error?.message ?? 'Unknown error'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link
          href={`/${params.locale}/dashboard/projects/new`}
          className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {t('newProject')}
        </Link>
      </div>

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
        actions={(row) => renderProjectActions(row, actionMenuId, params.locale, setActionMenuId, t)}
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
