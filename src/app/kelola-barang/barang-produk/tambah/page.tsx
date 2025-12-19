'use client';

import AppShell from '@/components/AppShell';
import SidebarTrigger from '@/components/SidebarTrigger';
import { DEFAULT_PRODUCTS, type ProductRow, loadProducts, saveProducts } from '@/app/kelola-barang/barang-produk/productStore';
import { DEFAULT_BRANCHES, branchNames, loadBranches } from '@/app/kelola-barang/cabang/branchStore';
import { DEFAULT_CATEGORIES, categoryNames, loadCategories } from '@/app/kelola-barang/kategori-produk/categoryStore';
import { DEFAULT_BRANDS, brandNames, loadBrands } from '@/app/kelola-barang/merk-produk/brandStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TambahProdukPage() {
  const router = useRouter();

  const [branches, setBranches] = useState<string[]>(() => branchNames(DEFAULT_BRANCHES));
  const [categories, setCategories] = useState<string[]>(() => categoryNames(DEFAULT_CATEGORIES));
  const [brands, setBrands] = useState<string[]>(() => brandNames(DEFAULT_BRANDS));

  const [draft, setDraft] = useState<{
    imageDataUrl: string;
    name: string;
    code: string;
    category: string;
    brand: string;
    qty: string;
    branch: string;
    sellPrice: string;
    buyPrice: string;
  }>({
    imageDataUrl: '',
    name: '',
    code: '',
    category: '',
    brand: '',
    qty: '',
    branch: '',
    sellPrice: '',
    buyPrice: '',
  });

  useEffect(() => {
    // Load latest options from localStorage on the client.
    setBranches(branchNames(loadBranches()));
    setCategories(categoryNames(loadCategories()));
    setBrands(brandNames(loadBrands()));
  }, []);

  useEffect(() => {
    // Ensure draft select values are always valid.
    setDraft((p) => ({
      ...p,
      category: p.category && categories.includes(p.category) ? p.category : (categories[0] ?? ''),
      branch: p.branch && branches.includes(p.branch) ? p.branch : (branches[0] ?? ''),
      brand: p.brand && brands.includes(p.brand) ? p.brand : (brands[0] ?? ''),
    }));
  }, [branches, categories, brands]);

  const handlePickImage = (file: File | null) => {
    if (!file) {
      setDraft((p) => ({ ...p, imageDataUrl: '' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setDraft((p) => ({ ...p, imageDataUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const name = draft.name.trim();
    const code = draft.code.trim();
    const category = draft.category.trim();
    const brand = draft.brand.trim();
    const branch = draft.branch.trim();
    const qty = Number(draft.qty);
    const sellPrice = Number(draft.sellPrice);
    const buyPrice = Number(draft.buyPrice);

    if (!name || !code || !category || !brand || !branch) {
      alert('Mohon lengkapi: nama, kode produk, kategori, merk, cabang.');
      return;
    }

    if (!Number.isFinite(qty) || qty < 0) {
      alert('Qty harus angka yang valid.');
      return;
    }

    if (!Number.isFinite(sellPrice) || sellPrice < 0) {
      alert('Harga jual harus angka yang valid.');
      return;
    }

    if (!Number.isFinite(buyPrice) || buyPrice < 0) {
      alert('Harga beli harus angka yang valid.');
      return;
    }

    const products = loadProducts();
    if (products.some((p) => p.code === code)) {
      alert('Kode produk sudah dipakai. Gunakan kode lain.');
      return;
    }

    const nextRow: ProductRow = {
      imageDataUrl: draft.imageDataUrl || undefined,
      name,
      code,
      category,
      brand,
      qty,
      branch,
      sellPrice,
      buyPrice,
    };

    const next = [nextRow, ...products];
    saveProducts(next.length ? next : DEFAULT_PRODUCTS);

    router.push('/kelola-barang/barang-produk');
  };

  return (
    <AppShell>
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <div className="text-xs text-gray-400">Kelola Barang &nbsp;›&nbsp; Barang/Produk</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Tambah Produk</h1>
        </div>
      </div>

      <div className="mt-4 w-full rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <div className="text-xs text-gray-500">Tambah data produk: gambar, nama, kode, kategori, merk, qty, harga jual, harga beli.</div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Gambar Produk</span>
            <div className="flex-1 flex items-center gap-3">
              {draft.imageDataUrl ? (
                <img
                  src={draft.imageDataUrl}
                  alt="preview"
                  className="h-12 w-12 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePickImage(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Nama</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama produk"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Kode Produk</span>
            <input
              value={draft.code}
              onChange={(e) => setDraft((p) => ({ ...p, code: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="kode produk"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Kategori</span>
            <select
              value={draft.category}
              onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Merk</span>
            <select
              value={draft.brand}
              onChange={(e) => setDraft((p) => ({ ...p, brand: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
            >
              <option value="" disabled>
                Pilih merk
              </option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Qty</span>
            <input
              value={draft.qty}
              onChange={(e) => setDraft((p) => ({ ...p, qty: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="0"
              inputMode="numeric"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Cabang</span>
            <select
              value={draft.branch}
              onChange={(e) => setDraft((p) => ({ ...p, branch: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
            >
              <option value="" disabled>
                Pilih cabang
              </option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Harga Jual per satuan</span>
            <input
              value={draft.sellPrice}
              onChange={(e) => setDraft((p) => ({ ...p, sellPrice: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="0"
              inputMode="numeric"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Harga Beli per satuan</span>
            <input
              value={draft.buyPrice}
              onChange={(e) => setDraft((p) => ({ ...p, buyPrice: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="0"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push('/kelola-barang/barang-produk')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark"
          >
            Simpan
          </button>
        </div>
      </div>
    </AppShell>
  );
}
