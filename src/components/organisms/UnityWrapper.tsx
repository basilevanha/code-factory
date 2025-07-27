'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';
import { useMemo, useEffect, useState } from 'react';
import Toggle from '@/components/atoms/Toggle';
import Button from '@/components/atoms/Button';

// Typescipt declarations
declare global {
  interface Window {
    onUnitySendEtat?: (json: string) => void;
  }
}

type UnityWrapperProps = {
  buildPath: string;
  className?: string;
};
// End of TypeScript declarations

const UnityWrapper = ({ buildPath, className = '' }: UnityWrapperProps) => {
  const [isDetectorOn, setIsDetectorOn] = useState<number | null>(null);

  const paths = useMemo(
    () => ({
      loaderUrl: `${buildPath}/build.loader.js`,
      dataUrl: `${buildPath}/build.data`,
      frameworkUrl: `${buildPath}/build.framework.js`,
      codeUrl: `${buildPath}/build.wasm`,
    }),
    [buildPath]
  );

  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext(paths);

  const handleSpawn = () => {
    if (!isLoaded) return;
    sendMessage('Pipe', 'TriggerSpawn', '');
  };

  useEffect(() => {
    window.onUnitySendEtat = (json: string) => {
      try {
        const data = JSON.parse(json);
        if (data.id === 'Sensor_1') {
          setIsDetectorOn(data.etat);
        }
      } catch (e) {
        console.error('Erreur JSON Unity → JS :', e);
      }
    };

    return () => {
      delete window.onUnitySendEtat;
    };
  }, []);

  const handleConveyor = (isActive: boolean) => {
    if (!isLoaded) return;
    const value = isActive ? '1' : '0';
    sendMessage('Conveyor_1', 'SetActifFromReact', value);
  };

  return (
    <div className={`mx-auto max-w-6xl ${className}`}>
      <div className="flex gap-8">
        <div className="flex w-1/3 flex-col justify-start gap-4">
          <Toggle onClick={handleConveyor}>Conveyor on/off</Toggle>
          <Button onClick={handleSpawn}>Spawwwwn</Button>

          <p className="mt-2 text-lg font-bold">
            État Sensor_1 → {isDetectorOn !== null ? isDetectorOn : '...'}
          </p>
        </div>

        <div className="w-2/3">
          <Unity
            unityProvider={unityProvider}
            className="aspect-video w-full rounded-lg bg-black"
          />
          {!isLoaded && (
            <p className="mt-4 text-center text-sm text-gray-500">
              Chargement... {Math.round(loadingProgression * 100)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnityWrapper;
