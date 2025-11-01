import { Edge, Node } from 'reactflow';

type Resolver = (
  node: Node,
  nodeMap: Map<string, Node>,
  edges: Edge[],
  deltaTime: number
) => void;

export const resolveRailAlim = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[]
): void => {
  node.data.outValue = 1;
};

export const resolveBobine = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[]
) => {
  const inValue = node.data.inValue;

  const isActive = inValue === 1;
  node.data.outValue = isActive ? 1 : 0;
  //console.log(`Bobine ${node.id} ,outValue=${node.data.outValue}`);
};

export const resolveContactNO = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[]
): void => {
  const inValue = node.data.inValue;

  const variable = node.data.variable;
  const etatsComposants: Record<string, number> =
    node.data.etatsComposants || {};

  const capteurValue = variable ? etatsComposants[variable] : 0;

  const isActive = capteurValue === 1;

  node.data.outValue = inValue === 1 && isActive ? 1 : 0;

  /*console.log(
    `→ Noeud ${node.id}: in=${inValue}, capteur=${capteurValue}, out=${node.data.outValue}`
  );*/
};

export const resolveSR = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[]
): void => {
  const inputs = node.data.inputs || {};

  const inSet = inputs['set'] ?? 0;
  const inReset = inputs['reset'] ?? 0;

  // Initialisation si nécessaire
  if (node.data.outValue === undefined) {
    node.data.outValue = 0;
  }

  // Logique SR : Set prioritaire
  if (inSet === 1) {
    node.data.outValue = 1;
  } else if (inReset === 1) {
    node.data.outValue = 0;
  }

  /* Debug
  console.log(
    `[SR] ${node.id} → set=${inSet}, reset=${inReset}, out=${node.data.outValue}`
  );*/
};

export const resolveTOff = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[],
  _deltaTime: number
): void => {
  const inVal = node.data.inValue || 0;
  const spVal = node.data.spValue || 0; // ms

  if (node.data.startTime === undefined) {
    node.data.startTime = null;
  }

  if (inVal === 1) {
    // Entrée active → Q = 1 immédiatement
    node.data.qValue = 1;
    node.data.etValue = 0;
    node.data.startTime = null; // reset du chrono
  } else {
    // IN = 0 → on démarre un chrono si pas déjà lancé
    if (node.data.startTime === null) {
      node.data.startTime = Date.now();
    }
    const elapsed = Date.now() - node.data.startTime;
    node.data.etValue = elapsed;

    if (elapsed >= spVal) {
      node.data.qValue = 0; // fin du délai
    } else {
      node.data.qValue = 1; // maintient la sortie pendant le délai
    }
  }

  node.data.outValue = node.data.qValue;
};

export const resolveTON = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[],
  _deltaTime: number
): void => {
  const inVal = node.data.inValue || 0;
  const spVal = node.data.spValue || 0; // durée en ms

  if (node.data.startTime === undefined) {
    node.data.startTime = null; // moment où IN passe à 1
  }

  //console.log(`[TON-${node.id}] IN=${inVal}, SP=${spVal}`);

  if (inVal === 1) {
    if (node.data.startTime === null) {
      // Premier cycle où IN est à 1 → on enregistre le temps
      node.data.startTime = Date.now();
      /* console.log(
        `[TON-${node.id}] Front montant détecté → startTime=${node.data.startTime}`
      );*/
    }

    // Temps écoulé depuis le front montant
    const elapsed = Date.now() - node.data.startTime;
    node.data.etValue = elapsed;
    node.data.qValue = elapsed >= spVal ? 1 : 0;

    /*console.log(
      `[TON-${node.id}] elapsed=${elapsed}ms, ET=${node.data.etValue}, Q=${node.data.qValue}`
    );*/
  } else {
    // Reset complet
    node.data.startTime = null;
    node.data.etValue = 0;
    node.data.qValue = 0;
    //console.log(`[TON-${node.id}] Reset → ET=0, Q=0`);
  }

  node.data.outValue = node.data.qValue;
};

export const resolveContactNF = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[]
): void => {
  const inValue = node.data.inValue;

  const variable = node.data.variable;
  const etatsComposants: Record<string, number> =
    node.data.etatsComposants || {};

  const capteurValue = variable ? etatsComposants[variable] : 0;

  // Le contact NF est actif quand le capteur est à 0 (inversé par rapport au NO)
  const isActive = capteurValue === 0;

  node.data.outValue = inValue === 1 && isActive ? 1 : 0;

  /*
  console.log(
    `→ Noeud NF ${node.id}: in=${inValue}, capteur=${capteurValue}, out=${node.data.outValue}`
  );
  */
};

export const resolveCTU = (
  node: Node,
  _nodeMap: Map<string, Node>,
  _edges: Edge[],
  _deltaTime: number
): void => {
  const inVal = node.data.inValue || 0;
  const rVal = node.data.rValue || 0;
  const spVal = node.data.spValue || 0;

  // Initialisation si nécessaire
  if (node.data.cvValue === undefined) node.data.cvValue = 0;
  if (node.data.prevIn === undefined) node.data.prevIn = 0;

  // Si reset actif → tout remettre à zéro
  if (rVal === 1) {
    node.data.cvValue = 0;
    node.data.qValue = 0;
  } else {
    // Détection du front montant sur IN
    if (inVal === 1 && node.data.prevIn === 0) {
      node.data.cvValue += 1;
    }

    // Q actif si le compteur atteint ou dépasse SP
    node.data.qValue = node.data.cvValue >= spVal ? 1 : 0;
  }

  // Mémorise l’état précédent de IN
  node.data.prevIn = inVal;

  // Sortie principale = Q
  node.data.outValue = node.data.qValue;
};

export const blockResolvers: Record<string, Resolver> = {
  contactNO: resolveContactNO,
  contactNF: resolveContactNF,
  bobine: resolveBobine,
  railAlim: resolveRailAlim,
  SR: resolveSR,
  Ton: resolveTON,
  Toff: resolveTOff,
  CTU: resolveCTU,
  // Ajoute les autres types ici
};
