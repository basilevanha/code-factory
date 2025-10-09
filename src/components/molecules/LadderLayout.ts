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
  const shiftRight = (
    node: Node,
    deltaCols: number,
    shifted = new Set<string>()
  ) => {
    if (shifted.has(node.id)) return;
    shifted.add(node.id);

    const col = Math.round(node.position.x / xStep);
    const row = Math.round(node.position.y / yStep);
    const height = getRungHeight(node);

    // Libère ses anciens rungs
    for (let rr = 0; rr < height; rr++) {
      delete rungOccupied[col]?.[row + rr];
    }

    // Déplace
    const newCol = col + deltaCols;
    const newX = newCol * xStep;
    const newY = row * yStep;

    // ✅ Met à jour dans positioned ET dans nodes
    node.position.x = newX;
    node.position.y = newY;

    const positionedIndex = positioned.findIndex((n) => n.id === node.id);
    if (positionedIndex !== -1) {
      positioned[positionedIndex].position.x = newX;
      positioned[positionedIndex].position.y = newY;
    }

    // Réinscrit dans la table
    markRungs(newCol, row, height, node.id);

    // Déplace récursivement tous ses successeurs
    const successors = edges
      .filter((e) => e.source === node.id)
      .map((e) => nodes.find((n) => n.id === e.target))
      .filter((n): n is Node => !!n);

    successors.forEach((succ) => shiftRight(succ, deltaCols, shifted));
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

      shiftRight(existingNode, 1, shifted);
    }
  };

  const markRungs = (
    col: number,
    row: number,
    height: number,
    nodeId: string
  ) => {
    /*console.log(
      `📝 markRungs(${nodeId} @ col=${col}, row=${row}, height=${height})`
    );*/
    rungOccupied[col] = rungOccupied[col] || {};
    for (let r = row; r < row + height; r++) {
      rungOccupied[col][r] = nodeId;
    }
  };

  const placeNode = (node: Node, col: number, row: number) => {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    const height = getRungHeight(node);

    // ✅ Si le node a déjà une position valide dans la grille, l'utiliser
    const currentCol = Math.round(node.position.x / xStep);
    const currentRow = Math.round(node.position.y / yStep);

    // Si le node est déjà bien positionné, ne pas le décaler
    const targetCol =
      currentCol > 0 && positioned.length > 0 ? currentCol : col;
    const targetRow =
      currentRow >= 0 && positioned.length > 0 ? currentRow : row;

    /*console.log(
      `📌 placeNode(${node.id}) @ target col=${targetCol}, row=${targetRow}, height=${height}`
    );*/

    const shifted = new Set<string>();

    // Décale si collision
    ensureSpace(targetCol, targetRow, height, shifted);

    // ✅ Utilise targetCol et targetRow partout
    markRungs(targetCol, targetRow, height, node.id);

    positioned.push({
      ...node,
      position: {
        x: targetCol * xStep,
        y: targetRow * yStep,
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
      //console.log(`   ↳ Successeur de ${node.id} : ${succ.id}`);

      if (shifted.has(succ.id)) {
        const currentCol = Math.round(succ.position.x / xStep);
        const currentRow = Math.round(succ.position.y / yStep);
        /*console.log(
          `   ⚠️ ${succ.id} déjà shifté à col=${currentCol}, row=${currentRow}`
        );*/
        placeNode(succ, currentCol, currentRow);
      } else {
        placeNode(succ, targetCol + 1, targetRow + offsetRow); // ✅ targetCol au lieu de col
      }

      offsetRow += getRungHeight(succ);
    });
  };

  console.log('🚀 Start ladderize');
  // Corrige les 'backlinks' : force les connexions vers la droite
  edges.forEach((e) => {
    const src = nodes.find((n) => n.id === e.source);
    const tgt = nodes.find((n) => n.id === e.target);
    if (!src || !tgt) return;

    const srcCol = Math.round(src.position.x / xStep);
    const tgtCol = Math.round(tgt.position.x / xStep);

    if (tgtCol <= srcCol) {
      console.warn(`↩️ backlink détecté: ${tgt.id} déplacé à droite`);
      tgt.position.x = (srcCol + 1) * xStep;
    }
  });

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
