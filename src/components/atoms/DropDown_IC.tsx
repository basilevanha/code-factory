type DropDownICProps = {
  composantsUnity: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showSensor?: boolean;
  showMemoire?: boolean;
  showActionneur?: boolean;
};

const DropDown_IC = ({
  composantsUnity,
  value,
  onChange,
  placeholder = '???',
  showSensor = true,
  showMemoire = true,
  showActionneur = true,
}: DropDownICProps) => {
  const getType = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.startsWith('i_')) return 'sensor';
    if (lower.startsWith('m_')) return 'memoire';
    if (lower.startsWith('q_')) return 'actionneur';
    return 'autre';
  };

  const typeIsVisible = (type: string) =>
    (type === 'sensor' && showSensor) ||
    (type === 'memoire' && showMemoire) ||
    (type === 'actionneur' && showActionneur);

  const optionsFiltrees = composantsUnity
    .filter((name) => typeIsVisible(getType(name)))
    .sort((a, b) => a.localeCompare(b));

  return (
    <select
      className="min-w-[9rem] rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:min-w-[2rem] md:min-w-[3rem] lg:min-w-[4rem]"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <option value="">{placeholder}</option>
      {optionsFiltrees.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default DropDown_IC;
