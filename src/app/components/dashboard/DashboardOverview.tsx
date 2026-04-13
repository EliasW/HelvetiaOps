'use client';
import { useTranslations } from 'next-intl';
import { useKpis, useProjects, useTeams } from './queries';

import KPICard from './KPICard';
import StatCard from './StatCard';
import { DashboardSkeleton } from './DashboardSkeleton';

export default function DashboardOverview() {
  const t = useTranslations('Dashboard.overview');

  const projects = useProjects();
  const teams = useTeams();
  const kpis = useKpis();

  const isLoading = projects.isLoading || teams.isLoading || kpis.isLoading;
  const isError = projects.isError || teams.isError || kpis.isError;
  const error = projects.error || teams.error || kpis.error;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 mb-3">{t('errorLoading')}</p>
        <p className="text-sm text-red-500 mb-4">{error?.message}</p>
        <button
          onClick={() => {
            projects.refetch();
            teams.refetch();
            kpis.refetch();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  const kpiData = kpis.data?.data ?? [];
  const projectData = projects.data?.data ?? [];
  const teamData = teams.data?.data ?? [];

  const onTrack = kpiData.filter((k) => k.status === 'on-track').length;
  const atRisk = kpiData.filter((k) => k.status === 'at-risk').length;
  const offTrack = kpiData.filter((k) => k.status === 'off-track').length;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t('projects')}
          value={projectData.length}
          color="bg-blue-100 text-blue-600"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
        />
        <StatCard
          label={t('teams')}
          value={teamData.length}
          color="bg-purple-100 text-purple-600"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label={t('onTrack')}
          value={onTrack}
          color="bg-emerald-100 text-emerald-600"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label={t('atRisk')}
          value={atRisk + offTrack}
          color="bg-amber-100 text-amber-600"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
        />
      </div>

      {/* KPI Overview */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">{t('recentKpis')}</h2>
        {kpiData.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="mt-4 text-neutral-600">{t('noKpis')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiData.map((kpi) => (
              <KPICard
                key={kpi.id}
                kpi={kpi}
                targetLabel={t('target')}
                currentLabel={t('current')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Projects Summary */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">{t('projectsSummary')}</h2>
        {projectData.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="mt-4 text-neutral-600">{t('noProjects')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectData.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-900">{project.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {project.status}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{project.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span>{project.members.length} members</span>
                  <span>{project.kpis.length} KPIs</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
