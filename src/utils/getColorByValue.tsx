// utils/getColorByValue.ts
export const getColorByValue = (value?: number | null): string => {
  if (value === undefined || value === null) return 'bg-gray-400';
  return value === 1 ? 'bg-green-500' : 'bg-blue-500';
};
