import { User, Team, Project, KPI } from '@/types/entities';

const now = new Date();
const ago = (days: number) => new Date(now.getTime() - days * 86400000);

export const mockUsers: User[] = [
  { id: 'u1', email: 'admin@helvetiaops.ch', name: 'Anna Müller', role: 'admin', createdAt: ago(90), updatedAt: ago(2) },
  { id: 'u2', email: 'manager@helvetiaops.ch', name: 'Lukas Meier', role: 'manager', createdAt: ago(60), updatedAt: ago(5) },
  { id: 'u3', email: 'viewer@helvetiaops.ch', name: 'Sara Weber', role: 'viewer', createdAt: ago(30), updatedAt: ago(1) },
  { id: 'u4', email: 'dev@helvetiaops.ch', name: 'Marco Bianchi', role: 'viewer', createdAt: ago(20), updatedAt: ago(3) },
  { id: 'u5', email: 'ops@helvetiaops.ch', name: 'Elena Fischer', role: 'manager', createdAt: ago(45), updatedAt: ago(7) },
];

export const mockTeams: Team[] = [
  {
    id: 't1',
    name: 'Platform Engineering',
    description: 'Core platform and infrastructure team',
    members: [mockUsers[0], mockUsers[1], mockUsers[3]],
    createdBy: 'u1',
    createdAt: ago(80),
    updatedAt: ago(10),
  },
  {
    id: 't2',
    name: 'Operations',
    description: 'Day-to-day operations and monitoring',
    members: [mockUsers[1], mockUsers[2], mockUsers[4]],
    createdBy: 'u1',
    createdAt: ago(70),
    updatedAt: ago(5),
  },
  {
    id: 't3',
    name: 'Data & Analytics',
    description: 'Data pipelines and business intelligence',
    members: [mockUsers[2], mockUsers[3]],
    createdBy: 'u2',
    createdAt: ago(40),
    updatedAt: ago(3),
  },
];

export const mockKPIs: KPI[] = [
  { id: 'k1', projectId: 'p1', name: 'Uptime', description: 'System uptime percentage', target: 99.9, current: 99.7, unit: '%', status: 'on-track', owner: 'u1', createdAt: ago(60), updatedAt: ago(1) },
  { id: 'k2', projectId: 'p1', name: 'Response Time', description: 'Average API response time', target: 200, current: 245, unit: 'ms', status: 'at-risk', owner: 'u3', createdAt: ago(60), updatedAt: ago(1) },
  { id: 'k3', projectId: 'p1', name: 'Error Rate', description: 'Percentage of failed requests', target: 0.5, current: 0.3, unit: '%', status: 'on-track', owner: 'u1', createdAt: ago(55), updatedAt: ago(2) },
  { id: 'k4', projectId: 'p2', name: 'Deployment Frequency', description: 'Deployments per week', target: 10, current: 7, unit: 'count', status: 'at-risk', owner: 'u2', createdAt: ago(40), updatedAt: ago(3) },
  { id: 'k5', projectId: 'p2', name: 'Lead Time', description: 'Commit to deploy time', target: 24, current: 36, unit: 'hours', status: 'off-track', owner: 'u4', createdAt: ago(40), updatedAt: ago(1) },
  { id: 'k6', projectId: 'p3', name: 'Pipeline Success Rate', description: 'Successful pipeline runs', target: 95, current: 92, unit: '%', status: 'at-risk', owner: 'u3', createdAt: ago(25), updatedAt: ago(2) },
  { id: 'k7', projectId: 'p3', name: 'Data Freshness', description: 'Max data staleness', target: 60, current: 45, unit: 'min', status: 'on-track', owner: 'u4', createdAt: ago(25), updatedAt: ago(1) },
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Cloud Migration',
    description: 'Migrate legacy services to cloud infrastructure',
    teamId: 't1',
    status: 'active',
    startDate: ago(60),
    endDate: new Date(now.getTime() + 30 * 86400000),
    owner: 'u1',
    members: [mockUsers[0], mockUsers[1], mockUsers[3]],
    kpis: mockKPIs.filter((k) => k.projectId === 'p1'),
    createdAt: ago(60),
    updatedAt: ago(1),
  },
  {
    id: 'p2',
    name: 'CI/CD Pipeline',
    description: 'Improve continuous integration and deployment',
    teamId: 't1',
    status: 'active',
    startDate: ago(40),
    owner: 'u2',
    members: [mockUsers[1], mockUsers[3]],
    kpis: mockKPIs.filter((k) => k.projectId === 'p2'),
    createdAt: ago(40),
    updatedAt: ago(3),
  },
  {
    id: 'p3',
    name: 'Data Lake Setup',
    description: 'Build centralized data lake for analytics',
    teamId: 't3',
    status: 'active',
    startDate: ago(25),
    owner: 'u3',
    members: [mockUsers[2], mockUsers[3]],
    kpis: mockKPIs.filter((k) => k.projectId === 'p3'),
    createdAt: ago(25),
    updatedAt: ago(2),
  },
  {
    id: 'p4',
    name: 'Legacy Monitoring',
    description: 'Old monitoring system - being replaced',
    teamId: 't2',
    status: 'archived',
    startDate: ago(120),
    endDate: ago(10),
    owner: 'u5',
    members: [mockUsers[4], mockUsers[2]],
    kpis: [],
    createdAt: ago(120),
    updatedAt: ago(10),
  },
];
