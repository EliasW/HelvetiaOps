import { Project, User, KPI } from '@/types/entities';

// Simple seeded random for deterministic data
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const teamNames = ['Platform', 'Operations', 'Data', 'Security', 'Frontend', 'Backend', 'DevOps', 'QA', 'Mobile', 'Infrastructure'];
const adjectives = ['Cloud', 'Smart', 'Fast', 'Secure', 'Modern', 'Legacy', 'Global', 'Internal', 'Customer', 'Real-time'];
const nouns = ['Migration', 'Pipeline', 'Dashboard', 'Gateway', 'Service', 'Monitor', 'Analyzer', 'Optimizer', 'Tracker', 'Engine'];
const firstNames = ['Anna', 'Lukas', 'Sara', 'Marco', 'Elena', 'Thomas', 'Julia', 'Felix', 'Laura', 'David', 'Nina', 'Simon'];
const lastNames = ['Müller', 'Meier', 'Weber', 'Bianchi', 'Fischer', 'Keller', 'Brunner', 'Schmid', 'Huber', 'Steiner'];
const statuses: Project['status'][] = ['active', 'inactive', 'archived'];
const kpiStatuses: KPI['status'][] = ['on-track', 'at-risk', 'off-track'];

export function generateLargeDataset(count: number, seed = 42): Project[] {
  const rand = seededRandom(seed);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const ago = (days: number) => new Date(Date.now() - days * 86400000);

  const projects: Project[] = [];

  for (let i = 0; i < count; i++) {
    const memberCount = Math.floor(rand() * 5) + 1;
    const members: User[] = Array.from({ length: memberCount }, (_, j) => ({
      id: `u-${i}-${j}`,
      email: `${pick(firstNames).toLowerCase()}.${pick(lastNames).toLowerCase()}@helvetiaops.ch`,
      name: `${pick(firstNames)} ${pick(lastNames)}`,
      role: pick(['admin', 'manager', 'viewer'] as const),
      createdAt: ago(Math.floor(rand() * 365)),
      updatedAt: ago(Math.floor(rand() * 30)),
    }));

    const kpiCount = Math.floor(rand() * 4);
    const kpis: KPI[] = Array.from({ length: kpiCount }, (_, k) => ({
      id: `k-${i}-${k}`,
      projectId: `p-${i}`,
      name: `${pick(adjectives)} ${pick(nouns)} KPI`,
      description: `KPI for project ${i}`,
      target: Math.floor(rand() * 100) + 50,
      current: Math.floor(rand() * 100) + 20,
      unit: pick(['%', 'ms', 'count', 'hours']),
      status: pick(kpiStatuses),
      owner: members[0].id,
      createdAt: ago(Math.floor(rand() * 90)),
      updatedAt: ago(Math.floor(rand() * 10)),
    }));

    const startDaysAgo = Math.floor(rand() * 365) + 10;

    projects.push({
      id: `p-${i}`,
      name: `${pick(adjectives)} ${pick(nouns)} ${i + 1}`,
      description: `Project ${i + 1} — ${pick(teamNames)} team initiative for ${pick(nouns).toLowerCase()} improvements`,
      teamId: `t-${Math.floor(rand() * teamNames.length)}`,
      status: pick(statuses),
      startDate: ago(startDaysAgo),
      endDate: rand() > 0.4 ? ago(startDaysAgo - Math.floor(rand() * 180)) : undefined,
      owner: members[0].id,
      members,
      kpis,
      createdAt: ago(startDaysAgo),
      updatedAt: ago(Math.floor(rand() * 10)),
    });
  }

  return projects;
}
