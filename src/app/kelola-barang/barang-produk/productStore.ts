import { readJson, writeJson } from '@/services/localStore';

export type ProductRow = {
  imageDataUrl?: string;
  name: string;
  code: string;
  category: string;
  brand: string;
  qty: number;
  branch: string;
  sellPrice: number;
  buyPrice: number;
};

export type Product = {
  _id: string,
  name: string,
  code: string,
  file: string,
  userId: string,
}

export type Stock = {
  name: string;
  code: string;
  qty: number;
  branch: string;
  harga: number;
  hargaModal: number;
  satuan: string;
  produk: Product;
};

export const PRODUCT_STORAGE_KEY = 'jaxerweb_products';

export const BRANCHES = ['Pusat', 'Cabang Jakarta', 'Cabang Surabaya', 'Cabang Bogor'] as const;

export const CATEGORIES = ['Pakaian', 'Obat Herbal', 'Makanan', 'Lemari', 'Rumah'] as const;

export const DEFAULT_PRODUCTS: ProductRow[] = [
  {
    name: 'Baju Adidas',
    code: 'ADI7889',
    category: 'Pakaian',
    brand: 'Adidas',
    qty: 100,
    branch: 'Pusat',
    sellPrice: 50_000,
    buyPrice: 23_000,
  },
  {
    name: 'Batik',
    code: 'BA36777',
    category: 'Pakaian',
    brand: 'Adidas',
    qty: 400,
    branch: 'Pusat',
    sellPrice: 120_000,
    buyPrice: 43_000,
  },
];

export function loadProducts(): ProductRow[] {
  return readJson<ProductRow[]>(PRODUCT_STORAGE_KEY, DEFAULT_PRODUCTS);
}

export function saveProducts(products: ProductRow[]): void {
  writeJson(PRODUCT_STORAGE_KEY, products);
}
