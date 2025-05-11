import React from 'react';
import { Padawan } from '../types/padawan';
import PadawanCard from './PadawanCard';
import { SlidersHorizontal, Search } from 'lucide-react';

interface PadawanListProps {
  padawans: Padawan[];
  onEdit: (padawan: Padawan) => void;
  onDelete: (id: string) => void;
  onSearch: (term: string) => void;
  searchTerm: string;
  currentUserId: string;
}

const PadawanList: React.FC<PadawanListProps> = ({ 
  padawans, 
  onEdit, 
  onDelete, 
  onSearch,
  searchTerm,
  currentUserId
}) => {
  if (padawans.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-md p-8 text-center border border-yellow-600/20">
        <p className="text-lg text-yellow-400 mb-4">Aucun Jedi enregistré pour le moment.</p>
        <p className="text-sm text-yellow-300/60">Créez une nouvelle fiche pour commencer.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-yellow-400">Fiches Jedi ({padawans.length})</h2>
        
        <div className="flex w-full sm:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-yellow-600/20 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-yellow-100 placeholder-yellow-300/40"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400/60" />
          </div>
          <button className="ml-2 p-2 bg-slate-800 text-yellow-400 rounded-md hover:bg-slate-700 transition-colors border border-yellow-600/20">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {padawans.map(padawan => (
          <PadawanCard 
            key={padawan.id}
            padawan={padawan}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default PadawanList;