import React from 'react';
import { Sword } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white py-6 px-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0 transform hover:scale-105 transition-transform duration-300">
          <Sword size={32} className="mr-3 text-white" />
          <h1 className="text-2xl md:text-3xl font-bold">Fiches Jedi</h1>
        </div>
        <div>
          <p className="text-sm md:text-base italic text-yellow-200">
            "Un Jedi utilise la Force pour la connaissance et la défense, jamais pour l'attaque."
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;