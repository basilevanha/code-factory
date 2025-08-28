import { Handle, Position, NodeProps, Edge, Node } from 'reactflow';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import DropDown_IC from '@/components/atoms/DropDown_IC';
import { getColorByValue } from '@/utils/getColorByValue';

const BobineNode = ({ data, selected }: NodeProps) => {
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
    if (data) {
      data.variable = selectedActionneur;
      if (data.onChange) {
        data.onChange(selectedActionneur);
      }
    }
  }, [selectedActionneur]);

  return (
    <div
      className={clsx(
        'relative h-10 w-30 rounded-2xl border bg-white shadow-md transition-colors',
        selected
          ? 'border-2 border-blue-500 ring-2 ring-blue-300'
          : 'border-gray-300'
      )}
    >
      {/* DropDown flottante au-dessus */}
      <div className="absolute -top-8 left-1/2 z-10 w-[90%] -translate-x-1/2">
        <DropDown_IC
          composantsUnity={composantsUnity}
          value={selectedActionneur}
          onChange={setSelectedActionneur}
          placeholder="???"
          showSensor={false}
          showMemoire={true}
          showActionneur={true}
        />
      </div>
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
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      {/* Contenu central parfaitement centré */}
      <div className="flex h-full items-center justify-center">
        <span
          className={clsx(
            'text-sm font-semibold transition-colors',
            getColorByValue(inValue, true)
          )}
        >
          --( )--
        </span>
      </div>
    </div>
  );
};

export default BobineNode;
