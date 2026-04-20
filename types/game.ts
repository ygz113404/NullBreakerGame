export interface CityData {
  cityHealth: number;
  gridStatus: number;
  civilianCasualtyCount: number;
}

export interface SiblingData {
  heartRate: number; // BPM (Kalp Atışı)
  neuroStress: number; // Yüzde (%) cinsinden Sinirsel Stres
  stabilityIndex: number; // Yüzde (%) cinsinden Stabilite
}

export interface ProjectileData {
  id: string;
  startX: number; // Yüzde (%) cinsinden X eksenindeki konumu
  speed: number; // Düşüş hızı / süresi (saniye)
  damage: number; // Merminin vereceği hasar
}

export type Language = 'en' | 'tr';

export type GameStateStatus = 'MENU' | 'INTRO' | 'IDLE' | 'FIGHTING' | 'DIALOGUE' | 'GAME_OVER';

export interface GameState {
  // State Verileri
  status: GameStateStatus;
  language: Language;
  city: CityData;
  sibling: SiblingData;

  // State Eylemleri (Actions)
  setGameStatus: (status: GameStateStatus) => void;
  setLanguage: (lang: Language) => void;
  damageCity: (healthDamage: number, casualties: number) => void;
  healSibling: (stabilityIncrease: number, stressDecrease: number) => void;
  updateSiblingHeartRate: (bpm: number) => void;
  updateGridStatus: (status: number) => void;
  resetGame: () => void;
}