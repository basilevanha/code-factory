import { Handle, Position, NodeProps, Edge, Node } from 'reactflow';
import { getColorByValue } from '@/utils/getColorByValue';
import clsx from 'clsx';

const SRNode = ({ data, id, selected }: NodeProps) => {
  const inSetValue: number | null | undefined = data?.inputs?.set;
  const inResetValue: number | null | undefined = data?.inputs?.reset;

  const outValue: number | null | undefined = data?.outValue;

  const label = data?.label || `SR-${id}`;

  return (
    <div
      className={clsx(
        'relative h-40 w-30 rounded-2xl border bg-white shadow-md transition-colors',
        selected
          ? 'border-2 border-blue-500 ring-2 ring-blue-300'
          : 'border-gray-300'
      )}
    >
      {/* Identifiant texte au-dessus */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold">
        {label}
      </div>

      {/* Entrée SET */}
      <Handle
        type="target"
        position={Position.Left}
        id="set"
        style={{
          backgroundColor: getColorByValue(inSetValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '38%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[38%] left-3 -translate-y-1/2 text-xs font-bold">
        S
      </div>

      {/* Entrée RESET */}
      <Handle
        type="target"
        position={Position.Left}
        id="reset"
        style={{
          backgroundColor: getColorByValue(inResetValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '88%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[88%] left-3 -translate-y-1/2 text-xs font-bold">
        R
      </div>

      {/* Sortie OUT */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          backgroundColor: getColorByValue(outValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '35%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[35%] right-3 -translate-y-1/2 text-xs font-bold">
        Out
      </div>
    </div>
  );
};

export default SRNode;
