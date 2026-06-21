"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getDialogues, DialogueLine } from '../../game/constants/dialogues';
import { BOSS_CONFIGS, WORD_POOLS, WordNode } from '../../game/constants/combat';
import { useGameAudio } from '../../hooks/useGameAudio';
import { useGameStore } from '../../store/useGameStore';
import { BossType, GameState, MoralCommand, NumericStateAction, RadioEvent } from '../../types/game';

interface FightBoxProps {
  currentBoss: BossType;
  bossHealth: number;
  setBossHealth: (value: NumericStateAction) => void;
  playerHealth: number;
  setPlayerHealth: (value: NumericStateAction) => void;
  dialogues: DialogueLine[];
  onDialogueEnd?: () => void;
  onBossDefeat?: () => void;
  onRestart?: () => void;
}

const shuffleWords = (words: WordNode[]) => {
  const shuffled = [...words];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const hasPrefixConflict = (first: string, second: string) =>
  first.startsWith(second) || second.startsWith(first);

const selectCompatibleWords = (pool: WordNode[], count: number) => {
  const selected: WordNode[] = [];
  for (const candidate of shuffleWords(pool)) {
    if (selected.every((word) => !hasPrefixConflict(word.word, candidate.word))) {
      selected.push(candidate);
    }
    if (selected.length === count) break;
  }
  return selected;
};

const MORAL_CHOICES: Record<number, [MoralCommand, MoralCommand]> = {
  70: ['REROUTE_TO_CATALYST', 'EVACUATE_SECTOR'],
  40: ['DRAIN_LIFE_SUPPORT', 'ABORT_EXTRACTION'],
  15: ['REROUTE_TO_CATALYST', 'DRAIN_LIFE_SUPPORT'],
};

const RADIO_EVENT_BY_COMMAND: Record<MoralCommand, RadioEvent> = {
  REROUTE_TO_CATALYST: 'SECTOR_DARK',
  EVACUATE_SECTOR: 'SECTOR_EVACUATED',
  DRAIN_LIFE_SUPPORT: 'LIFE_SUPPORT_DRAINED',
  ABORT_EXTRACTION: 'EXTRACTION_ABORTED',
};

export function FightBox({ currentBoss, bossHealth, setBossHealth, playerHealth, setPlayerHealth, dialogues, onDialogueEnd, onBossDefeat, onRestart }: FightBoxProps) {
  const language = useGameStore((state: GameState) => state.language);
  const recordCombatEvent = useGameStore((state: GameState) => state.recordCombatEvent);
  const recordKeystroke = useGameStore((state: GameState) => state.recordKeystroke);
  const tickCombatSecond = useGameStore((state: GameState) => state.tickCombatSecond);
  const resolveMoralDecision = useGameStore((state: GameState) => state.resolveMoralDecision);
  const sibling = useGameStore((state: GameState) => state.sibling);
  const runStats = useGameStore((state: GameState) => state.runStats);
  const DIALOGUES = useMemo(() => getDialogues(language), [language]);
  // Oyun Evresi: "dialogue" (Boss Konuşması) -> "combat" (Savaş)
  const [phase, setPhase] = useState<"dialogue" | "combat">("dialogue");
  const [dialogueLine, setDialogueLine] = useState("");
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const currentSpeaker = phase === "dialogue" && dialogueIndex < dialogues.length 
    ? dialogues[dialogueIndex].speaker 
    : "";

  // Savaş Durumları
  const [activeWords, setActiveWords] = useState<WordNode[]>([]);
  const [playerTarget, setPlayerTarget] = useState<string | null>(null);
  const [playerTyped, setPlayerTyped] = useState("");
  const [bossTarget, setBossTarget] = useState<string | null>(null);
  const [bossTyped, setBossTyped] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [moralThreshold, setMoralThreshold] = useState<number | null>(null);
  const [moralTyped, setMoralTyped] = useState("");
  const triggeredThresholdsRef = useRef(new Set<number>());
  const [reactionMessage, setReactionMessage] = useState<string | null>(null);
  const [radioMessage, setRadioMessage] = useState<DialogueLine | null>(null);
  const [mechanicMessage, setMechanicMessage] = useState<string | null>(null);
  const [antivirusNoise, setAntivirusNoise] = useState(false);
  const [screenSplit, setScreenSplit] = useState(false);
  const [impactShake, setImpactShake] = useState(false);
  
  const [empUsed, setEmpUsed] = useState(false); // Savaş başına 1 kullanım sınırı için eklendi
  // Kardeş Yardım Çağrısı
  const [siblingPlea, setSiblingPlea] = useState<string | null>(null);
  const pleaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const empTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const radioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const impactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastReactionRef = useRef<string | null>(null);

  const combatFrozen = isPaused || moralThreshold !== null;
  const { playSuccess, playDamage, playEmp, playDecision } = useGameAudio(
    sibling.heartRate,
    phase === 'combat' && !combatFrozen && bossHealth > 0 && playerHealth > 0,
  );

  const currentWordPool = WORD_POOLS[currentBoss];

  // Yeni kelime seçici
  const pickNewWords = useCallback(() => {
    setActiveWords(selectCompatibleWords(currentWordPool, 3));
    setPlayerTarget(null);
    setPlayerTyped("");
    setBossTarget(null);
    setBossTyped("");
  }, [currentWordPool]);

  const showReaction = useCallback((message: string) => {
    setReactionMessage(message);
    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    reactionTimeoutRef.current = setTimeout(() => setReactionMessage(null), 3600);
  }, []);

  const showRadio = useCallback((message: DialogueLine) => {
    setRadioMessage(message);
    if (radioTimeoutRef.current) clearTimeout(radioTimeoutRef.current);
    radioTimeoutRef.current = setTimeout(() => setRadioMessage(null), 5200);
  }, []);

  const triggerImpact = useCallback(() => {
    setImpactShake(true);
    if (impactTimeoutRef.current) clearTimeout(impactTimeoutRef.current);
    impactTimeoutRef.current = setTimeout(() => setImpactShake(false), 420);
  }, []);

  const chooseRandom = useCallback((messages: string[]) => {
    const alternatives = messages.filter((message) => message !== lastReactionRef.current);
    const pool = alternatives.length > 0 ? alternatives : messages;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    lastReactionRef.current = selected;
    return selected;
  }, []);

  // 1. Evre: Boss Diyalog Animasyonu
  useEffect(() => {
    if (phase !== "dialogue") return;

    if (dialogueIndex >= dialogues.length) {
      const timer = setTimeout(() => {
        setPhase("combat");
        pickNewWords();
        if (onDialogueEnd) onDialogueEnd();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const fullText = dialogues[dialogueIndex]?.text || "";
    let currentLength = 0;

    let advanceTimer: ReturnType<typeof setTimeout> | undefined;
    const typingInterval = setInterval(() => {
      currentLength++;
      setDialogueLine(fullText.slice(0, currentLength));
      if (currentLength >= fullText.length) {
        clearInterval(typingInterval);
        advanceTimer = setTimeout(() => {
          setDialogueLine("");
          setDialogueIndex((prev) => prev + 1);
        }, 2000);
      }
    }, 40);

    return () => {
      clearInterval(typingInterval);
      if (advanceTimer) clearTimeout(advanceTimer);
    };
  }, [phase, dialogueIndex, pickNewWords, dialogues, onDialogueEnd]);

  useEffect(() => {
    if (phase !== 'combat') return;

    const handlePauseKey = (event: KeyboardEvent) => {
      if (event.key === 'F2') {
        event.preventDefault();
        setIsPaused((paused) => !paused);
      }
    };
    const pauseForVisibility = () => {
      if (document.hidden) setIsPaused(true);
    };
    const pauseForBlur = () => setIsPaused(true);

    window.addEventListener('keydown', handlePauseKey);
    document.addEventListener('visibilitychange', pauseForVisibility);
    window.addEventListener('blur', pauseForBlur);
    return () => {
      window.removeEventListener('keydown', handlePauseKey);
      document.removeEventListener('visibilitychange', pauseForVisibility);
      window.removeEventListener('blur', pauseForBlur);
    };
  }, [phase]);

  const completeMoralChoice = useCallback((command: MoralCommand) => {
    if (moralThreshold === null) return;
    resolveMoralDecision(command, moralThreshold);
    showReaction(chooseRandom(DIALOGUES.sibling_reactions.moral[command]));
    showRadio(DIALOGUES.civilian_radio[RADIO_EVENT_BY_COMMAND[command]]);
    playDecision();
    pickNewWords();
    setMoralTyped("");
    setMoralThreshold(null);
  }, [moralThreshold, resolveMoralDecision, showReaction, chooseRandom, DIALOGUES, showRadio, playDecision, pickNewWords]);

  useEffect(() => {
    if (phase !== 'combat' || moralThreshold !== null || bossHealth <= 0 || playerHealth <= 0) return;
    const healthPercent = (bossHealth / BOSS_CONFIGS[currentBoss].maxHealth) * 100;
    const nextThreshold = [70, 40, 15].find((threshold) =>
      healthPercent <= threshold && !triggeredThresholdsRef.current.has(threshold)
    );
    if (!nextThreshold) return;

    const timer = setTimeout(() => {
      triggeredThresholdsRef.current.add(nextThreshold);
      setPlayerTarget(null);
      setPlayerTyped("");
      setBossTarget(null);
      setBossTyped("");
      setMoralTyped("");
      setMoralThreshold(nextThreshold);
      playDecision();
    }, 0);
    return () => clearTimeout(timer);
  }, [phase, moralThreshold, bossHealth, playerHealth, currentBoss, playDecision]);

  useEffect(() => {
    if (phase !== 'combat' || isPaused || moralThreshold === null) return;
    const choices = MORAL_CHOICES[moralThreshold];

    const handleMoralInput = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Backspace') {
        event.preventDefault();
        setMoralTyped((current) => current.slice(0, -1));
        return;
      }
      if (event.key.length !== 1 || !/[a-zA-Z0-9_]/.test(event.key)) return;

      const nextValue = moralTyped + event.key.toUpperCase();
      const candidates = choices.filter((choice) => choice.startsWith(nextValue));
      recordKeystroke(candidates.length > 0);
      if (candidates.length === 0) return;

      setMoralTyped(nextValue);
      const completed = candidates.find((choice) => choice === nextValue);
      if (completed) completeMoralChoice(completed);
    };

    window.addEventListener('keydown', handleMoralInput);
    return () => window.removeEventListener('keydown', handleMoralInput);
  }, [phase, isPaused, moralThreshold, moralTyped, recordKeystroke, completeMoralChoice]);

  useEffect(() => {
    if (phase !== 'combat' || combatFrozen || bossHealth <= 0 || playerHealth <= 0) return;
    const timer = setInterval(tickCombatSecond, 1000);
    return () => clearInterval(timer);
  }, [phase, combatFrozen, bossHealth, playerHealth, tickCombatSecond]);

  // Savaş sırasında kardeşin yardım çağrılarını göster
  useEffect(() => {
    if (phase !== "combat" || combatFrozen || bossHealth <= 0 || playerHealth <= 0) return;

    const pleaInterval = setInterval(() => {
      const randomPlea = DIALOGUES.sibling_pleas[Math.floor(Math.random() * DIALOGUES.sibling_pleas.length)];
      setSiblingPlea(randomPlea);
      
      if (pleaTimeoutRef.current) clearTimeout(pleaTimeoutRef.current);
      pleaTimeoutRef.current = setTimeout(() => {
        setSiblingPlea(null);
      }, 3000); // 3 saniye sonra kaybol

    }, 12000); // 12 saniyede bir

    return () => {
      clearInterval(pleaInterval);
      if (pleaTimeoutRef.current) clearTimeout(pleaTimeoutRef.current);
    };
  }, [phase, combatFrozen, bossHealth, playerHealth, DIALOGUES]);

  // Boss Yenildiğinde Geçiş İçin
  useEffect(() => {
    if (bossHealth <= 0 && onBossDefeat) {
      const timer = setTimeout(() => {
        onBossDefeat();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bossHealth, onBossDefeat]);

  // 2. Boss AI: Hedef Seçme
  const activeWordsRef = useRef(activeWords);
  useEffect(() => {
    activeWordsRef.current = activeWords;
  }, [activeWords]);

  useEffect(() => {
    if (phase !== "combat" || combatFrozen || bossHealth <= 0 || playerHealth <= 0) return;
    
    if (!bossTarget && activeWordsRef.current.length > 0) {
      const timer = setTimeout(() => {
        // Boss AI: Tuzaklara (trap) veya Şifreli (encrypted) düğümlere saldırmaz.
        const words = activeWordsRef.current.filter(w => w.type !== 'trap' && w.type !== 'encrypted');
        if (words.length > 0) {
           const randomWord = words[Math.floor(Math.random() * words.length)].word;
           setBossTarget(randomWord);
           setBossTyped("");
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [phase, combatFrozen, bossTarget, bossHealth, playerHealth]);

  // 3. Boss AI: Yazma İşlemi
  useEffect(() => {
    if (phase !== "combat" || combatFrozen || bossHealth <= 0 || playerHealth <= 0 || !bossTarget) return;

    const typingSpeed = BOSS_CONFIGS[currentBoss].typingSpeed;

    const bossInterval = setInterval(() => {
      setBossTyped((prev) => {
        if (prev.length < bossTarget.length) {
          return prev + bossTarget[prev.length];
        }
        return prev;
      });
    }, typingSpeed);

    return () => clearInterval(bossInterval);
  }, [phase, combatFrozen, bossTarget, bossHealth, playerHealth, currentBoss]);

  useEffect(() => {
    if (phase !== 'combat' || combatFrozen || bossHealth <= 0 || playerHealth <= 0) return;
    let recoveryTimer: ReturnType<typeof setTimeout> | undefined;
    let messageTimer: ReturnType<typeof setTimeout> | undefined;

    const fireMechanic = () => {
      const labels = language === 'tr' ? {
        FIREWALL: 'PAKET TEMİZLENDİ — HEDEFLER YENİLENDİ',
        ANTIVIRUS: 'İMZA GÜRÜLTÜSÜ — SAHTE KARAKTERLER',
        CORE_AI: 'HAFIZA TERSİNE ÇEVRİLDİ',
        FINAL_BOSS: 'ARAYÜZ BÜTÜNLÜĞÜ PARÇALANIYOR',
      } : {
        FIREWALL: 'PACKET PURGED — TARGETS REFRESHED',
        ANTIVIRUS: 'SIGNATURE NOISE — FALSE CHARACTERS',
        CORE_AI: 'MEMORY ORDER REVERSED',
        FINAL_BOSS: 'INTERFACE INTEGRITY SPLITTING',
      };
      setMechanicMessage(labels[currentBoss]);
      if (messageTimer) clearTimeout(messageTimer);
      messageTimer = setTimeout(() => setMechanicMessage(null), 2400);

      if (currentBoss === 'FIREWALL') {
        pickNewWords();
      } else if (currentBoss === 'ANTIVIRUS') {
        setAntivirusNoise(true);
        recoveryTimer = setTimeout(() => setAntivirusNoise(false), 2600);
      } else if (currentBoss === 'CORE_AI') {
        setActiveWords((words) => words.map((word) => ({
          ...word,
          word: [...word.word].reverse().join(''),
        })));
        setPlayerTarget(null);
        setPlayerTyped("");
        setBossTarget(null);
        setBossTyped("");
      } else {
        setScreenSplit(true);
        recoveryTimer = setTimeout(() => setScreenSplit(false), 2300);
      }
    };

    const interval = setInterval(fireMechanic, currentBoss === 'FINAL_BOSS' ? 7000 : 8500);
    return () => {
      clearInterval(interval);
      if (recoveryTimer) clearTimeout(recoveryTimer);
      if (messageTimer) clearTimeout(messageTimer);
    };
  }, [phase, combatFrozen, bossHealth, playerHealth, currentBoss, language, pickNewWords]);

  // 3.5 EMP (Aşırı Yükleme) Mekaniği
  const [empActive, setEmpActive] = useState(false);
  const triggerEMP = useCallback(() => {
    if (empUsed || empActive || combatFrozen || phase !== "combat" || playerHealth <= 200 || bossHealth <= 0) return;
    setEmpActive(true);
    setEmpUsed(true);
    setPlayerHealth(h => Math.max(1, h - 200));
    setBossHealth(h => Math.max(0, h - 300));
    recordCombatEvent('EMP', 300);
    playEmp();
    triggerImpact();
    showReaction(chooseRandom(DIALOGUES.sibling_reactions.emp));
    pickNewWords();
    if (empTimeoutRef.current) clearTimeout(empTimeoutRef.current);
    empTimeoutRef.current = setTimeout(() => setEmpActive(false), 500);
  }, [empUsed, empActive, combatFrozen, phase, playerHealth, bossHealth, pickNewWords, recordCombatEvent, setPlayerHealth, setBossHealth, playEmp, triggerImpact, showReaction, chooseRandom, DIALOGUES]);

  useEffect(() => () => {
    if (empTimeoutRef.current) clearTimeout(empTimeoutRef.current);
    if (pleaTimeoutRef.current) clearTimeout(pleaTimeoutRef.current);
    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    if (radioTimeoutRef.current) clearTimeout(radioTimeoutRef.current);
    if (impactTimeoutRef.current) clearTimeout(impactTimeoutRef.current);
  }, []);

  // 4. Player Input (Klavye Dinleyici)
  useEffect(() => {
    if (phase !== "combat" || combatFrozen || bossHealth <= 0 || playerHealth <= 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        triggerEMP();
        return;
      }
      if (e.key === "Escape") {
        setPlayerTarget(null);
        setPlayerTyped("");
        return;
      }

      // i, ı, I, İ harflerinin hepsini kabul edip standart İngilizce 'I' harfine çeviriyoruz.
      if (e.key.length === 1 && /[a-zA-Z0-9_ıiIİ]/.test(e.key)) {
        let char = e.key.toUpperCase();
        
        if (e.key === 'ı' || e.key === 'i' || char === 'İ') {
          char = 'I';
        }

        const nextStr = playerTyped + char;
        const candidates = activeWordsRef.current.filter((word) => word.word.startsWith(nextStr));
        recordKeystroke(candidates.length > 0);
        if (candidates.length > 0) {
          setPlayerTarget(candidates.length === 1 ? candidates[0].word : null);
          setPlayerTyped(nextStr);
        }
      } else if (e.key === "Backspace") {
        const newVal = playerTyped.slice(0, -1);
        const candidates = newVal
          ? activeWordsRef.current.filter((word) => word.word.startsWith(newVal))
          : [];
        setPlayerTarget(candidates.length === 1 ? candidates[0].word : null);
        setPlayerTyped(newVal);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, combatFrozen, bossHealth, playerHealth, triggerEMP, playerTyped, recordKeystroke]);

  // 5. Kelime Tamamlanma Kontrolü (Win/Loss)
  const handleWordComplete = useCallback((completedWord: string, winner: 'player' | 'boss') => {
    if (bossHealth <= 0 || playerHealth <= 0) return;
    const wordObj = activeWordsRef.current.find((word) => word.word === completedWord);
    if (!wordObj) return;

    const isEncryptedReveal = winner === 'player' && wordObj.type === 'encrypted' && wordObj.revealWord;

    if (winner === 'player') {
      if (wordObj.type === 'trap') {
        setPlayerHealth(h => Math.max(0, h - wordObj.damage));
        recordCombatEvent('TRAP', wordObj.damage);
        playDamage();
        triggerImpact();
        showReaction(chooseRandom(DIALOGUES.sibling_reactions.trap));
      } else if (isEncryptedReveal) {
        recordCombatEvent('SUCCESS', 0);
        playSuccess();
      } else {
        setBossHealth(h => Math.max(0, h - wordObj.damage));
        recordCombatEvent('SUCCESS', wordObj.damage);
        playSuccess();
      }

      if (wordObj.type !== 'trap' && (runStats.currentCombo + 1) % 5 === 0) {
        showReaction(chooseRandom(DIALOGUES.sibling_reactions.combo));
      }
    } else {
      setPlayerHealth(h => Math.max(0, h - wordObj.damage));
      recordCombatEvent('BOSS_HIT', wordObj.damage);
      playDamage();
      triggerImpact();
      if (Math.random() < 0.45) showReaction(chooseRandom(DIALOGUES.sibling_reactions.bossHit));
    }

    setActiveWords((previousWords) => {
      const index = previousWords.findIndex((word) => word.word === completedWord);
      if (index === -1) return previousWords;

      const nextWords = [...previousWords];
      if (isEncryptedReveal && wordObj.revealWord) {
        nextWords[index] = { word: wordObj.revealWord, damage: wordObj.damage, type: 'normal' };
        return nextWords;
      }

      const otherWords = nextWords.filter((_, wordIndex) => wordIndex !== index);
      const available = shuffleWords(currentWordPool).filter((candidate) =>
        !otherWords.some((word) => word.word === candidate.word) &&
        otherWords.every((word) => !hasPrefixConflict(word.word, candidate.word))
      );
      nextWords[index] = available[0] ?? wordObj;
      return nextWords;
    });

    setPlayerTarget(pt => pt === completedWord ? null : pt);
    setPlayerTyped(pt => pt === completedWord ? "" : pt);
    
    setBossTarget(bt => bt === completedWord ? null : bt);
    setBossTyped(bt => bt === completedWord ? "" : bt);
  }, [bossHealth, playerHealth, setBossHealth, setPlayerHealth, recordCombatEvent, currentWordPool, playDamage, triggerImpact, showReaction, chooseRandom, DIALOGUES, playSuccess, runStats.currentCombo]);

  useEffect(() => {
    if (phase !== "combat" || combatFrozen || bossHealth <= 0 || playerHealth <= 0) return;

    if (playerTarget && playerTyped === playerTarget) {
      const timer = setTimeout(() => handleWordComplete(playerTarget, 'player'), 0);
      return () => clearTimeout(timer);
    } else if (bossTarget && bossTyped === bossTarget) {
      const timer = setTimeout(() => handleWordComplete(bossTarget, 'boss'), 0);
      return () => clearTimeout(timer);
    }
  }, [playerTyped, bossTyped, playerTarget, bossTarget, handleWordComplete, phase, combatFrozen, bossHealth, playerHealth]);

  const accuracy = runStats.totalKeystrokes > 0
    ? Math.round((runStats.correctKeystrokes / runStats.totalKeystrokes) * 100)
    : 100;
  const wpm = runStats.combatSeconds > 0
    ? Math.round((runStats.correctKeystrokes / 5) / (runStats.combatSeconds / 60))
    : 0;
  const activeMoralChoices = moralThreshold === null ? [] : MORAL_CHOICES[moralThreshold];
  const moralDescriptions: Record<MoralCommand, string> = language === 'tr' ? {
    REROUTE_TO_CATALYST: 'Kardeşi güçlendir; bir şehir sektörünü karanlığa göm.',
    EVACUATE_SECTOR: '75.000 sivili tahliye et; boss savunmasını yenilesin.',
    DRAIN_LIFE_SUPPORT: 'Boss canının %22’sini sil; yaşam desteğini kapat.',
    ABORT_EXTRACTION: 'Şebekeyi toparla; kardeşin stabilitesini feda et.',
  } : {
    REROUTE_TO_CATALYST: 'Strengthen your sibling; condemn a city sector to darkness.',
    EVACUATE_SECTOR: 'Evacuate 75,000 civilians; let the boss restore its defenses.',
    DRAIN_LIFE_SUPPORT: 'Erase 22% boss health; shut down life support.',
    ABORT_EXTRACTION: "Stabilize the grid; sacrifice your sibling's stability.",
  };

  return (
    <div className={`w-full h-full border border-green-900 rounded p-4 relative overflow-hidden flex flex-col items-center justify-center ${impactShake ? 'animate-[shake_0.12s_ease-in-out_3]' : ''} ${empActive ? 'bg-white shadow-[0_0_100px_rgba(255,255,255,1)] transition-all duration-75' : 'bg-black shadow-[0_0_20px_rgba(0,255,0,0.1)] transition-all duration-1000'}`}>
      <div className="absolute inset-0 pointer-events-none bg-size-[100%_4px] bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] opacity-20"></div>

      {phase === 'combat' && (
        <div className="absolute top-3 left-3 z-20 flex gap-3 text-[10px] sm:text-xs font-mono text-cyan-500">
          <span>WPM {wpm}</span>
          <span>ACC {accuracy}%</span>
          <span className={runStats.currentCombo >= 5 ? 'text-yellow-400 animate-pulse' : 'text-gray-500'}>COMBO x{runStats.currentCombo}</span>
        </div>
      )}

      {mechanicMessage && (
        <p className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-xs text-red-400 bg-black/90 border border-red-900 px-3 py-1 animate-pulse">
          {mechanicMessage}
        </p>
      )}

      {screenSplit && (
        <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
          <div className="absolute left-0 top-0 h-full w-1/2 translate-x-2 border-r-2 border-red-700 bg-red-950/10" />
          <div className="absolute right-0 top-0 h-full w-1/2 -translate-x-2 border-l-2 border-cyan-700 bg-cyan-950/10" />
        </div>
      )}

      {moralThreshold !== null && !isPaused && (
        <div className="absolute inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-5" role="dialog" aria-modal="true" aria-labelledby="moral-decision-title">
          <p className="text-xs text-red-500 tracking-[0.35em] mb-2">{language === 'tr' ? 'GERİ ALINAMAZ KOMUT' : 'IRREVERSIBLE COMMAND'}</p>
          <h3 id="moral-decision-title" className="text-xl sm:text-2xl text-white font-bold mb-2 text-center">
            {language === 'tr' ? `BOSS %${moralThreshold} — KİMİ KURTARACAKSIN?` : `BOSS ${moralThreshold}% — WHO WILL YOU SAVE?`}
          </h3>
          <p className="text-xs text-gray-500 mb-5">{language === 'tr' ? 'Seçtiğin komutu klavyeyle yaz.' : 'Type the command you choose.'}</p>
          <div className="grid gap-3 w-full max-w-xl">
            {activeMoralChoices.map((choice) => {
              const isCandidate = choice.startsWith(moralTyped);
              return (
                <div key={choice} className={`border p-3 ${isCandidate ? 'border-cyan-700 bg-cyan-950/20' : 'border-gray-900 opacity-35'}`}>
                  <p className="font-bold tracking-wider text-sm sm:text-base">
                    {choice.split('').map((char, index) => (
                      <span key={`${choice}-${index}`} className={isCandidate && index < moralTyped.length ? 'text-green-400' : 'text-gray-400'}>{char}</span>
                    ))}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">{moralDescriptions[choice]}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 w-full max-w-xl border-t border-purple-900 pt-2 text-purple-400">
            &gt; {moralTyped}<span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse align-middle" />
          </div>
        </div>
      )}

      {phase === 'combat' && bossHealth > 0 && playerHealth > 0 && (
        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          className="absolute top-3 right-3 z-50 border border-gray-700 px-2 py-1 text-xs text-gray-400 hover:border-cyan-600 hover:text-cyan-400"
        >
          [F2] {isPaused ? (language === 'tr' ? 'DEVAM' : 'RESUME') : (language === 'tr' ? 'DURAKLAT' : 'PAUSE')}
        </button>
      )}

      {isPaused && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center" role="dialog" aria-modal="true" aria-label={language === 'tr' ? 'Oyun duraklatıldı' : 'Game paused'}>
          <p className="text-cyan-400 text-2xl font-bold tracking-widest mb-4">
            {language === 'tr' ? 'SİSTEM DURAKLATILDI' : 'SYSTEM PAUSED'}
          </p>
          <button
            type="button"
            onClick={() => setIsPaused(false)}
            className="border border-cyan-600 px-5 py-2 text-cyan-400 hover:bg-cyan-950"
          >
            &gt; {language === 'tr' ? 'DEVAM ET' : 'RESUME'}
          </button>
        </div>
      )}

      {/* KARDEŞ YARDIM ÇAĞRISI (GLITCH) */}
      {reactionMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-[27%] left-1/2 -translate-x-1/2 z-30 bg-black/90 px-4 py-3 w-[88%] max-w-xl text-center border border-purple-800 pointer-events-none"
        >
          <p className="text-[10px] text-purple-500 tracking-widest mb-2">[{language === 'tr' ? 'KARDEŞ // CANLI SİNYAL' : 'SIBLING // LIVE SIGNAL'}]</p>
          <p className="text-purple-300 font-mono text-sm sm:text-base leading-snug">“{reactionMessage}”</p>
        </motion.div>
      )}

      {siblingPlea && !reactionMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-[27%] left-1/2 -translate-x-1/2 z-20 bg-black/85 px-4 py-3 rounded-lg border border-red-700 pointer-events-none"
        >
          <p className="text-red-500 font-mono text-2xl animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            &gt; {siblingPlea}
          </p>
        </motion.div>
      )}

      {radioMessage && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-14 left-4 z-30 max-w-[75%] border-l-2 border-yellow-700 bg-black/90 px-3 py-2"
        >
          <p className="text-[10px] text-yellow-600 tracking-wider">[{radioMessage.speaker}]</p>
          <p className="text-xs text-yellow-200 mt-1">“{radioMessage.text}”</p>
        </motion.div>
      )}

      {phase === "dialogue" ? (
        <div className={`z-10 flex flex-col items-center max-w-lg min-h-24 ${currentSpeaker.includes('GLITCH') || currentSpeaker.includes('ANI:') || currentSpeaker.includes('MEMORY:') ? 'animate-[shake_0.2s_ease-in-out_infinite] opacity-80' : ''}`}>
           <span className={`font-mono text-sm mb-2 ${currentSpeaker.includes('GLITCH') ? 'text-purple-500 font-bold drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]' : 'text-gray-500'}`}>[{currentSpeaker}]</span>
           <div className={`font-mono text-xl sm:text-2xl text-center drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] ${currentSpeaker === 'NULL BREAKER' ? 'text-green-500' : currentSpeaker.includes('GLITCH') ? 'text-purple-400 font-bold' : currentSpeaker.includes('ANI:') || currentSpeaker.includes('MEMORY:') ? 'text-yellow-500 italic' : 'text-red-500'}`}>
             {dialogueLine}
             <span className={`animate-pulse w-3 h-6 inline-block align-middle ml-2 ${currentSpeaker === 'NULL BREAKER' ? 'bg-green-500' : currentSpeaker.includes('GLITCH') ? 'bg-purple-500' : currentSpeaker.includes('ANI:') || currentSpeaker.includes('MEMORY:') ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
           </div>
        </div>
      ) : bossHealth <= 0 ? (
        <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-green-500 text-3xl font-bold animate-pulse text-center z-10">
          {language === 'tr' ? <>BAĞLANTI KESİLDİ.<br/>BOSS YENİLDİ.</> : <>CONNECTION LOST.<br/>BOSS DEFEATED.</>}
        </motion.h2>
      ) : playerHealth <= 0 ? (
        <div className="flex flex-col items-center z-10">
          <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-red-500 text-3xl font-bold animate-pulse text-center mb-6">
            {language === 'tr' ? <>SİSTEM ÇÖKTÜ.<br/>ÖLDÜN.</> : <>SYSTEM CRASHED.<br/>YOU DIED.</>}
          </motion.h2>
          {onRestart && (
            <button 
              onClick={onRestart}
              className="px-6 py-2 border border-red-500 text-red-500 font-mono hover:bg-red-900 transition-colors tracking-widest animate-pulse"
            >
              &gt; {language === 'tr' ? 'YENİDEN BAŞLAT' : 'RESTART'}
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6 sm:gap-10 items-center font-mono text-xl sm:text-2xl tracking-widest relative w-full mt-4">
          
          {phase === "combat" && bossHealth > 0 && playerHealth > 0 && (
            <div className={`absolute -top-10 sm:-top-16 left-0 text-xs sm:text-sm font-mono z-30 transition-colors ${empUsed ? 'text-red-900 line-through' : 'text-gray-500 animate-pulse'}`}>
              [SPACE] OVERLOAD EMP {empUsed ? '(USED)' : '(Cost: 200 HP)'}
            </div>
          )}
          
          {activeWords.map((wordObj) => {
            const isPlayerTarget = playerTarget === wordObj.word;
            const isPlayerCandidate = !playerTarget && playerTyped.length > 0 && wordObj.word.startsWith(playerTyped);
            const isBossTarget = bossTarget === wordObj.word;
            const isTrap = wordObj.type === 'trap';
            const isEncrypted = wordObj.type === 'encrypted';

            return (
              <div key={wordObj.word} className={`flex flex-col items-center relative w-full group ${currentBoss === 'FINAL_BOSS' || isTrap ? 'animate-[shake_0.5s_ease-in-out_infinite]' : ''}`}>
                <div className="text-red-500 mb-1 flex drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] h-6 justify-center w-full transition-all">
                  {wordObj.word.split('').map((char, idx) => (
                    <span key={`boss-${idx}`} className={isBossTarget && idx < bossTyped.length ? 'opacity-100' : 'opacity-0'}>{char}</span>
                  ))}
                </div>
                
                <div className={`text-gray-600 font-bold relative z-10 flex justify-center w-full items-center gap-3 ${isTrap ? 'text-red-900 line-through' : isEncrypted ? 'text-purple-700' : ''}`}>
                  {isTrap && <span className="text-red-500 text-xs animate-pulse">[TRAP]</span>}
                  {isEncrypted && <span className="text-purple-400 text-xs animate-pulse">[ENCRYPTED]</span>}
                  {antivirusNoise && currentBoss === 'ANTIVIRUS' && <span className="text-red-700 text-xs animate-pulse">#@</span>}
                  
                  <span className="flex transition-colors duration-300">
                    {wordObj.word.split('').map((char, idx) => {
                      const isTyped = (isPlayerTarget || isPlayerCandidate) && idx < playerTyped.length;
                      let charColor = isTyped ? 'opacity-0' : 'opacity-50';
                      if (isTrap) charColor = isTyped ? 'opacity-0' : 'text-red-500 opacity-80';
                      if (isEncrypted) charColor = isTyped ? 'opacity-0' : 'text-purple-400 opacity-80';
                      
                      return (
                        <span key={`target-${idx}`} className={charColor}>{char}</span>
                      );
                    })}
                  </span>
                  {antivirusNoise && currentBoss === 'ANTIVIRUS' && <span className="text-red-700 text-xs animate-pulse">%!</span>}
                  <span className={isTrap ? "text-red-600 text-sm tracking-normal" : "text-yellow-600 text-sm tracking-normal"}>
                    {isTrap ? `[-${wordObj.damage} HP]` : `[-${wordObj.damage}]`}
                  </span>
                </div>

                <div className={`mt-1 flex h-6 justify-center w-full absolute top-7 ${isTrap ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : isEncrypted ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]' : 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]'}`}>
                  {wordObj.word.split('').map((char, idx) => (
                    <span key={`player-${idx}`} className={(isPlayerTarget || isPlayerCandidate) && idx < playerTyped.length ? 'opacity-100' : 'opacity-0'}>{char}</span>
                  ))}
                </div>
              </div>
            );
          })}

        </div>
      )}
      
      <div className="absolute bottom-4 left-4 border-t border-green-900 pt-2 text-sm sm:text-base font-mono w-[calc(100%-2rem)] flex justify-between">
        <div className="text-green-500">
          <span>&gt; {playerTyped}</span>
          <span className="animate-pulse bg-green-500 w-2 sm:w-3 h-4 sm:h-5 inline-block align-middle ml-1"></span>
        </div>
        <div className="text-red-500">
          <span className="text-xs text-gray-500 mr-2">BOSS_AI:</span>
          <span>{bossTyped}</span>
          <span className="animate-pulse bg-red-500 w-2 sm:w-3 h-4 sm:h-5 inline-block align-middle ml-1"></span>
        </div>
      </div>
    </div>
  );
}
