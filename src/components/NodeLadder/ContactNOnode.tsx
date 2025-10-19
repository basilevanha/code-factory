import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import DropDown_IC from '@/components/atoms/DropDown_IC';
import { getColorByValue } from '@/utils/getColorByValue';

const ContactNode = ({ data, id, selected }: NodeProps) => {
  const { setNodes } = useReactFlow();

  const composantsUnity: string[] = data?.composantsUnity || [];
  const etatsComposants: Record<string, number | undefined> =
    data?.etatsComposants || {};
  const inValue: number | null | undefined = data?.inValue;
  const outValue: number | null | undefined = data?.outValue;

  // Valeur sélectionnée (persistée dans ReactFlow)
  const [selectedSensor, setSelectedSensor] = useState(data?.variable || '');

  // Si la liste change et que l’élément sélectionné n’existe plus → reset
  useEffect(() => {
    if (!composantsUnity.includes(selectedSensor)) {
      setSelectedSensor('');
    }
  }, [composantsUnity]);

  // Synchronise la variable dans le state global ReactFlow
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, variable: selectedSensor } }
          : n
      )
    );
  }, [selectedSensor, id, setNodes]);

  const capteurValue = selectedSensor
    ? etatsComposants[selectedSensor]
    : undefined;

  return (
    <div
      className={clsx(
        'relative h-10 w-30 rounded-2xl border shadow-md transition-colors',
        selected
          ? 'border-2 border-blue-500 ring-2 ring-blue-300'
          : 'border-none bg-transparent shadow-none'
      )}
    >
      {/* Dropdown flottante */}
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

      {/* Corps du contact */}
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
