export type JediRank = 'padawan' | 'chevalier' | 'maitre';

export interface ForceAbility {
  id: string;
  name: string;
  learned: boolean;
}

export interface CombatForm {
  id: string;
  name: string;
  category: 'standard' | 'ZK' | 'JK';
  learned: boolean;
}

export interface Padawan {
  id: string;
  nom: string;
  age: number;
  race: string;
  planeteNatale: string;
  genre: string;
  taille: number;
  poids: number;
  couleurYeux: string;
  couleurCheveux: string;
  maitre: string;
  description: string;
  imageUrl: string;
  rang: JediRank;
  userId: string;
  forceAbilities: ForceAbility[];
  combatForms: CombatForm[];
  dateCreation: number;
}

export const defaultPadawan = (): Padawan => ({
  id: crypto.randomUUID(),
  nom: '',
  age: 0,
  race: '',
  planeteNatale: '',
  genre: '',
  taille: 0,
  poids: 0,
  couleurYeux: '',
  couleurCheveux: '',
  maitre: '',
  description: '',
  imageUrl: '',
  rang: 'padawan',
  userId: crypto.randomUUID(), // Simule un ID utilisateur unique
  forceAbilities: initialForceAbilities(),
  combatForms: initialCombatForms(),
  dateCreation: Date.now()
});

export const initialForceAbilities = (): ForceAbility[] => [
  // ... (reste du code inchangé)
];

export const initialCombatForms = (): CombatForm[] => [
  // ... (reste du code inchangé)
];