// ToolbarLadder.tsx
import Button from '@/components/atoms/Button';

type ToolbarLadderProps = {
  onAddNode: (type: string) => void;
  onSave?: () => void;
  onLoad?: () => void;
};

export default function ToolbarLadder({
  onAddNode,
  onSave,
  onLoad,
}: ToolbarLadderProps) {
  return (
    <div>
      <div
        id="ToolBarLadder"
        className="flex gap-2 rounded-lg bg-gray-200 p-2 shadow"
      >
        <Button
          tooltip="Bloc contact à ouverture"
          onClick={() => onAddNode('contactNO')}
        >
          -| |-
        </Button>
        <Button
          tooltip="Bloc contact à fermeture"
          onClick={() => onAddNode('contactNF')}
        >
          -|/|-
        </Button>
        <Button tooltip="Bloc bobine" onClick={() => onAddNode('bobine')}>
          -( )-
        </Button>
        <Button tooltip="Bloc Set-Reset" onClick={() => onAddNode('SR')}>
          SR
        </Button>
        <Button
          tooltip="Bloc Temporistion à l'enclenchement"
          onClick={() => onAddNode('Ton')}
        >
          Ton
        </Button>
        <Button
          tooltip="Bloc Temporistion à l'ouverture"
          onClick={() => onAddNode('Toff')}
        >
          Toff
        </Button>
        {onSave && (
          <Button tooltip="Sauvegarder le programme" onClick={onSave}>
            💾
          </Button>
        )}

        {onLoad && (
          <Button tooltip="Charger un programme" onClick={onLoad}>
            📂
          </Button>
        )}

        {/* Afficher le bouton railAlim uniquement s'il n'existe pas déjà */}

        <Button
          tooltip="Bloc rail d'alimentation"
          onClick={() => onAddNode('railAlim')}
        >
          |--
        </Button>
      </div>
    </div>
  );
}
