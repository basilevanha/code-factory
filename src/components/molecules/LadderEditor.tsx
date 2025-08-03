'use client';

import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const LadderEditor = () => {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow nodes={[]} edges={[]} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default LadderEditor;
