import { Handle, Position, NodeProps, Edge, Node } from 'reactflow';
import { getColorByValue } from '@/utils/getColorByValue';

const SRNode = ({ data, id }: NodeProps) => {
  const inSetValue: number | null | undefined = data?.inSetValue;
  const inResetValue: number | null | undefined = data?.inResetValue;
  const outValue: number | null | undefined = data?.outValue;

  const label = data?.label || `SR-${id}`;

  return (
    <div className="relative h-40 w-32 rounded-2xl border border-gray-300 bg-white shadow-md">
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

/**
 * Résolution logique du bloc SR
 */
export const resolveSR = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[]
): void => {
  const inSet = node.data.inSetValue || 0;
  const inReset = node.data.inResetValue || 0;

  // Mémorisation de l'état
  if (inSet === 1) {
    node.data.outValue = 1;
  }
  if (inReset === 1) {
    node.data.outValue = 0;
  }

  // Si état non initialisé, on commence à 0
  if (node.data.outValue === undefined) {
    node.data.outValue = 0;
  }
};
