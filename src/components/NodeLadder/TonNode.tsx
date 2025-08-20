//TonNode.tsx
import { Handle, Position, NodeProps, Edge, Node } from 'reactflow';
import { getColorByValue } from '@/utils/getColorByValue';
import { useState, useEffect } from 'react';

const TONNode = ({ data, id }: NodeProps) => {
  const inValue: number | undefined = data?.inValue;
  const qValue: number | undefined = data?.qValue;
  const etValue: number | undefined = data?.etValue;

  // SP modifiable par l'utilisateur
  const [spValue, setSpValue] = useState<number>(data?.spValue ?? 1000);

  // Synchronise le SP dans node.data pour le resolver
  useEffect(() => {
    data.spValue = spValue;
  }, [spValue]);

  const label = data?.label || `TON-${id}`;

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
          {etValue != null ? (etValue / 1000).toFixed(1) : '0.0'}{' '}
          {/* converti ms → s */}
        </div>
      </div>

      <div className="absolute top-[90%] right-3 -translate-y-1/2 text-xs font-bold">
        ET
      </div>
    </div>
  );
};

export default TONNode;

export const resolveTON = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[],
  _deltaTime: number
): void => {
  const inVal = node.data.inValue || 0;
  const spVal = node.data.spValue || 0; // durée en ms

  if (node.data.startTime === undefined) {
    node.data.startTime = null; // moment où IN passe à 1
  }

  console.log(`[TON-${node.id}] IN=${inVal}, SP=${spVal}`);

  if (inVal === 1) {
    if (node.data.startTime === null) {
      // Premier cycle où IN est à 1 → on enregistre le temps
      node.data.startTime = Date.now();
      console.log(
        `[TON-${node.id}] Front montant détecté → startTime=${node.data.startTime}`
      );
    }

    // Temps écoulé depuis le front montant
    const elapsed = Date.now() - node.data.startTime;
    node.data.etValue = elapsed;
    node.data.qValue = elapsed >= spVal ? 1 : 0;

    console.log(
      `[TON-${node.id}] elapsed=${elapsed}ms, ET=${node.data.etValue}, Q=${node.data.qValue}`
    );
  } else {
    // Reset complet
    node.data.startTime = null;
    node.data.etValue = 0;
    node.data.qValue = 0;
    console.log(`[TON-${node.id}] Reset → ET=0, Q=0`);
  }

  node.data.outValue = node.data.qValue;
};
