import { readJson, writeJson } from '@/services/localStore';

export type BranchRow = {
  name: string;
  phone: string;
  location: string;
};

export const BRANCH_STORAGE_KEY = 'jaxerweb_branches';

export const DEFAULT_BRANCHES: BranchRow[] = [
  { name: 'Pusat', phone: '+62 878899400', location: 'Bogor' },
  { name: 'Cabang Jakarta', phone: '+62 878899400', location: 'Jakarta Selatan, Senayan' },
  { name: 'Cabang Malang', phone: '+62 878899400', location: 'Malang' },
  { name: 'Cabang Jogja', phone: '+62 878899400', location: 'Jogja, Malioboro' },
  { name: 'Cabang Thailand', phone: '+62 878899400', location: 'Thailand' },
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
