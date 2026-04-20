"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import AuthPageContent from '@/app/components/AuthPageContent';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Auth');
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-focus email input on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // redirect if already authenticated
  useEffect(() => {
    if (session) {
      router.push(`/${locale}/dashboard`);
    }
  }, [session, router, locale]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  };

  return (
    <AuthPageContent>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <LanguageSwitcher />
        </div>
        {session && <p className="text-sm text-green-600">{t('alreadySignedIn')}</p>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && <p className="text-sm text-red-600" role="alert" id="auth-error">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              {t('email')}
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              required
              aria-describedby={error ? 'auth-error' : undefined}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-500 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? t('signingIn') : t('loginButton')}
          </button>
        </form>
      </div>
    </AuthPageContent>
  );
}