import { useQuery } from '@tanstack/react-query';
import { PaginatedResponse } from '@/types/api';
import { KPI, Project, Team } from '@/types/entities';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export function useProjects() {
  return useQuery<PaginatedResponse<Project>>({
    queryKey: ['projects'],
    queryFn: () => fetchJson('/api/projects?status=active'),
  });
}

export function useTeams() {
  return useQuery<PaginatedResponse<Team>>({
    queryKey: ['teams'],
    queryFn: () => fetchJson('/api/teams'),
  });
}

export function useKpis() {
  return useQuery<PaginatedResponse<KPI>>({
    queryKey: ['kpis'],
    queryFn: () => fetchJson('/api/kpis'),
  });
}
