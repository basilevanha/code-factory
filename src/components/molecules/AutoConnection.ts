import { Edge, Node, Position } from 'reactflow';
import { createNode } from '../../utils/Ladder/NodeManager';

type NodeData = {
  variable?: string;
  outValue?: number | null;
  inValue?: number;
  etatsComposants?: Record<string, number>;
  handles?: {
    id: string;
    type: 'source' | 'target';
    position: Position;
  }[];
  [key: string]: unknown;
};

export type LadderNode = Node<NodeData>;

/**
 * Récupère le premier handle disponible basé sur la position physique
 * - left = input
 * - right = output
 */
function getHandleByPosition(node: LadderNode, side: 'left' | 'right') {
  const handles = node.data?.handles || [];
  if (side === 'left') {
    const inputs = handles.filter((h) => h.position === Position.Left);
    return inputs[0] || null; // premier input trouvé
  } else {
    const outputs = handles.filter((h) => h.position === Position.Right);
    return outputs[0] || null; // première sortie trouvée
  }
}

export function addNodeWithAutoConnection(
  type: string,
  selectedNodeId: string | null,
  nodes: LadderNode[],
  edges: Edge[],
  composantsUnity: string[],
  etatsComposants: Record<string, number>
): { newNode: LadderNode; newEdges: Edge[] } {
  // 1️⃣ Créer le nouveau node
  const newNode = createNode(type, nodes, composantsUnity, etatsComposants);

  if (!selectedNodeId) return { newNode, newEdges: edges };

  // 2️⃣ Node sélectionné
  const selected = nodes.find((n) => n.id === selectedNodeId);
  if (!selected) return { newNode, newEdges: edges };
  console.log('[addNodeWithAutoConnection] Node sélectionné:', selected);

  // 3️⃣ Position automatique
  const posX = (selected.position.x ?? 0) + 200;
  const posY = selected.position.y ?? 0;
  newNode.position = { x: posX, y: posY };

  let newEdges = [...edges];

  // 4️⃣ Edge sortant
  const outgoingEdge = edges.find((e) => e.source === selectedNodeId);
  console.log(
    '[addNodeWithAutoConnection] Edge sortant existant:',
    outgoingEdge
  );

  // 5️⃣ Handle source du node sélectionné (output)
  const sourceHandle = getHandleByPosition(selected, 'right')?.id || 'out';
  console.log('[addNodeWithAutoConnection] Handle source:', sourceHandle);

  // 6️⃣ Handle target du nouveau node (premier input)
  let targetHandle = getHandleByPosition(newNode, 'left')?.id;
  if (!targetHandle) {
    // Fallback intelligent selon le type
    targetHandle = newNode.type === 'SR' ? 'set' : 'in';
  }
  console.log('[addNodeWithAutoConnection] Handle target:', targetHandle);

  if (outgoingEdge) {
    // insertion entre selected et successeur
    const successeurId = outgoingEdge.target;
    newEdges = newEdges.filter((e) => e.id !== outgoingEdge.id);

    // Edge vers le nouveau node
    newEdges.push({
      id: `edge-${selectedNodeId}-${newNode.id}`,
      source: selectedNodeId,
      sourceHandle,
      target: newNode.id,
      targetHandle: targetHandle,
      type: 'smoothstep',
    });

    // ✅ Handle du successeur avec fallback intelligent
    const successeur = nodes.find((n) => n.id === successeurId);
    let succTargetHandleId = successeur
      ? getHandleByPosition(successeur, 'left')?.id
      : undefined;

    if (!succTargetHandleId && successeur) {
      // Fallback intelligent selon le type du successeur
      succTargetHandleId = successeur.type === 'SR' ? 'set' : 'in';
    }

    newEdges.push({
      id: `edge-${newNode.id}-${successeurId}`,
      source: newNode.id,
      sourceHandle: getHandleByPosition(newNode, 'right')?.id || 'out',
      target: successeurId,
      targetHandle: succTargetHandleId,
      type: 'smoothstep',
    });
  } else {
    // ajout à la fin
    newEdges.push({
      id: `edge-${selectedNodeId}-${newNode.id}`,
      source: selectedNodeId,
      sourceHandle,
      target: newNode.id,
      targetHandle,
      type: 'smoothstep',
    });
  }

  return { newNode, newEdges };
}
