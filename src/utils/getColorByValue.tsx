// utils/getColorByValue.ts

declare global {
  interface Window {
    runPLCState?: boolean;
  }
}
export const getColorByValue = (
  value?: number | null,
  asClassName: boolean = false
): string => {
  const runPLC = window.runPLCState ?? true; // par défaut ON si non défini

  if (!runPLC) {
    return asClassName ? 'bg-gray-400' : '#9CA3AF';
  }

  if (value === 1) {
    return asClassName ? 'bg-green-500' : '#22C55E';
  }

  return asClassName ? 'bg-blue-500' : '#3B82F6';
};
