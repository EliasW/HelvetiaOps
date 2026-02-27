"use client";

import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

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
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={handleLogout}
      >
        Sign out
      </button>
    </div>
  );
}