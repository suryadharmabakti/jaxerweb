// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

type NavItem =
  | {
      key: string;
      label: string;
      href: string;
      icon: ReactNode;
    }
  | {
      key: string;
      label: string;
      icon: ReactNode;
      children: { key: string; label: string; href: string }[];
    };

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function DotIcon({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-block h-2.5 w-2.5 rounded-full border',
        active ? 'bg-jax-lime border-jax-lime' : 'bg-white border-gray-300'
      )}
    />
  );
}

interface SidebarProps {
  open: boolean;
  toggle: () => void;
}

export default function Sidebar({ open, toggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isKelolaBarangActive = pathname.startsWith('/kelola-barang');
  const [isKelolaBarangOpen, setIsKelolaBarangOpen] = useState(isKelolaBarangActive);

  useEffect(() => {
    if (isKelolaBarangActive) setIsKelolaBarangOpen(true);
  }, [isKelolaBarangActive]);

  const navItems: NavItem[] = useMemo(
    () => [
      {
        key: 'beranda',
        label: 'Beranda',
        href: '/dashboard',
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-7h4v7h4a1 1 0 001-1V10"
            />
          </svg>
        ),
      },
      {
        key: 'kelola-barang',
        label: 'Kelola Barang',
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
            />
          </svg>
        ),
        children: [
          { key: 'cabang', label: 'Cabang', href: '/kelola-barang/cabang' },
          { key: 'kategori', label: 'Kategori Produk', href: '/kelola-barang/kategori-produk' },
          { key: 'merk', label: 'Merk Produk', href: '/kelola-barang/merk-produk' },
          { key: 'barang', label: 'Barang/Produk', href: '/kelola-barang/barang-produk' },
        ],
      },
      {
        key: 'pengguna',
        label: 'Pengguna',
        href: '/pengguna',
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      },
      {
        key: 'laporan',
        label: 'Laporan',
        href: '/laporan',
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17v-6m4 6V7m4 10v-4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        ),
      },
    ],
    []
  );

  const handleLogout = () => {
    if (!confirm('Yakin ingin keluar?')) return;

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {
      // ignore
    }

    router.push('/login');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-jax-line bg-white transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <img src="/jaxlab.png" alt="JaxLab" className="h-6 w-auto" />
        </div>
        <button
          onClick={toggle}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="px-6 pb-2 text-xs text-gray-400">Highlight</div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            if ('children' in item) {
              const anyChildActive = item.children.some((c) => pathname.startsWith(c.href));

              return (
                <div key={item.key}>
                  <button
                    type="button"
                    onClick={() => setIsKelolaBarangOpen((v) => !v)}
                    className={cn(
                      'w-full flex items-center justify-between rounded-xl px-3 py-3 text-sm transition',
                      anyChildActive
                        ? 'bg-jax-lime text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn(anyChildActive ? 'text-white' : 'text-gray-600')}>{item.icon}</span>
                      <span className={cn('font-medium', anyChildActive ? 'text-white' : 'text-gray-800')}>
                        {item.label}
                      </span>
                    </span>

                    <svg
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isKelolaBarangOpen ? 'rotate-180' : 'rotate-0',
                        anyChildActive ? 'text-white' : 'text-gray-500'
                      )}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isKelolaBarangOpen && (
                    <div className="mt-2 ml-3 space-y-1">
                      {item.children.map((c) => {
                        const active = pathname === c.href;
                        return (
                          <Link
                            key={c.key}
                            href={c.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                              active ? 'text-jax-limeDark' : 'text-gray-700 hover:bg-gray-50'
                            )}
                          >
                            <DotIcon active={active} />
                            <span className={cn('font-medium', active && 'text-jax-limeDark')}>{c.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const active = isActive(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition',
                  active ? 'bg-jax-lime text-white' : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <span className={cn(active ? 'text-white' : 'text-gray-600')}>{item.icon}</span>
                <span className={cn('font-medium', active ? 'text-white' : 'text-gray-800')}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl border border-red-300 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}
