'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { PerformanceDataPoint } from '@/lib/mock/performanceData';

interface ChartProps {
  data: PerformanceDataPoint[];
  comparisonData?: PerformanceDataPoint[] | null;
  currentLabel: string;
  previousLabel: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function mergeData(
  current: PerformanceDataPoint[],
  comparison: PerformanceDataPoint[] | null | undefined
) {
  return current.map((point, i) => ({
    ...point,
    date: formatDate(point.date),
    compUptime: comparison?.[i]?.uptime,
    compResponseTime: comparison?.[i]?.responseTime,
    compErrorRate: comparison?.[i]?.errorRate,
    compDeployments: comparison?.[i]?.deployments,
    compThroughput: comparison?.[i]?.throughput,
  }));
}

export function UptimeChart({ data, comparisonData, currentLabel, previousLabel }: ChartProps) {
  const merged = mergeData(data, comparisonData);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={merged}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[99, 100]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="uptime"
          name={currentLabel}
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
        />
        {comparisonData && (
          <Line
            type="monotone"
            dataKey="compUptime"
            name={previousLabel}
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            opacity={0.5}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ResponseTimeChart({ data, comparisonData, currentLabel, previousLabel }: ChartProps) {
  const merged = mergeData(data, comparisonData);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={merged}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="responseTime"
          name={currentLabel}
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
        />
        {comparisonData && (
          <Line
            type="monotone"
            dataKey="compResponseTime"
            name={previousLabel}
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            opacity={0.5}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ErrorRateChart({ data, comparisonData, currentLabel, previousLabel }: ChartProps) {
  const merged = mergeData(data, comparisonData);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={merged}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="errorRate"
          name={currentLabel}
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
        />
        {comparisonData && (
          <Line
            type="monotone"
            dataKey="compErrorRate"
            name={previousLabel}
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            opacity={0.5}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DeploymentsChart({ data, comparisonData, currentLabel, previousLabel }: ChartProps) {
  const merged = mergeData(data, comparisonData);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={merged}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="deployments" name={currentLabel} fill="#8b5cf6" radius={[2, 2, 0, 0]} />
        {comparisonData && (
          <Bar dataKey="compDeployments" name={previousLabel} fill="#8b5cf6" opacity={0.3} radius={[2, 2, 0, 0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ThroughputChart({ data, comparisonData, currentLabel, previousLabel }: ChartProps) {
  const merged = mergeData(data, comparisonData);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={merged}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="throughput"
          name={currentLabel}
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
        />
        {comparisonData && (
          <Line
            type="monotone"
            dataKey="compThroughput"
            name={previousLabel}
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            opacity={0.5}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
