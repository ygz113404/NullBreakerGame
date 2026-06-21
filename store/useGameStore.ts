import { create } from 'zustand';
import { BOSS_CONFIGS } from '../game/constants/combat';
import {
  BossType,
  CombatEvent,
  GameState,
  MoralCommand,
  NumericStateAction,
  RadioEvent,
  RunStats,
} from '../types/game';

const initialCityState = {
  cityHealth: 100,
  gridStatus: 100,
  civilianCasualtyCount: 0,
};

const initialSiblingState = {
  heartRate: 140,
  neuroStress: 90,
  stabilityIndex: 10,
};

const initialRunStats: RunStats = {
  correctWords: 0,
  trapHits: 0,
  bossHits: 0,
  empUses: 0,
  puzzleFailures: 0,
  correctKeystrokes: 0,
  totalKeystrokes: 0,
  currentCombo: 0,
  maxCombo: 0,
  combatSeconds: 0,
  civiliansSaved: 0,
};

const PLAYER_MAX_HEALTH = 1000;

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const resolveNumericAction = (action: NumericStateAction, current: number) =>
  typeof action === 'function' ? action(current) : action;

const combatStateFor = (boss: BossType) => ({
  currentBoss: boss,
  bossHealth: BOSS_CONFIGS[boss].maxHealth,
  bossMaxHealth: BOSS_CONFIGS[boss].maxHealth,
  playerHealth: PLAYER_MAX_HEALTH,
  playerMaxHealth: PLAYER_MAX_HEALTH,
});

