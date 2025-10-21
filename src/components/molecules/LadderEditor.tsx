// LadderEditor.tsx
'use client';
import { usePathname } from 'next/navigation';

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
  SelectionMode,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { resolveLadder } from '../../utils/Ladder/Logic';
import { applyOutputs } from '../../utils/Ladder/ApplyOutputs';
import { getColorByValue } from '../../utils/getColorByValue';

//simplifiable?????????******************************************************************
import ContactNONode from '../NodeLadder/ContactNOnode';
import ContactNFNode from '../NodeLadder/ContactNFnode';
import RailAlimNode from '../NodeLadder/RailAlimNode';
import BobineNode from '../NodeLadder/BobineNode';
import SRnode from '../NodeLadder/SRnode';
import TonNode from '../NodeLadder/TonNode';
import ToffNode from '../NodeLadder/ToffNode';
//*************************************************************************** */
import ToolbarLadder from './ToolbarLadder';
import { ladderize } from './LadderLayout';
import { addNodeWithAutoConnection } from './AutoConnection';
import { useUndoRedo } from './UndoRedo';

import { createNode } from '../../utils/Ladder/NodeManager';

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
  const [rfInstance, setRfInstance] = useState<
    import('reactflow').ReactFlowInstance | null
  >(null);

  const savedViewportRef = useRef<{
    x: number;
    y: number;
    zoom: number;
  } | null>(null);

  const onInit = useCallback(
    (instance: import('reactflow').ReactFlowInstance) => {
      setRfInstance(instance);
      if (
        savedViewportRef.current &&
        typeof instance.setViewport === 'function'
      ) {
        instance.setViewport(savedViewportRef.current);
        savedViewportRef.current = null;
      }
    },
    []
  );

  const saveLadder = useCallback(
    async (filename: string) => {
      if (!rfInstance) return;

      if (!filename.trim()) {
        console.error('❌ Nom de fichier requis');
        return;
      }

      const flow = {
        ...rfInstance.toObject(),
        nodes: nodesRef.current.map((n) => ({
          ...n,
          data: { ...n.data },
        })),
      };

      try {
        const response = await fetch('/api/ladder/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: flow,
            filename: filename.trim(),
          }),
        });

        if (response.ok) {
          console.log(`✅ Ladder sauvegardé : ${filename}`);
        } else {
          console.error('❌ Erreur lors de la sauvegarde du ladder');
        }
      } catch (error) {
        console.error('❌ Erreur réseau lors de la sauvegarde :', error);
      }
    },
    [rfInstance]
  );

  const loadLadder = useCallback(
    async (filename: string) => {
      if (!composantsUnity || composantsUnity.length === 0) {
        console.warn('⚠️ composantsUnity pas encore chargé');
        return;
      }

      if (!filename.trim()) {
        console.error('❌ Nom de fichier requis');
        return;
      }

      try {
        const response = await fetch(
          `/api/ladder/load?filename=${encodeURIComponent(filename)}`
        );
        if (!response.ok) throw new Error('Erreur de chargement serveur');
        const flow = await response.json();

        const { x = 0, y = 0, zoom = 1 } = flow.viewport || {};

        const nodesWithData = (flow.nodes || []).map((node: Node) => {
          const shortVar = node.data?.variable || '';

          return {
            ...node,
            data: {
              ...node.data,
              variable: shortVar,
              composantsUnity,
              etatsComposants,
              onChange: () => {},
            },
          };
        });

        setNodes(nodesWithData);
        setEdges(flow.edges || []);
        savedViewportRef.current = { x, y, zoom };

        console.log(`✅ Ladder chargé : ${filename}`);
      } catch (error) {
        console.error('❌ Impossible de charger le ladder :', error);
      }
    },
    [composantsUnity, etatsComposants]
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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

  const pathname = usePathname();

  // Fonction pour générer le nom du fichier depuis le path
  const getFilenameFromPath = useCallback(() => {
    // Ex: '/games/step1' → 'games-step1'
    const segments = pathname.split('/').filter(Boolean);
    return segments.join('-') || 'default-ladder';
  }, [pathname]);

  useEffect(() => {
    // ✅ Dès que les composants Unity sont chargés et que ce n'est pas encore initialisé :
    if (!initialized && composantsUnity?.length) {
      (async () => {
        try {
          const filename = getFilenameFromPath();
          console.log(`📁 Chargement du fichier : ${filename}`);
          await loadLadder(filename);
          setInitialized(true);
        } catch (error) {
          console.error('❌ Erreur lors du chargement du ladder :', error);
        }
      })();
    }
  }, [composantsUnity, initialized, loadLadder, getFilenameFromPath]);

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
    const { newNode, newEdges } = addNodeWithAutoConnection(
      type,
      selectedNodeId,
      nodesRef.current,
      edgesRef.current,
      composantsUnity,
      etatsComposants
    );

    let updatedNodes = [...nodesRef.current, newNode];
    updatedNodes = ladderize(updatedNodes, newEdges);

    setNodes(updatedNodes);
    setEdges(newEdges);
    setSelectedNodeId(newNode.id);
  };

  const selected = nodesRef.current.find((n) => n.id === selectedNodeId);

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
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        const sourceNode = resolvedNodes.find((n) => n.id === edge.source);
        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: sourceNode
              ? getColorByValue(sourceNode.data.outValue)
              : '#9CA3AF',
            strokeWidth: 3, // optionnel : rendre les edges plus visibles
          },
        };
      })
    );
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

  useEffect(() => {
    // Mets à jour la variable globale (utilisée par getColorByValue)
    window.runPLCState = runPLC;

    // 🔹 Reset nodes et edges quand PLC OFF
    if (!runPLC) {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          const data = { ...node.data };

          // valeurs à remettre à zéro pour reset visuel et logique
          if ('inValue' in data) data.inValue = 0;
          if ('outValue' in data) data.outValue = 0;
          if ('qValue' in data) data.qValue = 0;
          if ('etValue' in data) data.etValue = 0;
          if ('memoire' in data) data.memoire = 0;

          return { ...node, data };
        })
      );

      setEdges((prevEdges) =>
        prevEdges.map((edge) => {
          const sourceNode = nodesRef.current.find((n) => n.id === edge.source);
          return {
            ...edge,
            style: {
              ...edge.style,
              stroke: sourceNode
                ? getColorByValue(sourceNode.data.outValue)
                : '#9CA3AF',
              strokeWidth: 3,
            },
          };
        })
      );

      console.log('Ladder reset local (runPLC=0)');
    }
  }, [runPLC]);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      const updated = applyNodeChanges(changes, nds);
      return ladderize(updated, edgesRef.current);
    });
    setRunPLC(false);
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
    setRunPLC(false); // toggle OFF dès qu'un edge change
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => {
      const updatedEdges = addEdge(connection, eds);
      setNodes((nds) => ladderize(nds, updatedEdges));
      return updatedEdges;
    });

    // Stop le PLC dès qu'une nouvelle connexion est créée
    setRunPLC(false);
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  return (
    <div id="ladder-editor" style={{ width: '100%', height: '85%' }}>
      <ToolbarLadder
        onAddNode={addNode}
        onSave={() => saveLadder('user_ladder')}
        onLoad={() => loadLadder('user_ladder')}
      />
      <ReactFlow
        snapToGrid={true}
        snapGrid={[40, 40]}
        onInit={onInit}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelectedNodeId(null)}
        nodeTypes={nodeTypes}
        panOnScroll
        selectionOnDrag
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#9CA3AF', strokeWidth: 2 },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
