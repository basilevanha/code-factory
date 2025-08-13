import { Handle, Position, NodeProps, Edge, Node } from 'reactflow';
import { getColorByValue } from '@/utils/getColorByValue';

const TONNode = ({ data, id }: NodeProps) => {
  const inValue: number | null | undefined = data?.inValue; // Entrée IN
  const spValue: number | null | undefined = data?.spValue; // Setpoint (durée)
  const qValue: number | null | undefined = data?.qValue; // Sortie Q
  const etValue: number | null | undefined = data?.etValue; // Sortie ET

  const label = data?.label || `TON-${id}`;

  return (
    <div className="relative h-28 w-36 rounded-2xl border border-gray-300 bg-white shadow-md">
      {/* Identifiant texte au-dessus */}
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
          top: '30%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[30%] left-3 -translate-y-1/2 text-xs font-bold">
        IN
      </div>

      {/* Entrée SP */}
      <Handle
        type="target"
        position={Position.Left}
        id="sp"
        style={{
          backgroundColor: getColorByValue(spValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '70%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[70%] left-3 -translate-y-1/2 text-xs font-bold">
        SP
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
          top: '30%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[30%] right-3 -translate-y-1/2 text-xs font-bold">
        Q
      </div>

      {/* Sortie ET */}
      <Handle
        type="source"
        position={Position.Right}
        id="et"
        style={{
          backgroundColor: getColorByValue(etValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '70%',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="absolute top-[70%] right-3 -translate-y-1/2 text-xs font-bold">
        ET
      </div>
    </div>
  );
};

export default TONNode;

/**
 * Résolution logique du bloc TON
 */
export const resolveTON = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[],
  deltaTime: number
): void => {
  const inVal = node.data.inValue || 0;
  const spVal = node.data.spValue || 0; // durée cible en secondes (ou ms selon ton choix)

  if (!node.data.timer) {
    node.data.timer = 0; // initialisation
  }

  if (inVal === 1) {
    node.data.timer += deltaTime;
    if (node.data.timer >= spVal) {
      node.data.qValue = 1;
    } else {
      node.data.qValue = 0;
    }
  } else {
    node.data.timer = 0;
    node.data.qValue = 0;
  }

  node.data.etValue = node.data.timer; // ET = temps écoulé
};
