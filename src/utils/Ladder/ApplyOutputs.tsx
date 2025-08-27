export type NodeWithData = {
  id: string;
  type: string;
  data: {
    variable?: string; // Nom du composant Unity (actionneur)
    outValue?: number | null; // Sortie calculée
    // ... autres données
  };
};

export const applyOutputs = (
  nodes: NodeWithData[],
  sendMessage: (
    objectName: string,
    methodName: string,
    parameter: string
  ) => void
) => {
  nodes.forEach((node) => {
    if (node.type === 'bobine') {
      console.log(
        `→ Bobine détectée : variable=${node.data.variable}, outValue=${node.data.outValue}`
      );
    }
  });
  const outputsToSend = nodes.filter(
    (node) => node.type === 'bobine' && typeof node.data.variable === 'string'
  );

  if (outputsToSend.length === 0) {
    console.log('applyOutputs : aucun output à envoyer');
    return;
  }

  console.log('applyOutputs : envoi vers Unity', outputsToSend);

  try {
    outputsToSend.forEach((node) => {
      const id = node.data.variable!;
      const value = (node.data.outValue ?? 0).toString(); // valeur forcée à 0 si undefined
      sendMessage(id, 'SetActifFromReact', value);
      console.log(
        `sendMessage vers Unity : ${id} / SetActifFromReact / ${value}`
      );
    });
  } catch (error) {
    console.error('Erreur lors de l’envoi vers Unity:', error);
  }
};
