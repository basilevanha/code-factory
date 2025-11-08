'use client';

import { useRouter, usePathname } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { FC, useEffect } from 'react';

type SuccessPopupProps = {
  show: boolean;
  message?: string;
  onReplay?: () => void;
  onClose?: () => void;
};

const SuccessPopup: FC<SuccessPopupProps> = ({
  show,
  message = 'Félicitations, mission accomplie ! ',
  onReplay,
  onClose,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentStep = (): number => {
    const match = pathname.match(/step(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  const getCompletedLevels = (): number[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('completedLevels');
    return stored ? JSON.parse(stored) : [];
  };

  const markLevelAsCompleted = (step: number) => {
    const completed = getCompletedLevels();
    if (!completed.includes(step)) {
      completed.push(step);
      localStorage.setItem('completedLevels', JSON.stringify(completed));
    }
  };

  useEffect(() => {
    if (show) {
      const currentStep = getCurrentStep();
      markLevelAsCompleted(currentStep);
    }
  }, [show]);

  const goToNextStep = () => {
    const currentStep = getCurrentStep();
    const nextStep = currentStep + 1;
    router.push(`/games/step${nextStep}`);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity">
      <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl transition-all duration-200">
        <h2 className="mb-2 text-xl font-bold text-green-600">🎉 BRAVO !</h2>
        <p className="mb-6 text-gray-800">{message}</p>

        <div className="flex flex-col gap-3">
          {/* 🔹 Bouton Rejouer – discret mais lisible */}
          <Button
            className="w-full justify-center bg-gray-300 text-gray-800 transition hover:bg-gray-400"
            onClick={() => {
              onClose?.();
              onReplay?.();
            }}
          >
            Rejouer
          </Button>

          {/* 🟢 Bouton principal – Niveau suivant */}
          <Button
            className="w-full justify-center bg-green-600 text-white transition hover:bg-green-700"
            onClick={() => {
              onClose?.();
              goToNextStep();
            }}
          >
            Niveau suivant
          </Button>
        </div>
      </div>
    </div>
  );
};

export const isLevelCompleted = (step: number): boolean => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('completedLevels');
  const completed: number[] = stored ? JSON.parse(stored) : [];
  return completed.includes(step);
};

export const resetProgress = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('completedLevels');
  }
};

export default SuccessPopup;
