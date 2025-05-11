import React from 'react';
import { ForceAbility } from '../types/padawan';

interface ForceAbilitiesGridProps {
  abilities: ForceAbility[];
  onChange: (updatedAbilities: ForceAbility[]) => void;
}

const ForceAbilitiesGrid: React.FC<ForceAbilitiesGridProps> = ({ abilities, onChange }) => {
  const handleToggle = (id: string) => {
    const updatedAbilities = abilities.map(ability => 
      ability.id === id ? { ...ability, learned: !ability.learned } : ability
    );
    onChange(updatedAbilities);
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg shadow-md mb-6 border border-yellow-600/20">
      <h3 className="text-xl font-semibold mb-4 text-yellow-400">Pouvoirs de Force</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {abilities.map(ability => (
          <div 
            key={ability.id}
            onClick={() => handleToggle(ability.id)}
            className={`
              cursor-pointer p-2 rounded-md text-center transition-all duration-200 border
              ${ability.learned 
                ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50 shadow-inner' 
                : 'bg-slate-700/50 text-gray-400 border-slate-600/50 hover:bg-slate-700'}
            `}
          >
            <span className="text-sm font-medium">{ability.name}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600/20 border border-yellow-500/50 rounded-sm"></div>
            <span className="text-sm text-yellow-300">Appris</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-700/50 border border-slate-600/50 rounded-sm"></div>
            <span className="text-sm text-gray-400">Non appris</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForceAbilitiesGrid;