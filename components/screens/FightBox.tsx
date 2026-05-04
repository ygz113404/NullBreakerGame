"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { DIALOGUES, DialogueLine } from '../../game/constants/dialogues';

// Hasar ve Kelime Havuzu
const WORD_POOL = [
  { word: "OVERRIDE_GATE", damage: 150 },
  { word: "BYPASS_TURRET", damage: 100 },
  { word: "KILL_PROCESS", damage: 120 },
  { word: "INJECT_PAYLOAD", damage: 200 },
  { word: "DISABLE_FIREWALL", damage: 180 },
  { word: "REROUTE_POWER", damage: 130 },
  { word: "HACK_MAINFRAME", damage: 250 },
  { word: "DECRYPT_KEY", damage: 90 },
];

interface FightBoxProps {
  bossHealth: number;
  setBossHealth: React.Dispatch<React.SetStateAction<number>>;
  playerHealth: number;
  setPlayerHealth: React.Dispatch<React.SetStateAction<number>>;
  dialogues: DialogueLine[];
  onDialogueEnd?: () => void;
  onBossDefeat?: () => void;
  onRestart?: () => void;
}

export function FightBox({ bossHealth, setBossHealth, playerHealth, setPlayerHealth, dialogues, onDialogueEnd, onBossDefeat, onRestart }: FightBoxProps) {
  // Oyun Evresi: "dialogue" (Boss Konuşması) -> "combat" (Savaş)
  const [phase, setPhase] = useState<"dialogue" | "combat">("dialogue");
  const [dialogueLine, setDialogueLine] = useState("");
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const currentSpeaker = phase === "dialogue" && dialogueIndex < dialogues.length 
    ? dialogues[dialogueIndex].speaker 
    : "";

  // Savaş Durumları
  const [activeWords, setActiveWords] = useState<{word: string, damage: number}[]>([]);
  const [playerTarget, setPlayerTarget] = useState<string | null>(null);
  const [playerTyped, setPlayerTyped] = useState("");
  const [bossTarget, setBossTarget] = useState<string | null>(null);
  const [bossTyped, setBossTyped] = useState("");
  
  // Kardeş Yardım Çağrısı
  const [siblingPlea, setSiblingPlea] = useState<string | null>(null);

  // Yeni kelime seçici
  const pickNewWords = useCallback(() => {
    const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
    setActiveWords(shuffled.slice(0, 3)); // 3 kelime seç
    setPlayerTarget(null);
    setPlayerTyped("");
    setBossTarget(null);
    setBossTyped("");
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
    setDialogueLine("");

    const typingInterval = setInterval(() => {
      currentLength++;
      setDialogueLine(fullText.slice(0, currentLength));
      if (currentLength >= fullText.length) {
        clearInterval(typingInterval);
        setTimeout(() => setDialogueIndex((prev) => prev + 1), 2000);
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, [phase, dialogueIndex, pickNewWords, dialogues, onDialogueEnd]);

  // Savaş sırasında kardeşin yardım çağrılarını göster
  useEffect(() => {
    if (phase !== "combat" || bossHealth <= 0 || playerHealth <= 0) return;

    const pleaInterval = setInterval(() => {
      const randomPlea = DIALOGUES.sibling_pleas[Math.floor(Math.random() * DIALOGUES.sibling_pleas.length)];
      setSiblingPlea(randomPlea);
      
      setTimeout(() => {
        setSiblingPlea(null);
      }, 3000); // 3 saniye sonra kaybol

    }, 12000); // 12 saniyede bir

    return () => clearInterval(pleaInterval);
  }, [phase, bossHealth, playerHealth]);

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
    if (phase !== "combat" || bossHealth <= 0 || playerHealth <= 0) return;
    
    if (!bossTarget && activeWordsRef.current.length > 0) {
      const timer = setTimeout(() => {
        const words = activeWordsRef.current;
        if (words.length > 0) {
           const randomWord = words[Math.floor(Math.random() * words.length)].word;
           setBossTarget(randomWord);
           setBossTyped("");
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [phase, bossTarget, bossHealth, playerHealth]);

  // 3. Boss AI: Yazma İşlemi
  useEffect(() => {
    if (phase !== "combat" || bossHealth <= 0 || playerHealth <= 0 || !bossTarget) return;

    const bossInterval = setInterval(() => {
      setBossTyped((prev) => {
        if (prev.length < bossTarget.length) {
          return prev + bossTarget[prev.length];
        }
        return prev;
      });
    }, 350);

    return () => clearInterval(bossInterval);
  }, [phase, bossTarget, bossHealth, playerHealth]);

  // 4. Player Input (Klavye Dinleyici)
  useEffect(() => {
    if (phase !== "combat" || bossHealth <= 0 || playerHealth <= 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPlayerTarget(null);
        setPlayerTyped("");
        return;
      }

      if (e.key.length === 1 && /[a-zA-Z0-9_]/.test(e.key)) {
        const char = e.key.toUpperCase();
        
        setPlayerTyped((prev) => {
          if (!playerTarget) {
            const match = activeWordsRef.current.find(w => w.word.startsWith(char));
            if (match) {
              setPlayerTarget(match.word);
              return char;
            }
            return prev;
          } else {
            const nextStr = prev + char;
            if (playerTarget.startsWith(nextStr)) {
              return nextStr;
            }
          }
          return prev;
        });
      } else if (e.key === "Backspace") {
        setPlayerTyped((prev) => {
          const newVal = prev.slice(0, -1);
          if (newVal === "") setPlayerTarget(null);
          return newVal;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, playerTarget, bossHealth, playerHealth]);

  // 5. Kelime Tamamlanma Kontrolü (Win/Loss)
  const handleWordComplete = useCallback((completedWord: string, winner: 'player' | 'boss') => {
    if (bossHealth <= 0 || playerHealth <= 0) return;

    setActiveWords(prev => {
      const nextWords = [...prev];
      const idx = nextWords.findIndex(w => w.word === completedWord);
      
      if (idx !== -1) {
        const wordDamage = nextWords[idx].damage;
        if (winner === 'player') {
          setBossHealth(h => Math.max(0, h - wordDamage));
        } else {
          setPlayerHealth(h => Math.max(0, h - wordDamage));
        }

        const available = WORD_POOL.filter(w => !nextWords.some(nw => nw.word === w.word));
        const fallback = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : WORD_POOL[0];
        nextWords[idx] = fallback;
      }
      return nextWords;
    });

    setPlayerTarget(pt => pt === completedWord ? null : pt);
    setPlayerTyped(pt => pt === completedWord ? "" : pt);
    
    setBossTarget(bt => bt === completedWord ? null : bt);
    setBossTyped(bt => bt === completedWord ? "" : bt);
  }, [bossHealth, playerHealth, setBossHealth, setPlayerHealth]);

  useEffect(() => {
    if (phase !== "combat" || bossHealth <= 0 || playerHealth <= 0) return;

    if (playerTarget && playerTyped === playerTarget) {
      const timer = setTimeout(() => handleWordComplete(playerTarget, 'player'), 0);
      return () => clearTimeout(timer);
    } else if (bossTarget && bossTyped === bossTarget) {
      const timer = setTimeout(() => handleWordComplete(bossTarget, 'boss'), 0);
      return () => clearTimeout(timer);
    }
  }, [playerTyped, bossTyped, playerTarget, bossTarget, handleWordComplete, phase, bossHealth, playerHealth]);

  return (
    <div className="w-full h-full bg-black border border-green-900 shadow-[0_0_20px_rgba(0,255,0,0.1)] rounded p-4 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none bg-size-[100%_4px] bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] opacity-20"></div>

      {/* KARDEŞ YARDIM ÇAĞRISI (GLITCH) */}
      {siblingPlea && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/80 p-4 rounded-lg border border-red-700"
        >
          <p className="text-red-500 font-mono text-2xl animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            &gt; {siblingPlea}
          </p>
        </motion.div>
      )}

      {phase === "dialogue" ? (
        <div className="z-10 flex flex-col items-center max-w-lg min-h-24">
           <span className="text-gray-500 font-mono text-sm mb-2">[{currentSpeaker}]</span>
           <div className={`font-mono text-xl sm:text-2xl text-center drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] ${currentSpeaker === 'NULL BREAKER' ? 'text-green-500' : 'text-red-500'}`}>
             {dialogueLine}
             <span className={`animate-pulse w-3 h-6 inline-block align-middle ml-2 ${currentSpeaker === 'NULL BREAKER' ? 'bg-green-500' : 'bg-red-500'}`}></span>
           </div>
        </div>
      ) : bossHealth <= 0 ? (
        <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-green-500 text-3xl font-bold animate-pulse text-center z-10">BAĞLANTI KESİLDİ.<br/>BOSS YENİLDİ.</motion.h2>
      ) : playerHealth <= 0 ? (
        <div className="flex flex-col items-center z-10">
          <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-red-500 text-3xl font-bold animate-pulse text-center mb-6">SİSTEM ÇÖKTÜ.<br/>ÖLDÜN.</motion.h2>
          {onRestart && (
            <button 
              onClick={onRestart}
              className="px-6 py-2 border border-red-500 text-red-500 font-mono hover:bg-red-900 transition-colors tracking-widest animate-pulse"
            >
              &gt; YENİDEN BAŞLAT
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6 sm:gap-10 items-center font-mono text-xl sm:text-2xl tracking-widest relative w-full mt-4">
          
          {activeWords.map((wordObj, i) => {
            const isPlayerTarget = playerTarget === wordObj.word;
            const isBossTarget = bossTarget === wordObj.word;

            return (
              <div key={i} className="flex flex-col items-center relative w-full group">
                <div className="text-red-500 mb-1 flex drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] h-6 justify-center w-full transition-all">
                  {wordObj.word.split('').map((char, idx) => (
                    <span key={`boss-${idx}`} className={isBossTarget && idx < bossTyped.length ? 'opacity-100' : 'opacity-0'}>{char}</span>
                  ))}
                </div>
                <div className="text-gray-600 font-bold relative z-10 flex justify-center w-full items-center gap-3">
                  <span className="flex transition-colors duration-300">
                    {wordObj.word.split('').map((char, idx) => {
                      const isTyped = isPlayerTarget && idx < playerTyped.length;
                      return (
                        <span key={`target-${idx}`} className={isTyped ? 'opacity-0' : 'opacity-50'}>{char}</span>
                      );
                    })}
                  </span>
                  <span className="text-yellow-600 text-sm tracking-normal">[-{wordObj.damage}]</span>
                </div>
                <div className="text-green-400 mt-1 flex drop-shadow-[0_0_5px_rgba(74,222,128,0.8)] h-6 justify-center w-full absolute top-7">
                  {wordObj.word.split('').map((char, idx) => (
                    <span key={`player-${idx}`} className={isPlayerTarget && idx < playerTyped.length ? 'opacity-100' : 'opacity-0'}>{char}</span>
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