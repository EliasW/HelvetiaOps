import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* simple sidebar */}
      <aside className="w-64 bg-neutral-800 text-neutral-100 p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li><a href="/dashboard" className="hover:underline">Home</a></li>
            <li><a href="/dashboard/settings" className="hover:underline">Settings</a></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-neutral-100 text-neutral-900">
        {children}
      </main>
    </div>
  );
}