"use client";

import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Can from '@/components/Can';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // protected by middleware, but useEffect serves as a fallback client-side guard
  useEffect(() => {
    if (!session) {
      router.push('/auth');
    }
  }, [session, router]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to the dashboard</h1>
      {session?.user && (
        <p className="mt-2">
          Logged in as <strong>{session.user.email}</strong> (role: <em>{(session.user as any).role}</em>)
        </p>
      )}
      {/* guarded UI actions */}
      <div id='listMembers' className="mt-4 space-x-2">
        <div>members list</div>
        {/* Admin-only action */}
      {  <Can minRole="admin" fallback={null}>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded">Admin Panel</button>
        </Can>}

        {/* Manager+ action */}
        <Can minRole="manager" fallback={null}>
          <button className="px-3 py-1 bg-emerald-600 text-white rounded">Manage Users</button>
        </Can>

        {/* Viewer+ action (everyone with a session) */}
        <Can minRole="viewer" fallback={null}>
          <button className="px-3 py-1 bg-gray-600 text-white rounded">View Reports</button>
        </Can>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={handleLogout}
      >
        Sign out
      </button>
    </div>
  );
}