export const useGameStore = create<GameState>()((set) => ({
  scene: 'MENU',
  language: 'tr',
  city: { ...initialCityState },
  sibling: { ...initialSiblingState },
  ...combatStateFor('FIREWALL'),
  runStats: { ...initialRunStats },
  moralDecisions: [],
  radioEvents: [],
  ending: null,

  setLanguage: (language) => set({ language }),

  startGame: () => set((state) => ({
    scene: 'INTRO',
    city: { ...initialCityState },
    sibling: { ...initialSiblingState },
    ...combatStateFor('FIREWALL'),
    runStats: { ...initialRunStats },
    moralDecisions: [],
    radioEvents: [],
    ending: null,
    language: state.language,
  })),

  completeIntro: () => set({ scene: 'PRE_FIREWALL_STORY' }),

  completeStory: () => set((state) => {
    switch (state.scene) {
      case 'PRE_FIREWALL_STORY':
        return { scene: 'FIREWALL_PUZZLE' };
      case 'EXPLORATION_1':
        return { scene: 'ANTIVIRUS_COMBAT', ...combatStateFor('ANTIVIRUS') };
      case 'EXPLORATION_2':
        return { scene: 'CORE_AI_COMBAT', ...combatStateFor('CORE_AI') };
      case 'BREAKING_POINT':
        return { scene: 'FINAL_BOSS_COMBAT', ...combatStateFor('FINAL_BOSS') };
      default:
        return {};
    }
  }),

  completePuzzle: (failedAttempts) => set((state) => ({
    scene: 'FIREWALL_COMBAT',
    ...combatStateFor('FIREWALL'),
    runStats: {
      ...state.runStats,
      puzzleFailures: state.runStats.puzzleFailures + failedAttempts,
    },
  })),

  setBossHealth: (value) => set((state) => ({
    bossHealth: clamp(resolveNumericAction(value, state.bossHealth), 0, state.bossMaxHealth),
  })),

  setPlayerHealth: (value) => set((state) => ({
    playerHealth: clamp(resolveNumericAction(value, state.playerHealth), 0, state.playerMaxHealth),
  })),

  recordCombatEvent: (event: CombatEvent, magnitude = 0) => set((state) => {
    const city = { ...state.city };
    const sibling = { ...state.sibling };
    const runStats = { ...state.runStats };

    switch (event) {
      case 'SUCCESS':
        city.cityHealth = clamp(city.cityHealth - Math.max(0.2, magnitude / 600));
        city.gridStatus = clamp(city.gridStatus - Math.max(0.1, magnitude / 1200));
        city.civilianCasualtyCount += Math.round(magnitude * 15);
        runStats.currentCombo += 1;
        runStats.maxCombo = Math.max(runStats.maxCombo, runStats.currentCombo);
        const comboBonus = runStats.currentCombo % 5 === 0 ? 4 : 0;
        sibling.stabilityIndex = clamp(sibling.stabilityIndex + 1.5 + comboBonus);
        sibling.neuroStress = clamp(sibling.neuroStress - 1 - (comboBonus > 0 ? 3 : 0));
        sibling.heartRate = clamp(sibling.heartRate - 1, 65, 220);
        runStats.correctWords += 1;
        break;
      case 'TRAP':
        sibling.neuroStress = clamp(sibling.neuroStress + 4);
        sibling.heartRate = clamp(sibling.heartRate + 4, 65, 220);
        runStats.trapHits += 1;
        runStats.currentCombo = 0;
        break;
      case 'BOSS_HIT':
        city.cityHealth = clamp(city.cityHealth - 0.5);
        city.gridStatus = clamp(city.gridStatus - 1);
        city.civilianCasualtyCount += Math.round(magnitude * 10);
        sibling.neuroStress = clamp(sibling.neuroStress + 2);
        sibling.heartRate = clamp(sibling.heartRate + 2, 65, 220);
        runStats.bossHits += 1;
        runStats.currentCombo = 0;
        break;
      case 'EMP':
        city.cityHealth = clamp(city.cityHealth - 5);
        city.gridStatus = clamp(city.gridStatus - 8);
        city.civilianCasualtyCount += 40000;
        sibling.stabilityIndex = clamp(sibling.stabilityIndex + 4);
        sibling.neuroStress = clamp(sibling.neuroStress - 3);
        sibling.heartRate = clamp(sibling.heartRate + 8, 65, 220);
        runStats.empUses += 1;
        runStats.currentCombo = 0;
        break;
    }

    return { city, sibling, runStats };
  }),

  recordKeystroke: (correct) => set((state) => ({
    runStats: {
      ...state.runStats,
      totalKeystrokes: state.runStats.totalKeystrokes + 1,
      correctKeystrokes: state.runStats.correctKeystrokes + (correct ? 1 : 0),
    },
  })),

  tickCombatSecond: () => set((state) => ({
    runStats: {
      ...state.runStats,
      combatSeconds: state.runStats.combatSeconds + 1,
    },
  })),

  resolveMoralDecision: (command: MoralCommand, threshold) => set((state) => {
    const city = { ...state.city };
    const sibling = { ...state.sibling };
    const runStats = { ...state.runStats };
    let bossHealth = state.bossHealth;
    let radioEvent: RadioEvent;

    switch (command) {
      case 'REROUTE_TO_CATALYST':
        city.cityHealth = clamp(city.cityHealth - 6);
        city.gridStatus = clamp(city.gridStatus - 9);
        city.civilianCasualtyCount += 30000;
        sibling.stabilityIndex = clamp(sibling.stabilityIndex + 14);
        sibling.neuroStress = clamp(sibling.neuroStress - 12);
        sibling.heartRate = clamp(sibling.heartRate - 10, 65, 220);
        radioEvent = 'SECTOR_DARK';
        break;
      case 'EVACUATE_SECTOR':
        city.cityHealth = clamp(city.cityHealth + 2);
        city.gridStatus = clamp(city.gridStatus - 1);
        runStats.civiliansSaved += 75000;
        sibling.neuroStress = clamp(sibling.neuroStress + 2);
        bossHealth = clamp(bossHealth + state.bossMaxHealth * 0.12, 0, state.bossMaxHealth);
        radioEvent = 'SECTOR_EVACUATED';
        break;
      case 'DRAIN_LIFE_SUPPORT':
        city.cityHealth = clamp(city.cityHealth - 9);
        city.gridStatus = clamp(city.gridStatus - 7);
        city.civilianCasualtyCount += 90000;
        sibling.stabilityIndex = clamp(sibling.stabilityIndex + 6);
        sibling.neuroStress = clamp(sibling.neuroStress - 4);
        bossHealth = clamp(bossHealth - state.bossMaxHealth * 0.22, 0, state.bossMaxHealth);
        radioEvent = 'LIFE_SUPPORT_DRAINED';
        break;
      case 'ABORT_EXTRACTION':
        city.cityHealth = clamp(city.cityHealth + 4);
        city.gridStatus = clamp(city.gridStatus + 6);
        sibling.stabilityIndex = clamp(sibling.stabilityIndex - 10);
        sibling.neuroStress = clamp(sibling.neuroStress + 14);
        sibling.heartRate = clamp(sibling.heartRate + 10, 65, 220);
        bossHealth = clamp(bossHealth + state.bossMaxHealth * 0.05, 0, state.bossMaxHealth);
        radioEvent = 'EXTRACTION_ABORTED';
        break;
    }

    return {
      city,
      sibling,
      runStats,
      bossHealth,
      radioEvents: [...state.radioEvents, radioEvent].slice(-8),
      moralDecisions: [...state.moralDecisions, {
        command,
        boss: state.currentBoss,
        threshold,
        cityHealthAfter: city.cityHealth,
        siblingStabilityAfter: sibling.stabilityIndex,
        casualtiesAfter: city.civilianCasualtyCount,
      }],
    };
  }),

  defeatCurrentBoss: () => set((state) => {
    const city = { ...state.city };
    const sibling = { ...state.sibling };
    const consequences: Record<BossType, { health: number; grid: number; casualties: number }> = {
      FIREWALL: { health: 3, grid: 4, casualties: 25000 },
      ANTIVIRUS: { health: 5, grid: 6, casualties: 75000 },
      CORE_AI: { health: 8, grid: 10, casualties: 175000 },
      FINAL_BOSS: { health: 0, grid: 0, casualties: 0 },
    };
    const impact = consequences[state.currentBoss];

    city.cityHealth = clamp(city.cityHealth - impact.health);
    city.gridStatus = clamp(city.gridStatus - impact.grid);
    city.civilianCasualtyCount += impact.casualties;
    sibling.stabilityIndex = clamp(sibling.stabilityIndex + 5);
    sibling.neuroStress = clamp(sibling.neuroStress - 5);
    sibling.heartRate = clamp(sibling.heartRate - 5, 65, 220);

    const nextScene = {
      FIREWALL: 'EXPLORATION_1',
      ANTIVIRUS: 'EXPLORATION_2',
      CORE_AI: 'BREAKING_POINT',
      FINAL_BOSS: 'ENDING_CHOICE',
    } as const;

    return { city, sibling, scene: nextScene[state.currentBoss] };
  }),

  selectEnding: (ending) => set((state) => {
    if (ending === 'B_SACRIFICE') {
      return {
        ending,
        scene: 'ENDING',
        city: {
          ...state.city,
          cityHealth: Math.max(60, state.city.cityHealth),
          gridStatus: Math.max(70, state.city.gridStatus),
        },
      };
    }

    if (ending === 'C_NULL') {
      return {
        ending,
        scene: 'ENDING',
        sibling: {
          heartRate: 88,
          neuroStress: 35,
          stabilityIndex: Math.max(70, state.sibling.stabilityIndex),
        },
      };
    }

    return { ending, scene: 'ENDING' };
  }),

  resetGame: () => set((state) => ({
    scene: 'MENU',
    city: { ...initialCityState },
    sibling: { ...initialSiblingState },
    ...combatStateFor('FIREWALL'),
    runStats: { ...initialRunStats },
    moralDecisions: [],
    radioEvents: [],
    ending: null,
    language: state.language,
  })),
}));
