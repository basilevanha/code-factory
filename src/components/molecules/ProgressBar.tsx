'use client';

import React from 'react';

interface ProgressBarProps {
  totalSteps?: number;
  currentStep?: number;
  onStepClick?: (step: number) => void; // fonction appelée au clic sur une pastille
}

export default function ProgressBar({
  totalSteps = 5,
  currentStep = 1,
  onStepClick,
}: ProgressBarProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex w-full items-center justify-center py-2">
      <div className="flex w-full max-w-3xl items-center justify-center">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
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
                      ? 'bg-blue-700'
                      : 'bg-gray-500'
                } ${onStepClick ? 'cursor-pointer hover:scale-120' : ''}`}
              ></div>

              {/* Trait de liaison */}
              {!isLast && (
                <div
                  className={`mx-1 h-[2px] flex-1 transition-all duration-300 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-600'
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
