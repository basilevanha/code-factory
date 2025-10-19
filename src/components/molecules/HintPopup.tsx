'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/atoms/Button';

type PopupPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

type Hint = {
  text: string | ReactNode;
  targetSelector?: string;
  popupPosition?: PopupPosition;
  offset?: number;
};

type HintPopupProps = {
  hints: Hint[];
  onClose: () => void;
};

export default function HintPopup({ hints, onClose }: HintPopupProps) {
  const [currentHint, setCurrentHint] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const hint = hints[currentHint];

  const updateHighlightPosition = () => {
    if (!hint.targetSelector) {
      setHighlightRect(null);
      return;
    }
    const el = document.querySelector(hint.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setHighlightRect(rect);
    } else {
      setHighlightRect(null);
    }
  };

  useEffect(() => {
    updateHighlightPosition();
    window.addEventListener('resize', updateHighlightPosition);
    window.addEventListener('scroll', updateHighlightPosition, true);
    return () => {
      window.removeEventListener('resize', updateHighlightPosition);
      window.removeEventListener('scroll', updateHighlightPosition, true);
    };
  }, [hint]);

  const handleNext = () => {
    if (currentHint < hints.length - 1) setCurrentHint(currentHint + 1);
    else onClose();
  };

  const handlePrevious = () => {
    if (currentHint > 0) setCurrentHint(currentHint - 1);
  };

  const getBestPosition = (): PopupPosition => {
    if (!highlightRect) return 'center';
    if (hint.popupPosition) return hint.popupPosition;

    const popupHeight = 200;
    const popupWidth = 320;
    const offset = hint.offset ?? 20;
    const padding = 20;

    const spaceTop = highlightRect.top - padding;
    const spaceBottom = window.innerHeight - highlightRect.bottom - padding;
    const spaceLeft = highlightRect.left - padding;
    const spaceRight = window.innerWidth - highlightRect.right - padding;

    const scores = {
      bottom: spaceBottom >= popupHeight ? spaceBottom : -1,
      top: spaceTop >= popupHeight ? spaceTop : -1,
      right: spaceRight >= popupWidth ? spaceRight : -1,
      left: spaceLeft >= popupWidth ? spaceLeft : -1,
    };

    if (scores.bottom > 0) return 'bottom';
    if (scores.top > 0) return 'top';
    if (scores.right > 0) return 'right';
    if (scores.left > 0) return 'left';

    const maxScore = Math.max(
      scores.bottom,
      scores.top,
      scores.right,
      scores.left
    );

    if (maxScore === scores.bottom) return 'bottom';
    if (maxScore === scores.top) return 'top';
    if (maxScore === scores.right) return 'right';
    return 'left';
  };

  const popupStyle: React.CSSProperties = (() => {
    if (!highlightRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const popupHeight = popupRef.current?.offsetHeight ?? 200;
    const popupWidth = popupRef.current?.offsetWidth ?? 320;
    const offset = hint.offset ?? 20;
    const pos = getBestPosition();

    let top = 0;
    let left = 0;

    switch (pos) {
      case 'top':
        top = highlightRect.top - popupHeight - offset;
        left = highlightRect.left + highlightRect.width / 2 - popupWidth / 2;
        break;
      case 'bottom':
        top = highlightRect.bottom + offset;
        left = highlightRect.left + highlightRect.width / 2 - popupWidth / 2;
        break;
      case 'left':
        top = highlightRect.top + highlightRect.height / 2 - popupHeight / 2;
        left = highlightRect.left - popupWidth - offset;
        break;
      case 'right':
        top = highlightRect.top + highlightRect.height / 2 - popupHeight / 2;
        left = highlightRect.right + offset;
        break;
    }

    const maxLeft = window.innerWidth - popupWidth - 20;
    const maxTop = window.innerHeight - popupHeight - 20;

    left = Math.max(20, Math.min(left, maxLeft));
    top = Math.max(20, Math.min(top, maxTop));

    return {
      position: 'fixed',
      top,
      left,
    };
  })();

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Zones sombres autour du highlight */}
      {highlightRect ? (
        <>
          <div
            className="pointer-events-auto fixed bg-black/40"
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: highlightRect.top,
            }}
            onClick={onClose}
          />
          <div
            className="pointer-events-auto fixed bg-black/40"
            style={{
              top: highlightRect.bottom,
              left: 0,
              width: '100%',
              height: `calc(100vh - ${highlightRect.bottom}px)`,
            }}
            onClick={onClose}
          />
          <div
            className="pointer-events-auto fixed bg-black/40"
            style={{
              top: highlightRect.top,
              left: 0,
              width: highlightRect.left,
              height: highlightRect.height,
            }}
            onClick={onClose}
          />
          <div
            className="pointer-events-auto fixed bg-black/40"
            style={{
              top: highlightRect.top,
              left: highlightRect.right,
              width: `calc(100vw - ${highlightRect.right}px)`,
              height: highlightRect.height,
            }}
            onClick={onClose}
          />

          <div
            className="pointer-events-none fixed rounded-lg border-4 border-yellow-400 shadow-[0_0_30px_10px_rgba(255,255,0,0.8)]"
            style={{
              top: highlightRect.top - 6,
              left: highlightRect.left - 6,
              width: highlightRect.width + 12,
              height: highlightRect.height + 12,
            }}
          />
        </>
      ) : (
        <div
          className="pointer-events-auto fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Popup principale */}
      <div
        ref={popupRef}
        className="pointer-events-auto fixed w-80 rounded-2xl bg-white p-5 text-gray-800 shadow-2xl transition-all"
        style={popupStyle}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="mb-4 text-base leading-relaxed">{hint.text}</div>

        <div className="mt-4 flex items-center justify-between">
          {/* Bouton précédent ghost discret */}
          <Button
            icon="chevron-left"
            onClick={handlePrevious}
            disabled={currentHint === 0}
            className="border-none bg-gray-200 px-2 py-1 text-sm text-gray-400"
          >
            {''}
          </Button>

          {/* Compteur étape */}
          <div className="text-xs text-gray-400">
            {currentHint + 1} / {hints.length}
          </div>

          {/* Bouton suivant classique */}
          <Button icon="chevron-right" onClick={handleNext}>
            {currentHint < hints.length - 1 ? 'Suivant' : 'Terminer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
