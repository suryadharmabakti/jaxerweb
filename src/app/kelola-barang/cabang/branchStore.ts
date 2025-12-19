import { readJson, writeJson } from '@/services/localStore';

export type BranchRow = {
  name: string;
  phone: string;
  location: string;
};

export const BRANCH_STORAGE_KEY = 'jaxerweb_branches';

export const DEFAULT_BRANCHES: BranchRow[] = [
  { name: 'Pusat', phone: '021-0000', location: 'Jakarta' },
  { name: 'Cabang Jakarta', phone: '021-1111', location: 'Jakarta' },
  { name: 'Cabang Surabaya', phone: '031-2222', location: 'Surabaya' },
  { name: 'Cabang Bogor', phone: '0251-3333', location: 'Bogor' },
];

export function loadBranches(): BranchRow[] {
  return readJson<BranchRow[]>(BRANCH_STORAGE_KEY, DEFAULT_BRANCHES);
}

export function saveBranches(rows: BranchRow[]): void {
  writeJson(BRANCH_STORAGE_KEY, rows);
}

export function branchNames(rows: BranchRow[]): string[] {
  return rows.map((r) => r.name).filter(Boolean);
}

