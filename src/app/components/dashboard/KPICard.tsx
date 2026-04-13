'use client';

import { KPI } from '@/types/entities';

const statusColors = {
  'on-track': { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100', dot: 'bg-emerald-500' },
  'at-risk': { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100', dot: 'bg-amber-500' },
  'off-track': { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100', dot: 'bg-red-500' },
};

interface KPICardProps {
  kpi: KPI;
  targetLabel: string;
  currentLabel: string;
}

export default function KPICard({ kpi, targetLabel, currentLabel }: KPICardProps) {
  const colors = statusColors[kpi.status];
  const progress = Math.min((kpi.current / kpi.target) * 100, 100);

  return (
    <div className={`rounded-lg border p-4 ${colors.bg} transition-shadow hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-neutral-900 truncate flex-1">{kpi.name}</h4>
        <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge} ${colors.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
          {kpi.status.replace('-', ' ')}
        </span>
      </div>

      {kpi.description && (
        <p className="text-xs text-neutral-500 mb-3 line-clamp-1">{kpi.description}</p>
      )}

      <div className="flex justify-between text-sm mb-2">
        <span className="text-neutral-600">{currentLabel}: <span className="font-semibold text-neutral-900">{kpi.current}{kpi.unit}</span></span>
        <span className="text-neutral-500">{targetLabel}: {kpi.target}{kpi.unit}</span>
      </div>

      <div className="w-full bg-neutral-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all ${colors.dot}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
