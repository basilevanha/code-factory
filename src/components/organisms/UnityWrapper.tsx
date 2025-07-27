'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';
import { useMemo, useEffect, useState } from 'react';
import Toggle from '@/components/atoms/Toggle';
import Button from '@/components/atoms/Button';

declare global {
  interface Window {
    onReceiveEtatJSON?: (json: string) => void;
  }
}

type UnityWrapperProps = {
  buildPath: string;
  className?: string;
};

const UnityWrapper = ({ buildPath, className = '' }: UnityWrapperProps) => {
  const [etatDetecteur, setEtatDetecteur] = useState<number | null>(null);

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

  useEffect(() => {
    window.onReceiveEtatJSON = (json: string) => {
      try {
        const data = JSON.parse(json);
        if (data.id === 'Sensor_1') {
          setEtatDetecteur(data.etat);
        }
      } catch (e) {
        console.error('Erreur JSON Unity → JS :', e);
      }
    };

    return () => {
      delete window.onReceiveEtatJSON;
    };
  }, []);

  const handleConveyor = (isActive: boolean) => {
    if (!isLoaded) return;
    const value = isActive ? '0' : '1';
    sendMessage('Conveyor_1', 'SetActifFromReact', value);
  };

  const demanderEtatSensor = () => {
    if (!isLoaded) return;
    sendMessage('Sensor_1', 'SendEtatJSONToJS');
  };

  return (
    <div className={`mx-auto max-w-6xl ${className}`}>
      <div className="flex gap-8">
        <div className="flex flex-col justify-start w-1/3 gap-4">
          <Toggle onClick={handleConveyor}>Conveyor on/off</Toggle>

          <Button onClick={demanderEtatSensor}>
            lecture Sensor_1
          </Button>

          <p className="mt-2 text-lg font-bold">
            État détecteur : {etatDetecteur !== null ? etatDetecteur : '...'}
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
