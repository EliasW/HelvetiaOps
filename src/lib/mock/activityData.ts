import { Activity } from '@/types/entities';

const ago = (days: number, hours = 0) =>
  new Date(Date.now() - days * 86400000 - hours * 3600000);

export const mockActivities: Activity[] = [
  { id: 'a1', projectId: 'p1', type: 'created', description: 'Project created', userId: 'u1', userName: 'Anna Müller', createdAt: ago(60) },
  { id: 'a2', projectId: 'p1', type: 'member_added', description: 'Lukas Meier was added to the project', userId: 'u1', userName: 'Anna Müller', createdAt: ago(59) },
  { id: 'a3', projectId: 'p1', type: 'member_added', description: 'Marco Bianchi was added to the project', userId: 'u1', userName: 'Anna Müller', createdAt: ago(58) },
  { id: 'a4', projectId: 'p1', type: 'kpi_added', description: 'KPI "Uptime" was added', userId: 'u1', userName: 'Anna Müller', createdAt: ago(55) },
  { id: 'a5', projectId: 'p1', type: 'kpi_added', description: 'KPI "Response Time" was added', userId: 'u3', userName: 'Sara Weber', createdAt: ago(55, 2) },
  { id: 'a6', projectId: 'p1', type: 'kpi_added', description: 'KPI "Error Rate" was added', userId: 'u1', userName: 'Anna Müller', createdAt: ago(54) },
  { id: 'a7', projectId: 'p1', type: 'kpi_updated', description: 'KPI "Uptime" current value updated to 99.7%', userId: 'u1', userName: 'Anna Müller', createdAt: ago(10) },
  { id: 'a8', projectId: 'p1', type: 'comment', description: 'Migration phase 1 completed successfully', userId: 'u2', userName: 'Lukas Meier', createdAt: ago(7) },
  { id: 'a9', projectId: 'p1', type: 'kpi_updated', description: 'KPI "Response Time" status changed to at-risk', userId: 'u3', userName: 'Sara Weber', createdAt: ago(3) },
  { id: 'a10', projectId: 'p1', type: 'comment', description: 'Investigating response time degradation on EU region', userId: 'u4', userName: 'Marco Bianchi', createdAt: ago(2) },
  { id: 'a11', projectId: 'p1', type: 'updated', description: 'Project end date set to next month', userId: 'u1', userName: 'Anna Müller', createdAt: ago(1) },

  { id: 'a12', projectId: 'p2', type: 'created', description: 'Project created', userId: 'u2', userName: 'Lukas Meier', createdAt: ago(40) },
  { id: 'a13', projectId: 'p2', type: 'member_added', description: 'Marco Bianchi was added to the project', userId: 'u2', userName: 'Lukas Meier', createdAt: ago(39) },
  { id: 'a14', projectId: 'p2', type: 'kpi_added', description: 'KPI "Deployment Frequency" was added', userId: 'u2', userName: 'Lukas Meier', createdAt: ago(38) },
  { id: 'a15', projectId: 'p2', type: 'kpi_added', description: 'KPI "Lead Time" was added', userId: 'u4', userName: 'Marco Bianchi', createdAt: ago(37) },
  { id: 'a16', projectId: 'p2', type: 'kpi_updated', description: 'KPI "Lead Time" status changed to off-track', userId: 'u4', userName: 'Marco Bianchi', createdAt: ago(5) },
  { id: 'a17', projectId: 'p2', type: 'comment', description: 'Need to optimize build pipeline to reduce lead time', userId: 'u2', userName: 'Lukas Meier', createdAt: ago(4) },

  { id: 'a18', projectId: 'p3', type: 'created', description: 'Project created', userId: 'u3', userName: 'Sara Weber', createdAt: ago(25) },
  { id: 'a19', projectId: 'p3', type: 'member_added', description: 'Marco Bianchi was added to the project', userId: 'u3', userName: 'Sara Weber', createdAt: ago(24) },
  { id: 'a20', projectId: 'p3', type: 'kpi_added', description: 'KPI "Pipeline Success Rate" was added', userId: 'u3', userName: 'Sara Weber', createdAt: ago(23) },
  { id: 'a21', projectId: 'p3', type: 'comment', description: 'Initial data lake schema designed and reviewed', userId: 'u4', userName: 'Marco Bianchi', createdAt: ago(15) },
  { id: 'a22', projectId: 'p3', type: 'kpi_updated', description: 'KPI "Data Freshness" current value updated to 45min', userId: 'u3', userName: 'Sara Weber', createdAt: ago(2) },
];
