import { Handle, Position, NodeProps, Node, Edge } from 'reactflow';
import clsx from 'clsx';
import { getColorByValue } from '@/utils/getColorByValue';
import { useEffect } from 'react';

const RailAlimNode = ({ data }: NodeProps) => {
  return (
    <div className="relative h-10 w-15 rounded-2xl border border-gray-300 bg-white shadow-md">
      {/* Sortie */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          backgroundColor: 'bg-green-500', //getColorByValue(outValue),
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

export const resolveRailAlim = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[]
): void => {
  node.data.outValue = 1;
};
