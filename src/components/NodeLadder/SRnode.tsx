import { Handle, Position, NodeProps, Edge, Node } from 'reactflow';
import { getColorByValue } from '@/utils/getColorByValue';
import clsx from 'clsx';

const SRNode = ({ data, id, selected }: NodeProps) => {
  const inSetValue: number | null | undefined = data?.inputs?.set;
  const inResetValue: number | null | undefined = data?.inputs?.reset;

  const outValue: number | null | undefined = data?.outValue;

  const label = data?.label || `${id}`;

  return (
    <div
      className={clsx(
        'relative h-40 w-30 rounded-2xl shadow-md transition-all',
        selected
          ? 'border border-blue-400 ring-2 ring-blue-300' // bordure fine + ring pour sélection
          : '' // non sélectionné, on gère le style inline
      )}
      style={{
        backgroundColor: '#ffffff',
        borderWidth: selected ? '2px' : '6px', // fine si sélectionné, large sinon
        borderColor: selected ? '#3B82F6' : getColorByValue(outValue, false), // couleur selon la sortie
      }}
    >
      {/* Identifiant texte au-dessus */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-100">
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
          top: '12%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[12%] left-3 -translate-y-1/2 text-xs font-bold">
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
          top: '75%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[75%] left-3 -translate-y-1/2 text-xs font-bold">
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
          top: '12%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[12%] right-3 -translate-y-1/2 text-xs font-bold">
        Out
      </div>
    </div>
  );
};

export default SRNode;
