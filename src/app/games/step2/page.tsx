'use client';

// React
import { useEffect, useState, useRef } from 'react';
import { useUnityContext } from 'react-unity-webgl';

// Utilities
import { getUnityPaths } from '@/utils/unity';

// Components
import Button from '@/components/atoms/Button';
import Toolbar from '@/components/molecules/Toolbar';
import UnityWrapper from '@/components/molecules/UnityWrapper';
import LadderEditor from '@/components/molecules/LadderEditor';
import SuccessPopup from '@/components/molecules/SuccesPopup';
import HintPopup from '@/components/molecules/HintPopup';

declare global {
  interface Window {
    onUnityReady?: (json: string) => void;
    onUnitySendEtat?: (json: string) => void;
    onLevelSuccess?: (json: string) => void;
  }
}

const gamePath = '/unity/BasicConveyor-1';

export default function GamePage() {
  const [sensorState, setSensorState] = useState<number | null>(null);
  const unityPaths = getUnityPaths(gamePath);

  // Initialise Unity avec les chemins fournis et extrait les fonctions utiles
  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext(unityPaths);
  const [runPLC, setRunPLC] = useState(false);

  const handleSpawn = () => {
    if (!isLoaded) return;
    sendMessage('Pipe', 'TriggerSpawn', '');
  };

  const handleReset = () => {
    if (!isLoaded) return;
    sendMessage('GameManager', 'ResetScene', '');
  };

  const [composantsUnity, setComposantsUnity] = useState<string[]>([]);

  // Récupère la liste des composants Unity
  useEffect(() => {
    window.onUnityReady = (json: string) => {
      try {
        const composants = JSON.parse(json); // ex : ["Sensor_1", "Conveyor_1", ...]
        setComposantsUnity(composants.items);
      } catch (e) {
        console.error('Erreur JSON dans la liste des composants Unity:', e);
      }
    };

    return () => {
      delete window.onUnityReady;
    };
  }, []);

  // Demande les états à Unity toutes les 100ms
  useEffect(() => {
    if (!isLoaded || !runPLC) return;

    const interval = setInterval(() => {
      sendMessage('GameManager', 'GetEtatsJSON', '');
    }, 100); // toutes les 10 ms

    return () => clearInterval(interval);
  }, [isLoaded, runPLC, sendMessage]);

  const [etatsComposants, setEtatsComposants] = useState<
    Record<string, number>
  >({}); // stocke les info JSON

  //écoute pour recevoir les états des composants Unity
  useEffect(() => {
    window.onUnitySendEtat = (json: string) => {
      try {
        const data = JSON.parse(json); // data.items = [{ id: 'Sensor_1', etat: 1 }, ...]

        if (Array.isArray(data.items)) {
          // Construction d’un nouvel objet d’état
          const nouveauxEtats: Record<string, number> = {};

          data.items.forEach((comp: { id: string; etat: number }) => {
            nouveauxEtats[comp.id] = comp.etat;
          });

          setEtatsComposants(nouveauxEtats); // mise à jour globale à chaque rafraîchissement
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
      // front montant (0 → 1)
      handleSpawn();
    } else if (prevRunPLC.current && !runPLC) {
      // front descendant (1 → 0)
      handleReset();
    }

    // mise à jour de la valeur précédente
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
          setSuccessMessage(
            'Tu viens de réussir ta première intervention sur automate!'
          );
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
          Petit ou gros projet, ta mission se déroule en 3 temps. <br />
          1. <strong>comprendre</strong> la scène (cahier de charge)
          <br />
          2. <strong>corriger</strong> le code (ou en créer un nouveau)
          <br />
          3. <strong>tester</strong> le fonctionnement
        </>
      ),
    },
    {
      text: (
        <>
          <strong className="text-lg">Comprehension:</strong>
          <br />
          <br />
          Lorsque l'automate est en RUN, une <strong>caisse</strong> tombe sur
          le convoyeur et doit être acheminée{' '}
          <strong>jusqu'à la palette</strong>.
          <br />
          <br />
          Quel détecteur sera activé à ce moment là?
          <br />
          Passe ta souris sur le détecteur pour voir son nom.
        </>
      ),
      targetSelector: '#unity-container',
    },
    {
      text: (
        <>
          <strong className="text-lg">Correction:</strong>
          <br />
          <br />
          Pour modifier le code, <strong>clique maintenant</strong> sur le
          contact à fermeture <strong> --||--</strong> <br />
          et choisi le bon détecteur.
        </>
      ),
      targetSelector: '#ladder-editor',
    },
    {
      text: (
        <>
          <strong className="text-lg">Tests:</strong>
          <br />
          <br />
          Maintenant teste ton code en cliquant sur
          <strong className="text-blue-600"> RUN PLC</strong>.
        </>
      ),
    },
  ];

  const onHintClick = () => setShowHints(true);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <main className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-2 text-gray-900">
      <div className="mx-auto flex flex-col gap-4">
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
          {/* Colonne gauche : Toolbar + LadderEditor */}
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
