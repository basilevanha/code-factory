'use client';

import { useState } from 'react';

const options = [
  {
    label: '0-2 heures / semaine',
    value: 2,
    message: 'Commence doucement, chaque petite session compte !',
  },
  {
    label: '3-6 heures / semaine',
    value: 5,
    message: 'Super ! Une bonne régularité pour progresser rapidement.',
  },
  {
    label: '8 heures / semaine',
    value: 8,
    message: 'Excellent ! Ton engagement te permettra d’avancer très vite.',
  },
  {
    label: '+8 heures / semaine',
    value: 9,
    message: 'Wow ! Tu es un vrai passionné, continue sur cette lancée !',
  },
];

export default function StudyGoalPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const handleSelect = (value: number) => {
    setSelected(value);
    const opt = options.find((o) => o.value === value);
    if (opt) {
      setMessage(opt.message);
      setSelectedLabel(opt.label);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-slate-100 antialiased">
      {!selected ? (
        <>
          <h1 className="mb-6 text-center text-3xl font-bold">
            Choisis ton objectif d'apprentissage hebdomadaire
          </h1>

          <div className="flex w-full max-w-md flex-col gap-6">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="w-full rounded-xl bg-blue-700 px-6 py-4 text-lg font-semibold text-slate-100 shadow-lg transition-transform hover:scale-105"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold text-slate-200">
            Ton choix : <span className="text-blue-400">{selectedLabel}</span>
          </p>
          <p className="text-xl font-medium text-blue-400 transition-all duration-500">
            🎯 {message}
          </p>
        </div>
      )}
    </main>
  );
}
