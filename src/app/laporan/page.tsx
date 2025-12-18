import AppShell from '@/components/AppShell';

export default function LaporanPage() {
  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">report</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">report</h1>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M6 12h12M10 19h4" />
          </svg>
          Filter
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-white border border-gray-200 p-6 text-sm text-gray-600">
        Belom tau nih isinya apa.
      </div>
    </AppShell>
  );
}
