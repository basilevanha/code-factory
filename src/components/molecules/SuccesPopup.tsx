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

  // Extraire le numéro de step actuel
  const getCurrentStep = (): number => {
    const match = pathname.match(/step(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  // Sauvegarder le niveau comme réussi
  const markLevelAsCompleted = (step: number) => {
    const completed = getCompletedLevels();
    if (!completed.includes(step)) {
      completed.push(step);
      localStorage.setItem('completedLevels', JSON.stringify(completed));
      //console.log('✅ Niveau', step, 'marqué comme réussi');
    }
  };

  // Récupérer les niveaux réussis
  const getCompletedLevels = (): number[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('completedLevels');
    return stored ? JSON.parse(stored) : [];
  };

  // Marquer le niveau comme réussi quand la popup s'affiche
  useEffect(() => {
    if (show) {
      const currentStep = getCurrentStep();
      markLevelAsCompleted(currentStep);
    }
  }, [show]);

  // Aller à la step suivante
  const goToNextStep = () => {
    const currentStep = getCurrentStep();
    const nextStep = currentStep + 1;
    const nextUrl = `/games/step${nextStep}`;

    console.log('➡️ Passage à :', nextUrl);
    router.push(nextUrl);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity">
      <div className="relative mx-4 w-full max-w-sm scale-100 transform rounded-2xl bg-white p-6 text-center shadow-xl transition-all duration-200">
        <h2 className="mb-2 text-xl font-bold text-green-600">🎉 BRAVO !</h2>
        <p className="mb-6 text-gray-800">{message}</p>

        <div className="flex flex-col gap-3">
          <Button
            className="w-full justify-center"
            onClick={() => {
              onClose?.();
              onReplay?.();
            }}
          >
            Rejouer
          </Button>

          <Button
            className="w-full justify-center bg-green-600 text-white hover:bg-green-700"
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

// Fonction utilitaire exportée pour vérifier si un niveau est complété
export const isLevelCompleted = (step: number): boolean => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('completedLevels');
  const completed: number[] = stored ? JSON.parse(stored) : [];
  return completed.includes(step);
};

// Fonction pour réinitialiser la progression
export const resetProgress = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('completedLevels');
    //console.log('🔄 Progression réinitialisée');
  }
};

export default SuccessPopup;
