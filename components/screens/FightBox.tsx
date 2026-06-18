"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getDialogues, DialogueLine } from '../../game/constants/dialogues';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types/game';

type WordNode = {
  word: string;
  damage: number;
  type?: 'normal' | 'trap' | 'encrypted';
  revealWord?: string; // Şifre çözüldüğünde ortaya çıkacak kelime
};

// Boss'lara Özel Hasar ve Kelime Havuzları
const WORD_POOLS: Record<string, WordNode[]> = {
  FIREWALL: [
    { word: "OVERRIDE_GATE", damage: 150 },
    { word: "BYPASS_TURRET", damage: 100 },
    { word: "KILL_PROCESS", damage: 120 },
    { word: "SYS_CORRUPTION", damage: 150, type: "trap" },
    { word: "DECRYPT", damage: 150, type: "encrypted", revealWord: "INJECT_PAYLOAD" },
    { word: "INJECT_PAYLOAD", damage: 200 },
    { word: "DISABLE_FIREWALL", damage: 180 },
    { word: "DECRYPT_KEY", damage: 90 },
  ],
  ANTIVIRUS: [
    { word: "QUARANTINE_BREACH", damage: 100 },
    { word: "SYS_32_CORRUPT", damage: 130 },
    { word: "IGNORE_ME", damage: 150, type: "trap" },
    { word: "DECRYPT", damage: 180, type: "encrypted", revealWord: "PURGE_MALWARE" },
    { word: "0XFA8B_KILL", damage: 150 },
    { word: "PURGE_MALWARE", damage: 180 },
    { word: "ERASE_SIGNATURE", damage: 120 },
  ],
  CORE_AI: [
    { word: "MNEMONIC_WIPE", damage: 150 },
    { word: "OVERLOAD_CORE", damage: 200 },
    { word: "AI_TRAP_0X", damage: 200, type: "trap" },
    { word: "FORMAT_C", damage: 250 },
    { word: "DECRYPT", damage: 170, type: "encrypted", revealWord: "BYPASS_NEURAL_NET" },
    { word: "AI_LOGIC_FAULT", damage: 180 },
    { word: "BYPASS_NEURAL_NET", damage: 170 },
  ],
  FINAL_BOSS: [
    { word: "SEVER_CONNECTION", damage: 100 },
    { word: "DONT_LEAVE_ME", damage: 200, type: "trap" },
    { word: "LET_ME_GO", damage: 150 },
    { word: "BREAK_THE_CHAINS", damage: 200 },
    { word: "DECRYPT", damage: 250, type: "encrypted", revealWord: "WAKE_UP" },
    { word: "WAKE_UP", damage: 250 },
  ]
};

interface FightBoxProps {
  currentBoss: string;
  bossHealth: number;
  setBossHealth: React.Dispatch<React.SetStateAction<number>>;
  playerHealth: number;
  setPlayerHealth: React.Dispatch<React.SetStateAction<number>>;
  dialogues: DialogueLine[];
  onDialogueEnd?: () => void;
  onBossDefeat?: () => void;
  onRestart?: () => void;
}

