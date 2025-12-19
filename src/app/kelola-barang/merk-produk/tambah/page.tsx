'use client';

import AppShell from '@/components/AppShell';
import SidebarTrigger from '@/components/SidebarTrigger';
import { loadBrands, saveBrands, type BrandRow } from '@/app/kelola-barang/merk-produk/brandStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TambahMerkProdukPage() {
  const router = useRouter();

  const [draft, setDraft] = useState<BrandRow>({
    name: '',
    code: '',
  });

  const handleSave = () => {
    const name = draft.name.trim();
    const code = draft.code.trim();

    if (!name || !code) {
      alert('Mohon lengkapi: nama merk dan kode merk.');
      return;
    }

    const rows = loadBrands();
    if (rows.some((r) => r.code.toLowerCase() === code.toLowerCase())) {
      alert('Kode merk sudah dipakai. Gunakan kode lain.');
      return;
    }

    const next: BrandRow[] = [{ name, code }, ...rows];
    saveBrands(next);
    router.push('/kelola-barang/merk-produk');
  };

  return (
    <AppShell>
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <div className="text-xs text-gray-400">Kelola Barang &nbsp;›&nbsp; Merk Produk</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Tambah Merk Produk</h1>
        </div>
      </div>

      <div className="mt-4 w-full rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <div className="text-xs text-gray-500">Tambah data merk produk: nama dan kode merk.</div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Nama Merk</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama merk"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Kode Merk</span>
            <input
              value={draft.code}
              onChange={(e) => setDraft((p) => ({ ...p, code: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="kode merk"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
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
    </AppShell>
  );
}
