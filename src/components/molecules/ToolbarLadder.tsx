// ToolbarLadder.tsx
import Button from '@/components/atoms/Button';

type ToolbarLadderProps = {
  onAddNode: (type: string) => void;
};

export default function ToolbarLadder({ onAddNode }: ToolbarLadderProps) {
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
        {/* <Button onClick={() => onAddNode('SR')}>SR</Button> */}
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
      </div>
    </div>
  );
}