export function FightBox({ currentBoss, bossHealth, setBossHealth, playerHealth, setPlayerHealth, dialogues, onDialogueEnd, onBossDefeat, onRestart }: FightBoxProps) {
  const language = useGameStore((state: GameState) => state.language);
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
  
  const [empUsed, setEmpUsed] = useState(false); // Savaş başına 1 kullanım sınırı için eklendi
  // Kardeş Yardım Çağrısı
  const [siblingPlea, setSiblingPlea] = useState<string | null>(null);

  const currentWordPool = WORD_POOLS[currentBoss as keyof typeof WORD_POOLS] || WORD_POOLS.FIREWALL;

  // Yeni kelime seçici
  const pickNewWords = useCallback(() => {
    const shuffled = [...currentWordPool].sort(() => 0.5 - Math.random());
    setActiveWords(shuffled.slice(0, 3)); // 3 kelime seç
    setPlayerTarget(null);
    setPlayerTyped("");
    setBossTarget(null);
    setBossTyped("");
  }, [currentWordPool]);

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
  }, [phase, dialogueIndex, pickNewWords, dialogues, onDialogueEnd, DIALOGUES]);

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
  }, [phase, bossHealth, playerHealth, DIALOGUES]);

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
  }, [phase, bossTarget, bossHealth, playerHealth]);

  // 3. Boss AI: Yazma İşlemi
  useEffect(() => {
    if (phase !== "combat" || bossHealth <= 0 || playerHealth <= 0 || !bossTarget) return;

    // Boss'a göre hız belirle (ms cinsinden harf yazma süresi)
    let typingSpeed = 350; // Firewall hızı (Yavaş)
    if (currentBoss === 'ANTIVIRUS') typingSpeed = 280; // Orta
    if (currentBoss === 'CORE_AI') typingSpeed = 180; // Hızlı
    if (currentBoss === 'FINAL_BOSS') typingSpeed = 120; // Çok Hızlı ve Agresif

    const bossInterval = setInterval(() => {
      setBossTyped((prev) => {
        if (prev.length < bossTarget.length) {
          return prev + bossTarget[prev.length];
        }
        return prev;
      });
    }, typingSpeed);

    return () => clearInterval(bossInterval);
  }, [phase, bossTarget, bossHealth, playerHealth, currentBoss]);

  // 3.5 EMP (Aşırı Yükleme) Mekaniği
  const [empActive, setEmpActive] = useState(false);
  const triggerEMP = useCallback(() => {
    if (empUsed || empActive || phase !== "combat" || playerHealth <= 200 || bossHealth <= 0) return;
    setEmpActive(true);
    setEmpUsed(true); // EMP kullanıldı olarak işaretle
    setPlayerHealth(h => Math.max(1, h - 200)); // Oyuncu 200 hasar alır
    setBossHealth(h => Math.max(0, h - 300));   // Boss 300 hasar alır
    pickNewWords(); // Kelimeler sıfırlanır
    setTimeout(() => setEmpActive(false), 500); // 0.5s ekran beyaz parlama efekti
  }, [empUsed, empActive, phase, playerHealth, bossHealth, pickNewWords, setPlayerHealth, setBossHealth]);

  // 4. Player Input (Klavye Dinleyici)
  useEffect(() => {
    if (phase !== "combat" || bossHealth <= 0 || playerHealth <= 0) return;

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
  }, [phase, playerTarget, bossHealth, playerHealth, triggerEMP]);

  // 5. Kelime Tamamlanma Kontrolü (Win/Loss)
  const handleWordComplete = useCallback((completedWord: string, winner: 'player' | 'boss') => {
    if (bossHealth <= 0 || playerHealth <= 0) return;

    setActiveWords(prev => {
      const nextWords = [...prev];
      const idx = nextWords.findIndex(w => w.word === completedWord);
      
      if (idx !== -1) {
        const wordObj = nextWords[idx];
        
        if (winner === 'player') {
          if (wordObj.type === 'trap') {
            setPlayerHealth(h => Math.max(0, h - wordObj.damage)); // Oyuncu tuzağa düştü!
          } else if (wordObj.type === 'encrypted' && wordObj.revealWord) {
            // Şifre çözüldü, kelime gerçeğine dönüşüp ekranda kalır.
            nextWords[idx] = { word: wordObj.revealWord, damage: wordObj.damage, type: 'normal' };
            return nextWords;
          } else {
            setBossHealth(h => Math.max(0, h - wordObj.damage)); // Normal saldırı
          }
        } else {
          setPlayerHealth(h => Math.max(0, h - wordObj.damage)); // Boss oyuncuya vurdu
        }

        const available = currentWordPool.filter(w => !nextWords.some(nw => nw.word === w.word));
        const fallback = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : currentWordPool[0];
        nextWords[idx] = fallback;
      }
      return nextWords;
    });

    setPlayerTarget(pt => pt === completedWord ? null : pt);
    setPlayerTyped(pt => pt === completedWord ? "" : pt);
    
    setBossTarget(bt => bt === completedWord ? null : bt);
    setBossTyped(bt => bt === completedWord ? "" : bt);
  }, [bossHealth, playerHealth, setBossHealth, setPlayerHealth, currentWordPool]);

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
    <div className={`w-full h-full border border-green-900 rounded p-4 relative overflow-hidden flex flex-col items-center justify-center ${empActive ? 'bg-white shadow-[0_0_100px_rgba(255,255,255,1)] transition-all duration-75' : 'bg-black shadow-[0_0_20px_rgba(0,255,0,0.1)] transition-all duration-1000'}`}>
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
          
          {activeWords.map((wordObj, i) => {
            const isPlayerTarget = playerTarget === wordObj.word;
            const isBossTarget = bossTarget === wordObj.word;
            const isTrap = wordObj.type === 'trap';
            const isEncrypted = wordObj.type === 'encrypted';

            return (
              <div key={i} className={`flex flex-col items-center relative w-full group ${currentBoss === 'FINAL_BOSS' || isTrap ? 'animate-[shake_0.5s_ease-in-out_infinite]' : ''}`}>
                <div className="text-red-500 mb-1 flex drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] h-6 justify-center w-full transition-all">
                  {wordObj.word.split('').map((char, idx) => (
                    <span key={`boss-${idx}`} className={isBossTarget && idx < bossTyped.length ? 'opacity-100' : 'opacity-0'}>{char}</span>
                  ))}
                </div>
                
                <div className={`text-gray-600 font-bold relative z-10 flex justify-center w-full items-center gap-3 ${isTrap ? 'text-red-900 line-through' : isEncrypted ? 'text-purple-700' : ''}`}>
                  {isTrap && <span className="text-red-500 text-xs animate-pulse">[TRAP]</span>}
                  {isEncrypted && <span className="text-purple-400 text-xs animate-pulse">[ENCRYPTED]</span>}
                  
                  <span className="flex transition-colors duration-300">
                    {wordObj.word.split('').map((char, idx) => {
                      const isTyped = isPlayerTarget && idx < playerTyped.length;
                      let charColor = isTyped ? 'opacity-0' : 'opacity-50';
                      if (isTrap) charColor = isTyped ? 'opacity-0' : 'text-red-500 opacity-80';
                      if (isEncrypted) charColor = isTyped ? 'opacity-0' : 'text-purple-400 opacity-80';
                      
                      return (
                        <span key={`target-${idx}`} className={charColor}>{char}</span>
                      );
                    })}
                  </span>
                  <span className={isTrap ? "text-red-600 text-sm tracking-normal" : "text-yellow-600 text-sm tracking-normal"}>
                    {isTrap ? `[-${wordObj.damage} HP]` : `[-${wordObj.damage}]`}
                  </span>
                </div>

                <div className={`mt-1 flex h-6 justify-center w-full absolute top-7 ${isTrap ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : isEncrypted ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]' : 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]'}`}>
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