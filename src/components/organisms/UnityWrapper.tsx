'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';

const UnityTest = () => {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: '/unity-test/communication.loader.js',
    dataUrl: '/unity-test/communication.data',
    frameworkUrl: '/unity-test/communication.framework.js',
    codeUrl: '/unity-test/communication.wasm',
  });

  return (
    <div className="mx-auto max-w-3xl">
      <Unity
        unityProvider={unityProvider}
        className="aspect-video w-full rounded-lg bg-black"
      />
      {!isLoaded && (
        <p className="mt-4 text-center">
          Chargement... {Math.round(loadingProgression * 100)}%
        </p>
      )}
    </div>
  );
};

export default UnityTest;
