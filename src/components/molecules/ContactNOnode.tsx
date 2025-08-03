import { Handle, Position, NodeProps } from 'reactflow';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import DropDown_IC from '@/components/atoms/DropDown_IC';
import { getColorByValue } from '@/utils/getColorByValue';

const ContactNode = ({ data, id }: NodeProps) => {
  const composantsUnity: string[] = data?.composantsUnity || [];
  const etatsComposants: Record<string, number | undefined> =
    data?.etatsComposants || {};
  const inValue: number | null | undefined = data?.inValue;

  const [selectedSensor, setSelectedSensor] = useState(data?.variable || '');

  // Met à jour selectedSensor si la liste change ET que l’élément sélectionné n’existe plus
  useEffect(() => {
    if (!composantsUnity.includes(selectedSensor)) {
      setSelectedSensor('');
    }
  }, [composantsUnity]);

  useEffect(() => {
    if (data?.onChange) {
      data.onChange(selectedSensor);
    }
  }, [selectedSensor]);

  const selected = composantsUnity.find((name) => name === selectedSensor);
  const capteurValue = selected ? etatsComposants[selected] : undefined;

  const outValue =
    inValue === 1 && capteurValue === 1
      ? 1
      : inValue === 0 || capteurValue === 0
        ? 0
        : undefined;

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

      {/* Sortie */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          backgroundColor: getColorByValue(outValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
        }}
      />

      {/* Contenu central */}
      <div className="flex flex-col items-center gap-3">
        <DropDown_IC
          composantsUnity={composantsUnity}
          value={selectedSensor}
          onChange={setSelectedSensor}
          placeholder="???"
          showSensor
          showMemoire
          showActionneur
        />

        <span
          className={clsx(
            'text-sm font-semibold transition-colors',
            getColorByValue(capteurValue) //GET COLOR A MODIFIER
          )}
        >
          --| |--
        </span>
      </div>
    </div>
  );
};

export default ContactNode;
