'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Project, Activity } from '@/types/entities';
import ActivityTimeline from './ActivityTimeline';
import KPICard from './KPICard';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-neutral-100 text-neutral-600',
  archived: 'bg-amber-100 text-amber-700',
};

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-4 items-center">
        <div className="h-8 bg-neutral-200 rounded w-64"></div>
        <div className="h-6 bg-neutral-200 rounded-full w-16"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-24 bg-neutral-200 rounded-lg"></div>
          <div className="h-48 bg-neutral-200 rounded-lg"></div>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-neutral-200 rounded-lg"></div>
          <div className="h-48 bg-neutral-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailView({ projectId }: { projectId: string }) {
  const t = useTranslations('ProjectDetail');
  const locale = useLocale();
  const { data: session } = useSession();
  const [tab, setTab] = useState<'overview' | 'activity'>('overview');
  const [comment, setComment] = useState('');

  const userRole = (session?.user as any)?.role ?? 'viewer';
  const isReadOnly = userRole === 'viewer';

  const project = useQuery<ApiResponse<Project>>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch project');
      return res.json();
    },
  });

  const activities = useQuery<PaginatedResponse<Activity>>({
    queryKey: ['activities', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/activities`);
      if (!res.ok) throw new Error('Failed to fetch activities');
      return res.json();
    },
  });

  if (project.isLoading) return <DetailSkeleton />;

  if (project.isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 mb-3">{t('errorLoading')}</p>
        <p className="text-sm text-red-500 mb-4">{project.error?.message}</p>
        <button onClick={() => project.refetch()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
          {t('retry')}
        </button>
      </div>
    );
  }

  const p = project.data?.data;
  if (!p) return null;

  const activityData = activities.data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/dashboard/projects`}
            className="text-neutral-400 hover:text-neutral-600 transition"
          >
            ← {t('backToProjects')}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {isReadOnly && (
            <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-500 rounded-full">
              {t('readOnly')}
            </span>
          )}
          {!isReadOnly && (
            <button className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition text-sm">
              {t('editProject')}
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>
          {p.status}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            onClick={() => setTab('overview')}
            className={`pb-3 text-sm font-medium border-b-2 transition ${
              tab === 'overview'
                ? 'border-neutral-800 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {t('overview')}
          </button>
          <button
            onClick={() => setTab('activity')}
            className={`pb-3 text-sm font-medium border-b-2 transition ${
              tab === 'activity'
                ? 'border-neutral-800 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {t('activity')} ({activityData.length})
          </button>
        </div>
      </div>

      {tab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg border p-5">
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">{t('description')}</h3>
              <p className="text-sm text-neutral-600">
                {p.description || <span className="italic text-neutral-400">{t('noDescription')}</span>}
              </p>
            </div>

            {/* KPIs */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">{t('kpis')}</h3>
              {p.kpis.length === 0 ? (
                <div className="bg-white rounded-lg border p-8 text-center text-neutral-500 text-sm">
                  {t('noKpis')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {p.kpis.map((kpi) => (
                    <KPICard key={kpi.id} kpi={kpi} targetLabel={t('target')} currentLabel={t('current')} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Project info */}
            <div className="bg-white rounded-lg border p-5 space-y-3">
              <InfoRow label={t('status')}>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>
                  {p.status}
                </span>
              </InfoRow>
              <InfoRow label={t('owner')}>
                <span className="text-sm">{p.owner}</span>
              </InfoRow>
              <InfoRow label={t('team')}>
                <span className="text-sm">{p.teamId}</span>
              </InfoRow>
              <InfoRow label={t('startDate')}>
                <span className="text-sm">{new Date(p.startDate).toLocaleDateString()}</span>
              </InfoRow>
              <InfoRow label={t('endDate')}>
                <span className="text-sm">
                  {p.endDate ? new Date(p.endDate).toLocaleDateString() : t('notSet')}
                </span>
              </InfoRow>
            </div>

            {/* Members */}
            <div className="bg-white rounded-lg border p-5">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">{t('members')}</h3>
              <div className="space-y-2">
                {p.members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      {(m.name || m.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{m.name || m.email}</p>
                      <p className="text-xs text-neutral-500">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Activity tab */
        <div className="space-y-4">
          {/* Comment input (only for non-viewers) */}
          {!isReadOnly && (
            <div className="flex gap-3">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('addComment')}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />
              <button
                onClick={() => { alert(`Comment: ${comment}`); setComment(''); }}
                disabled={!comment.trim()}
                className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-sm hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {t('submitComment')}
              </button>
            </div>
          )}

          {activities.isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-200"></div>
                  <div className="flex-1 h-16 bg-neutral-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <ActivityTimeline activities={activityData} noActivityMessage={t('noActivity')} />
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-500">{label}</span>
      {children}
    </div>
  );
}
