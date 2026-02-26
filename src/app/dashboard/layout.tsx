'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/dashboard', label: 'Home' },
    { href: '/dashboard/settings', label: 'Settings' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen flex">
      {/* mobile hamburger */}
      <button
        className="md:hidden p-2 m-2 text-neutral-100 bg-neutral-800 rounded"
        aria-label="Toggle sidebar"
        onClick={() => setMobileOpen((o) => !o)}
      >
        {/* simple hamburger icon */}
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

      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-neutral-800 text-neutral-100 p-4 transform 
          md:relative md:translate-x-0 transition-transform duration-200 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
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

      <main className="flex-1 p-6 bg-neutral-100 text-neutral-900 md:ml-64">
        {children}
      </main>
    </div>
  );
}
