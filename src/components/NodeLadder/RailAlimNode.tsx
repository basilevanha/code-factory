import { Handle, Position, NodeProps, Node, Edge } from 'reactflow';
import clsx from 'clsx';
import { getColorByValue } from '@/utils/getColorByValue';
import { useEffect } from 'react';

const RailAlimNode = ({ data, selected }: NodeProps) => {
  return (
    <div
      className={clsx(
        'relative h-10 w-30 rounded-2xl border bg-white shadow-md transition-colors',
        selected
          ? 'border-2 border-blue-500 ring-2 ring-blue-300'
          : 'border-gray-300'
      )}
    >
      {/* Sortie */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          backgroundColor: getColorByValue(1),
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
            'text-sm font-bold transition-colors',
            '#22C55E' //getColorByValue(outValue, true)
          )}
        >
          |‒‒
        </span>
      </div>
    </div>
  );
};

export default RailAlimNode;
