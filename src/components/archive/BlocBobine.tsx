import { useState } from 'react';
import clsx from 'clsx';
import { getColorByValue } from '@/utils/getColorByValue';
import DropDown_IC from '@/components/atoms/DropDown_IC';

type BlocBobineProps = {
  composantsUnity: string[];
  etatsComposants: Record<string, number | undefined>;
  inValue?: number | null; // 0 ou 1 ou indéterminé
};

const BlocBobine = ({
  composantsUnity,
  etatsComposants,
  inValue,
}: BlocBobineProps) => {
  const [selectedActionneur, setSelectedActionneur] = useState('');

  // Récupère l'état actuel de l'actionneur sélectionné
  const actionneurValue = selectedActionneur
    ? etatsComposants[selectedActionneur]
    : undefined;

  // Sortie = valeur de l'entrée (pilote la bobine)
  const outValue = inValue ?? undefined;

  return (
    <div className="relative w-56 rounded-2xl border border-gray-300 bg-white p-4 shadow-md">
      {/* Pastille d'entrée gauche */}
      <div
        className={clsx(
          'absolute top-1/2 left-[-10px] h-4 w-4 -translate-y-1/2 transform rounded-full transition-colors duration-300',
          getColorByValue(inValue)
        )}
      />

      <div className="flex flex-col items-center gap-3">
        <DropDown_IC
          composantsUnity={composantsUnity}
          value={selectedActionneur}
          onChange={setSelectedActionneur}
          placeholder="Choisir un actionneur"
          showSensor={false}
          showMemoire={false}
          showActionneur={true}
        />

        <span
          className={clsx(
            'text-sm font-semibold transition-colors',
            getColorByValue(outValue)
          )}
        >
          --( )--
        </span>
      </div>
    </div>
  );
};

export default BlocBobine;
