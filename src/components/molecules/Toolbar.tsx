// Components
import Toggle from '@/components/atoms/Toggle';
import Button, { IconName } from '@/components/atoms/Button';

type ToolbarItem =
  | {
      type: 'button';
      icon?: IconName;
      name: string;
      onClick: () => void;
      id?: string;
    }
  | {
      type: 'toggle';
      name: string;
      onClick: (value: boolean) => void;
      value: boolean;
      id?: string;
    }
  | {
      type: 'text';
      name: string;
      value: string;
    };

type ToolbarProps = {
  items: ToolbarItem[];
  className?: string;
  /** Fonction appelée quand on clique sur le bouton d’aide */
  onHintClick?: () => void;
};

const Toolbar = ({ items, className = '', onHintClick }: ToolbarProps) => {
  return (
    <div
      className={`flex min-w-max flex-row items-center gap-5 rounded-lg bg-gray-200 p-2 ${className}`}
    >
      {/* Items existants */}
      <div className="flex flex-row gap-5">
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
              <Toggle
                key={index}
                value={item.value}
                onClick={item.onClick}
                id={item.id}
              >
                {item.name}
              </Toggle>
            );
          }

          if (item.type === 'button') {
            return (
              <Button
                key={index}
                onClick={item.onClick}
                icon={item.icon}
                id={item.id}
              >
                {item.name}
              </Button>
            );
          }

          return null;
        })}
      </div>

      {/* Bouton Aide toujours présent à droite */}
      {onHintClick && (
        <div className="ml-auto">
          <Button onClick={onHintClick} icon="help-circle" tooltip="Indice">
            {'Aide'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
