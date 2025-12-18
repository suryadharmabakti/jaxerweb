'use client';

import AppShell from '@/components/AppShell';
import { DEFAULT_PRODUCTS, loadProducts, saveProducts } from '@/app/kelola-barang/barang-produk/productStore';
import { exportToExcel, importFromExcel } from '@/utils/excel';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function includesText(value: string, q: string) {
  return value.toLowerCase().includes(q);
}

export type Product = {
  _id: string;
  name: string;
  code: string;
  file: string;
  userId: string;
}

export type Stock = {
  name: string;
  code: string;
  qty: number;
  branch: string;
  harga: number;
  hargaModal: number;
  satuan: string;
  produk: Product;
};

export default function BarangProdukPage() {
  const router = useRouter();

  const [rows, setRows] = useState<Stock[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [filterText, setFilterText] = useState('');

  const [openMenuForCode, setOpenMenuForCode] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const columnsRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState<Record<string, boolean>>({
    image: true,
    name: true,
    code: true,
    category: true,
    brand: true,
    qty: true,
    branch: true,
    sellPrice: true,
    buyPrice: true,
    actions: true,
  });

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      const token = localStorage.getItem('token');

      const result = await fetch(
        `/api/stock?id=${user._id}&token=${token}`,
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

  console.log("cek ini data", rows);

  useEffect(() => {
    setRows(loadProducts());
    setHydrated(true);
    try {
      const saved = localStorage.getItem('columns_barang');
      if (saved) {
        const parsed = JSON.parse(saved);
        setColumns({
          image: Boolean(parsed.image),
          name: Boolean(parsed.name),
          code: Boolean(parsed.code),
          category: Boolean(parsed.category),
          brand: Boolean(parsed.brand),
          qty: Boolean(parsed.qty),
          branch: Boolean(parsed.branch),
          sellPrice: Boolean(parsed.sellPrice),
          buyPrice: Boolean(parsed.buyPrice),
          actions: true,
        });
      }
    } catch {}
    fetchData();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveProducts(rows);
  }, [rows, hydrated]);

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
      const toSave = {
        image: columns.image,
        name: columns.name,
        code: columns.code,
        category: columns.category,
        brand: columns.brand,
        qty: columns.qty,
        branch: columns.branch,
        sellPrice: columns.sellPrice,
        buyPrice: columns.buyPrice,
      };
      localStorage.setItem('columns_barang', JSON.stringify(toSave));
    } catch {}
  }, [columns]);

  const filteredRows = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const qtyText = Number.isFinite(r.qty) ? String(r.qty) : '';
      const sellText = Number.isFinite(r.harga) ? String(r.harga) : '';
      const buyText = Number.isFinite(r.hargaModal) ? String(r.hargaModal) : '';

      return (
        includesText(r.name, q) ||
        includesText(r.code, q) ||
        includesText(qtyText, q) ||
        includesText(sellText, q) ||
        includesText(buyText, q)
      );
    });
  }, [rows, filterText]);

  // const totalQty = useMemo(() => filteredRows.reduce((sum, r) => sum + (Number.isFinite(r.qty) ? r.qty : 0), 0), [filteredRows]);

  const handleDelete = (code: string) => {
    const p = rows.find((r) => r.code === code);
    if (!p) return;
    if (!confirm(`Hapus produk: ${p.name}?`)) return;

    setRows((prev) => prev.filter((r) => r.code !== code));
    setOpenMenuForCode(null);
  };

  const handleEdit = (code: string) => {
    setOpenMenuForCode(null);
    router.push(`/kelola-barang/barang-produk/${code}/edit`);
  };

  const handleExport = () => {
    exportToExcel(rows, 'data-barang');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     const data = await importFromExcel(file);
  //     // Validate or map data
  //     const newRows: Product[] = data.map((item: any) => ({
  //       name: item.name || item['Nama'] || '',
  //       code: item.code || item['Kode Produk'] || '',
  //       category: item.category || item['Kategori Produk'] || '',
  //       brand: item.brand || item['Merk Produk'] || '',
  //       qty: Number(item.qty || item['Qty'] || 0),
  //       branch: item.branch || item['Cabang'] || '',
  //       sellPrice: Number(item.sellPrice || item['Harga Jual'] || 0),
  //       buyPrice: Number(item.buyPrice || item['Harga Beli'] || 0),
  //       imageDataUrl: item.imageDataUrl || item['Gambar'] || undefined,
  //     })).filter(r => r.name && r.code);

  //     if (confirm(`Akan mengimpor ${newRows.length} data? Data lama akan digabungkan.`)) {
  //        const combined = [...rows];
  //        for (const newRow of newRows) {
  //           const index = combined.findIndex(r => r.code === newRow.code);
  //           if (index >= 0) {
  //              combined[index] = newRow; 
  //           } else {
  //              combined.push(newRow);
  //           }
  //        }
  //        saveProducts(combined);
  //        setRows(combined);
  //        alert('Import berhasil!');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert('Gagal mengimpor file excel.');
  //   } finally {
  //     if (fileInputRef.current) fileInputRef.current.value = '';
  //   }
  // };

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Manage Item &nbsp;›&nbsp; goods/products</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">goods/products</h1>
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
                  { key: 'image', label: 'Gambar' },
                  { key: 'name', label: 'Nama' },
                  { key: 'code', label: 'Kode Produk' },
                  { key: 'category', label: 'Kategori Produk' },
                  { key: 'brand', label: 'Merk Produk' },
                  { key: 'qty', label: 'Qty' },
                  { key: 'branch', label: 'Cabang' },
                  { key: 'sellPrice', label: 'Harga Jual per satuan' },
                  { key: 'buyPrice', label: 'Harga Beli per satuan' },
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
        <div className="mt-4 w-full max-w-3xl rounded-2xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600 w-24 shrink-0">Cari</div>
            <input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama / kode / kategori / merk / cabang"
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
          onClick={() => router.push('/kelola-barang/barang-produk/tambah')}
          className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition"
        >
          <span className="text-base leading-none">+</span> Tambah
        </button>
        {/* <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".xlsx, .xls"
        /> */}
        <button 
          onClick={handleImportClick}
          className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3" />
          </svg>
          Import
        </button>
        <button 
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21V9m0 0l4 4m-4-4l-4 4M4 7V4h16v3" />
          </svg>
          Export
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-jax-lime px-5 py-4 text-white w-full max-w-xs">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs opacity-90">Total Stok Tersedia</div>
            {/* <div className="mt-1 text-lg font-semibold">{totalQty.toLocaleString('id-ID')}</div> */}
            <div className="mt-1 text-[11px] opacity-90">
              Menampilkan {filteredRows?.length} dari {rows?.length} produk
            </div>
          </div>
          <div className="rounded-xl bg-white/20 p-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-[11px] text-gray-500">
                {columns.image && <th className="px-5 py-3 font-medium">Gambar</th>}
                {columns.name && <th className="px-5 py-3 font-medium">Nama</th>}
                {columns.code && <th className="px-5 py-3 font-medium">Kode Produk</th>}
                {columns.category && <th className="px-5 py-3 font-medium">Kategori Produk</th>}
                {columns.brand && <th className="px-5 py-3 font-medium">Merk Produk</th>}
                {columns.qty && <th className="px-5 py-3 font-medium">Qty</th>}
                {columns.branch && <th className="px-5 py-3 font-medium">Cabang</th>}
                {columns.sellPrice && <th className="px-5 py-3 font-medium">Harga Jual per satuan</th>}
                {columns.buyPrice && <th className="px-5 py-3 font-medium">Harga Beli per satuan</th>}
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRows?.map((r) => (
                <tr key={r.code} className="border-b border-gray-100">
                  <td className="px-5 py-3">
                    <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
                      {r.produk?.file ? (
                        <img
                          src={r.produk.file}
                          alt={r.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-900">{r.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.code}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.code}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.code}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.qty}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.branch}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.harga?.toLocaleString('id-ID')}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.hargaModal?.toLocaleString('id-ID')}</td>
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
          <div>Menampilkan {filteredRows?.length} dari {rows?.length}</div>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <span className="rounded border border-gray-200 bg-white px-2 py-1">20</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
