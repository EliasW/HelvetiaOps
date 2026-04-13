'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import TransitionProvider from './TransitionProvider';
import QueryProvider from './QueryProvider';

export default function Providers(
  props: Readonly<{ children: React.ReactNode }>
) {
  const { children } = props;
  return (
    <SessionProvider>
      <QueryProvider>
        <TransitionProvider>
          {children}
        </TransitionProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
