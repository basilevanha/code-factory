'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';
import { useMemo } from 'react';

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

  const { unityProvider, isLoaded, loadingProgression } =
    useUnityContext(paths);

  return (
    <div className={`mx-auto max-w-4xl ${className}`}>
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
  );
};

export default UnityWrapper;
