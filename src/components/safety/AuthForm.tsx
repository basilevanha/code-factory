'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  defaultMode?: 'login' | 'signup';
}

export default function AuthForm({ defaultMode = 'login' }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedCGU, setAcceptedCGU] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Connexion ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/MyFactory');
  };

  // --- Création de compte ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptedCGU) {
      setError(
        'Veuillez accepter les conditions générales avant de continuer.'
      );
      return;
    }

    setLoading(true);
    try {
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email,
          password,
          options: { data: { surname } },
        });
      if (signupError) throw signupError;

      const user = signupData.user;
      if (!user) {
        alert('Compte créé, vérifie ta boîte mail pour valider ton adresse.');
        return;
      }

      const code = `CF-${Math.floor(100000 + Math.random() * 900000)}`;
      const { error: insertError } = await supabase
        .from('joueurs')
        .insert([{ user_id: user.id, nom: surname, email: user.email, code }]);
      if (insertError) throw insertError;

      router.push('/MyFactory');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError('');
    setAcceptedCGU(false);
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-slate-800/70 p-8 text-center shadow-xl backdrop-blur">
      {/* 💡 Titre & ambiance dynamique */}
      {mode === 'login' ? (
        <>
          <h1 className="mb-4 text-3xl font-bold text-blue-400">
            Ravi de te revoir 👋
          </h1>
          <p className="mb-10 text-slate-300">
            Le monde de <strong>Coding Factory</strong> n’a pas arrêté d’évoluer
            pendant ton absence.
            <br />
            Connecte-toi et reprends l'aventure là où tu l’as laissée ⚙️
          </p>
        </>
      ) : (
        <>
          <p className="mb-10 text-slate-300">
            Prêt à embarquer dans l'aventure <strong>Coding Factory</strong> ?
            <br />
            Crée ton compte, débloque les prochains niveaux, et deviens un pro
            de l’automatisation industrielle 💡
          </p>
        </>
      )}

      <form
        onSubmit={mode === 'login' ? handleLogin : handleSignup}
        className="flex flex-col gap-4 text-left"
      >
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Prénom*"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="rounded-xl bg-slate-900 px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl bg-slate-900 px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl bg-slate-900 px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />

        {/* ✅ Case RGPD visible uniquement pour création */}
        {mode === 'signup' && (
          <div className="mt-2 flex items-start gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              id="acceptCGU"
              checked={acceptedCGU}
              onChange={(e) => setAcceptedCGU(e.target.checked)}
              className="mt-1 h-4 w-4 accent-blue-600"
              required
            />
            <label htmlFor="acceptCGU">
              J’ai lu et j’accepte les{' '}
              <a
                href="/reglement"
                target="_blank"
                className="text-blue-400 underline hover:text-blue-300"
              >
                conditions générales
              </a>
              .
            </label>
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 rounded-xl py-3 font-semibold transition-all ${
            loading
              ? 'cursor-not-allowed bg-slate-600'
              : 'bg-blue-600 hover:scale-105 hover:bg-blue-700'
          }`}
        >
          {loading
            ? 'Chargement...'
            : mode === 'login'
              ? 'Se Connecter'
              : 'Rejoindre l’aventure !'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-400">
        {mode === 'login' ? (
          <>
            Pas encore de compte ?{' '}
            <button
              onClick={toggleMode}
              className="text-blue-400 underline hover:text-blue-300"
            >
              Rejoins l’aventure ici
            </button>
            .
          </>
        ) : (
          <>
            Déjà membre de l’aventure ?{' '}
            <button
              onClick={toggleMode}
              className="text-blue-400 underline hover:text-blue-300"
            >
              Connecte-toi ici
            </button>
            .
          </>
        )}
      </div>
    </div>
  );
}
