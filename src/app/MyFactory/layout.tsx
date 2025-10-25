'use client';

import AuthGuard from '@/components/safety/AuthGuard';
import { useSupabaseUser } from '@/lib/useSupabaseUser';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function MyFactoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSupabaseUser();
  const router = useRouter();

  // 🔐 Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Retour à l’accueil après déconnexion
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100">
        {/* 🧠 Bandeau utilisateur */}
        <header className="w-full border-b border-slate-700 bg-slate-800/60 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="text-sm text-slate-300">
              {user ? (
                <>
                  Connecté en tant que{' '}
                  <span className="font-medium text-blue-400">
                    {user.user_metadata?.surname || user.email}
                  </span>
                </>
              ) : (
                'Chargement...'
              )}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </div>
        </header>

        {/* 🧩 Contenu principal */}
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
