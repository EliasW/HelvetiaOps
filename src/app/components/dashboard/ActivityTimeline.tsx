'use client';

import { Activity } from '@/types/entities';
import { useTranslations } from 'next-intl';

const typeIcons: Record<Activity['type'], { bg: string; icon: string }> = {
  created: { bg: 'bg-blue-100 text-blue-600', icon: '✦' },
  updated: { bg: 'bg-neutral-100 text-neutral-600', icon: '✎' },
  member_added: { bg: 'bg-emerald-100 text-emerald-600', icon: '+' },
  member_removed: { bg: 'bg-red-100 text-red-600', icon: '−' },
  kpi_added: { bg: 'bg-purple-100 text-purple-600', icon: '◎' },
  kpi_updated: { bg: 'bg-amber-100 text-amber-600', icon: '↻' },
  status_changed: { bg: 'bg-indigo-100 text-indigo-600', icon: '⇄' },
  comment: { bg: 'bg-sky-100 text-sky-600', icon: '💬' },
};

function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

interface ActivityTimelineProps {
  activities: Activity[];
  noActivityMessage: string;
}

export default function ActivityTimeline({ activities, noActivityMessage }: ActivityTimelineProps) {
  const t = useTranslations('ProjectDetail');

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <p>{noActivityMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200" />

      <div className="space-y-4">
        {activities.map((activity) => {
          const style = typeIcons[activity.type];
          const typeLabel = t(activity.type.replace('_', '') as any, { defaultValue: activity.type });

          return (
            <div key={activity.id} className="relative flex gap-4 pl-1">
              {/* Icon */}
              <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${style.bg}`}>
                {style.icon}
              </div>

              {/* Content */}
              <div className="flex-1 bg-white rounded-lg border p-3 -mt-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-sm text-neutral-900">{activity.userName}</span>
                    <span className="text-xs text-neutral-400 ml-2">{timeAgo(activity.createdAt)}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg}`}>
                    {typeLabel}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">{activity.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
