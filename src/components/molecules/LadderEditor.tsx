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
import { resolveLadder } from './LadderLogic';
import { applyOutputs } from './ApplyOutputs';

import ContactNONode from '../NodeLadder/ContactNOnode';
import ContactNFNode from '../NodeLadder/ContactNFnode';
import RailAlimNode from '../NodeLadder/RailAlimNode';
import BobineNode from '../NodeLadder/BobineNode';
import SRnode from '../NodeLadder/SRnode';
import TonNode from '../NodeLadder/TonNode';
import ToffNode from '../NodeLadder/ToffNode';

import ToolbarLadder from './ToolbarLadder';
import { createNode } from './NodeManager';

type LadderEditorProps = {
  composantsUnity: string[];
  etatsComposants: Record<string, number>;
  sendMessage: (
    objectName: string,
    methodName: string,
    parameter: string
  ) => void;
};

const nodeTypes = {
  contactNO: ContactNONode,
  contactNF: ContactNFNode,
  railAlim: RailAlimNode,
  bobine: BobineNode,
  SR: SRnode,
  Ton: TonNode,
  Toff: ToffNode,
};

export default function LadderEditor({
  composantsUnity,
  etatsComposants,
  sendMessage,
}: LadderEditorProps) {
  const railId = 'rail-1';
  const contactId = 'contact-1';
  const bobineId = 'bobine-1';

  const baseNodes: Node[] = [
    {
      id: railId,
      type: 'railAlim',
      position: { x: 0, y: 80 },
      data: {},
    },
    {
      id: contactId,
      type: 'contactNO',
      position: { x: 150, y: 80 },
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
      position: { x: 350, y: 80 },
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
      type: 'smoothstep',
    },

    {
      id: 'edge-contact-bobine',
      source: contactId,
      sourceHandle: 'out',
      target: bobineId,
      targetHandle: 'in',
      type: 'smoothstep',
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
        if (node.type !== 'railAlim') {
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

  type NodeData = {
    variable?: string;
    outValue?: number | null;
    inValue?: number;
    etatsComposants?: Record<string, number>;
    [key: string]: unknown;
  };

  type NodeWithData = Node & {
    type: string; // obligatoire
    data: NodeData;
  };

  const addNode = (type: string) => {
    const newNode = createNode(type, nodes, composantsUnity, etatsComposants);
    setNodes((nds) => [...nds, newNode]);
  };

  let lastRunTime: number | null = null;

  const runWorkflow = () => {
    const now = Date.now();
    const deltaTime = lastRunTime !== null ? now - lastRunTime : 0; // ms
    lastRunTime = now;

    const resolvedNodes = resolveLadder(nodes, edges, deltaTime);

    setNodes(resolvedNodes);

    // Filtrer uniquement les nodes qui ont un type défini et une variable pour applyOutputs
    const nodesWithData = resolvedNodes.filter(
      (node): node is NodeWithData =>
        typeof node.type === 'string' &&
        node.data !== undefined &&
        typeof node.data.variable === 'string'
    );

    applyOutputs(nodesWithData, sendMessage);
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

      <ToolbarLadder onAddNode={addNode} />
      <ReactFlow
        snapToGrid={true}
        snapGrid={[40, 40]}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep', // ← angles droits intégrés
          style: { stroke: '#000', strokeWidth: 2 },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
