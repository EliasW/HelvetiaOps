'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import DateRangeFilter, { DatePreset } from './DateRangeFilter';
import {
  UptimeChart,
  ResponseTimeChart,
  ErrorRateChart,
  DeploymentsChart,
  ThroughputChart,
} from './PerformanceChart';
import PerformanceSummary from './PerformanceSummary';
import { PerformanceDataPoint } from '@/lib/mock/performanceData';

const PRESET_DAYS: Record<DatePreset, number> = {
  '7d': 7,
  '14d': 14,
  '30d': 30,
  '90d': 90,
};

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-4 animate-pulse">
      <div className="h-4 bg-neutral-200 rounded w-32 mb-4"></div>
      <div className="h-[250px] bg-neutral-100 rounded"></div>
    </div>
  );
}

export default function PerformanceDashboard() {
  const t = useTranslations('Performance');
  const [preset, setPreset] = useState<DatePreset>('30d');
  const [compareEnabled, setCompareEnabled] = useState(false);

  const { start, end, compareStart, compareEnd } = useMemo(() => {
    const days = PRESET_DAYS[preset];
    const now = new Date();
    const endDate = new Date(now);
    const startDate = new Date(now.getTime() - days * 86400000);
    const compEnd = new Date(startDate.getTime() - 86400000);
    const compStart = new Date(compEnd.getTime() - days * 86400000);

    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      compareStart: compStart.toISOString().split('T')[0],
      compareEnd: compEnd.toISOString().split('T')[0],
    };
  }, [preset]);

  const url = useMemo(() => {
    let u = `/api/performance?start=${start}&end=${end}`;
    if (compareEnabled) {
      u += `&compareStart=${compareStart}&compareEnd=${compareEnd}`;
    }
    return u;
  }, [start, end, compareEnabled, compareStart, compareEnd]);

  const { data, isLoading, isError, error, refetch } = useQuery<{
    success: boolean;
    data: {
      current: PerformanceDataPoint[];
      comparison: PerformanceDataPoint[] | null;
    };
  }>({
    queryKey: ['performance', preset, compareEnabled],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const currentData = data?.data?.current ?? [];
  const comparisonData = compareEnabled ? data?.data?.comparison : null;
  const currentLabel = t('currentPeriod');
  const previousLabel = t('previousPeriod');

  if (isError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-3">{t('errorLoading')}</p>
          <p className="text-sm text-red-500 mb-4">{error?.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <DateRangeFilter
          preset={preset}
          onPresetChange={setPreset}
          compareEnabled={compareEnabled}
          onCompareToggle={setCompareEnabled}
        />
      </div>

      {/* Summary stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-3 animate-pulse">
              <div className="h-3 bg-neutral-200 rounded w-16 mb-2"></div>
              <div className="h-6 bg-neutral-200 rounded w-20 mb-1"></div>
              <div className="h-3 bg-neutral-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : (
        <PerformanceSummary
          data={currentData}
          avgLabel={t('avg')}
          minLabel={t('min')}
          maxLabel={t('max')}
        />
      )}

      {/* Charts grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      ) : currentData.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-neutral-600">{t('noData')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">{t('uptime')} (%)</h3>
            <UptimeChart
              data={currentData}
              comparisonData={comparisonData}
              currentLabel={currentLabel}
              previousLabel={previousLabel}
            />
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">{t('responseTime')} ({t('ms')})</h3>
            <ResponseTimeChart
              data={currentData}
              comparisonData={comparisonData}
              currentLabel={currentLabel}
              previousLabel={previousLabel}
            />
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">{t('errorRate')} (%)</h3>
            <ErrorRateChart
              data={currentData}
              comparisonData={comparisonData}
              currentLabel={currentLabel}
              previousLabel={previousLabel}
            />
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">{t('deployments')}</h3>
            <DeploymentsChart
              data={currentData}
              comparisonData={comparisonData}
              currentLabel={currentLabel}
              previousLabel={previousLabel}
            />
          </div>

          <div className="bg-white rounded-lg border p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">{t('throughput')} ({t('reqSec')})</h3>
            <ThroughputChart
              data={currentData}
              comparisonData={comparisonData}
              currentLabel={currentLabel}
              previousLabel={previousLabel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
