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

declare global {
  interface Window {
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

  useEffect(() => {
    window.onUnitySendEtat = (json: string) => {
      try {
        const data = JSON.parse(json);
        if (data.id === 'Sensor_1') {
          setSensorState(data.etat);
        }
      } catch (e) {
        console.error('Erreur JSON Unity → JS :', e);
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
