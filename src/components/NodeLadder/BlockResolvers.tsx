import { Node, Edge } from 'reactflow';

import { resolveContactNO } from './ContactNOnode';
import { resolveBobine } from './BobineNode';
import { resolveRailAlim } from './RailAlimNode';
import { resolveSR } from './SRnode';
import { resolveTON } from './TonNode';
//import { resolveTOff } from './ToffNode';
import { resolveContactNF } from './ContactNFnode';
// Ajoute ici d’autres resolvers si besoin
type Resolver = (
  node: Node,
  nodeMap: Map<string, Node>,
  edges: Edge[],
  deltaTime: number
) => void;

export const blockResolvers: Record<string, Resolver> = {
  contactNO: resolveContactNO,
  contactNF: resolveContactNF,
  bobine: resolveBobine,
  railAlim: resolveRailAlim,
  SR: resolveSR,
  Ton: resolveTON, //need to create a tempoBlocResolver???
  //ToffNode: resolveTOff,
  // Ajoute les autres types ici
};
