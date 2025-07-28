export type UnityPathsType = {
  loaderUrl: string;
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
};

export const getUnityPaths = (gamePath: string): UnityPathsType => ({
  loaderUrl: `${gamePath}/build.loader.js`,
  dataUrl: `${gamePath}/build.data`,
  frameworkUrl: `${gamePath}/build.framework.js`,
  codeUrl: `${gamePath}/build.wasm`,
});
