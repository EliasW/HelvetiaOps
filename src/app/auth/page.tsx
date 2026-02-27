"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // redirect if already authenticated
  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session, router]);

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
      router.push('/dashboard');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Sign in</h1>
      {session && <p className="text-sm text-green-600">Already signed in</p>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
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
          {loading ? 'Signing in…' : 'Log In'}
        </button>
      </form>
    </div>
  );
}