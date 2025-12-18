'use client';

import AppShell from '@/components/AppShell';
import { loadCategories, saveCategories, type CategoryRow } from '@/app/kelola-barang/kategori-produk/categoryStore';
import { loadProducts, saveProducts } from '@/app/kelola-barang/barang-produk/productStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function EditKategoriProdukPage() {
  const router = useRouter();
  const params = useParams();

  const encodedCode = (params?.code as string) ?? '';
  const codeParam = useMemo(() => {
    try {
      return decodeURIComponent(encodedCode);
    } catch {
      return encodedCode;
    }
  }, [encodedCode]);

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CategoryRow | null>(null);
  const [draft, setDraft] = useState<CategoryRow>({ name: '', code: '' });

  useEffect(() => {
    const categories = loadCategories();
    const found = categories.find((c) => c.code === codeParam) ?? null;
    setCategory(found);

    if (found) {
      setDraft({ name: found.name, code: found.code });
    }

    setLoading(false);
  }, [codeParam]);

  const handleSave = () => {
    if (!category) return;

    const nextName = draft.name.trim();
    const nextCode = draft.code.trim();

    if (!nextName || !nextCode) {
      alert('Mohon lengkapi: nama kategori dan kode kategori.');
      return;
    }

    const categories = loadCategories();

    if (
      nextCode.toLowerCase() !== category.code.toLowerCase() &&
      categories.some((c) => c.code.toLowerCase() === nextCode.toLowerCase())
    ) {
      alert('Kode kategori sudah dipakai. Gunakan kode lain.');
      return;
    }

    const nextCategories = categories.map((c) => (c.code === category.code ? { name: nextName, code: nextCode } : c));
    saveCategories(nextCategories);

    // If category name changed, propagate to products for consistency.
    if (nextName !== category.name) {
      const products = loadProducts();
      const nextProducts = products.map((p) => (p.category === category.name ? { ...p, category: nextName } : p));
      saveProducts(nextProducts);
    }

    router.push('/kelola-barang/kategori-produk');
  };

  const handleDelete = () => {
    if (!category) return;
    if (!confirm(`Hapus kategori: ${category.name}?`)) return;

    const categories = loadCategories();
    saveCategories(categories.filter((c) => c.code !== category.code));
    router.push('/kelola-barang/kategori-produk');
  };

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Kelola Barang &nbsp;›&nbsp; Kategori Produk</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Edit Kategori Produk</h1>
        </div>
      </div>

      <div className="mt-4 w-full max-w-3xl rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        {loading ? (
          <div className="text-sm text-gray-600">Memuat…</div>
        ) : !category ? (
          <div className="text-sm text-gray-600">
            Kategori tidak ditemukan.
            <button
              type="button"
              onClick={() => router.push('/kelola-barang/kategori-produk')}
              className="ml-2 underline text-jax-limeDark"
            >
              Kembali
            </button>
          </div>
        ) : (
          <>
            <div className="mt-1 text-xs text-gray-500">Kode kategori: {category.code}</div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-xs text-gray-600">Nama Kategori</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                  placeholder="nama kategori"
                />
              </label>

              <label className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-xs text-gray-600">Kode Kategori</span>
                <input
                  value={draft.code}
                  onChange={(e) => setDraft((p) => ({ ...p, code: e.target.value }))}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                  placeholder="kode kategori"
                />
              </label>
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Hapus
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/kelola-barang/kategori-produk')}
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
          </>
        )}
      </div>
    </AppShell>
  );
}
