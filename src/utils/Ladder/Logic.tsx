//Logic.tsx
import { Edge, Node } from 'reactflow';
import { blockResolvers } from '@/utils/Ladder/resolvers';

/**
 * Propagation d’un signal depuis les rails jusqu’aux autres nœuds.
 * Gère plusieurs entrées par nœud grâce à `data.inputs[handleId]`.
 */
export const resolveLadder = (
  nodes: Node[],
  edges: Edge[],
  deltaTime: number
): Node[] => {
  const nodeMap = new Map(
    nodes.map((n) => [
      n.id,
      {
        ...n,
        data: {
          ...n.data,
          inValue: 0,
          inputs: {}, // dictionnaire des entrées
        },
      },
    ])
  );

  const queue: string[] = [];

  console.log('=== [LADDER] Initialisation ===');

  // Step 1 : initialiser les rails
  for (const node of nodeMap.values()) {
    if (node.type === 'railAlim') {
      node.data.outValue = 1;
      node.data.inValue = 1;
      node.data.inputs['in'] = 1;
      queue.push(node.id);
      console.log(`[INIT] Rail ${node.id} activé → out=1, in=1`);
    }
  }

  const alreadyQueued = new Set<string>();

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    alreadyQueued.delete(currentId);
    const currentNode = nodeMap.get(currentId);
    if (!currentNode) continue;

    console.log(
      `\n[RESOLVE] Noeud ${currentNode.id} (type=${currentNode.type})`
    );

    // Résolution par le resolver du bloc
    const resolver = currentNode.type && blockResolvers[currentNode.type];
    if (resolver) {
      resolver(currentNode, nodeMap, edges, deltaTime);
    } else {
      console.warn(
        `[WARN] Aucun resolver trouvé pour type=${currentNode.type}`
      );
    }

    console.log(
      `   Résultat → inputs=${JSON.stringify(
        currentNode.data.inputs
      )}, inValue=${currentNode.data.inValue}, outValue=${currentNode.data.outValue}`
    );

    // Propagation vers les cibles
    const outgoingEdges = edges.filter((e) => e.source === currentId);
    for (const edge of outgoingEdges) {
      const targetNode = nodeMap.get(edge.target);
      if (!targetNode) continue;

      const outVal = currentNode.data.outValue ?? 0;
      const handleId = edge.targetHandle || 'in';

      if (!targetNode.data.inputs) targetNode.data.inputs = {};
      const prevVal = targetNode.data.inputs[handleId] ?? 0;
      targetNode.data.inputs[handleId] = outVal;

      // Compatibilité avec anciens blocs
      if (handleId === 'in') {
        targetNode.data.inValue = targetNode.data.inValue || outVal ? 1 : 0;
      }

      /*console.log(
        `   [PROPAG] ${currentNode.id} (out=${outVal}) → ${targetNode.id}.${handleId} (avant=${prevVal}, après=${outVal})`
      );*/

      if (!alreadyQueued.has(targetNode.id)) {
        queue.push(targetNode.id);
        alreadyQueued.add(targetNode.id);
      }
    }
  }

  console.log('=== [LADDER] Résolution terminée ===');
  return Array.from(nodeMap.values());
};
