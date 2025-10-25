'use client';
import { useRouter } from 'next/navigation';
import { useSupabaseUser } from '@/lib/useSupabaseUser';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabaseUser();
  const router = useRouter();

  useEffect(() => {
    // ⚠️ Ne redirige que quand on est sûr que la session est absente
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-300">
        Vérification de la session en cours...
      </div>
    );
  }

  if (!user) return null; // redirection en cours

  return <>{children}</>;
}
