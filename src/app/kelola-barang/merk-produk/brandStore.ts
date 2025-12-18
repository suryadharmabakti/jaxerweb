import { readJson, writeJson } from '@/services/localStore';

export type BrandRow = {
  name: string;
  code: string;
};

export const BRAND_STORAGE_KEY = 'jaxerweb_product_brands';

export const DEFAULT_BRANDS: BrandRow[] = [
  { name: 'Adidas', code: 'Adidas' },
  { name: 'Swallow', code: 'Swallow' },
  { name: 'Kapal Api', code: 'Kapal Api' },
  { name: 'Intel', code: 'Intel' },
  { name: 'AMD', code: 'AMD' },
];

export function loadBrands(): BrandRow[] {
  return readJson<BrandRow[]>(BRAND_STORAGE_KEY, DEFAULT_BRANDS);
}

export function saveBrands(rows: BrandRow[]): void {
  writeJson(BRAND_STORAGE_KEY, rows);
}

export function brandNames(rows: BrandRow[]): string[] {
  return rows.map((r) => r.name).filter(Boolean);
}
