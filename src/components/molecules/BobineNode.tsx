import { Handle, Position, NodeProps } from 'reactflow';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import DropDown_IC from '@/components/atoms/DropDown_IC';
import { getColorByValue } from '@/utils/getColorByValue';

const BobineNode = ({ data }: NodeProps) => {
  const composantsUnity: string[] = data?.composantsUnity || [];
  const etatsComposants: Record<string, number | undefined> =
    data?.etatsComposants || {};
  const inValue: number | null | undefined = data?.inValue;

  // Variable sélectionnée dans la dropdown (nom actionneur)
  const [selectedActionneur, setSelectedActionneur] = useState(
    data?.variable || ''
  );

  // Reset si la liste change et que l’élément sélectionné disparaît
  useEffect(() => {
    if (!composantsUnity.includes(selectedActionneur)) {
      setSelectedActionneur('');
    }
  }, [composantsUnity]);

  // Prévenir le parent que la variable a changé
  useEffect(() => {
    if (data?.onChange) data.onChange(selectedActionneur);
  }, [selectedActionneur]);

  // L'état de sortie : actif si entrée === 1 et actionneur sélectionné
  const outValue = inValue === 1 && selectedActionneur ? 1 : 0;

  return (
    <div className="relative w-56 rounded-2xl border border-gray-300 bg-white p-4 shadow-md">
      {/* Entrée */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        style={{
          backgroundColor: getColorByValue(inValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
        }}
      />

      {/* Contenu central */}
      <div className="flex flex-col items-center gap-3">
        <DropDown_IC
          composantsUnity={composantsUnity}
          value={selectedActionneur}
          onChange={setSelectedActionneur}
          placeholder="Sélectionnez actionneur"
          showSensor={false}
          showMemoire={false}
          showActionneur={true}
        />

        <span
          className={clsx(
            'text-sm font-semibold transition-colors',
            getColorByValue(outValue) //GET COLOR A MODIFIER
          )}
        >
          --( )-- {/* Symbole bobine simple */}
        </span>
      </div>
    </div>
  );
};

export default BobineNode;
