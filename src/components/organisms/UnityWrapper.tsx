'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';
import { useMemo } from 'react';
// import Button from '@/components/atoms/Button';
import Toggle from '@/components/atoms/Toggle';

type UnityWrapperProps = {
  buildPath: string; // ex: "/unity/my-game"
  className?: string;
};

const UnityWrapper = ({ buildPath, className = '' }: UnityWrapperProps) => {
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

  // const handleSpawn = () => {
  //   if (!isLoaded) return;
  //   console.log('Spawner button clicked');
  //   sendMessage('Spawner', 'TriggerSpawn');
  // };

  const handleConveyor = (isActive: boolean) => {
    if (!isLoaded) return;
    console.log('Conveyor button clicked');
    const value = isActive ? '0' : '1';
    sendMessage('Conveyor_1', 'SetActifFromReact', value);
  };

  return (
    <div className={`mx-auto flex max-w-4xl flex-col ${className}`}>
      <Unity
        unityProvider={unityProvider}
        className="aspect-video w-full rounded-lg bg-black"
      />
      {!isLoaded && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Chargement... {Math.round(loadingProgression * 100)}%
        </p>
      )}
      {/* <Button
        onClick={handleSpawn}
        className="m-5 flex w-min bg-green-600 text-white hover:bg-green-700"
        icon="chevron-right"
      >
        {'Spawn'}
      </Button> */}
      <Toggle onClick={handleConveyor}>{'Conveyor on/off'}</Toggle>
    </div>
  );
};

export default UnityWrapper;
