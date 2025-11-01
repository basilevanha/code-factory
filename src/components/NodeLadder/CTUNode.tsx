import { Handle, Position, NodeProps } from 'reactflow';
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
      step="1"
      className="nodrag nopan w-20 rounded border border-gray-300 text-center text-xs"
      value={value}
      onChange={(e) => onChange(Number(e.currentTarget.value))}
      onBlur={onCommit}
      onPointerDown={(e) => e.stopPropagation()}
    />
  );
});

const CTUNode = ({ data, id, selected }: NodeProps) => {
  const inValue: number | undefined = data?.inValue;
  const rValue: number | undefined = data?.rValue;
  const qValue: number | undefined = data?.qValue;
  const cvValue: number | undefined = data?.cvValue;

  // SP : nombre d'impulsions à atteindre
  const [spValue, setSpValue] = useState<number>(data?.spValue ?? 5);
  const handleChange = useCallback((v: number) => setSpValue(v), []);
  const label = data?.label || `${id}`;

  // Synchronisation vers node.data
  useEffect(() => {
    data.spValue = spValue;
  }, [spValue]);

  return (
    <div
      className={clsx(
        'relative h-48 w-32 rounded-2xl shadow-md transition-all',
        selected ? 'border border-blue-400 ring-2 ring-blue-300' : ''
      )}
      style={{
        backgroundColor: '#ffffff',
        borderWidth: selected ? '2px' : '6px',
        borderColor: selected ? '#3B82F6' : getColorByValue(qValue, false),
      }}
    >
      {/* Label */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-100">
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
          top: '15%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[15%] left-3 -translate-y-1/2 text-xs font-bold">
        IN
      </div>

      {/* Entrée R (Reset) */}
      <Handle
        type="target"
        position={Position.Left}
        id="r"
        style={{
          backgroundColor: getColorByValue(rValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '35%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[35%] left-3 -translate-y-1/2 text-xs font-bold">
        R
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
          top: '15%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[15%] right-3 -translate-y-1/2 text-xs font-bold">
        Q
      </div>

      {/* SP (setpoint) */}
      <div className="absolute top-[55%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-xs">
        <label className="font-bold">SP [count]</label>
        <SPInput value={spValue} onChange={handleChange} />
      </div>

      {/* CV affiché */}
      <div className="absolute top-[78%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-xs">
        <label className="font-bold">CV</label>
        <div className="w-20 rounded border border-gray-300 bg-gray-100 text-center text-xs">
          {cvValue ?? 0}
        </div>
      </div>
    </div>
  );
};

export default CTUNode;
