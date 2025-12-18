'use client';

import AppShell from '@/components/AppShell';
import { loadBrands, saveBrands, type BrandRow } from '@/app/kelola-barang/merk-produk/brandStore';
import { loadProducts, saveProducts } from '@/app/kelola-barang/barang-produk/productStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function EditMerkProdukPage() {
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
  const [brand, setBrand] = useState<BrandRow | null>(null);
  const [draft, setDraft] = useState<BrandRow>({ name: '', code: '' });

  useEffect(() => {
    const brands = loadBrands();
    const found = brands.find((b) => b.code === codeParam) ?? null;
    setBrand(found);

    if (found) {
      setDraft({ name: found.name, code: found.code });
    }

    setLoading(false);
  }, [codeParam]);

  const handleSave = () => {
    if (!brand) return;

    const nextName = draft.name.trim();
    const nextCode = draft.code.trim();

    if (!nextName || !nextCode) {
      alert('Mohon lengkapi: nama merk dan kode merk.');
      return;
    }

    const brands = loadBrands();

    if (
      nextCode.toLowerCase() !== brand.code.toLowerCase() &&
      brands.some((b) => b.code.toLowerCase() === nextCode.toLowerCase())
    ) {
      alert('Kode merk sudah dipakai. Gunakan kode lain.');
      return;
    }

    const nextBrands = brands.map((b) => (b.code === brand.code ? { name: nextName, code: nextCode } : b));
    saveBrands(nextBrands);

    // If brand name changed, propagate to products for consistency.
    if (nextName !== brand.name) {
      const products = loadProducts();
      const nextProducts = products.map((p) => (p.brand === brand.name ? { ...p, brand: nextName } : p));
      saveProducts(nextProducts);
    }

    router.push('/kelola-barang/merk-produk');
  };

  const handleDelete = () => {
    if (!brand) return;
    if (!confirm(`Hapus merk: ${brand.name}?`)) return;

    const brands = loadBrands();
    saveBrands(brands.filter((b) => b.code !== brand.code));
    router.push('/kelola-barang/merk-produk');
  };

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Kelola Barang &nbsp;›&nbsp; Merk Produk</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Edit Merk Produk</h1>
        </div>
      </div>

      <div className="mt-4 w-full max-w-3xl rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        {loading ? (
          <div className="text-sm text-gray-600">Memuat…</div>
        ) : !brand ? (
          <div className="text-sm text-gray-600">
            Merk tidak ditemukan.
            <button
              type="button"
              onClick={() => router.push('/kelola-barang/merk-produk')}
              className="ml-2 underline text-jax-limeDark"
            >
              Kembali
            </button>
          </div>
        ) : (
          <>
            <div className="mt-1 text-xs text-gray-500">Kode merk: {brand.code}</div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-xs text-gray-600">Nama Merk</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                  placeholder="nama merk"
                />
              </label>

              <label className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-xs text-gray-600">Kode Merk</span>
                <input
                  value={draft.code}
                  onChange={(e) => setDraft((p) => ({ ...p, code: e.target.value }))}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                  placeholder="kode merk"
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
                  onClick={() => router.push('/kelola-barang/merk-produk')}
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
