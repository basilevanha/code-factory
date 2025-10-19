import { Handle, Position, NodeProps, Node, Edge } from 'reactflow';
import clsx from 'clsx';
import { getColorByValue } from '@/utils/getColorByValue';
import { useEffect } from 'react';

const RailAlimNode = ({ data, selected }: NodeProps) => {
  return (
    <div
      className={clsx(
        'relative h-10 w-30 rounded-2xl border shadow-md transition-colors',
        selected
          ? 'border-2 border-blue-500 ring-2 ring-blue-300'
          : 'border-none bg-transparent shadow-none'
      )}
    >
      {/* Sortie */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          backgroundColor: getColorByValue(1),
          width: 8,
          height: 8,
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      <div className="flex h-full w-full items-center">
        {/* espace vide à gauche */}
        <div className="flex-1" />

        {/* symbole central */}
        <div className="flex flex-shrink-0 items-center justify-center px-0">
          <span
            className="text-xl font-bold transition-colors"
            style={{ color: getColorByValue(1) }}
          >
            |
          </span>
        </div>

        {/* bras droit */}
        <div className="flex flex-1 items-center">
          <div
            className="w-full border-t-4"
            style={{ borderColor: getColorByValue(1) }}
          />
        </div>
      </div>
    </div>
  );
};

export default RailAlimNode;
