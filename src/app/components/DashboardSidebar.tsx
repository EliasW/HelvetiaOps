'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  locale: string;
  links: { href: string; label: string }[];
  menuLabel: string;
}

export default function DashboardSidebar({
  locale,
  links,
  menuLabel,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-3 left-4 p-2 text-neutral-100 hover:bg-neutral-700 rounded z-30"
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

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-16 left-0 z-20 w-64 bg-neutral-800 text-neutral-100 p-4 transform 
          md:relative md:inset-auto md:translate-x-0 transition-transform duration-200 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <h2 className="text-xl font-bold mb-4">{menuLabel}</h2>
        <nav>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-2 py-1 rounded 
                    ${
                      isActive(link.href)
                        ? 'bg-neutral-700 font-semibold'
                        : 'hover:bg-neutral-700'
                    }
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
    </>
  );
}
