'use client';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}
