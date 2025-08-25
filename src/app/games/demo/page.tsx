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

declare global {
  interface Window {
    onUnityReady?: (json: string) => void;
    onUnitySendEtat?: (json: string) => void;
    onLevelSuccess?: (json: string) => void;
  }
}

const gamePath = '/unity/demo';

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

  const handleConveyor = (isActive: boolean) => {
    if (!isLoaded) return;
    const value = isActive ? '1' : '0';
    sendMessage('Conveyor_1', 'SetActifFromReact', value);
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
    const interval = setInterval(() => {
      if (isLoaded) {
        sendMessage('GameManager', 'GetEtatsJSON', '');
        //console.log('Envoi de GetEtatsJSON à Unity'); // Debug
      }
    }, 100); // toutes les 100 ms

    return () => clearInterval(interval);
  }, [isLoaded, sendMessage]);

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
          setSuccessMessage(data.message || 'Niveau terminé !');
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

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-semibold">Niveau 1 – Démonstration</h1>
          <Button href="/" icon="chevron-left">
            Retour à l'accueil
          </Button>
        </div>
        <Toolbar
          items={[
            {
              type: 'button',
              name: 'Revoir les objectifs',
              icon: 'target',
              onClick: () => setShowMissionPopup(true),
            },
            {
              type: 'button',
              name: 'Réinitialiser la scène',
              icon: 'refresh',
              onClick: handleReset,
            },
            {
              type: 'toggle',
              name: 'RUN PLC',
              onClick: (value: boolean) => {
                console.log('Toggle RUN PLC changé:', value);
                setRunPLC(value);
              },
              value: runPLC,
            },
          ]}
        />

        <div className="flex h-full w-full gap-4">
          {/* Colonne gauche : Toolbar + LadderEditor */}
          <div className="flex flex-1 flex-col gap-4">
            {/*
          <ul>
             Affiche la liste des IC + états => uggly but hey! it works
            {Object.entries(etatsComposants).map(([id, etat]) => (
              <li key={id}>
                {id} : {etat}
              </li>
            ))}
          </ul> */}
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
          <div className="flex-1">
            <UnityWrapper
              unityProvider={unityProvider}
              isLoaded={isLoaded}
              loadingProgression={loadingProgression}
            />
          </div>
        </div>

        {showMissionPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 text-center shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-blue-600">
                Objectif
              </h2>
              <p className="mb-4 text-left text-gray-700">
                Votre tâche consiste à construire le programme en Ladder pour
                acheminer la caisse sur la palette.
                <br />
                <br />
                Tips: <br />
                Pour charger la programme dans la scène, active "Run PLC".
                <br />
                Ajoute un bloc Ladder en cliquant dessus. <br />
                Pour effacer un bloc ou une connection, clique dessus et sur ton
                clavier appuie "suppr".
              </p>

              {/* Image ou vidéo */}
              <div className="mb-4">
                <video
                  src="/videos/TutoVideo.mp4"
                  autoPlay
                  loop
                  muted
                  className="mx-auto w-full max-w-lg rounded-lg"
                />
                {/* Ou image : <img src="/images/mission.png" alt="Mission" className="mx-auto rounded-lg max-h-48" /> */}
              </div>

              <Button
                className="w-full justify-center bg-green-600 text-white hover:bg-green-700"
                onClick={() => setShowMissionPopup(false)}
              >
                J’ai compris
              </Button>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
              <h2 className="mb-2 text-xl font-bold text-green-600">
                🎉 BRAVO !
              </h2>
              <p className="mb-6">{successMessage}</p>

              {/* Boutons l'un sous l'autre */}
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full justify-center"
                  onClick={() => {
                    setShowSuccess(false);
                    setRunPLC(false);
                  }}
                >
                  Rejouer
                </Button>
                <Button
                  className="w-full justify-center bg-green-600 text-white hover:bg-green-700"
                  onClick={() => {
                    setShowSuccess(false);
                    setRunPLC(false);
                    window.open(
                      'https://forms.gle/kWR9gLiVGJDYixf8A',
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  Niveau suivant
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
