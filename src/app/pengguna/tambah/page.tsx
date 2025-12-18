'use client';

import AppShell from '@/components/AppShell';
import { BRANCHES, DEFAULT_USERS, type Role, type UserRow, loadUsers, saveUsers } from '@/app/pengguna/userStore';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function TambahPenggunaPage() {
  const router = useRouter();

  const branches = useMemo(() => Array.from(BRANCHES), []);

  const [draft, setDraft] = useState<{ name: string; email: string; branch: string; role: Role }>({
    name: '',
    email: '',
    branch: branches[0] ?? 'Pusat',
    role: 'cashier',
  });

  const handleSave = () => {
    const name = draft.name.trim();
    const email = draft.email.trim();
    const branch = draft.branch.trim();

    if (!name || !email || !branch) {
      alert('Mohon lengkapi Nama, Email, Cabang, dan Role.');
      return;
    }

    const users = loadUsers();
    const id = String(Date.now());

    const next: UserRow[] = [{ id, name, email, branch, role: draft.role }, ...users];
    saveUsers(next.length ? next : DEFAULT_USERS);

    router.push('/pengguna');
  };

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Pengguna</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Tambah Pengguna</h1>
        </div>
      </div>

      <div className="mt-4 w-full max-w-2xl rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <div className="text-xs text-gray-500">Input manual: nama, email, cabang, role.</div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-gray-600">Nama</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value.toLowerCase() }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama pengguna"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-600">Email</span>
            <input
              value={draft.email}
              onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value.toLowerCase() }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="email@contoh.com"
              inputMode="email"
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs text-gray-600">Cabang</span>
              <select
                value={draft.branch}
                onChange={(e) => setDraft((p) => ({ ...p, branch: e.target.value }))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-gray-600">Role</span>
              <select
                value={draft.role}
                onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value as Role }))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              >
                <option value="admin">Admin</option>
                <option value="cashier">Kasir</option>
                <option value="warehouse">Gudang</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push('/pengguna')}
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
