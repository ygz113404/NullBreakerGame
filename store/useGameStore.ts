import { create } from 'zustand';
import { GameState } from '../types/game';

const initialCityState = {
  cityHealth: 100,
  gridStatus: 100,
  civilianCasualtyCount: 0,
};

const initialSiblingState = {
  heartRate: 140, // Kritik başlangıç
  neuroStress: 90, // Yüksek stres
  stabilityIndex: 10, // Düşük stabilite
};

export const useGameStore = create<GameState>()((set) => ({
  status: 'MENU',
  language: 'tr',
  city: initialCityState,
  sibling: initialSiblingState,
  currentBoss: 'FIREWALL',

  setGameStatus: (status) => set({ status }),

  setLanguage: (language) => set({ language }),

  damageCity: (healthDamage, casualties) => set((state) => ({
    city: {
      ...state.city,
      cityHealth: Math.max(0, state.city.cityHealth - healthDamage),
      civilianCasualtyCount: state.city.civilianCasualtyCount + casualties,
    }
  })),

  healSibling: (stabilityIncrease, stressDecrease) => set((state) => ({
    sibling: {
      ...state.sibling,
      stabilityIndex: Math.min(100, state.sibling.stabilityIndex + stabilityIncrease),
      neuroStress: Math.max(0, state.sibling.neuroStress - stressDecrease),
    }
  })),

  updateSiblingHeartRate: (bpm) => set((state) => ({
    sibling: { ...state.sibling, heartRate: bpm }
  })),

  updateGridStatus: (gridStatus) => set((state) => ({
    city: { ...state.city, gridStatus }
  })),

  setCurrentBoss: (boss) => set({ currentBoss: boss }),

  resetGame: () => set({
    status: 'MENU',
    city: initialCityState,
    sibling: initialSiblingState,
    currentBoss: 'FIREWALL'
  }),
}));