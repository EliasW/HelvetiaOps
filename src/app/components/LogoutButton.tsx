'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton({ locale, label }: { locale: string; label: string }) {
  const handleLogout = () => {
    signOut({ callbackUrl: `/${locale}/auth` });
  };

  return (
    <button
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      onClick={handleLogout}
    >
      {label}
    </button>
  );
}
