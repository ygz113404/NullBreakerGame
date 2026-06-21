import { BossType } from '../../types/game';

export interface WordNode {
  word: string;
  damage: number;
  type?: 'normal' | 'trap' | 'encrypted';
  revealWord?: string;
}

export interface BossConfig {
  maxHealth: number;
  typingSpeed: number;
}

export const BOSS_CONFIGS: Record<BossType, BossConfig> = {
  FIREWALL: { maxHealth: 1000, typingSpeed: 350 },
  ANTIVIRUS: { maxHealth: 1150, typingSpeed: 280 },
  CORE_AI: { maxHealth: 1300, typingSpeed: 180 },
  FINAL_BOSS: { maxHealth: 1500, typingSpeed: 120 },
};

export const WORD_POOLS: Record<BossType, WordNode[]> = {
  FIREWALL: [
    { word: 'OVERRIDE_GATE', damage: 150 },
    { word: 'BYPASS_TURRET', damage: 100 },
    { word: 'KILL_PROCESS', damage: 120 },
    { word: 'SYS_CORRUPTION', damage: 150, type: 'trap' },
    { word: 'DECRYPT', damage: 150, type: 'encrypted', revealWord: 'INJECT_PAYLOAD' },
    { word: 'DISABLE_FIREWALL', damage: 180 },
    { word: 'EXTRACT_KEY', damage: 90 },
  ],
  ANTIVIRUS: [
    { word: 'QUARANTINE_BREACH', damage: 100 },
    { word: 'SYS_32_CORRUPT', damage: 130 },
    { word: 'IGNORE_ME', damage: 150, type: 'trap' },
    { word: 'DECRYPT', damage: 180, type: 'encrypted', revealWord: 'PURGE_MALWARE' },
    { word: '0XFA8B_KILL', damage: 150 },
    { word: 'ERASE_SIGNATURE', damage: 120 },
  ],
  CORE_AI: [
    { word: 'MNEMONIC_WIPE', damage: 150 },
    { word: 'OVERLOAD_CORE', damage: 200 },
    { word: 'AI_TRAP_0X', damage: 200, type: 'trap' },
    { word: 'FORMAT_C', damage: 250 },
    { word: 'DECRYPT', damage: 170, type: 'encrypted', revealWord: 'BYPASS_NEURAL_NET' },
    { word: 'AI_LOGIC_FAULT', damage: 180 },
  ],
  FINAL_BOSS: [
    { word: 'SEVER_CONNECTION', damage: 100 },
    { word: 'DONT_LEAVE_ME', damage: 200, type: 'trap' },
    { word: 'LET_ME_GO', damage: 150 },
    { word: 'BREAK_THE_CHAINS', damage: 200 },
    { word: 'DECRYPT', damage: 250, type: 'encrypted', revealWord: 'WAKE_UP' },
    { word: 'NULL_THE_PUPPET', damage: 180 },
  ],
};
