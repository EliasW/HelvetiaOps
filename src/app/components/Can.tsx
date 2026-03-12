'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Role, hasAtLeast } from '@/utils/permissions';

export default function Can(
  props: Readonly<{
    minRole: Role;
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }>
) {
  const { minRole, children, fallback = null } = props;
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as Role | undefined;

  if (hasAtLeast(role, minRole)) return <>{children}</>;
  return <>{fallback}</>;
}
