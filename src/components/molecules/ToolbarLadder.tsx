// ToolbarLadder.tsx
import Button from '@/components/atoms/Button';

type ToolbarLadderProps = {
  onAddNode: (type: string) => void;
};

export default function ToolbarLadder({ onAddNode }: ToolbarLadderProps) {
  return (
    <div>
      Ajoute un bloc Ladder en cliquant dessus. Pour effacer un bloc ou une
      connection, clique dessus et sur ton clavier appuie sur "del" ou "suppr".
      <div className="flex gap-2 rounded bg-white p-2 shadow">
        <Button
          tooltip="Bloc contact Normalement Ouvert (NO)"
          onClick={() => onAddNode('contactNO')}
        >
          -| |-
        </Button>
        <Button onClick={() => onAddNode('contactNF')}>-|/|-</Button>
        <Button onClick={() => onAddNode('bobine')}>-( )-</Button>
        {/* <Button onClick={() => onAddNode('SR')}>SR</Button> */}
        <Button onClick={() => onAddNode('Ton')}>Ton</Button>
        <Button onClick={() => onAddNode('Toff')}>Toff</Button>
      </div>
    </div>
  );
}
