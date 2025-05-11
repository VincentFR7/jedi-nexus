import React from 'react';
import { CombatForm } from '../types/padawan';

interface CombatFormsGridProps {
  forms: CombatForm[];
  onChange: (updatedForms: CombatForm[]) => void;
}

const CombatFormsGrid: React.FC<CombatFormsGridProps> = ({ forms, onChange }) => {
  const handleToggle = (id: string) => {
    const updatedForms = forms.map(form => 
      form.id === id ? { ...form, learned: !form.learned } : form
    );
    onChange(updatedForms);
  };

  const standardForms = forms.filter(form => form.category === 'standard');
  const zkForms = forms.filter(form => form.category === 'ZK');
  const jkForms = forms.filter(form => form.category === 'JK');

  const renderFormsGroup = (groupForms: CombatForm[], title: string) => (
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-3 text-yellow-400">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {groupForms.map(form => (
          <div 
            key={form.id}
            onClick={() => handleToggle(form.id)}
            className={`
              cursor-pointer p-2 rounded-md text-center transition-all duration-200 border
              ${form.learned 
                ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50 shadow-inner' 
                : 'bg-slate-700/50 text-gray-400 border-slate-600/50 hover:bg-slate-700'}
            `}
          >
            <span className="text-sm font-medium">{form.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg shadow-md mb-6 border border-yellow-600/20">
      <h3 className="text-xl font-semibold mb-4 text-yellow-400">Formes de Combat</h3>
      
      {renderFormsGroup(standardForms, 'Formes Standard')}
      {renderFormsGroup(zkForms, 'Formes ZK (Zealous Knight)')}
      {renderFormsGroup(jkForms, 'Formes JK (Jedi Knight)')}
      
      <div className="mt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600/20 border border-yellow-500/50 rounded-sm"></div>
            <span className="text-sm text-yellow-300">Maîtrisée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-700/50 border border-slate-600/50 rounded-sm"></div>
            <span className="text-sm text-gray-400">Non maîtrisée</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatFormsGrid;