'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/molecules/ProgressBar';

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleStepClick = (step: number) => {
    setCurrentStep(step); // met à jour la progression
    router.push(`/games/step${step}`); // navigation
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header / barre de progression */}
      <header className="top-0 z-50 bg-gray-900 p-2">
        <ProgressBar
          totalSteps={5}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </header>

      {/* Contenu de la page stepX */}
      <section className="flex-1">{children}</section>
    </main>
  );
}
