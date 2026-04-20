'use client';

import { useState, useRef, KeyboardEvent } from 'react';
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
  const navRef = useRef<HTMLUListElement>(null);

  const isActive = (href: string) => pathname === href;

  const handleNavKeyDown = (e: KeyboardEvent) => {
    const items = navRef.current?.querySelectorAll<HTMLElement>('a');
    if (!items?.length) return;
    const currentIndex = Array.from(items).findIndex((el) => el === document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(currentIndex + 1) % items.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length].focus();
    }
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-3 left-4 p-2 text-neutral-100 hover:bg-neutral-700 rounded z-30 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        aria-label="Toggle sidebar"
        aria-expanded={mobileOpen}
        aria-controls="sidebar-nav"
        onClick={() => setMobileOpen((o) => !o)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar-nav"
        role="navigation"
        aria-label={menuLabel}
        className={`fixed inset-y-16 left-0 z-20 w-64 bg-neutral-800 text-neutral-100 p-4 transform 
          md:relative md:inset-auto md:translate-x-0 transition-transform duration-200 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <h2 className="text-xl font-bold mb-4">{menuLabel}</h2>
        <nav>
          <ul ref={navRef} className="space-y-2" role="list" onKeyDown={handleNavKeyDown}>
            {links.map((link) => (
              <li key={link.href} role="listitem">
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`block px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-neutral-400
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
    </>
  );
}
