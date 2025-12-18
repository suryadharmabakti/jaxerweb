'use client';

import AppShell from '@/components/AppShell';
import { loadCategories, saveCategories, type CategoryRow } from '@/app/kelola-barang/kategori-produk/categoryStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TambahKategoriProdukPage() {
  const router = useRouter();

  const [draft, setDraft] = useState<CategoryRow>({
    name: '',
    code: '',
  });

  const handleSave = () => {
    const name = draft.name.trim();
    const code = draft.code.trim();

    if (!name || !code) {
      alert('Mohon lengkapi: nama kategori dan kode kategori.');
      return;
    }

    const rows = loadCategories();
    if (rows.some((r) => r.code.toLowerCase() === code.toLowerCase())) {
      alert('Kode kategori sudah dipakai. Gunakan kode lain.');
      return;
    }

    const next: CategoryRow[] = [{ name, code }, ...rows];
    saveCategories(next);
    router.push('/kelola-barang/kategori-produk');
  };

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Kelola Barang &nbsp;›&nbsp; Kategori Produk</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Tambah Kategori Produk</h1>
        </div>
      </div>

      <div className="mt-4 w-full max-w-3xl rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <div className="text-xs text-gray-500">Tambah data kategori produk: nama dan kode kategori.</div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs text-gray-600">Nama Kategori</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama kategori"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-600">Kode Kategori</span>
            <input
              value={draft.code}
              onChange={(e) => setDraft((p) => ({ ...p, code: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="kode kategori"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
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
    </AppShell>
  );
}
