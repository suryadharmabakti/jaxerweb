import AppShell from '@/components/AppShell';

type ProductRow = {
  name: string;
  code: string;
  category: string;
  brand: string;
  qty: number;
  branch: string;
  sellPrice: number;
  buyPrice: number;
};

export default function BarangProdukPage() {
  const rows: ProductRow[] = [
    {
      name: 'Baju Adidas',
      code: 'ADI7889',
      category: 'Pakaian',
      brand: 'Adidas',
      qty: 100,
      branch: 'Pusat',
      sellPrice: 50_000,
      buyPrice: 23_000,
    },
    {
      name: 'Batik',
      code: 'BA36777',
      category: 'Pakaian',
      brand: 'Adidas',
      qty: 400,
      branch: 'Pusat',
      sellPrice: 120_000,
      buyPrice: 43_000,
    },
  ];

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Kelola Barang &nbsp;›&nbsp; Barang/Produk</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Barang/Produk</h1>
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

      <div className="mt-4 rounded-2xl bg-jax-lime px-5 py-4 text-black w-full max-w-xs">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs opacity-90">Total Stok Tersedia</div>
            <div className="mt-1 text-lg font-semibold">500</div>
            <div className="mt-1 text-[11px] opacity-90">Dari 2 produk, Cabang Pusat</div>
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
                <th className="px-5 py-3 font-medium">Gambar</th>
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Kode Produk</th>
                <th className="px-5 py-3 font-medium">Kategori Produk</th>
                <th className="px-5 py-3 font-medium">Merk Produk</th>
                <th className="px-5 py-3 font-medium">Qty</th>
                <th className="px-5 py-3 font-medium">Cabang</th>
                <th className="px-5 py-3 font-medium">Harga Jual per satuan</th>
                <th className="px-5 py-3 font-medium">Harga Beli per satuan</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.code} className="border-b border-gray-100">
                  <td className="px-5 py-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-900">{r.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.code}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.category}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.brand}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.qty.toLocaleString('id-ID')}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.branch}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.sellPrice.toLocaleString('id-ID')}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.buyPrice.toLocaleString('id-ID')}</td>
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
