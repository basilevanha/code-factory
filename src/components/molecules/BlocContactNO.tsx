import { useState } from 'react';
import clsx from 'clsx';
import { getColorByValue } from '@/utils/getColorByValue';
import { text } from 'stream/consumers';

type BlocContactNOProps = {
  composantsUnity: string[];
  etatsComposants: Record<string, number | undefined>;
  inValue?: number | null; // 0 ou 1 ou undefined (indéterminé)
};

const BlocContactNO = ({
  composantsUnity,
  etatsComposants,
  inValue,
}: BlocContactNOProps) => {
  const [selectedSensor, setSelectedSensor] = useState('');

  const selected = composantsUnity.find((name) => name === selectedSensor);
  const capteurValue = selected ? etatsComposants[selected] : undefined;

  // Sortie = entrée ET capteur actif (1 = vrai, 0 = faux, undefined = indéterminé)
  const outValue =
    inValue === 1 && capteurValue === 1
      ? 1
      : inValue === 0 || capteurValue === 0
        ? 0
        : undefined;

  return (
    <div className="relative w-56 rounded-2xl border border-gray-300 bg-white p-4 shadow-md">
      {/* Pastille d'entrée gauche */}
      <div
        className={clsx(
          'absolute top-1/2 left-[-10px] h-4 w-4 -translate-y-1/2 transform rounded-full transition-colors duration-300',
          getColorByValue(inValue)
        )}
      />

      {/* Pastille de sortie droite */}
      <div
        className={clsx(
          'absolute top-1/2 right-[-10px] h-4 w-4 -translate-y-1/2 transform rounded-full transition-colors duration-300',
          getColorByValue(outValue)
        )}
      />

      <div className="flex flex-col items-center gap-3">
        <select
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={selectedSensor}
          onChange={(e) => setSelectedSensor(e.target.value)}
        >
          <option value="">???</option>
          {composantsUnity.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <span
          className={clsx(
            'text-sm font-semibold transition-colors',
            getColorByValue(capteurValue)
          )}
        >
          --| |--
        </span>
      </div>
    </div>
  );
};

export default BlocContactNO;
