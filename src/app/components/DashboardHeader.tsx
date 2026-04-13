'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import DashboardLogoutButton from '@/app/components/DashboardLogoutButton';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

interface HeaderProps {
  locale: string;
  translations: {
    user: string;
    settings: string;
    logout: string;
    loggedInUser: string;
  };
}

export default function DashboardHeader({
  locale,
  translations,
}: Readonly<HeaderProps>) {
  const {data: session} = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-neutral-800 text-neutral-100 px-4 py-3 flex items-center justify-between md:px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold hidden md:block">HelvetiaOps</h1>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-700 transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
              U
            </div>
            <span className="hidden sm:inline text-sm">{translations.user}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-700 rounded shadow-lg z-50">
              <div className="px-4 py-2 border-b border-neutral-600">
                {session?.user && (
                  <>
                    <p className="text-sm font-semibold">
                      {translations.loggedInUser}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      <strong>{session.user.email}</strong>
                    </p>
                    <p className="text-xs text-neutral-400">
                      <em>{(session.user as any).role}</em>
                    </p>
                  </>
                )}
              </div>

              <nav className="py-1">
                <Link
                  href={`/${locale}/dashboard/settings`}
                  className="block px-4 py-2 hover:bg-neutral-600 text-sm"
                  onClick={() => setUserMenuOpen(false)}
                >
                  {translations.settings}
                </Link>
                <div onClick={() => setUserMenuOpen(false)}>
                  <DashboardLogoutButton locale={locale} />
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
