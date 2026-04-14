/**
 * User entity interface
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'manager' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Team entity interface
 */
export interface Team {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project entity interface
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  status: 'active' | 'inactive' | 'archived';
  startDate: Date;
  endDate?: Date;
  owner: string; // User ID
  members: User[];
  kpis: KPI[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * KPI (Key Performance Indicator) entity interface
 */
export interface KPI {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  target: number;
  current: number;
  unit: string; // e.g., '%', 'count', 'hours', 'dollars'
  status: 'on-track' | 'at-risk' | 'off-track';
  owner: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Activity event for project timeline
 */
export interface Activity {
  id: string;
  projectId: string;
  type: 'created' | 'updated' | 'member_added' | 'member_removed' | 'kpi_added' | 'kpi_updated' | 'status_changed' | 'comment';
  description: string;
  userId: string;
  userName: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
