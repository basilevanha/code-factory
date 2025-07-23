import {
  Play,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { ReactNode, MouseEvent } from 'react';
import clsx from 'clsx';

type IconName = 'play' | 'chevron-down' | 'chevron-right' | 'chevron-left';

const iconMap: Record<IconName, LucideIcon> = {
  play: Play,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
};

type ButtonProps = {
  children: ReactNode;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  href?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({
  children,
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  href,
  onClick,
  type = 'button',
}: ButtonProps) => {
  const IconComponent = icon ? iconMap[icon] : null;

  const baseStyles = clsx(
    'inline-flex items-center gap-2 rounded-2xl px-6 py-2 font-semibold shadow-md transition',
    'text-white bg-blue-600 hover:bg-blue-700',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  );

  const iconElement = IconComponent ? <IconComponent size={16} /> : null;

  // Si `href` est fourni → Link
  if (href) {
    return (
      <Link href={href} className={baseStyles} aria-disabled={disabled}>
        {iconElement && iconPosition === 'left' && iconElement}
        {children}
        {iconElement && iconPosition === 'right' && iconElement}
      </Link>
    );
  }

  // Sinon → bouton
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {iconElement && iconPosition === 'left' && iconElement}
      {children}
      {iconElement && iconPosition === 'right' && iconElement}
    </button>
  );
};

export default Button;
