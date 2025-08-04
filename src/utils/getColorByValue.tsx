// utils/getColorByValue.ts
export const getColorByValue = (
  value?: number | null,
  asClassName: boolean = false
): string => {
  if (value === undefined || value === null) {
    return asClassName ? 'bg-gray-400' : '#9CA3AF';
  }

  if (value === 1) {
    return asClassName ? 'bg-green-500' : '#22C55E';
  }

  return asClassName ? 'bg-blue-500' : '#3B82F6';
};
