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

declare global {
  interface Window {
    onUnityReady?: (json: string) => void;
    onUnitySendEtat?: (json: string) => void;
    onLevelSuccess?: (json: string) => void;
  }
}

const gamePath = '/unity/BasicConveyor-2';

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
  const [currentLevel, setCurrentLevel] = useState(1);
  const maxLevel = 2;

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

  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = ['/videos/TutoVideo-1.mp4', '/videos/TutoVideo-2.mp4'];

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <main className="bg-white px-6 py-2 text-gray-900">
      <div className="mx-auto flex flex-col gap-4">
        <Toolbar
          items={[
            {
              type: 'button',
              name: 'Revoir les objectifs',
              icon: 'target',
              onClick: () => {
                setShowMissionPopup(true);
              },
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
              unityProvider={unityProvider}
              isLoaded={isLoaded}
              loadingProgression={loadingProgression}
            />
          </div>
        </div>
        <SuccessPopup
          show={showSuccess}
          message={successMessage}
          onReplay={() => {
            setRunPLC(false);
          }}
          onClose={() => setShowSuccess(false)}
        />

        {showMissionPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 text-center shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-blue-600">
                Objectif
              </h2>

              {currentLevel === 1 ? (
                <>
                  <p className="mb-4 text-left text-gray-700">
                    <b>
                      Complète le programme pour acheminer la caisse sur la
                      palette.
                    </b>
                    <br />
                    <br />
                    <u>Conseils:</u>
                    <br />
                    <span className={currentVideo === 0 ? 'font-bold' : ''}>
                      Le nom des composants s'affiche en passant la souris
                      dessus.
                    </span>
                    <br />
                    <span className={currentVideo === 1 ? 'font-bold' : ''}>
                      Pour charger la programme dans l'automate, active "Run
                      PLC", activer le PLC fait apparaitre une caisse
                    </span>
                  </p>

                  <div className="mb-4">
                    <video
                      src={videos[currentVideo]}
                      autoPlay
                      muted
                      className="mx-auto w-4/5 max-w-lg rounded-lg"
                      onEnded={() =>
                        setCurrentVideo((currentVideo + 1) % videos.length)
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-4 text-left text-gray-700">
                    <b>Ajoute de nouveaux blocs Ladder</b> dans le programme
                    pour acheminer la caisse sur la palette.
                    <br />
                    <br />
                    <u>Conseils:</u>
                    <br />
                    <span className="font-bold">
                      Connecte les blocs entre eux pour construire la logique.
                    </span>
                  </p>

                  <div className="mb-4">
                    <video
                      src="/videos/TutoVideo-3.mp4"
                      autoPlay
                      muted
                      className="mx-auto w-4/5 max-w-lg rounded-lg"
                    />
                  </div>
                </>
              )}

              <Button
                className="w-full justify-center bg-green-600 text-white hover:bg-green-700"
                onClick={() => setShowMissionPopup(false)}
              >
                J’ai compris
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
