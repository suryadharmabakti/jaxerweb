'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const res = await result.json();
      if (!result.ok) throw new Error(res.error || 'Login gagal');
      
      const data = res.data;

      const user = {
        _id: data._id,
        name: data.name,
        email: data.email,
        store: data.store,
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* Left panel (gray block like the screenshot) */}
        <div className="hidden lg:block lg:w-1/2 bg-gray-200" />

        {/* Right panel */}
        <div className="relative flex flex-1 items-center justify-center p-8 sm:p-12">
          {/* Logo */}
            <div className="absolute left-10 top-8">
            <img 
              src="/jaxlab.png"   
              alt="JaxLab Logo" 
              className="h-8 w-auto"
            />
            </div>

          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900">Welcome,</h1>
              <p className="mt-2 text-sm text-gray-600">
                Kendalikan seluruh transaksi penjualanmu<br />
                hanya dengan satu klik saja.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Username / Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-400"
                  placeholder="username/email"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-400"
                  placeholder="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-3.5 w-3.5 rounded border-gray-300"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-lime-500 py-2.5 text-sm font-semibold text-white transition hover:bg-lime-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>

              <p className="pt-2 text-center text-xs text-gray-600">
                Baru pertama kali pakai App? Silakan{' '}
                <Link href="/register" className="font-semibold text-lime-600 hover:text-lime-700">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
