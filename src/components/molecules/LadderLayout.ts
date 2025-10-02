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

  // rungs occupés par colonne : rungOccupied[col][row] = node.id
  const rungOccupied: Record<number, Record<number, string>> = {};

  // calcule combien de rungs verticalement occupe le node
  const getRungHeight = (node: Node) => {
    return node.data?.rungHeight ?? 1;
  };

  // Vérifie et décale les nodes existants si collision
  const ensureSpace = (
    col: number,
    row: number,
    height: number,
    shifted = new Set<string>()
  ) => {
    rungOccupied[col] = rungOccupied[col] || {};

    for (let r = row; r < row + height; r++) {
      const occupyingNodeId = rungOccupied[col][r];
      if (!occupyingNodeId) continue;
      if (shifted.has(occupyingNodeId)) continue; // déjà déplacé

      const existingIndex = positioned.findIndex(
        (n) => n.id === occupyingNodeId
      );
      if (existingIndex === -1) continue;

      const existingNode = positioned[existingIndex];
      const existingHeight = getRungHeight(existingNode);

      const originalRow = Object.keys(rungOccupied[col])
        .map((rr) => parseInt(rr))
        .filter((rr) => rungOccupied[col][rr] === existingNode.id)
        .sort((a, b) => a - b)[0];

      // ⚡ Libérer les rungs
      for (let rr = 0; rr < existingHeight; rr++) {
        delete rungOccupied[col][originalRow + rr];
      }

      // Libérer rungs, déplacer le node
      existingNode.position.x = (col + 1) * xStep;
      existingNode.position.y = originalRow * yStep;

      shifted.add(existingNode.id); // ⚡ marque comme déplacé

      // ⚡ NE PAS toucher visited ici
      // Déplacer ses successeurs également
      const successors = edges
        .filter((e) => e.source === existingNode.id)
        .map((e) => nodes.find((n) => n.id === e.target))
        .filter((n): n is Node => !!n);

      successors.forEach((succ) => {
        ensureSpace(
          existingNode.position.x / xStep + 1,
          originalRow,
          getRungHeight(succ),
          shifted
        );
      });

      // Vérifier récursivement la colonne actuelle
      ensureSpace(col + 1, originalRow, existingHeight, shifted);
    }
  };

  const markRungs = (
    col: number,
    row: number,
    height: number,
    nodeId: string
  ) => {
    console.log(
      `📝 markRungs(${nodeId} @ col=${col}, row=${row}, height=${height})`
    );
    rungOccupied[col] = rungOccupied[col] || {};
    for (let r = row; r < row + height; r++) {
      rungOccupied[col][r] = nodeId;
    }
  };

  const placeNode = (node: Node, col: number, row: number) => {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    const height = getRungHeight(node);
    console.log(
      `📌 placeNode(${node.id}) @ col=${col}, row=${row}, height=${height}`
    );

    // Décale si collision
    ensureSpace(col, row, height);

    // Marquer avant de pousser
    markRungs(col, row, height, node.id);

    positioned.push({
      ...node,
      position: {
        x: col * xStep,
        y: row * yStep,
      },
      draggable: edges.some((e) => e.source === node.id || e.target === node.id)
        ? false
        : true,
    });

    // Successeurs
    const successors = edges
      .filter((e) => e.source === node.id)
      .map((e) => nodes.find((n) => n.id === e.target))
      .filter((n): n is Node => !!n);

    let offsetRow = 0;
    successors.forEach((succ) => {
      console.log(`   ↳ Successeur de ${node.id} : ${succ.id}`);
      placeNode(succ, col + 1, row + offsetRow);
      offsetRow += getRungHeight(succ);
    });
  };

  console.log('🚀 Start ladderize');
  placeNode(rail, 0, 0);

  // Nodes isolés
  nodes.forEach((n) => {
    if (!visited.has(n.id)) {
      console.log(`🟦 Node isolé: ${n.id}`);
      positioned.push({ ...n, draggable: true });
    }
  });

  console.log('✅ ladderize terminé');
  return positioned;
}
