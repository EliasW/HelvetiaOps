'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');

  const links = [
    { href: '/dashboard', label: 'Home' },
    { href: '/dashboard/settings', label: 'Settings' },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    // TODO: Implement logout logic (clear auth, redirect to login)
    console.log('Logging out...');
    router.push('/auth');
  };

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    // TODO: Implement language change logic (save preference, update UI)
    console.log('Language changed to:', code);
    setUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="bg-neutral-800 text-neutral-100 px-4 py-3 flex items-center justify-between md:px-6">
        <div className="flex items-center gap-4">
          {/* mobile hamburger */}
          <button
            className="md:hidden p-2 -m-2 text-neutral-100 hover:bg-neutral-700 rounded"
            aria-label="Toggle sidebar"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold hidden md:block">HelvetiaOps</h1>
        </div>

        {/* User Menu and Language Switcher */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1 bg-neutral-700 text-neutral-100 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Language selector"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-700 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                U
              </div>
              <span className="hidden sm:inline text-sm">User</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* User Menu Dropdown Content */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-700 rounded shadow-lg z-50">
                <div className="px-4 py-2 border-b border-neutral-600">
                  <p className="text-sm font-semibold">Logged in User</p>
                  <p className="text-xs text-neutral-400">user@example.com</p>
                </div>
                <nav className="py-1">
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 hover:bg-neutral-600 text-sm"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-600 text-sm text-red-400 hover:text-red-300"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-20 w-64 bg-neutral-800 text-neutral-100 p-4 transform 
            md:relative md:inset-auto md:translate-x-0 transition-transform duration-200 ease-in-out
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <nav>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-2 py-1 rounded 
                        ${isActive(link.href) ? 'bg-neutral-700 font-semibold' : 'hover:bg-neutral-700'}
                      `}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-6 bg-neutral-100 text-neutral-900">
          {children}
        </main>
      </div>
    </div>
  );
}
