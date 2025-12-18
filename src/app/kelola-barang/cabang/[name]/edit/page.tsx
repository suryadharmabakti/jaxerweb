// 'use client';

// import AppShell from '@/components/AppShell';
// import { loadBranches, saveBranches, type BranchRow } from '@/app/kelola-barang/cabang/branchStore';
// import { loadProducts, saveProducts } from '@/app/kelola-barang/barang-produk/productStore';
// import { useParams, useRouter } from 'next/navigation';
// import { useEffect, useMemo, useState } from 'react';

// export default function EditCabangPage() {
//   const router = useRouter();
//   const params = useParams();

//   const encodedName = (params?.name as string) ?? '';
//   const branchName = useMemo(() => {
//     try {
//       return decodeURIComponent(encodedName);
//     } catch {
//       return encodedName;
//     }
//   }, [encodedName]);

//   const [loading, setLoading] = useState(true);
//   const [branch, setBranch] = useState<BranchRow | null>(null);
//   const [draft, setDraft] = useState<BranchRow>({ name: '', phone: '', location: '' });

//   useEffect(() => {
//     const branches = loadBranches();
//     const found = branches.find((b) => b.name === branchName) ?? null;
//     setBranch(found);

//     if (found) {
//       setDraft({ name: found.name, phone: found.phone, location: found.location });
//     }

//     setLoading(false);
//   }, [branchName]);

//   const handleSave = () => {
//     if (!branch) return;

//     const nextName = draft.name.trim();
//     const nextPhone = draft.phone.trim();
//     const nextLocation = draft.location.trim();

//     if (!nextName || !nextPhone || !nextLocation) {
//       alert('Mohon lengkapi: nama cabang, no telpon admin, lokasi cabang.');
//       return;
//     }

//     const branches = loadBranches();

//     if (
//       nextName.toLowerCase() !== branch.name.toLowerCase() &&
//       branches.some((b) => b.name.toLowerCase() === nextName.toLowerCase())
//     ) {
//       alert('Nama cabang sudah ada. Gunakan nama lain.');
//       return;
//     }

//     const nextBranches = branches.map((b) => (b.name === branch.name ? { name: nextName, phone: nextPhone, location: nextLocation } : b));
//     saveBranches(nextBranches);

//     // If branch name changed, propagate to products for consistency.
//     if (nextName !== branch.name) {
//       const products = loadProducts();
//       const nextProducts = products.map((p) => (p.branch === branch.name ? { ...p, branch: nextName } : p));
//       saveProducts(nextProducts);
//     }

//     router.push('/kelola-barang/cabang');
//   };

//   const handleDelete = () => {
//     if (!branch) return;
//     if (!confirm(`Hapus cabang: ${branch.name}?`)) return;

//     const branches = loadBranches();
//     saveBranches(branches.filter((b) => b.name !== branch.name));
//     router.push('/kelola-barang/cabang');
//   };

//   return (
//     <AppShell>
//       <div className="flex items-start justify-between">
//         <div>
//           <div className="text-xs text-gray-400">Kelola Barang &nbsp;›&nbsp; Cabang</div>
//           <h1 className="mt-1 text-xl font-semibold text-gray-900">Edit Cabang</h1>
//         </div>
//       </div>

//       <div className="mt-4 w-full max-w-3xl rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
//         {loading ? (
//           <div className="text-sm text-gray-600">Memuat…</div>
//         ) : !branch ? (
//           <div className="text-sm text-gray-600">
//             Cabang tidak ditemukan.
//             <button
//               type="button"
//               onClick={() => router.push('/kelola-barang/cabang')}
//               className="ml-2 underline text-jax-limeDark"
//             >
//               Kembali
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="mt-1 text-xs text-gray-500">Nama cabang: {branch.name}</div>

//             <div className="mt-4 grid grid-cols-1 gap-4">
//               <label className="flex items-center gap-3">
//                 <span className="w-40 shrink-0 text-xs text-gray-600">Nama Cabang</span>
//                 <input
//                   value={draft.name}
//                   onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
//                   className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
//                   placeholder="nama cabang"
//                 />
//               </label>

//               <label className="flex items-center gap-3">
//                 <span className="w-40 shrink-0 text-xs text-gray-600">No Telpon Admin</span>
//                 <input
//                   value={draft.phone}
//                   onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
//                   className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
//                   placeholder="+62..."
//                 />
//               </label>

//               <label className="flex items-center gap-3">
//                 <span className="w-40 shrink-0 text-xs text-gray-600">Lokasi Cabang</span>
//                 <input
//                   value={draft.location}
//                   onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
//                   className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
//                   placeholder="alamat / kota"
//                 />
//               </label>
//             </div>

//             <div className="mt-5 flex items-center justify-between gap-2">
//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-600 hover:bg-red-50"
//               >
//                 Hapus
//               </button>

//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => router.push('/kelola-barang/cabang')}
//                   className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   className="rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark"
//                 >
//                   Simpan
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </AppShell>
//   );
// }
