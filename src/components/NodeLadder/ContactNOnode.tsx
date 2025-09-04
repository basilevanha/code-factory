import { Handle, Position, NodeProps, Edge, Node } from 'reactflow';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import DropDown_IC from '@/components/atoms/DropDown_IC';
import { getColorByValue } from '@/utils/getColorByValue';

const ContactNode = ({ data, id, selected }: NodeProps) => {
  const composantsUnity: string[] = data?.composantsUnity || [];
  const etatsComposants: Record<string, number | undefined> =
    data?.etatsComposants || {};
  const inValue: number | null | undefined = data?.inValue;
  const outValue: number | null | undefined = data?.outValue;

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

  const capteurValue = selectedSensor
    ? etatsComposants[selectedSensor]
    : undefined;

  return (
    <div
      className={clsx(
        'relative h-10 w-30 rounded-2xl border bg-white shadow-md transition-colors',
        selected
          ? 'border-2 border-blue-500 ring-2 ring-blue-300'
          : 'border-none bg-transparent shadow-none'
      )}
    >
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
          width: 8,
          height: 8,
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
          width: 8,
          height: 8,
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      <div className="flex h-full w-full items-center">
        {/* bras gauche */}
        <div className="flex flex-1 items-center">
          <div
            className="w-full border-t-4"
            style={{ borderColor: getColorByValue(inValue) }}
          />
        </div>

        {/* symbole central */}
        <div className="flex flex-shrink-0 items-center justify-center px-0">
          <span
            className="text-xl font-bold transition-colors"
            style={{ color: getColorByValue(capteurValue) }}
          >
            | |
          </span>
        </div>

        {/* bras droit */}
        <div className="flex flex-1 items-center">
          <div
            className="w-full border-t-4"
            style={{ borderColor: getColorByValue(outValue) }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactNode;
