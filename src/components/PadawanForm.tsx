import React, { useState, useEffect } from 'react';
import { Padawan, defaultPadawan, JediRank } from '../types/padawan';
import ForceAbilitiesGrid from './ForceAbilitiesGrid';
import CombatFormsGrid from './CombatFormsGrid';

interface PadawanFormProps {
  initialData?: Padawan;
  onSubmit: (padawan: Padawan) => void;
  onCancel: () => void;
}

const PadawanForm: React.FC<PadawanFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  const [padawan, setPadawan] = useState<Padawan>(initialData || defaultPadawan());

  useEffect(() => {
    if (initialData) {
      setPadawan(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPadawan(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'taille' || name === 'poids' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(padawan);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400 border-b border-slate-700 pb-3">
        {initialData ? 'Modifier la Fiche Jedi' : 'Nouvelle Fiche Jedi'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Rang Jedi</label>
          <select
            name="rang"
            value={padawan.rang}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            required
          >
            <option value="padawan">Padawan</option>
            <option value="chevalier">Chevalier Jedi</option>
            <option value="maitre">Maître Jedi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={padawan.imageUrl}
            onChange={handleChange}
            placeholder="https://exemple.com/image.jpg"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Nom</label>
          <input
            type="text"
            name="nom"
            value={padawan.nom}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Âge</label>
          <input
            type="number"
            name="age"
            value={padawan.age || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Race</label>
          <input
            type="text"
            name="race"
            value={padawan.race}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Planète Natale</label>
          <input
            type="text"
            name="planeteNatale"
            value={padawan.planeteNatale}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Genre</label>
          <select
            name="genre"
            value={padawan.genre}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            required
          >
            <option value="">Sélectionner</option>
            <option value="Masculin">Masculin</option>
            <option value="Féminin">Féminin</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Taille (cm)</label>
          <input
            type="number"
            name="taille"
            value={padawan.taille || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Poids (kg)</label>
          <input
            type="number"
            name="poids"
            value={padawan.poids || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Couleur des Yeux</label>
          <input
            type="text"
            name="couleurYeux"
            value={padawan.couleurYeux}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Couleur des Cheveux</label>
          <input
            type="text"
            name="couleurCheveux"
            value={padawan.couleurCheveux}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Maître Jedi</label>
          <input
            type="text"
            name="maitre"
            value={padawan.maitre}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
        <textarea
          name="description"
          value={padawan.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
        ></textarea>
      </div>
      
      <ForceAbilitiesGrid 
        abilities={padawan.forceAbilities} 
        onChange={(updatedAbilities) => setPadawan(prev => ({ ...prev, forceAbilities: updatedAbilities }))}
      />
      
      <CombatFormsGrid 
        forms={padawan.combatForms} 
        onChange={(updatedForms) => setPadawan(prev => ({ ...prev, combatForms: updatedForms }))}
      />
      
      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          {initialData ? 'Mettre à jour' : 'Créer la fiche'}
        </button>
      </div>
    </form>
  );
};

export default PadawanForm;