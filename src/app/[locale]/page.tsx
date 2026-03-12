import React from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Home');
  return (
    <div className="min-h-screen bg-neutral-100">
      {/* header/navbar */}
      <header className="bg-neutral-900 text-neutral-100 shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-sm">{t('description')}</p>
          </div>
          <nav className="flex gap-4 items-center">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/dashboard`}
              className="hover:text-neutral-300 transition"
            >
              {t('nav.dashboard')}
            </Link>
            <Link href={`/${locale}/auth`} className="hover:text-neutral-300 transition">
              {t('nav.signIn')}
            </Link>
          </nav>
        </div>
      </header>

      {/* hero section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
          {t('hero.title')}
        </h2>
        <p className="text-lg text-neutral-600 mb-8">
          {t('hero.subtitle')}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
           href={`/${locale}/dashboard`}
        
            className="bg-neutral-500 text-white px-6 py-3 rounded hover:bg-neutral-600 transition"
          >
            {t('hero.dashboardButton')}
          </Link>
          <Link
           href={`/${locale}/auth`}
            className="bg-neutral-200 text-neutral-900 px-6 py-3 rounded hover:bg-neutral-300 transition"
          >
            {t('hero.signInButton')}
          </Link>
        </div>
      </section>

      {/* features section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            {t('features.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('features.fast.title'),
                description: t('features.fast.description'),
              },
              {
                title: t('features.easy.title'),
                description: t('features.easy.description'),
              },
              {
                title: t('features.scalable.title'),
                description: t('features.scalable.description'),
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 border border-neutral-200 rounded-lg bg-neutral-50"
              >
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="bg-neutral-800 text-neutral-100 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
