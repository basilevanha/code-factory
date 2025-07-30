'use client';

// React
import { Unity } from 'react-unity-webgl';
import { useUnityContext } from 'react-unity-webgl';

type UnityContext = ReturnType<typeof useUnityContext>;

type UnityWrapperProps = {
  unityProvider: UnityContext['unityProvider'];
  isLoaded: boolean;
  loadingProgression: number;
  className?: string;
};

const UnityWrapper = ({
  unityProvider,
  isLoaded,
  loadingProgression,
  className = '',
}: UnityWrapperProps) => {
  return (
    <div className={`mx-auto w-full max-w-[90vmin] ${className}`}>
      <Unity
        unityProvider={unityProvider}
        className="aspect-square w-full rounded-lg bg-black"
      />
      <div className="flex min-h-[2rem] items-center justify-center">
        {!isLoaded && (
          <p className="text-center text-sm text-gray-500">
            Chargement... {Math.round(loadingProgression * 100)}%
          </p>
        )}
      </div>
    </div>
  );
};

export default UnityWrapper;
