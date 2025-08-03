'use client';

// React
import { useEffect, useState } from 'react';
import { useUnityContext } from 'react-unity-webgl';

// Utilities
import { getUnityPaths } from '@/utils/unity';

// Components
import Button from '@/components/atoms/Button';
import Toolbar from '@/components/molecules/Toolbar';
import UnityWrapper from '@/components/molecules/UnityWrapper';
import LadderEditor from '@/components/molecules/LadderEditor';
import BlocContactNO from '@/components/molecules/BlocContactNO';

declare global {
  interface Window {
    onUnityReady?: (json: string) => void;
    onUnitySendEtat?: (json: string) => void;
  }
}

const gamePath = '/unity/demo';

export default function GamePage() {
  const [sensorState, setSensorState] = useState<number | null>(null);
  const unityPaths = getUnityPaths(gamePath);

  // Initialise Unity avec les chemins fournis et extrait les fonctions utiles
  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext(unityPaths);

  const handleSpawn = () => {
    if (!isLoaded) return;
    sendMessage('Pipe', 'TriggerSpawn', '');
  };

  const handleConveyor = (isActive: boolean) => {
    if (!isLoaded) return;
    const value = isActive ? '1' : '0';
    sendMessage('Conveyor_1', 'SetActifFromReact', value);
  };

  const [composantsUnity, setComposantsUnity] = useState<string[]>([]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLoaded) {
        sendMessage('GameManager', 'GetEtatsJSON', '');
        console.log('Envoi de GetEtatsJSON à Unity'); // Debug
      }
    }, 500); // toutes les 500 ms

    return () => clearInterval(interval);
  }, [isLoaded, sendMessage]);

  const [etatsComposants, setEtatsComposants] = useState<
    Record<string, number>
  >({}); // stocke les info JSON

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

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-semibold">Niveau 1 – Démonstration</h1>
          <Button href="/" icon="chevron-left">
            Retour à l'accueil
          </Button>
        </div>

        {/*<div className="p-8">
          <BlocContactNO
            composantsUnity={composantsUnity}
            etatsComposants={etatsComposants}
            inValue={1} //1 pour test
          />
        </div> */}

        <div className="flex w-full flex-col gap-8 md:flex-row">
          <Toolbar
            items={[
              {
                type: 'text',
                name: 'Sensor_1',
                value: sensorState ? '🟢' : '🔵',
              },
              {
                type: 'toggle',
                name: 'Conveyor on/off',
                onClick: handleConveyor,
              },
              {
                type: 'button',
                name: '📦 Spawwwwn',
                onClick: handleSpawn,
              },
            ]}
          />
          <LadderEditor />
          {/*
          <ul>
             uggly but hey it works
            {Object.entries(etatsComposants).map(([id, etat]) => (
              <li key={id}>
                {id} : {etat}
              </li>
            ))}
          </ul> */}

          <UnityWrapper
            unityProvider={unityProvider}
            isLoaded={isLoaded}
            loadingProgression={loadingProgression}
          />
        </div>
      </div>
    </main>
  );
}
