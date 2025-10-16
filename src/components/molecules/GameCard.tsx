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

  // Détermine la classe selon l'état
  const baseClass = `block rounded-xl p-4 transition-all border border-slate-700 ${
    disabled
      ? 'cursor-not-allowed bg-slate-800 text-slate-500'
      : 'cursor-pointer bg-slate-800 text-slate-100 hover:bg-slate-700 hover:shadow-[0_0_15px_5px_rgba(96,165,250,0.6)]'
  }`;

  const titleClass = `mb-1 text-lg font-semibold ${disabled ? '' : 'text-blue-400'}`;

  return (
    <li>
      <Wrapper {...(href && !disabled ? { href } : {})} className={baseClass}>
        <div className={titleClass}>
          {icon} {title}
        </div>
        <p className="text-sm text-slate-300">{description}</p>
      </Wrapper>
    </li>
  );
}
