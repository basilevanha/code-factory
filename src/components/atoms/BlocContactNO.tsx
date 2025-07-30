import { useState } from 'react';
import clsx from 'clsx';

type Sensor = {
  name: string;
  state: boolean;
};

type BlocContactNOProps = {
  sensors: Sensor[];
};

const BlocContactNO = ({ sensors }: BlocContactNOProps) => {
  const [selectedSensor, setSelectedSensor] = useState('');

  const selected = sensors.find((s) => s.name === selectedSensor);
  const isActive = selected?.state ?? false;

  return (
    <div className="flex w-56 flex-col gap-3 rounded-2xl border border-gray-300 bg-white p-4 shadow-md">
      <span className="text-sm font-semibold text-gray-700">Contact NO</span>

      <select
        className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={selectedSensor}
        onChange={(e) => setSelectedSensor(e.target.value)}
      >
        <option value="">???</option> {/* ✅ Option par défaut */}
        {sensors.map((sensor) => (
          <option key={sensor.name} value={sensor.name}>
            {sensor.name}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <div
          className={clsx(
            'h-4 w-4 rounded-full transition-colors duration-300',
            selected
              ? isActive
                ? 'bg-green-500'
                : 'bg-gray-300'
              : 'border border-gray-300 bg-transparent'
          )}
        />
        <span className="text-sm text-gray-600">
          {selected ? (isActive ? 'Actif' : 'Inactif') : '—'}
        </span>
      </div>
    </div>
  );
};

export default BlocContactNO;
