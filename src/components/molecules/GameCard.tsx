type GameCardProps = {
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
  icon?: string;
};

export default function GameCard({
  title,
  description,
  href,
  disabled = false,
  icon,
}: GameCardProps) {
  const Wrapper = href && !disabled ? 'a' : 'div';

  return (
    <li>
      <Wrapper
        {...(href && !disabled ? { href } : {})}
        className={`block rounded-md border p-4 transition ${
          disabled
            ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'
            : 'border-gray-200 text-gray-900 hover:bg-gray-50'
        }`}
      >
        <div className={`font-medium ${disabled ? '' : 'text-blue-600'}`}>
          {icon} {title}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </Wrapper>
    </li>
  );
}
