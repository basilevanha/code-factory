import { Handle, Position, NodeProps } from 'reactflow';
import clsx from 'clsx';
import { getColorByValue } from '@/utils/getColorByValue';

const RailAlimNode = ({ data }: NodeProps) => {
  const outValue = 1; // Toujours actif

  return (
    <div className="relative w-32 rounded-2xl border border-gray-300 bg-white p-4 shadow-md">
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
        }}
      />

      {/* Contenu central */}
      <div className="flex flex-col items-center justify-center">
        <span className="mt-1 text-xs text-gray-500">power</span>
        <span
          className={clsx(
            'text-base font-bold transition-colors',
            getColorByValue(outValue) //GET COLOR A MODIFIER
          )}
        >
          |‒‒
        </span>
      </div>
    </div>
  );
};

export default RailAlimNode;
