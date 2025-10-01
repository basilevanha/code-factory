import { Edge, Node } from 'reactflow';
import { createNode } from '../../utils/Ladder/NodeManager';

type NodeData = {
  variable?: string;
  outValue?: number | null;
  inValue?: number;
  etatsComposants?: Record<string, number>;
  [key: string]: unknown;
};

export type LadderNode = Node<NodeData>;

export function addNodeWithAutoConnection(
  type: string,
  selectedNodeId: string | null,
  nodes: LadderNode[],
  edges: Edge[],
  composantsUnity: string[],
  etatsComposants: Record<string, number>
): { newNode: LadderNode; newEdges: Edge[] } {
  // 1. Créer le nouveau node
  const newNode = createNode(type, nodes, composantsUnity, etatsComposants);

  if (!selectedNodeId) {
    return { newNode, newEdges: edges };
  }

  // 2. Trouver le node sélectionné
  const selected = nodes.find((n) => n.id === selectedNodeId);
  if (!selected) {
    return { newNode, newEdges: edges };
  }

  // 3. Chercher un edge sortant du node sélectionné
  const outgoingEdge = edges.find((e) => e.source === selectedNodeId);
  let newEdges = [...edges];

  if (outgoingEdge) {
    // Cas "insertion entre selected et successeur"
    const successeurId = outgoingEdge.target;
    newEdges = newEdges.filter((e) => e.id !== outgoingEdge.id);

    newEdges.push({
      id: `edge-${selectedNodeId}-${newNode.id}`,
      source: selectedNodeId,
      sourceHandle: 'out',
      target: newNode.id,
      targetHandle: 'in',
      type: 'smoothstep',
    });
    newEdges.push({
      id: `edge-${newNode.id}-${successeurId}`,
      source: newNode.id,
      sourceHandle: 'out',
      target: successeurId,
      targetHandle: 'in',
      type: 'smoothstep',
    });
  } else {
    // Cas "ajout à la fin"
    newEdges.push({
      id: `edge-${selectedNodeId}-${newNode.id}`,
      source: selectedNodeId,
      sourceHandle: 'out',
      target: newNode.id,
      targetHandle: 'in',
      type: 'smoothstep',
    });
  }

  // 4. Placer le nouveau node automatiquement
  const posX = (selected.position.x ?? 0) + 200;
  const posY = selected.position.y ?? 80;
  newNode.position = { x: posX, y: posY };

  return { newNode, newEdges };
}
