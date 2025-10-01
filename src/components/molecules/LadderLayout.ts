import { Node, Edge } from 'reactflow';

export function ladderize(
  nodes: Node[],
  edges: Edge[],
  xStep = 200,
  yStep = 100
): Node[] {
  const rail = nodes.find((n) => n.type === 'railAlim');
  if (!rail) return nodes;

  const positioned: Node[] = [];
  const visited = new Set<string>();

  const placeNode = (node: Node, col: number, row: number) => {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    positioned.push({
      ...node,
      position: {
        x: col * xStep,
        y: row * yStep,
      },
      draggable: edges.some((e) => e.source === node.id || e.target === node.id)
        ? false // node connecté → bloqué
        : true, // node isolé → libre
    });

    const successors = edges
      .filter((e) => e.source === node.id)
      .map((e) => nodes.find((n) => n.id === e.target))
      .filter((n): n is Node => !!n);

    successors.forEach((succ, i) => {
      placeNode(succ, col + 1, row + i); // chaque branche parallèle descend
    });
  };

  placeNode(rail, 0, 0);

  // Ajout des nodes isolés (non visités) → restent libres
  nodes.forEach((n) => {
    if (!visited.has(n.id)) {
      positioned.push({ ...n, draggable: true });
    }
  });

  return positioned;
}
