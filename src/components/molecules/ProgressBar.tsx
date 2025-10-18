'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ProgressBarProps {
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

export default function ProgressBar({
  totalSteps = 5,
  onStepClick,
}: ProgressBarProps) {
  const pathname = usePathname();
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Charger les niveaux réussis depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('completedLevels');
      const completed: number[] = stored ? JSON.parse(stored) : [];
      setCompletedLevels(completed);
    }
  }, [pathname]); // Recharger quand on change de page

  // Extraire le numéro de step depuis l'URL
  const extractStepFromUrl = (): number => {
    const match = pathname.match(/step(\d+)/);
    if (match && match[1]) {
      const stepNum = parseInt(match[1], 10);
      if (stepNum >= 1 && stepNum <= totalSteps) {
        return stepNum;
      }
    }
    return 1;
  };

  const currentStep = extractStepFromUrl();
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex w-full items-center justify-center py-2">
      <div className="flex w-full max-w-3xl items-center justify-center">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = completedLevels.includes(step);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step}>
              {/* Boule cliquable */}
              <div
                onClick={() => onStepClick && onStepClick(step)}
                className={`relative h-3 w-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-400 shadow-[0_0_10px_4px_rgba(96,165,250,0.8)]'
                    : isCompleted
                      ? 'bg-green-600 shadow-[0_0_8px_2px_rgba(34,197,94,0.4)]'
                      : 'bg-gray-500'
                } ${onStepClick ? 'cursor-pointer hover:scale-125' : ''}`}
              >
                {/* Icône de validation pour les niveaux réussis */}
                {isCompleted && !isActive && (
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white">
                    ✓
                  </div>
                )}
              </div>

              {/* Trait de liaison */}
              {!isLast && (
                <div
                  className={`mx-1 h-[2px] flex-1 transition-all duration-300 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
