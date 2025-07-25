'use client';

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      await register(username, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 font-semibold rounded-l ${tab === 'login' ? 'bg-gray-200' : ''}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold rounded-r ${tab === 'register' ? 'bg-gray-200' : ''}`}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {tab === 'login' ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <input name="email" type="email" placeholder="Email" className="w-full px-3 py-2 border rounded" />
            <input name="password" type="password" placeholder="Password" className="w-full px-3 py-2 border rounded" />
            <button type="submit" className="w-full py-2 font-bold text-white bg-black rounded" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <input name="username" type="text" placeholder="Username" className="w-full px-3 py-2 border rounded" />
            <input name="email" type="email" placeholder="Email" className="w-full px-3 py-2 border rounded" />
            <input name="password" type="password" placeholder="Password" className="w-full px-3 py-2 border rounded" />
            <button type="submit" className="w-full py-2 font-bold text-white bg-black rounded" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 