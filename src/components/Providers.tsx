'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

export default function Providers(
  props: Readonly<{ children: React.ReactNode }>
) {
  const { children } = props;
  return <SessionProvider>{children}</SessionProvider>;
}
