'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js'; // ✅ Import du type officiel
import AuthForm from '@/components/safety/AuthForm';

export default function CreateAccountPage() {
  const [user, setUser] = useState<User | null>(null); // ✅ Typage correct
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data?.session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      // 🔁 Si déjà connecté, redirige vers MyFactory
      if (currentUser) {
        router.replace('/MyFactory');
      }
    };

    checkUser();

    // 🔁 Écoute les changements de session (connexion / déconnexion)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) router.replace('/MyFactory');
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (loading)
    return (
      <main className="flex h-screen items-center justify-center text-slate-300">
        Vérification de la session...
      </main>
    );

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-slate-100 antialiased">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Sauvegarde ta progression !
        </h1>
        <AuthForm defaultMode="signup" />
      </main>
    );
  }

  return null; // redirection automatique
}
