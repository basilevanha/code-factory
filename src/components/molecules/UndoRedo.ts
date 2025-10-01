import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';

type FlowState = {
  nodes: Node[];
  edges: Edge[];
};

export function useUndoRedo(initial: FlowState) {
  const [past, setPast] = useState<FlowState[]>([]);
  const [present, setPresent] = useState<FlowState>(initial);
  const [future, setFuture] = useState<FlowState[]>([]);

  const set = useCallback(
    (newState: FlowState) => {
      setPast((prev) => [...prev, present]);
      setPresent(newState);
      setFuture([]); // on efface le futur dès qu’on fait une nouvelle action
    },
    [present]
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((prev) => prev.slice(0, prev.length - 1));
    setFuture((next) => [present, ...next]);
    setPresent(previous);
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setPast((prev) => [...prev, present]);
    setPresent(next);
  }, [future, present]);

  return { state: present, set, undo, redo };
}
