export type Role = 'admin' | 'manager' | 'viewer';

// Role hierarchy for simple comparisons
const rank: Record<Role, number> = {
  admin: 3,
  manager: 2,
  viewer: 1,
};

export const isAdmin = (role?: Role) => role === 'admin';
export const isManager = (role?: Role) => role === 'manager';
export const isViewer = (role?: Role) => role === 'viewer';

export const canView = (role?: Role) => {
  if (!role) return false;
  return (rank[role] ?? 0) >= rank.viewer;
};

export const canManage = (role?: Role) => {
  if (!role) return false;
  return (rank[role] ?? 0) >= rank.manager;
};

export const canAdmin = (role?: Role) => isAdmin(role);

// generic helper to check minimum role
export const hasAtLeast = (role: Role | undefined, minimum: Role) => {
  if (!role) return false;
  return (rank[role] ?? 0) >= (rank[minimum] ?? 0);
};
