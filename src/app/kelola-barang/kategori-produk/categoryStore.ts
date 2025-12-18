import { readJson, writeJson } from '@/services/localStore';

export type CategoryRow = {
  name: string;
  code: string;
};

export const CATEGORY_STORAGE_KEY = 'jaxerweb_product_categories';

export const DEFAULT_CATEGORIES: CategoryRow[] = [
  { name: 'Pakaian', code: 'PKA00989' },
  { name: 'Obat Herbal', code: 'OH78660' },
  { name: 'Makanan', code: 'C75990TH' },
  { name: 'Lemari', code: 'LK09U114' },
  { name: 'Rumah', code: 'SUB5669000' },
];

export function loadCategories(): CategoryRow[] {
  return readJson<CategoryRow[]>(CATEGORY_STORAGE_KEY, DEFAULT_CATEGORIES);
}

export function saveCategories(rows: CategoryRow[]): void {
  writeJson(CATEGORY_STORAGE_KEY, rows);
}

export function categoryNames(rows: CategoryRow[]): string[] {
  return rows.map((r) => r.name).filter(Boolean);
}
