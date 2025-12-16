'use client';

import AppShell from '@/components/AppShell';
import { useEffect, useMemo, useRef, useState } from 'react';

type Role = 'admin' | 'cashier' | 'warehouse';

type UserRow = {
  id: string;
  name: string;
  email: string;
  branch: string;
  role: Role;
};

const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  cashier: 'Kasir',
  warehouse: 'Gudang',
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function rolePillClass(role: Role) {
  // Keep it simple + close to your current design language (lime pill)
  return cn(
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
    role === 'admin' && 'bg-jax-lime text-white',
    role === 'cashier' && 'bg-jax-lime text-white',
    role === 'warehouse' && 'bg-jax-lime text-white'
  );
}

export default function PenggunaPage() {
  const branches = useMemo(() => ['Pusat', 'Cabang Jakarta', 'Cabang Surabaya', 'Cabang Bogor'], []);

  const [rows, setRows] = useState<UserRow[]>([
    {
      id: '1',
      name: 'Ahmad Ashidiq',
      email: 'ahmadasshidiq08@gmail.com',
      branch: 'Pusat',
      role: 'admin',
    },
    {
      id: '2',
      name: 'Rudi Malik',
      email: 'rudimalik@gmail.com',
      branch: 'Cabang Jakarta',
      role: 'cashier',
    },
    {
      id: '3',
      name: 'Suparman',
      email: 'suparman38@gmail.com',
      branch: 'Cabang Jakarta',
      role: 'warehouse',
    },
    {
      id: '4',
      name: 'Ayu Fadilah',
      email: 'ayu7788@gmail.com',
      branch: 'Cabang Surabaya',
      role: 'warehouse',
    },
    {
      id: '5',
      name: 'Marwah',
      email: 'marwan56@gmail.com',
      branch: 'Cabang Bogor',
      role: 'warehouse',
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openMenuForId, setOpenMenuForId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const [draft, setDraft] = useState<{ name: string; email: string; branch: string; role: Role }>({
    name: '',
    email: '',
    branch: branches[0] ?? 'Pusat',
    role: 'cashier',
  });

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!openMenuForId) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (menuRef.current && menuRef.current.contains(target)) return;
      setOpenMenuForId(null);
    };

    window.addEventListener('mousedown', onMouseDown);
    return () => window.removeEventListener('mousedown', onMouseDown);
  }, [openMenuForId]);

  const handleDelete = (id: string) => {
    const u = rows.find((r) => r.id === id);
    if (!u) return;
    if (!confirm(`Hapus pengguna: ${u.name}?`)) return;

    setRows((prev) => prev.filter((r) => r.id !== id));
    setOpenMenuForId(null);
  };

  const handleSetRole = (id: string, role: Role) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, role } : r)));
    setOpenMenuForId(null);
  };

  const handleAdd = () => {
    const name = draft.name.trim();
    const email = draft.email.trim();
    const branch = draft.branch.trim();

    if (!name || !email || !branch) {
      alert('Mohon lengkapi Nama, Email, Cabang, dan Role.');
      return;
    }

    const id = String(Date.now());
    setRows((prev) => [{ id, name, email, branch, role: draft.role }, ...prev]);

    setIsAddOpen(false);
    setDraft({ name: '', email: '', branch: branches[0] ?? 'Pusat', role: 'cashier' });
  };

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Pengguna</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Pengguna/Karyawan</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M6 12h12M10 19h4" />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            Kolom
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition"
        >
          <span className="text-base leading-none">+</span> Tambah
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3" />
          </svg>
          Import
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21V9m0 0l4 4m-4-4l-4 4M4 7V4h16v3" />
          </svg>
          Export
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-[11px] text-gray-500">
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Cabang</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900">{r.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.email}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.branch}</td>
                  <td className="px-5 py-3 text-sm">
                    <span className={rolePillClass(r.role)}>{ROLE_LABEL[r.role]}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() => setOpenMenuForId((v) => (v === r.id ? null : r.id))}
                        className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100"
                        aria-label="Row actions"
                      >
                        <span className="text-lg leading-none">…</span>
                      </button>

                      {openMenuForId === r.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
                        >
                          <div className="px-3 py-2 text-[11px] font-medium text-gray-500">Ubah role</div>
                          {(['admin', 'cashier', 'warehouse'] as Role[]).map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => handleSetRole(r.id, role)}
                              className={cn(
                                'w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50',
                                r.role === role && 'bg-gray-50'
                              )}
                            >
                              {ROLE_LABEL[role]}
                            </button>
                          ))}

                          <div className="my-1 h-px bg-gray-100" />

                          <button
                            type="button"
                            onClick={() => handleDelete(r.id)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-500">
          <div>Page 1 of 1</div>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <span className="rounded border border-gray-200 bg-white px-2 py-1">20</span>
          </div>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsAddOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-gray-200 p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-900">Tambah Pengguna</div>
                <div className="mt-1 text-xs text-gray-500">Input manual: nama, email, cabang, role.</div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <label className="grid gap-1">
                <span className="text-xs text-gray-600">Nama</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                  placeholder="Nama pengguna"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-gray-600">Email</span>
                <input
                  value={draft.email}
                  onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                  placeholder="email@contoh.com"
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
                onClick={() => setIsAddOpen(false)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
