'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import TransitionProvider from './TransitionProvider';

export default function Providers(
  props: Readonly<{ children: React.ReactNode }>
) {
  const { children } = props;
  return (
    <SessionProvider>
      <TransitionProvider>
        {children}
      </TransitionProvider>
    </SessionProvider>
  );
}
