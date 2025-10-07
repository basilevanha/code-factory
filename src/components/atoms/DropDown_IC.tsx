type DropDownICProps = {
  composantsUnity: string[];
  value: string; // valeur sans préfixe
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
  // Renvoie le type à partir du préfixe
  const getType = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.startsWith('i_')) return 'sensor';
    if (lower.startsWith('m_')) return 'memoire';
    if (lower.startsWith('q_')) return 'actionneur';
    return 'autre';
  };

  const typeIsVisible = (type: string) => {
    return (
      (type === 'sensor' && showSensor) ||
      (type === 'memoire' && showMemoire) ||
      (type === 'actionneur' && showActionneur)
    );
  };

  // Filtrer et trier les options affichées selon le type
  const optionsFiltrees = composantsUnity
    .filter((name) => typeIsVisible(getType(name)))
    .sort((a, b) => a.localeCompare(b)); // tri alphabétique

  return (
    <select
      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
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
