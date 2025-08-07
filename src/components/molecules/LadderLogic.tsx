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
export const resolveLadder = (nodes: Node[], edges: Edge[]): Node[] => {
  const nodeMap = new Map(nodes.map((n) => [n.id, { ...n }]));
  const queue: string[] = [];

  // Étape 1 : Initialisation
  for (const node of nodeMap.values()) {
    node.data.inValue = 0;
    if (node.type === 'railAlim') {
      node.data.inValue = 1;
      queue.push(node.id);
    }
  }

  // Étape 2 : Propagation à partir des rails
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentNode = nodeMap.get(currentId);
    if (!currentNode) continue;

    // Appelle le résolveur spécifique selon le type du noeud
    const resolver = currentNode.type && blockResolvers[currentNode.type];

    if (resolver) {
      resolver(currentNode, nodeMap, edges);
    } else {
      // Pas de résolveur spécifique, on peut éventuellement définir un fallback
      console.warn(`Pas de resolver pour le type ${currentNode.type}`);
      currentNode.data.outValue = 0; // valeur par défaut
    }
    console.log(`→ Noeud ${currentNode.id} out=${currentNode.data.outValue}`);

    const targets = getConnectedTargets(currentId, edges);
    for (const targetId of targets) {
      const targetNode = nodeMap.get(targetId);
      if (!targetNode) continue;

      // Si au moins une entrée en amont vaut 1, on active l’entrée de ce nœud
      const incomingEdges = edges.filter((e) => e.target === targetId);
      const newInValue = incomingEdges.some(
        (e) => nodeMap.get(e.source)?.data.outValue === 1
      )
        ? 1
        : 0;

      if (targetNode.data.inValue !== newInValue) {
        console.log(
          `→ propagation vers ${targetNode.id}: inValue ${targetNode.data.inValue} → ${newInValue}`
        );
        targetNode.data.inValue = newInValue;
        queue.push(targetId);
      }
    }
  }

  console.log('Résultat final :', Array.from(nodeMap.values()));
  return Array.from(nodeMap.values());
};
