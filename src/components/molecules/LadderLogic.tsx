import { Edge, Node } from 'reactflow';
import { blockResolvers } from '../NodeLadder/BlockResolvers';

/**
 * Cherche les cibles connectées à un nœud donné.
 */
const getConnectedTargets = (nodeId: string, edges: Edge[]): string[] => {
  return edges.filter((e) => e.source === nodeId).map((e) => e.target);
};

/**
 * Propagation d’un signal de 1 depuis les rails, uniquement sur les `inValue`.
 */
export const resolveLadder = (
  nodes: Node[],
  edges: Edge[],
  deltaTime: number
): Node[] => {
  const nodeMap = new Map(nodes.map((n) => [n.id, { ...n }]));
  const queue: string[] = [];

  // Step 1 : start at the power rails
  for (const node of nodeMap.values()) {
    node.data.inValue = 0;
    if (node.type === 'railAlim') {
      node.data.inValue = 1;
      queue.push(node.id);
    }
  }

  const alreadyQueued = new Set<string>();

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    alreadyQueued.delete(currentId);
    const currentNode = nodeMap.get(currentId);
    if (!currentNode) continue;

    const resolver = currentNode.type && blockResolvers[currentNode.type];
    if (resolver) {
      console.log(
        `[DEBUG] Résolveur trouvé pour type=${currentNode.type}, id=${currentNode.id}`
      );
      resolver(currentNode, nodeMap, edges, deltaTime);
    } else {
      console.log(
        `[DEBUG] Aucun résolveur pour type=${currentNode.type}, id=${currentNode.id}`
      );
    }

    console.log(`→ Noeud ${currentNode.id} ,out=${currentNode.data.outValue}`);

    const targets = getConnectedTargets(currentId, edges);
    for (const targetId of targets) {
      const targetNode = nodeMap.get(targetId);
      if (!targetNode) continue;

      const incomingEdges = edges.filter((e) => e.target === targetId);
      const newInValue = incomingEdges.some(
        (e) => nodeMap.get(e.source)?.data.outValue === 1
      )
        ? 1
        : 0;

      const shouldEnqueue =
        targetNode.data.inValue !== newInValue || !alreadyQueued.has(targetId);

      if (shouldEnqueue) {
        console.log(
          `→ propagation vers ${targetNode.id}: inValue ${targetNode.data.inValue} → ${newInValue}`
        );
        targetNode.data.inValue = newInValue;
        queue.push(targetId);
        alreadyQueued.add(targetId);
      }
    }
  }

  console.log('Résultat final :', Array.from(nodeMap.values()));
  return Array.from(nodeMap.values());
};
