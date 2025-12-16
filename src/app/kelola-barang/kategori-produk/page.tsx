import AppShell from '@/components/AppShell';

type CategoryRow = {
  name: string;
  code: string;
};

export default function KategoriProdukPage() {
  const rows: CategoryRow[] = [
    { name: 'Pakaian', code: 'PKA00989' },
    { name: 'Obat Herbal', code: 'OH78660' },
    { name: 'Makanan', code: 'C75990TH' },
    { name: 'Lemari', code: 'LK09U114' },
    { name: 'Rumah', code: 'SUB5669000' },
  ];

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Kelola Barang &nbsp;›&nbsp; Kategori Produk</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Kategori Produk</h1>
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
        <button className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition">
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
              {rows.map((r) => (
                <tr key={r.code} className="border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900">{r.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.code}</td>
                  <td className="px-5 py-3 text-right text-sm text-gray-500">…</td>
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
