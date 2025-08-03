// utils/ladderLogic.ts
import { Edge, Node } from 'reactflow';

/**
 * Calcule les outValues pour chaque node selon son type.
 */
export const computeOutValues = (nodes: Node[]): Map<string, number> => {
  const outValues = new Map<string, number>();

  nodes.forEach((node) => {
    switch (node.type) {
      case 'railAlim':
        outValues.set(node.id, 1);
        break;
      case 'contactNO':
        outValues.set(node.id, node.data.inValue ?? 0);
        break;
      case 'bobine':
        outValues.set(node.id, node.data.inValue ?? 0);
        break;
      default:
        outValues.set(node.id, 0);
    }
  });

  return outValues;
};

/**
 * Propagation des inValue depuis les outValues via les edges.
 * Retourne une nouvelle liste de nodes avec les inValue mis à jour.
 */
export const propagateValues = (
  nodes: Node[],
  edges: Edge[],
  outValues: Map<string, number>
): Node[] => {
  return nodes.map((node) => {
    const incomingEdges = edges.filter((e) => e.target === node.id);

    if (incomingEdges.length === 0) return node;

    let newInValue = 0;
    for (const edge of incomingEdges) {
      const sourceOut = outValues.get(edge.source) ?? 0;
      if (sourceOut === 1) {
        newInValue = 1;
        break;
      }
    }

    if (node.data.inValue !== newInValue) {
      return {
        ...node,
        data: {
          ...node.data,
          inValue: newInValue,
        },
      };
    }

    return node;
  });
};
