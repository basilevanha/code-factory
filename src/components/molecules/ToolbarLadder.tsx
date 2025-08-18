// ToolbarLadder.tsx
import Button from '@/components/atoms/Button';

type ToolbarLadderProps = {
  onAddNode: (type: string) => void;
};

export default function ToolbarLadder({ onAddNode }: ToolbarLadderProps) {
  return (
    <div className="flex gap-2 rounded bg-white p-2 shadow">
      <Button onClick={() => onAddNode('contactNO')}>-| |-</Button>
      <Button onClick={() => onAddNode('contactNF')}>-|/|-</Button>
      <Button onClick={() => onAddNode('bobine')}>-( )-</Button>
      <Button onClick={() => onAddNode('SR')}>SR</Button>
    </div>
  );
}
