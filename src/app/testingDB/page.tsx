'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    console.log('✅ Connexion réussie');
    router.push('/MyFactory'); // redirige vers l’accueil ou MyFactory
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-slate-100">
      <form
        onSubmit={handleLogin}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="mb-4 text-2xl font-bold">Connexion</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl bg-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl bg-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="mt-2 rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </main>
  );
}
