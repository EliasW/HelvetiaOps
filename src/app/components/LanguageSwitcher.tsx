'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition, useEffect } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Prefetch both locale versions on mount for instant switching
  useEffect(() => {
    const segments = pathname.split('/');
    const otherLocale = locale === 'en' ? 'de' : 'en';
    segments[1] = otherLocale;
    const otherPath = segments.join('/');
    
    // Prefetch the other locale version
    router.prefetch(otherPath);
  }, [pathname, locale, router]);

  const switchLocale = (newLocale: string) => {
    if (locale === newLocale || isPending) return;
    
    // Replace the locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    
    startTransition(() => {
      // Use replace to avoid adding to history and make it smoother
      router.replace(newPath, { scroll: false });
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`px-3 py-1 rounded font-medium transition-all ${
          locale === 'en'
            ? 'bg-neutral-700 text-white'
            : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
        } ${isPending ? 'opacity-60 cursor-wait' : ''}`}
        aria-label="Switch to English"
      >
        {isPending && locale !== 'en' ? (
          <span className="inline-block animate-spin text-sm">⟳</span>
        ) : (
          'EN'
        )}
      </button>
      <button
        onClick={() => switchLocale('de')}
        disabled={isPending}
        className={`px-3 py-1 rounded font-medium transition-all ${
          locale === 'de'
            ? 'bg-neutral-700 text-white'
            : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
        } ${isPending ? 'opacity-60 cursor-wait' : ''}`}
        aria-label="Switch to German"
      >
        {isPending && locale !== 'de' ? (
          <span className="inline-block animate-spin text-sm">⟳</span>
        ) : (
          'DE'
        )}
      </button>
    </div>
  );
}
