import React from 'react';
import { Padawan } from '../types/padawan';
import { Edit, Trash2, User, MapPin, Award, Shield } from 'lucide-react';

interface PadawanCardProps {
  padawan: Padawan;
  onEdit: (padawan: Padawan) => void;
  onDelete: (id: string) => void;
  currentUserId: string;
}

const PadawanCard: React.FC<PadawanCardProps> = ({ padawan, onEdit, onDelete, currentUserId }) => {
  const forceAbilitiesCount = padawan.forceAbilities.filter(a => a.learned).length;
  const combatFormsCount = padawan.combatForms.filter(f => f.learned).length;
  const canEdit = currentUserId === padawan.userId;
  
  const getRankColor = (rang: string) => {
    switch (rang) {
      case 'padawan': return 'text-blue-300';
      case 'chevalier': return 'text-green-300';
      case 'maitre': return 'text-yellow-300';
      default: return 'text-gray-300';
    }
  };

  const getRankTitle = (rang: string) => {
    switch (rang) {
      case 'padawan': return 'Padawan';
      case 'chevalier': return 'Chevalier Jedi';
      case 'maitre': return 'Maître Jedi';
      default: return rang;
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 hover:shadow-xl transition-shadow duration-300">
      {padawan.imageUrl && (
        <div className="w-full h-[40rem] overflow-hidden relative">
          <img 
            src={padawan.imageUrl} 
            alt={padawan.nom}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={20} className={getRankColor(padawan.rang)} />
              <span className={`text-lg ${getRankColor(padawan.rang)}`}>
                {getRankTitle(padawan.rang)}
              </span>
            </div>
            <h3 className="text-4xl font-bold mb-4 text-white">{padawan.nom}</h3>
            <div className="flex flex-col space-y-2 text-gray-200">
              <div className="flex items-center">
                <User size={18} className="mr-2" />
                <span className="text-lg">{padawan.race}, {padawan.age} ans</span>
              </div>
              {padawan.maitre && (
                <div className="flex items-center">
                  <Award size={18} className="mr-2" />
                  <span className="text-lg">{padawan.maitre}</span>
                </div>
              )}
              <div className="flex items-center">
                <MapPin size={18} className="mr-2" />
                <span className="text-lg">{padawan.planeteNatale}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6 text-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/50 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-sm text-purple-300 mb-2">Pouvoirs de Force</div>
            <div className="text-2xl font-semibold text-purple-200">
              {forceAbilitiesCount} / {padawan.forceAbilities.length}
            </div>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-sm text-indigo-300 mb-2">Formes de Combat</div>
            <div className="text-2xl font-semibold text-indigo-200">
              {combatFormsCount} / {padawan.combatForms.length}
            </div>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => onEdit(padawan)} 
              className="p-3 text-purple-400 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Modifier"
            >
              <Edit size={20} />
            </button>
            <button 
              onClick={() => onDelete(padawan.id)} 
              className="p-3 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Supprimer"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PadawanCard;