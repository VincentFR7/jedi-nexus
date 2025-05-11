import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PadawanForm from './components/PadawanForm';
import PadawanList from './components/PadawanList';
import { Padawan, defaultPadawan } from './types/padawan';
import { loadPadawans, savePadawans } from './utils/storage';
import { Plus, ChevronUp } from 'lucide-react';

function App() {
  const [padawans, setPadawans] = useState<Padawan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPadawan, setCurrentPadawan] = useState<Padawan | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentUserId] = useState(crypto.randomUUID()); // Simule un ID utilisateur unique

  useEffect(() => {
    setPadawans(loadPadawans());

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCreatePadawan = () => {
    const newPadawan = defaultPadawan();
    newPadawan.userId = currentUserId;
    setCurrentPadawan(undefined);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditPadawan = (padawan: Padawan) => {
    if (padawan.userId === currentUserId) {
      setCurrentPadawan(padawan);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeletePadawan = (id: string) => {
    const padawan = padawans.find(p => p.id === id);
    if (padawan && padawan.userId === currentUserId) {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche Jedi ?')) {
        const updatedPadawans = padawans.filter(p => p.id !== id);
        setPadawans(updatedPadawans);
        savePadawans(updatedPadawans);
      }
    }
  };

  const handleSubmitPadawan = (padawan: Padawan) => {
    let updatedPadawans: Padawan[];
    
    if (currentPadawan) {
      updatedPadawans = padawans.map(p => p.id === padawan.id ? padawan : p);
    } else {
      updatedPadawans = [...padawans, padawan];
    }
    
    setPadawans(updatedPadawans);
    savePadawans(updatedPadawans);
    setShowForm(false);
    setCurrentPadawan(undefined);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredPadawans = padawans.filter(padawan => 
    padawan.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    padawan.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
    padawan.planeteNatale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    padawan.maitre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          <PadawanForm 
            initialData={currentPadawan}
            onSubmit={handleSubmitPadawan}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-yellow-400">Registre des Jedi</h1>
              <button
                onClick={handleCreatePadawan}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Nouveau Jedi
              </button>
            </div>
            
            <PadawanList 
              padawans={filteredPadawans}
              onEdit={handleEditPadawan}
              onDelete={handleDeletePadawan}
              onSearch={handleSearch}
              searchTerm={searchTerm}
              currentUserId={currentUserId}
            />
          </>
        )}
      </main>
      
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-yellow-600 text-white p-3 rounded-full shadow-lg hover:bg-yellow-700 transition-colors"
          aria-label="Retour en haut"
        >
          <ChevronUp size={24} />
        </button>
      )}
      
      <footer className="bg-slate-800 text-gray-300 py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Registre des Jedi | Créé par l'Ordre Jedi
          </p>
          <p className="text-xs mt-2 text-yellow-400">
            "Que la Force soit avec vous."
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;