'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import DashboardLogoutButton from '@/app/components/DashboardLogoutButton';
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
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus first menu item when menu opens
  useEffect(() => {
    if (userMenuOpen && menuRef.current) {
      const firstItem = menuRef.current.querySelector<HTMLElement>('[role="menuitem"]');
      firstItem?.focus();
    }
  }, [userMenuOpen]);

  const closeMenu = useCallback(() => {
    setUserMenuOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const handleMenuKeyDown = (e: KeyboardEvent) => {
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (!items?.length) return;
    const currentIndex = Array.from(items).findIndex((el) => el === document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        items[(currentIndex + 1) % items.length].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length].focus();
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        closeMenu();
        break;
    }
  };

  return (
    <header className="bg-neutral-800 text-neutral-100 px-4 py-3 flex items-center justify-between md:px-6" role="banner">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold hidden md:block">HelvetiaOps</h1>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        <div className="relative">
          <button
            ref={triggerRef}
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400"
            aria-label="User menu"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold" aria-hidden="true">
              U
            </div>
            <span className="hidden sm:inline text-sm">{translations.user}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeMenu} aria-hidden="true" />
              <div
                ref={menuRef}
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-48 bg-neutral-700 rounded shadow-lg z-50"
                onKeyDown={handleMenuKeyDown}
              >
                <div className="px-4 py-2 border-b border-neutral-600">
                  {session?.user && (
                    <>
                      <p className="text-sm font-semibold">{translations.loggedInUser}</p>
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
                    role="menuitem"
                    tabIndex={-1}
                    className="block px-4 py-2 hover:bg-neutral-600 focus:bg-neutral-600 focus:outline-none text-sm"
                    onClick={closeMenu}
                  >
                    {translations.settings}
                  </Link>
                  <div role="menuitem" tabIndex={-1} onClick={closeMenu} onKeyDown={(e) => { if (e.key === 'Enter') closeMenu(); }} className="focus:bg-neutral-600 focus:outline-none">
                    <DashboardLogoutButton locale={locale} />
                  </div>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
