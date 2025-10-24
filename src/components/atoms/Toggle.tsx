import { ReactNode } from 'react';

type ToggleProps = {
  id?: string;
  value: boolean;
  onClick?: (checked: boolean) => void;
  children?: ReactNode;
};

const Toggle = ({ id, value, onClick, children }: ToggleProps) => {
  const handleToggle = () => {
    onClick?.(!value);
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleToggle}
      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-all duration-300 focus:outline-none ${
        value
          ? 'border-green-400 bg-green-500/10 shadow-[0_0_6px_rgba(34,197,94,0.4)]'
          : 'border-gray-300 bg-gray-100 hover:bg-gray-200'
      }`}
    >
      <div className="relative">
        {/* Track */}
        <div
          className={`h-6 w-10 rounded-full border transition-all duration-300 ${
            value
              ? 'border-green-400 bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]'
              : 'border-gray-400 bg-gray-200'
          }`}
        />

        {/* Knob */}
        <div
          className={`absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
            value ? 'translate-x-4' : ''
          }`}
        />
      </div>

      {children && (
        <span
          className={`text-sm transition-all ${
            value ? 'font-semibold' : 'font-normal'
          }`}
        >
          {children}
        </span>
      )}
    </button>
  );
};

export default Toggle;
