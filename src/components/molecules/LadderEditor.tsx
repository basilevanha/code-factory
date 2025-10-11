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
  SelectionMode,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { resolveLadder } from '../../utils/Ladder/Logic';
import { applyOutputs } from '../../utils/Ladder/ApplyOutputs';

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

  // Sauvegarde sur le serveur
  const saveLadder = useCallback(async () => {
    if (!rfInstance) return;

    // Inclure toutes les data des nodes
    const flow = {
      ...rfInstance.toObject(),
      nodes: nodesRef.current.map((n) => ({
        ...n,
        data: { ...n.data }, // <-- conserve toutes les propriétés dynamiques
      })),
    };

    try {
      const response = await fetch('/api/ladder/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flow),
      });

      if (response.ok) {
        console.log('✅ Ladder sauvegardé sur le serveur');
      } else {
        console.error('❌ Erreur lors de la sauvegarde du ladder');
      }
    } catch (error) {
      console.error('❌ Erreur réseau lors de la sauvegarde :', error);
    }
  }, [rfInstance]);

  const loadLadder = useCallback(async () => {
    if (!composantsUnity || composantsUnity.length === 0) {
      console.warn(
        '⚠️ composantsUnity pas encore chargé, impossible de restaurer le ladder'
      );
      return;
    }

    try {
      const response = await fetch('/api/ladder/load');
      if (!response.ok) throw new Error('Erreur de chargement serveur');
      const flow = await response.json();

      const { x = 0, y = 0, zoom = 1 } = flow.viewport || {};

      // 🔧 Fonction pour retrouver la bonne variable avec préfixe
      const findFullName = (shortName: string) => {
        return (
          composantsUnity.find((name) => name.substring(2) === shortName) || ''
        );
      };

      const nodesWithData = (flow.nodes || []).map((node: Node) => {
        const shortVar = node.data?.variable || '';
        const fullVar = findFullName(shortVar);

        return {
          ...node,
          data: {
            ...node.data,
            variable: shortVar, // ton dropdown gère déjà la suppression de préfixe
            composantsUnity,
            etatsComposants,
            onChange: () => {},
          },
        };
      });

      setNodes(nodesWithData);
      setEdges(flow.edges || []);
      savedViewportRef.current = { x, y, zoom };

      console.log('✅ Ladder chargé depuis le serveur');
    } catch (error) {
      console.error('❌ Impossible de charger le ladder :', error);
    }
  }, [composantsUnity, etatsComposants]);

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

  useEffect(() => {
    // ✅ Dès que les composants Unity sont chargés et que ce n’est pas encore initialisé :
    if (!initialized && composantsUnity?.length) {
      (async () => {
        try {
          await loadLadder(); // ← charge la scène depuis le serveur
          setInitialized(true);
        } catch (error) {
          console.error('❌ Erreur lors du chargement du ladder :', error);
        }
      })();
    }
  }, [composantsUnity, initialized, loadLadder]);

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
    // mets à jour la variable globale (utilisée par getColorByValue)
    window.runPLCState = runPLC;

    if (runPLC) return; // seulement quand on passe à false

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

    console.log('Ladder reset local (runPLC=0)');
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
    <div style={{ width: '100%', height: '85%' }}>
      <ToolbarLadder
        onAddNode={addNode}
        onSave={saveLadder}
        onLoad={loadLadder}
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
        nodeTypes={nodeTypes}
        panOnScroll
        selectionOnDrag
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
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
