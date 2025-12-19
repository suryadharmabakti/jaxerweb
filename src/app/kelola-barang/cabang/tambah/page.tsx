'use client';

import AppShell from '@/components/AppShell';
import SidebarTrigger from '@/components/SidebarTrigger';
import { loadBranches, saveBranches, type BranchRow } from '@/app/kelola-barang/cabang/branchStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TambahCabangPage() {
  const router = useRouter();

  const [draft, setDraft] = useState<BranchRow>({
    name: '',
    phone: '',
    location: '',
  });

  const handleSave = () => {
    const name = draft.name.trim();
    const phone = draft.phone.trim();
    const location = draft.location.trim();

    if (!name || !phone || !location) {
      alert('Mohon lengkapi: nama cabang, no telpon admin, lokasi cabang.');
      return;
    }

    const rows = loadBranches();
    if (rows.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      alert('Nama cabang sudah ada. Gunakan nama lain.');
      return;
    }

    const next: BranchRow[] = [{ name, phone, location }, ...rows];
    saveBranches(next);
    router.push('/kelola-barang/cabang');
  };

  return (
    <AppShell>
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <div className="text-xs text-gray-400">Kelola Barang &nbsp;›&nbsp; Cabang</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Tambah Cabang</h1>
        </div>
      </div>

      <div className="mt-4 w-full rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <div className="text-xs text-gray-500">Tambah data cabang: nama cabang, no telpon admin, lokasi cabang.</div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Nama Cabang</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama cabang"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">No Telpon Admin</span>
            <input
              value={draft.phone}
              onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="+62..."
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Lokasi Cabang</span>
            <input
              value={draft.location}
              onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="alamat / kota"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push('/kelola-barang/cabang')}
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
