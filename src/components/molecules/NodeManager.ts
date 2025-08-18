// NodeManager.ts
import { Node } from 'reactflow';

type NodeData = {
  variable?: string;
  inValue?: number;
  composantsUnity?: string[];
  etatsComposants?: Record<string, number>;
  onChange?: (variable: string) => void;
};

export const createNode = (
  type: string,
  nodes: Node[],
  composantsUnity: string[],
  etatsComposants: Record<string, number>
): Node => {
  return {
    id: `${type}-${nodes.length + 1}`,
    type,
    position: { x: 100, y: 100 }, // ou calculé dynamiquement
    data: {
      variable: '',
      composantsUnity,
      etatsComposants,
      inValue: 0,
      onChange: () => {},
    } as NodeData,
  };
};
