// LadderEditor.tsx
import React, { useCallback, useState, useEffect, useRef } from 'react';
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
  runPLC: boolean;
  setRunPLC: (value: boolean) => void;
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
  runPLC,
  setRunPLC,
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
        variable: 'I_Sensor_1',
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
        variable: 'Q_Conv_1',
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

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  useEffect(() => {
    if (!initialized && composantsUnity?.length) {
      setNodes(baseNodes);
      setEdges(baseEdges);
      setInitialized(true);
    }
  }, [composantsUnity, initialized]);

  type NodeData = {
    variable?: string;
    outValue?: number | null;
    inValue?: number;
    etatsComposants?: Record<string, number>;
    [key: string]: unknown;
  };

  type NodeWithData = Node & {
    type: string;
    data: NodeData;
  };

  const addNode = (type: string) => {
    const newNode = createNode(
      type,
      nodesRef.current,
      composantsUnity,
      etatsComposants
    );
    setNodes((nds) => [...nds, newNode]);
  };

  let lastRunTime: number | null = null;

  const runWorkflow = () => {
    const now = Date.now();
    const deltaTime = lastRunTime !== null ? now - lastRunTime : 0;
    lastRunTime = now;

    // Injection des dernières valeurs Unity dans les nodes
    const nodesWithLatestState = nodesRef.current.map((node) => {
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
    });

    const resolvedNodes = resolveLadder(
      nodesWithLatestState,
      edgesRef.current,
      deltaTime
    );
    setNodes(resolvedNodes);

    const nodesWithData = resolvedNodes.filter(
      (node): node is NodeWithData =>
        typeof node.type === 'string' &&
        node.data !== undefined &&
        typeof node.data.variable === 'string'
    );

    applyOutputs(nodesWithData, sendMessage);
  };

  // Boucle automatique si runPLC actif et à chaque nouvelle valeur Unity
  useEffect(() => {
    if (!runPLC) return;
    if (!etatsComposants || Object.keys(etatsComposants).length === 0) return;

    //console.log('[DEBUG] runPLC actif -> déclenchement runWorkflow');
    runWorkflow();
  }, [etatsComposants, runPLC]);
  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    setRunPLC(false); // toggle OFF dès qu'un node change
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
    setRunPLC(false); // toggle OFF dès qu'un edge change
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
    setRunPLC(false); // toggle OFF dès qu'une nouvelle connexion est créée
  }, []);

  return (
    <div style={{ width: '100%', height: '85%' }}>
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
          type: 'smoothstep',
          style: { stroke: '#000', strokeWidth: 2 },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
