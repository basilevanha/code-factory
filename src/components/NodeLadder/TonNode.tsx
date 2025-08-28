//TonNode.tsx
import { Handle, Position, NodeProps, Edge, Node } from 'reactflow';
import { getColorByValue } from '@/utils/getColorByValue';
import { useState, useEffect, memo, useCallback } from 'react';
import clsx from 'clsx';

const SPInput = memo(function SPInput({
  value,
  onChange,
  onCommit,
}: {
  value: number;
  onChange: (v: number) => void;
  onCommit?: () => void;
}) {
  return (
    <input
      type="number"
      step="0.1"
      className="nodrag nopan w-24 rounded border border-gray-300 text-center text-xs"
      value={value}
      onChange={(e) => onChange(Number(e.currentTarget.value))}
      onBlur={onCommit}
      onPointerDown={(e) => e.stopPropagation()} // évite que React Flow “mange” les events
    />
  );
});

const TONNode = ({ data, id, selected }: NodeProps) => {
  const inValue: number | undefined = data?.inValue;
  const qValue: number | undefined = data?.qValue;
  const etValue: number | undefined = data?.etValue;

  // SP modifiable par l'utilisateur
  const [spValue, setSpValue] = useState<number>(data?.spValue ?? 1.0);
  const handleChange = useCallback((v: number) => setSpValue(v), []);

  const label = data?.label || `TON-${id}`;

  // Synchronisation dans node.data
  useEffect(() => {
    data.spValue = spValue * 1000;
  }, [spValue]);

  return (
    <div
      className={clsx(
        'relative h-44 w-30 rounded-2xl border bg-white shadow-md transition-colors',
        selected
          ? 'border-2 border-blue-500 ring-2 ring-blue-300'
          : 'border-gray-300'
      )}
    >
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
        <label className="font-bold">SP [s]</label>
        <SPInput value={spValue} onChange={handleChange} />
      </div>

      {/* ET */}
      <div className="absolute top-[70%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-xs">
        <label className="font-bold">ET [s]</label>
        <div className="w-24 rounded border border-gray-300 bg-gray-100 text-center text-xs">
          {etValue != null ? (etValue / 1000).toFixed(1) : '0.0'}{' '}
          {/* converti ms → s */}
        </div>
      </div>
    </div>
  );
};

export default TONNode;
