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
    if (lower.includes('sensor')) return 'sensor';
    if (lower.includes('memoire') || lower.includes('m_')) return 'memoire';
    if (lower.includes('actionneur') || lower.includes('a_'))
      return 'actionneur';
    return 'autre';
  };

  const typeIsVisible = (type: string) => {
    return (
      (type === 'sensor' && showSensor) ||
      (type === 'memoire' && showMemoire) ||
      (type === 'actionneur' && showActionneur)
    );
  };

  // Commenté temporairement pour désactiver le filtre
  // const optionsFiltrées = composantsUnity.filter((name) =>
  //   typeIsVisible(getType(name))
  // );

  const optionsFiltrées = composantsUnity; // Affiche tout sans filtrage

  return (
    <select
      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {optionsFiltrées.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default DropDown_IC;
