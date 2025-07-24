import { useState, ReactNode } from 'react';

type ToggleProps = {
  defaultChecked?: boolean;
  onClick?: (checked: boolean) => void;
  children?: ReactNode;
};

const Toggle = ({ defaultChecked = false, onClick, children }: ToggleProps) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onClick?.(!newValue);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="m-5 flex cursor-pointer items-center gap-3 focus:outline-none"
    >
      <div className="relative">
        <div
          className={`h-6 w-10 rounded-full transition-colors duration-300 ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        />
        <div
          className={`absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </div>
      {children && <span className="text-sm">{children}</span>}
    </button>
  );
};

export default Toggle;
