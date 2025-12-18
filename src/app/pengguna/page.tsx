'use client';

import AppShell from '@/components/AppShell';
import { DEFAULT_USERS, type Role, type UserRow, saveUsers } from '@/app/pengguna/userStore';
import { useRouter } from 'next/navigation';
import { Branch } from '../kelola-barang/cabang/page';
import { useEffect, useMemo, useRef, useState } from 'react';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function rolePillClass(role: String) {
  return cn(
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
    role === 'admin' && 'bg-jax-lime text-white',
    role === 'kasir' && 'bg-jax-lime text-white',
    role === 'gudang' && 'bg-jax-lime text-white'
  );
}

  export type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    branch: Branch;
  };

function includesText(value: string, q: string) {
  return value.toLowerCase().includes(q);
}

export default function PenggunaPage() {
  const router = useRouter();

  const [rows, setRows] = useState<User[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [filterText, setFilterText] = useState('');

  const [openMenuForId, setOpenMenuForId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      const token = localStorage.getItem('token');

      const result = await fetch(
        `/api/user?id=${user._id}&email=${user.email}&token=${token}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const res = await result.json();
      if (!result.ok) throw new Error(res.error || 'Login gagal');

      setRows(res.data);
    } catch (error) {
      console.log("error", error)
    }
  }
  const [columnsOpen, setColumnsOpen] = useState(false);
  const columnsRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState<Record<string, boolean>>({
    name: true,
    email: true,
    branch: true,
    role: true,
    actions: true,
  });

  useEffect(() => {
    fetchData();
    setHydrated(true);
    try {
      const saved = localStorage.getItem('columns_pengguna');
      if (saved) {
        const parsed = JSON.parse(saved);
        setColumns({
          name: Boolean(parsed.name),
          email: Boolean(parsed.email),
          branch: Boolean(parsed.branch),
          role: Boolean(parsed.role),
          actions: true,
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    // saveUsers(rows);
  }, [rows, hydrated]);

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

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!columnsOpen) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (columnsRef.current && columnsRef.current.contains(target)) return;
      setColumnsOpen(false);
    };
    window.addEventListener('mousedown', onMouseDown);
    return () => window.removeEventListener('mousedown', onMouseDown);
  }, [columnsOpen]);

  useEffect(() => {
    try {
      const toSave = { name: columns.name, email: columns.email, branch: columns.branch, role: columns.role };
      localStorage.setItem('columns_pengguna', JSON.stringify(toSave));
    } catch {}
  }, [columns]);

  const filteredRows = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      includesText(r.name, q) ||
      includesText(r.email, q) ||
      includesText(r.branch.name, q) ||
      includesText(r.role.toLowerCase(), q)
    );
  }, [rows, filterText]);

  const handleDelete = (id: string) => {
    const u = rows.find((r) => r._id === id);
    if (!u) return;
    if (!confirm(`Hapus pengguna: ${u.name}?`)) return;

    setRows((prev) => prev.filter((r) => r._id !== id));
    setOpenMenuForId(null);
  };

  const handleEdit = (id: string) => {
    setOpenMenuForId(null);
    router.push(`/pengguna/${id}/edit`);
  };

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Pengguna/Karyawan</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Pengguna/Karyawan</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilter((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M6 12h12M10 19h4" />
            </svg>
            Filter
          </button>
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setColumnsOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h10" />
              </svg>
              Kolom
            </button>
            {columnsOpen && (
              <div
                ref={columnsRef}
                className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
              >
                <div className="px-2 py-1 text-xs text-gray-500">Tampilkan Kolom</div>
                {[
                  { key: 'name', label: 'Nama' },
                  { key: 'email', label: 'Email' },
                  { key: 'branch', label: 'Cabang' },
                  { key: 'role', label: 'Role' },
                ].map((c) => (
                  <div key={c.key} className="flex items-center justify-between px-2 py-1">
                    <span className="text-sm text-gray-700">{c.label}</span>
                    <button
                      onClick={() => setColumns((p) => ({ ...p, [c.key]: !p[c.key as keyof typeof p] }))}
                      className={cn(
                        'relative inline-flex h-5 w-9 items-center rounded-full transition',
                        columns[c.key as keyof typeof columns] ? 'bg-jax-lime' : 'bg-gray-200'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition',
                          columns[c.key as keyof typeof columns] ? 'translate-x-4' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between px-2 py-1 opacity-60">
                  <span className="text-sm text-gray-700">Aksi</span>
                  <button
                    className={cn('relative inline-flex h-5 w-9 items-center rounded-full transition', 'bg-gray-300')}
                    disabled
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="mt-4 w-full max-w-2xl rounded-2xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600 w-24 shrink-0">Cari</div>
            <input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama / email / cabang / role"
            />
            <button
              type="button"
              onClick={() => setFilterText('')}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => router.push('/pengguna/tambah')}
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
                {columns.name && <th className="px-5 py-3 font-medium">Nama</th>}
                {columns.email && <th className="px-5 py-3 font-medium">Email</th>}
                {columns.branch && <th className="px-5 py-3 font-medium">Cabang</th>}
                {columns.role && <th className="px-5 py-3 font-medium">Role</th>}
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900">{r.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.email}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.branch?.name}</td>
                  <td className="px-5 py-3 text-sm">
                    <span className={rolePillClass(r.role.toLowerCase())}>{r.role.charAt(0).toUpperCase() + r.role.slice(1)}</span>
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
    </AppShell>
  );
}
