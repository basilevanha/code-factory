// TOffNode.tsx
import { Handle, Position, NodeProps, Node, Edge } from 'reactflow';
import { getColorByValue } from '@/utils/getColorByValue';
import { useState, useEffect } from 'react';

const TOffNode = ({ data, id }: NodeProps) => {
  const inValue: number | undefined = data?.inValue;
  const qValue: number | undefined = data?.qValue;
  const etValue: number | undefined = data?.etValue;

  const [spValue, setSpValue] = useState<number>(data?.spValue ?? 1000); // durée en ms

  // Synchronisation dans node.data
  useEffect(() => {
    data.spValue = spValue;
  }, [spValue]);

  const label = data?.label || `TOF-${id}`;

  return (
    <div className="relative h-44 w-44 rounded-2xl border border-gray-300 bg-white p-2 shadow-md">
      {/* Label */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold">
        {label}
      </div>

      {/* Entrée IN */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        style={{
          backgroundColor: getColorByValue(inValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '20%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[20%] left-3 -translate-y-1/2 text-xs font-bold">
        IN
      </div>

      {/* Sortie Q */}
      <Handle
        type="source"
        position={Position.Right}
        id="q"
        style={{
          backgroundColor: getColorByValue(qValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '20%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[20%] right-3 -translate-y-1/2 text-xs font-bold">
        Q
      </div>

      {/* SP */}
      <div className="absolute top-[45%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-xs">
        <label className="font-bold">SP (ms)</label>
        <input
          type="number"
          className="w-24 rounded border border-gray-300 text-center text-xs"
          value={spValue}
          onChange={(e) => setSpValue(Number(e.target.value))}
        />
      </div>

      {/* ET */}
      <div className="absolute top-[70%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-xs">
        <label className="font-bold">ET (s)</label>
        <div className="w-24 rounded border border-gray-300 bg-gray-100 text-center text-xs">
          {etValue != null ? (etValue / 1000).toFixed(1) : '0.0'}
        </div>
      </div>

      <div className="absolute top-[90%] right-3 -translate-y-1/2 text-xs font-bold">
        ET
      </div>
    </div>
  );
};

export default TOffNode;

/**
 * Résolution logique du bloc TOF
 */
export const resolveTOff = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[],
  _deltaTime: number
): void => {
  const inVal = node.data.inValue || 0;
  const spVal = node.data.spValue || 0; // ms

  if (node.data.startTime === undefined) {
    node.data.startTime = null;
  }

  if (inVal === 1) {
    // Entrée active → Q = 1 immédiatement
    node.data.qValue = 1;
    node.data.etValue = 0;
    node.data.startTime = null; // reset du chrono
  } else {
    // IN = 0 → on démarre un chrono si pas déjà lancé
    if (node.data.startTime === null) {
      node.data.startTime = Date.now();
    }
    const elapsed = Date.now() - node.data.startTime;
    node.data.etValue = elapsed;

    if (elapsed >= spVal) {
      node.data.qValue = 0; // fin du délai
    } else {
      node.data.qValue = 1; // maintient la sortie pendant le délai
    }
  }

  node.data.outValue = node.data.qValue;
};
