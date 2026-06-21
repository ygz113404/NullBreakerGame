export interface CityData {
  cityHealth: number;
  gridStatus: number;
  civilianCasualtyCount: number;
}

export interface SiblingData {
  heartRate: number;
  neuroStress: number;
  stabilityIndex: number;
}

export type Language = 'en' | 'tr';

export type BossType = 'FIREWALL' | 'ANTIVIRUS' | 'CORE_AI' | 'FINAL_BOSS';

export type GameScene =
  | 'MENU'
  | 'INTRO'
  | 'PRE_FIREWALL_STORY'
  | 'FIREWALL_PUZZLE'
  | 'FIREWALL_COMBAT'
  | 'EXPLORATION_1'
  | 'ANTIVIRUS_COMBAT'
  | 'EXPLORATION_2'
  | 'CORE_AI_COMBAT'
  | 'BREAKING_POINT'
  | 'FINAL_BOSS_COMBAT'
  | 'ENDING_CHOICE'
  | 'ENDING';

export type EndingType = 'A_DARKNESS' | 'B_SACRIFICE' | 'C_NULL';

export type CombatEvent = 'SUCCESS' | 'TRAP' | 'BOSS_HIT' | 'EMP';

export type MoralCommand =
  | 'REROUTE_TO_CATALYST'
  | 'EVACUATE_SECTOR'
  | 'DRAIN_LIFE_SUPPORT'
  | 'ABORT_EXTRACTION';

export type RadioEvent =
  | 'SECTOR_DARK'
  | 'SECTOR_EVACUATED'
  | 'LIFE_SUPPORT_DRAINED'
  | 'EXTRACTION_ABORTED';

export interface MoralDecision {
  command: MoralCommand;
  boss: BossType;
  threshold: number;
  cityHealthAfter: number;
  siblingStabilityAfter: number;
  casualtiesAfter: number;
}

export interface RunStats {
  correctWords: number;
  trapHits: number;
  bossHits: number;
  empUses: number;
  puzzleFailures: number;
  correctKeystrokes: number;
  totalKeystrokes: number;
  currentCombo: number;
  maxCombo: number;
  combatSeconds: number;
  civiliansSaved: number;
}

export type NumericStateAction = number | ((previous: number) => number);

export interface GameState {
  scene: GameScene;
  language: Language;
  city: CityData;
  sibling: SiblingData;
  currentBoss: BossType;
  bossHealth: number;
  bossMaxHealth: number;
  playerHealth: number;
  playerMaxHealth: number;
  runStats: RunStats;
  moralDecisions: MoralDecision[];
  radioEvents: RadioEvent[];
  ending: EndingType | null;

  setLanguage: (language: Language) => void;
  startGame: () => void;
  completeIntro: () => void;
  completeStory: () => void;
  completePuzzle: (failedAttempts: number) => void;
  setBossHealth: (value: NumericStateAction) => void;
  setPlayerHealth: (value: NumericStateAction) => void;
  recordCombatEvent: (event: CombatEvent, magnitude?: number) => void;
  recordKeystroke: (correct: boolean) => void;
  tickCombatSecond: () => void;
  resolveMoralDecision: (command: MoralCommand, threshold: number) => void;
  defeatCurrentBoss: () => void;
  selectEnding: (ending: EndingType) => void;
  resetGame: () => void;
}
