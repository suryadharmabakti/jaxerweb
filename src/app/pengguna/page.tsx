'use client';

import AppShell from '@/components/AppShell';
import { DEFAULT_USERS, type Role, type UserRow, saveUsers } from '@/app/pengguna/userStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Branch } from '../kelola-barang/cabang/page';

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

export default function PenggunaPage() {
  const router = useRouter();

  const [rows, setRows] = useState<User[]>([]);
  const [hydrated, setHydrated] = useState(false);

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

  useEffect(() => {
    fetchData();
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
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Cabang</th>
                <th className="px-5 py-3 font-medium">Role</th>
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
                  <td className="px-5 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() => setOpenMenuForId((v) => (v === r._id ? null : r._id))}
                        className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100"
                        aria-label="Row actions"
                      >
                        <span className="text-lg leading-none">…</span>
                      </button>

                      {openMenuForId === r._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
                        >
                          <button
                            type="button"
                            onClick={() => handleEdit(r._id)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            Edit
                          </button>

                          <div className="my-1 h-px bg-gray-100" />

                          <button
                            type="button"
                            onClick={() => handleDelete(r._id)}
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
    </AppShell>
  );
}
