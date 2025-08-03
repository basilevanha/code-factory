// LadderEditor.tsx
import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { computeOutValues, propagateValues } from './LadderLogic';

import ContactNONode from './ContactNOnode';
import RailAlimNode from './RailAlimNode';
import BobineNode from './BobineNode';

type LadderEditorProps = {
  composantsUnity: string[];
  etatsComposants: Record<string, number>;
};

const nodeTypes = {
  contactNO: ContactNONode,
  railAlim: RailAlimNode,
  bobine: BobineNode,
};

export default function LadderEditor({
  composantsUnity,
  etatsComposants,
}: LadderEditorProps) {
  const railId = 'rail-1';
  const contactId = 'contact-1';
  const bobineId = 'bobine-1';

  const baseNodes: Node[] = [
    {
      id: railId,
      type: 'railAlim',
      position: { x: 0, y: 100 },
      data: {},
    },
    {
      id: contactId,
      type: 'contactNO',
      position: { x: 150, y: 100 },
      data: {
        variable: '',
        composantsUnity,
        etatsComposants,
        inValue: 0,
        onChange: () => {},
      },
    },
    {
      id: bobineId,
      type: 'bobine',
      position: { x: 400, y: 100 },
      data: {
        variable: '',
        composantsUnity,
        etatsComposants,
        inValue: 0,
        onChange: () => {},
      },
    },
  ];

  const baseEdges: Edge[] = [
    {
      id: 'edge-rail-contact',
      source: railId,
      sourceHandle: 'out',
      target: contactId,
      targetHandle: 'in',
      type: 'default',
    },
    {
      id: 'edge-contact-bobine',
      source: contactId,
      sourceHandle: 'out',
      target: bobineId,
      targetHandle: 'in',
      type: 'default',
    },
  ];

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && composantsUnity?.length) {
      setNodes(baseNodes);
      setEdges(baseEdges);
      setInitialized(true);
    }
  }, [composantsUnity, initialized]);

  useEffect(() => {
    if (nodes.length === 0) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'contactNO' || node.type === 'bobine') {
          return {
            ...node,
            data: {
              ...node.data,
              composantsUnity,
              etatsComposants,
            },
          };
        }
        return node;
      })
    );
  }, [composantsUnity, etatsComposants]);

  const runWorkflow = () => {
    const outValues = computeOutValues(nodes);
    const newNodes = propagateValues(nodes, edges, outValues);
    setNodes(newNodes);
  };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <button
        className="mb-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        onClick={runWorkflow}
      >
        ▶️ Calculer workflow
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
