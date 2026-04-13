'use client';

import { useTranslations } from 'next-intl';

export type DatePreset = '7d' | '14d' | '30d' | '90d';

interface DateRangeFilterProps {
  preset: DatePreset;
  onPresetChange: (preset: DatePreset) => void;
  compareEnabled: boolean;
  onCompareToggle: (enabled: boolean) => void;
}

export default function DateRangeFilter({
  preset,
  onPresetChange,
  compareEnabled,
  onCompareToggle,
}: DateRangeFilterProps) {
  const t = useTranslations('Performance');

  const presets: { value: DatePreset; label: string }[] = [
    { value: '7d', label: t('last7') },
    { value: '14d', label: t('last14') },
    { value: '30d', label: t('last30') },
    { value: '90d', label: t('last90') },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-500">{t('dateRange')}:</span>
        <div className="flex rounded-lg border overflow-hidden">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => onPresetChange(p.value)}
              className={`px-3 py-1.5 text-sm transition ${
                preset === p.value
                  ? 'bg-neutral-800 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={compareEnabled}
          onChange={(e) => onCompareToggle(e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300 text-neutral-800 focus:ring-neutral-500"
        />
        <span className="text-sm text-neutral-600">{t('compare')}</span>
      </label>
    </div>
  );
}
