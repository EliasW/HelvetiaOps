import { User, Team, Project, KPI } from './entities';

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

// ============================================
// USER API CONTRACTS
// ============================================

export interface CreateUserRequest {
  email: string;
  name?: string;
  password: string;
  role: 'admin' | 'manager' | 'viewer';
}

export interface UpdateUserRequest {
  name?: string;
  role?: 'admin' | 'manager' | 'viewer';
}

export interface UserResponse extends User {}

// ============================================
// TEAM API CONTRACTS
// ============================================

export interface CreateTeamRequest {
  name: string;
  description?: string;
  memberIds?: string[];
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface AddTeamMemberRequest {
  userId: string;
}

export interface RemoveTeamMemberRequest {
  userId: string;
}

export interface TeamResponse extends Team {}

// ============================================
// PROJECT API CONTRACTS
// ============================================

export interface CreateProjectRequest {
  name: string;
  description?: string;
  teamId: string;
  startDate: Date;
  endDate?: Date;
  memberIds?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'archived';
  endDate?: Date;
}

export interface AddProjectMemberRequest {
  userId: string;
}

export interface RemoveProjectMemberRequest {
  userId: string;
}

export interface ProjectResponse extends Project {}

// ============================================
// KPI API CONTRACTS
// ============================================

export interface CreateKPIRequest {
  projectId: string;
  name: string;
  description?: string;
  target: number;
  unit: string;
  ownerId: string;
}

export interface UpdateKPIRequest {
  name?: string;
  description?: string;
  target?: number;
  current?: number;
  unit?: string;
  status?: 'on-track' | 'at-risk' | 'off-track';
}

export interface UpdateKPICurrentRequest {
  current: number;
}

export interface KPIResponse extends KPI {}

// ============================================
// BATCH OPERATIONS
// ============================================

export interface BatchCreateKPIsRequest {
  projectId: string;
  kpis: Omit<CreateKPIRequest, 'projectId'>[];
}

export interface BatchUpdateKPIsRequest {
  updates: Array<{
    id: string;
    data: UpdateKPIRequest;
  }>;
}

// ============================================
// FILTER & SEARCH CONTRACTS
// ============================================

export interface ProjectFilterRequest {
  teamId?: string;
  status?: 'active' | 'inactive' | 'archived';
  ownerId?: string;
  page?: number;
  limit?: number;
}

export interface KPIFilterRequest {
  projectId?: string;
  status?: 'on-track' | 'at-risk' | 'off-track';
  ownerId?: string;
  page?: number;
  limit?: number;
}

export interface TeamFilterRequest {
  page?: number;
  limit?: number;
  search?: string;
}

// ============================================
// ERROR RESPONSE
// ============================================

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

// ============================================
// API ERROR CODES
// ============================================

export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}
