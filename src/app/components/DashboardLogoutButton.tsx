'use client';

import { signOut } from 'next-auth/react';

interface DashboardLogoutButtonProps {
  locale: string;
}

export default function DashboardLogoutButton({
  locale,
}: DashboardLogoutButtonProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: `/${locale}/auth` });
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 hover:bg-neutral-600 text-sm text-red-400 hover:text-red-300"
    >
      Logout
    </button>
  );
}
