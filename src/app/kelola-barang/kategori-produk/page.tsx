'use client';

import AppShell from '@/components/AppShell';
import { loadCategories, saveCategories, type CategoryRow } from '@/app/kelola-barang/kategori-produk/categoryStore';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function includesText(value: string, q: string) {
  return value.toLowerCase().includes(q);
}

export type Category = {
  name: string;
  code: string;
};

export default function KategoriProdukPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Category[]>([]);

  const [showFilter, setShowFilter] = useState(false);
  const [filterText, setFilterText] = useState('');

  const [openMenuForCode, setOpenMenuForCode] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      const token = localStorage.getItem('token');

      const result = await fetch(
        `/api/category-product?id=${user._id}&token=${token}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const res = await result.json();
      console.log("cek data", res);
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
    const onMouseDown = (e: MouseEvent) => {
      if (!openMenuForCode) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (menuRef.current && menuRef.current.contains(target)) return;
      setOpenMenuForCode(null);
    };

    window.addEventListener('mousedown', onMouseDown);
    return () => window.removeEventListener('mousedown', onMouseDown);
  }, [openMenuForCode]);

  const filteredRows = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => includesText(r.name, q) || includesText(r.code, q));
  }, [rows, filterText]);

  const handleDelete = (code: string) => {
    const c = rows.find((r) => r.code === code);
    if (!c) return;
    if (!confirm(`Hapus kategori: ${c.name}?`)) return;

    const next = rows.filter((r) => r.code !== code);
    saveCategories(next);
    setRows(next);
    setOpenMenuForCode(null);
  };

  const handleEdit = (code: string) => {
    setOpenMenuForCode(null);
    router.push(`/kelola-barang/kategori-produk/${encodeURIComponent(code)}/edit`);
  };

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Manage Item &nbsp;›&nbsp; product category</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Kategori Produk</h1>
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
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            Kolom
          </button>
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
              placeholder="nama / kode"
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
          onClick={() => router.push('/kelola-barang/kategori-produk/tambah')}
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
                <th className="px-5 py-3 font-medium">Nama Kategori</th>
                <th className="px-5 py-3 font-medium">Kode Kategori</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.code} className="border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900">{r.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.code}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() => setOpenMenuForCode((v) => (v === r.code ? null : r.code))}
                        className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100"
                        aria-label="Row actions"
                      >
                        <span className="text-lg leading-none">…</span>
                      </button>

                      {openMenuForCode === r.code && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
                        >
                          <button
                            type="button"
                            onClick={() => handleEdit(r.code)}
                            className={cn('w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50')}
                          >
                            Edit
                          </button>

                          <div className="my-1 h-px bg-gray-100" />

                          <button
                            type="button"
                            onClick={() => handleDelete(r.code)}
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
          <div>Menampilkan {filteredRows.length} dari {rows.length}</div>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <span className="rounded border border-gray-200 bg-white px-2 py-1">20</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
