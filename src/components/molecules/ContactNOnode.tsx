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
    if (data) {
      data.variable = selectedSensor;
      if (data.onChange) {
        data.onChange(selectedSensor);
      }
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
    <div className="relative h-10 w-30 rounded-2xl border border-gray-300 bg-white shadow-md">
      {/* DropDown flottante au-dessus */}
      <div className="absolute -top-8 left-1/2 z-10 w-[90%] -translate-x-1/2">
        <DropDown_IC
          composantsUnity={composantsUnity}
          value={selectedSensor}
          onChange={setSelectedSensor}
          placeholder="???"
          showSensor
          showMemoire
          showActionneur
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
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Contenu central parfaitement centré */}
      <div className="flex h-full items-center justify-center">
        <span
          className={clsx(
            'text-sm font-semibold transition-colors',
            getColorByValue(capteurValue, true)
          )}
        >
          --| |--
        </span>
      </div>
    </div>
  );
};

export default ContactNode;
