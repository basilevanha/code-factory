// Components
import Toggle from '@/components/atoms/Toggle';
import Button, { IconName } from '@/components/atoms/Button';

type ToolbarItem =
  | {
      type: 'button';
      icon?: IconName;
      name: string;
      onClick: () => void;
    }
  | {
      type: 'toggle';
      name: string;
      onClick: (value: boolean) => void;
      value: boolean;
    }
  | {
      type: 'text';
      name: string;
      value: string;
    };

type ToolbarProps = {
  items: ToolbarItem[];
  className?: string;
};

const Toolbar = ({ items, className = '' }: ToolbarProps) => {
  return (
    <div
      className={`flex min-w-max flex-row gap-5 rounded-lg bg-gray-200 p-4 ${className}`}
    >
      {items.map((item, index) => {
        if (item.type === 'text') {
          return (
            <p key={index} className="text-lg font-medium">
              {item.name} : {item.value}
            </p>
          );
        }

        if (item.type === 'toggle') {
          return (
            <Toggle key={index} value={item.value} onClick={item.onClick}>
              {item.name}
            </Toggle>
          );
        }

        if (item.type === 'button') {
          return (
            <Button key={index} onClick={item.onClick} icon={item.icon}>
              {item.name}
            </Button>
          );
        }

        return null;
      })}
    </div>
  );
};

export default Toolbar;
