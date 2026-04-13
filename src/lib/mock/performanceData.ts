export interface PerformanceDataPoint {
  date: string; // YYYY-MM-DD
  uptime: number;
  responseTime: number;
  errorRate: number;
  deployments: number;
  throughput: number;
}

function randomBetween(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

/**
 * Generate daily performance data for a given date range
 */
export function generatePerformanceData(
  startDate: Date,
  endDate: Date
): PerformanceDataPoint[] {
  const data: PerformanceDataPoint[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    data.push({
      date: current.toISOString().split('T')[0],
      uptime: randomBetween(99.2, 99.99, 2),
      responseTime: randomBetween(
        isWeekend ? 120 : 180,
        isWeekend ? 200 : 320
      ),
      errorRate: randomBetween(0.05, isWeekend ? 0.4 : 0.8, 2),
      deployments: isWeekend
        ? Math.floor(Math.random() * 2)
        : Math.floor(Math.random() * 5) + 1,
      throughput: randomBetween(
        isWeekend ? 800 : 1500,
        isWeekend ? 1200 : 3000,
        0
      ),
    });

    current.setDate(current.getDate() + 1);
  }

  return data;
}
