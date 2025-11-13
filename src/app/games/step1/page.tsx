'use client';

import { useEffect, useState, useRef } from 'react';
import { useUnityContext } from 'react-unity-webgl';

import { getUnityPaths } from '@/utils/unity';

import Button from '@/components/atoms/Button';
import Toolbar from '@/components/molecules/Toolbar';
import UnityWrapper from '@/components/molecules/UnityWrapper';
import LadderEditor from '@/components/molecules/LadderEditor';
import SuccessPopup from '@/components/molecules/SuccesPopup';
import HintPopup from '@/components/molecules/HintPopup';
import ToolbarLadder from '@/components/molecules/ToolbarLadder';

declare global {
  interface Window {
    onUnityReady?: (json: string) => void;
    onUnitySendEtat?: (json: string) => void;
    onLevelSuccess?: (json: string) => void;
  }
}

const gamePath = '/unity/PackagingBottle';

export default function GamePage() {
  const [sensorState, setSensorState] = useState<number | null>(null);
  const unityPaths = getUnityPaths(gamePath);

  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext(unityPaths);
  const [runPLC, setRunPLC] = useState(false);

  // ✅ Refs pour stocker les fonctions exposées par LadderEditor
  const addNodeRef = useRef<((type: string) => void) | null>(null);
  const saveLadderRef = useRef<((filename: string) => Promise<void>) | null>(
    null
  );
  const loadLadderRef = useRef<((filename: string) => Promise<void>) | null>(
    null
  );

  const handleSpawn = () => {
    if (!isLoaded) return;
    sendMessage('Pipe', 'TriggerSpawn', '');
  };

  const handleReset = () => {
    if (!isLoaded) return;
    sendMessage('GameManager', 'ResetScene', '');
  };

  const [composantsUnity, setComposantsUnity] = useState<string[]>([]);

  useEffect(() => {
    window.onUnityReady = (json: string) => {
      try {
        const composants = JSON.parse(json);
        setComposantsUnity(composants.items);
      } catch (e) {
        console.error('Erreur JSON dans la liste des composants Unity:', e);
      }
    };

    return () => {
      delete window.onUnityReady;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !runPLC) return;

    const interval = setInterval(() => {
      sendMessage('GameManager', 'GetEtatsJSON', '');
    }, 100);

    return () => clearInterval(interval);
  }, [isLoaded, runPLC, sendMessage]);

  const [etatsComposants, setEtatsComposants] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    window.onUnitySendEtat = (json: string) => {
      try {
        const data = JSON.parse(json);

        if (Array.isArray(data.items)) {
          const nouveauxEtats: Record<string, number> = {};

          data.items.forEach((comp: { id: string; etat: number }) => {
            nouveauxEtats[comp.id] = comp.etat;
          });

          setEtatsComposants(nouveauxEtats);
        } else {
          console.warn('Structure inattendue dans data.items:', data);
        }
      } catch (e) {
        console.error('Erreur JSON Unity → JS:', e);
      }
    };

    return () => {
      delete window.onUnitySendEtat;
    };
  }, []);

  const prevRunPLC = useRef(runPLC);

  useEffect(() => {
    if (!prevRunPLC.current && runPLC) {
      handleSpawn();
    } else if (prevRunPLC.current && !runPLC) {
      handleReset();
    }

    prevRunPLC.current = runPLC;
  }, [runPLC]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    window.onLevelSuccess = (json: string) => {
      try {
        const data = JSON.parse(json);
        console.log('Succès Unity reçu:', data);

        if (data.success) {
          setShowSuccess(true);
        }
      } catch (e) {
        console.error('Erreur JSON onLevelSuccess:', e);
      }
    };

    return () => {
      delete window.onLevelSuccess;
    };
  }, []);

  const [showMissionPopup, setShowMissionPopup] = useState(true);
  const [showHints, setShowHints] = useState(true);

  const hints = [
    {
      text: (
        <>
          <strong className="text-lg">🎯 Bienvenue !</strong>
          <br />
          <br />
          Ta mission est de démarrer l'automate du packaging de bouteilles.
        </>
      ),
    },
    {
      text: (
        <>
          La partie de <strong>droite</strong> te montre l'
          <strong>usine</strong> en 3D.
          <br />
          <br />
          <strong>Déplace</strong> ta souris sur les éléments de l'usine pour
          découvrir leurs noms.
        </>
      ),
      targetSelector: '#unity-container',
    },
    {
      text: (
        <>
          <strong>Convention de nommage :</strong>
          <br />
          <br />• <span>I_</span> = Entrées (détections, capteurs)
          <br />• <span>Q_</span> = Sorties (actionneurs)
        </>
      ),
      targetSelector: '#unity-container',
    },
    {
      text: (
        <>
          La partie de <strong>gauche</strong> permet de :
          <br />
          <br />
          1. <strong>Construire</strong> ton code Ladder
          <br />
          2. <strong>Visualiser</strong> l'état des composants en temps réel
        </>
      ),
      targetSelector: '#ladder-editor',
    },
    {
      text: (
        <>
          <strong>Clique maintenant </strong>sur
          <strong className="text-blue-600"> RUN PLC</strong> pour :
          <br />• Charger le code dans l'automate
          <br />• Démarrer la simulation
        </>
      ),
      targetSelector: '#run-plc-toggle',
      nextOnClick: true,
    },
    {
      text: (
        <>
          Tu peux maintenant <strong>observer</strong> comment ton code agit sur
          l'usine.
          <br />
          En <span className="font-semibold text-green-500">vert</span>, ce qui
          est actif.
          <br />
          En <span className="font-semibold text-blue-500">bleu</span>, ce qui
          est inactif.
        </>
      ),
      targetSelector: '#Big',
    },
  ];

  const onHintClick = () => setShowHints(true);

  // ✅ Configuration des boutons visibles pour ce niveau
  const visibleButtons = [
    'contactNO',
    'contactNF',
    'bobine',
    'railAlim',
    // Pas de SR, Ton, Toff, CTU pour ce niveau débutant
  ];

  return (
    <main className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-2 text-gray-900">
      <div id="Big" className="mx-auto flex flex-col gap-4">
        <Toolbar
          items={[
            {
              type: 'button',
              name: 'Objectifs',
              icon: 'target',
              onClick: () => {
                setShowHints(true);
              },
            },
            {
              type: 'toggle',
              name: 'RUN PLC',
              id: 'run-plc-toggle',
              onClick: (value: boolean) => {
                console.log('Toggle RUN PLC changé:', value);
                setRunPLC(value);
              },
              value: runPLC,
            },
          ]}
          onHintClick={onHintClick}
        />

        <div className="flex w-full gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex-1">
              <LadderEditor
                composantsUnity={composantsUnity}
                etatsComposants={etatsComposants}
                sendMessage={sendMessage}
                runPLC={runPLC}
                setRunPLC={setRunPLC}
              />
            </div>
          </div>
          <div className="max-w-[35vw] flex-1">
            <UnityWrapper
              id="unity-container"
              unityProvider={unityProvider}
              isLoaded={isLoaded}
              loadingProgression={loadingProgression}
            />
          </div>
        </div>

        {showHints && (
          <HintPopup hints={hints} onClose={() => setShowHints(false)} />
        )}

        <SuccessPopup
          show={showSuccess}
          message={successMessage}
          onReplay={() => {
            setRunPLC(false);
          }}
          onClose={() => setShowSuccess(false)}
        />
      </div>
    </main>
  );
}
