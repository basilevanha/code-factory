import { Edge, Node } from 'reactflow';

/**
 * Cherche les cibles connectées à un nœud donné.
 */
const getConnectedTargets = (nodeId: string, edges: Edge[]): string[] => {
  return edges.filter((e) => e.source === nodeId).map((e) => e.target);
};

/**
 * Recalcule la sortie logique (outValue) d’un nœud à partir de son type.
 */
const computeOutValue = (node: Node): number | undefined => {
  const { type, data } = node;
  if (!data) return undefined;

  const { inValue, variable, etatsComposants } = data;

  if (type === 'contactNO') {
    const capteurValue = etatsComposants?.[variable] ?? undefined;
    const result =
      inValue === 1 && capteurValue === 1
        ? 1
        : inValue === 0 || capteurValue === 0
          ? 0
          : undefined;
    console.log(
      `contactNO [${node.id}] → inValue=${inValue}, capteur=${capteurValue}, out=${result}`
    );
    return result;
  }

  if (type === 'bobine') {
    const result = inValue === 1 ? 1 : 0;
    console.log(`bobine [${node.id}] → inValue=${inValue}, out=${result}`);
    return result;
  }

  if (type === 'railAlim') {
    return 1;
  }

  return undefined;
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

    // Recalcule et stocke outValue à chaque propagation
    currentNode.data.outValue = computeOutValue(currentNode);

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
