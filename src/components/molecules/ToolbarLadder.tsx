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
      Ajoute un bloc Ladder en cliquant dessus.
      <div className="flex gap-2 rounded bg-white p-2 shadow">
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
        <Button onClick={() => onAddNode('SR')}>SR</Button>
        <Button
          tooltip="Bloc Temporistion à l’enclenchement"
          onClick={() => onAddNode('Ton')}
        >
          Ton
        </Button>
        <Button
          tooltip="Bloc Temporistion à l’ouverture"
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
      </div>
    </div>
  );
}
