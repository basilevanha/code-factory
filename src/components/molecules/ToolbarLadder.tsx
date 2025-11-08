import Button from '@/components/atoms/Button';

type ToolbarLadderProps = {
  onAddNode: (type: string) => void;
  onSave?: () => void;
  onLoad?: () => void;
  visibleButtons?: string[]; // ✅ Liste des boutons à afficher
};

export default function ToolbarLadder({
  onAddNode,
  onSave,
  onLoad,
  visibleButtons = [
    'contactNO',
    'contactNF',
    'bobine',
    'SR',
    'Ton',
    'Toff',
    'CTU',
    'railAlim',
    'save',
    'load',
  ], // valeur par défaut : tout afficher
}: ToolbarLadderProps) {
  // ✅ Helper pour vérifier la présence d’un bouton
  const show = (key: string) => visibleButtons.includes(key);

  return (
    <div>
      <div
        id="ToolBarLadder"
        className="flex flex-wrap gap-2 rounded-lg bg-gray-200 p-2 shadow"
      >
        {show('contactNO') && (
          <Button
            tooltip="Bloc contact à ouverture"
            onClick={() => onAddNode('contactNO')}
          >
            -| |-
          </Button>
        )}
        {show('contactNF') && (
          <Button
            tooltip="Bloc contact à fermeture"
            onClick={() => onAddNode('contactNF')}
          >
            -|/|-
          </Button>
        )}
        {show('bobine') && (
          <Button tooltip="Bloc bobine" onClick={() => onAddNode('bobine')}>
            -( )-
          </Button>
        )}
        {show('SR') && (
          <Button tooltip="Bloc Set-Reset" onClick={() => onAddNode('SR')}>
            SR
          </Button>
        )}
        {show('Ton') && (
          <Button
            tooltip="Bloc Temporisation à l'enclenchement"
            onClick={() => onAddNode('Ton')}
          >
            Ton
          </Button>
        )}
        {show('Toff') && (
          <Button
            tooltip="Bloc Temporisation à l'ouverture"
            onClick={() => onAddNode('Toff')}
          >
            Toff
          </Button>
        )}
        {show('CTU') && (
          <Button
            tooltip="Compteur à incrémentation (Count Up)"
            onClick={() => onAddNode('CTU')}
          >
            CTU
          </Button>
        )}
        {show('BP') && (
          <Button tooltip="Bouton poussoir" onClick={() => onAddNode('BP')}>
            --||--
          </Button>
        )}
        {show('save') && onSave && (
          <Button tooltip="Sauvegarder le programme" onClick={onSave}>
            💾
          </Button>
        )}
        {show('load') && onLoad && (
          <Button tooltip="Charger un programme" onClick={onLoad}>
            📂
          </Button>
        )}
        {show('railAlim') && (
          <Button
            tooltip="Bloc rail d'alimentation"
            onClick={() => onAddNode('railAlim')}
          >
            |--
          </Button>
        )}
      </div>
    </div>
  );
}
