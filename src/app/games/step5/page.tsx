'use client';

import { useState } from 'react';

export default function CreateAccountPage() {
  const [accountCreated, setAccountCreated] = useState(false);
  const [method, setMethod] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignup = () => {
    // Ici tu brancheras la logique Google OAuth
    setMethod('Google');
    setAccountCreated(true);
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici tu brancheras la logique création de compte avec email/password
    setMethod('Email');
    setAccountCreated(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-slate-100 antialiased">
      {!accountCreated ? (
        <>
          <h1 className="mb-6 text-center text-3xl font-bold">
            Sauvegarde ta progression !
          </h1>
          <p className="mb-10 max-w-xl text-center text-slate-300">
            Crée ton compte pour découvir ce que Coding Factory à encore dans
            son sac...
          </p>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignup}
            className="mb-6 w-full max-w-md rounded-xl bg-blue-400 px-6 py-4 text-lg font-semibold text-slate-900 shadow-lg transition-transform hover:scale-105"
          >
            Se connecter avec Google
          </button>

          <div className="mb-6 flex w-full max-w-md items-center">
            <hr className="flex-1 border-slate-600" />
            <span className="mx-4 text-slate-400">ou</span>
            <hr className="flex-1 border-slate-600" />
          </div>

          {/* Formulaire email/password */}
          <form
            onSubmit={handleEmailSignup}
            className="flex w-full max-w-md flex-col gap-4"
            autoComplete="on"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              autoComplete="new-password"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-700 px-6 py-4 text-lg font-semibold text-slate-100 shadow-lg transition-transform hover:scale-105"
            >
              Créer un compte
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold text-slate-200">
            Tu as choisi : <span className="text-blue-400">{method}</span>
          </p>
          <p className="text-xl font-medium text-blue-400 transition-all duration-500">
            🎉 Félicitations ! Ton compte a été créé avec succès.
          </p>
        </div>
      )}
    </main>
  );
}
