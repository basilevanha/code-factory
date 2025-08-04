import { Handle, Position, NodeProps } from 'reactflow';
import clsx from 'clsx';
import { getColorByValue } from '@/utils/getColorByValue';

const RailAlimNode = ({ data }: NodeProps) => {
  const outValue = 1; // Toujours actif

  return (
    <div className="relative h-10 w-15 rounded-2xl border border-gray-300 bg-white shadow-md">
      {/* Sortie */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          backgroundColor: getColorByValue(outValue),
          width: 12,
          height: 12,
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Contenu central parfaitement centré */}
      <div className="flex h-full items-center justify-center">
        <span
          className={clsx(
            'text-sm font-bold transition-colors',
            getColorByValue(outValue, true)
          )}
        >
          |‒‒
        </span>
      </div>
    </div>
  );
};

export default RailAlimNode;
