'use client';

import { PerformanceDataPoint } from '@/lib/mock/performanceData';

interface SummaryProps {
  data: PerformanceDataPoint[];
  avgLabel: string;
  minLabel: string;
  maxLabel: string;
}

function avg(arr: number[]) {
  return arr.length ? parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : 0;
}

export default function PerformanceSummary({ data, avgLabel, minLabel, maxLabel }: SummaryProps) {
  const metrics = [
    {
      label: 'Uptime',
      avg: avg(data.map((d) => d.uptime)),
      min: Math.min(...data.map((d) => d.uptime)),
      max: Math.max(...data.map((d) => d.uptime)),
      unit: '%',
      color: 'text-emerald-600',
    },
    {
      label: 'Response Time',
      avg: avg(data.map((d) => d.responseTime)),
      min: Math.min(...data.map((d) => d.responseTime)),
      max: Math.max(...data.map((d) => d.responseTime)),
      unit: 'ms',
      color: 'text-blue-600',
    },
    {
      label: 'Error Rate',
      avg: avg(data.map((d) => d.errorRate)),
      min: Math.min(...data.map((d) => d.errorRate)),
      max: Math.max(...data.map((d) => d.errorRate)),
      unit: '%',
      color: 'text-red-600',
    },
    {
      label: 'Throughput',
      avg: avg(data.map((d) => d.throughput)),
      min: Math.min(...data.map((d) => d.throughput)),
      max: Math.max(...data.map((d) => d.throughput)),
      unit: 'req/s',
      color: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white rounded-lg border p-3">
          <p className="text-xs text-neutral-500 mb-1">{m.label}</p>
          <p className={`text-xl font-bold ${m.color}`}>
            {m.avg}
            <span className="text-xs font-normal text-neutral-400 ml-1">{m.unit}</span>
          </p>
          <div className="flex gap-3 mt-1 text-xs text-neutral-400">
            <span>{minLabel}: {m.min}{m.unit}</span>
            <span>{maxLabel}: {m.max}{m.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
