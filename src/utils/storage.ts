import { Padawan } from '../types/padawan';

const STORAGE_KEY = 'jedi-padawan-data';

export const savePadawans = (padawans: Padawan[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(padawans));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données:', error);
  }
};

export const loadPadawans = (): Padawan[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return [];
  }
};

export const addPadawan = (padawan: Padawan): void => {
  const padawans = loadPadawans();
  savePadawans([...padawans, padawan]);
};

export const updatePadawan = (padawan: Padawan): void => {
  const padawans = loadPadawans();
  const index = padawans.findIndex(p => p.id === padawan.id);
  
  if (index !== -1) {
    padawans[index] = padawan;
    savePadawans(padawans);
  }
};

export const deletePadawan = (id: string): void => {
  const padawans = loadPadawans();
  savePadawans(padawans.filter(p => p.id !== id));
};