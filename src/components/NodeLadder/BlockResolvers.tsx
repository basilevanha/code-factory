import { Node, Edge } from 'reactflow';

import { resolveContactNO } from './ContactNOnode';
import { resolveBobine } from './BobineNode';
import { resolveRailAlim } from './RailAlimNode';
import { resolveSR } from './SRnode';
import { resolveTON } from './TonNode';
// Ajoute ici d’autres resolvers si besoin
type Resolver = (node: Node, nodeMap: Map<string, Node>, edges: Edge[]) => void;

export const blockResolvers: Record<string, Resolver> = {
  contactNO: resolveContactNO,
  bobine: resolveBobine,
  railAlim: resolveRailAlim,
  SRnode: resolveSR,
  //TonNode: resolveTON, //need to create a tempoBlocResolver???

  // Ajoute les autres types ici
};
