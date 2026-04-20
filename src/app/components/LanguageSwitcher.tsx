'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition, useEffect, KeyboardEvent } from 'react';

const locales = ['en', 'de'] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const segments = pathname.split('/');
    const otherLocale = locale === 'en' ? 'de' : 'en';
    segments[1] = otherLocale;
    router.prefetch(segments.join('/'));
  }, [pathname, locale, router]);

  const switchLocale = (newLocale: string) => {
    if (locale === newLocale || isPending) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    startTransition(() => {
      router.replace(segments.join('/'), { scroll: false });
    });
  };

  const handleKeyDown = (e: KeyboardEvent, currentLocale: string) => {
    const currentIndex = locales.indexOf(currentLocale as typeof locales[number]);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % locales.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + locales.length) % locales.length;
    }

    if (nextIndex !== currentIndex) {
      switchLocale(locales[nextIndex]);
    }
  };

  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Language">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          onKeyDown={(e) => handleKeyDown(e, loc)}
          disabled={isPending}
          role="radio"
          aria-checked={locale === loc}
          aria-label={loc === 'en' ? 'English' : 'Deutsch'}
          tabIndex={locale === loc ? 0 : -1}
          className={`px-3 py-1 rounded font-medium transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
            locale === loc
              ? 'bg-neutral-700 text-white'
              : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
          } ${isPending ? 'opacity-60 cursor-wait' : ''}`}
        >
          {isPending && locale !== loc ? (
            <span className="inline-block animate-spin text-sm" aria-hidden="true">⟳</span>
          ) : (
            loc.toUpperCase()
          )}
        </button>
      ))}
    </div>
  );
}
