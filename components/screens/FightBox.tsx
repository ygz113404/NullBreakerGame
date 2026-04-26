"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

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
}

export function FightBox({ bossHealth, setBossHealth, playerHealth, setPlayerHealth }: FightBoxProps) {
  // Oyun Evresi: "dialogue" (Boss Konuşması) -> "combat" (Savaş)
  const [phase, setPhase] = useState<"dialogue" | "combat">("dialogue");
  const [dialogueLine, setDialogueLine] = useState("");
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const DIALOGUES = [
    "SİSTEME İZİNSİZ GİRİŞ TESPİT EDİLDİ...",
    "AETHERIA'NIN KUSURSUZLUĞU TEHLİKEDE.",
    "SAVUNMA PROTOKOLLERİ DEVREDE. YOK EDİLECEKSİN!"
  ];

  // Savaş Durumları
  const [activeWords, setActiveWords] = useState<{word: string, damage: number}[]>([]);
  
  const [playerTarget, setPlayerTarget] = useState<string | null>(null);
  const [playerTyped, setPlayerTyped] = useState("");
  
  const [bossTarget, setBossTarget] = useState<string | null>(null);
  const [bossTyped, setBossTyped] = useState("");

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

    if (dialogueIndex >= DIALOGUES.length) {
      // Diyaloglar bitti, savaşı başlat
      const timer = setTimeout(() => {
        setPhase("combat");
        pickNewWords();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const fullText = DIALOGUES[dialogueIndex];
    let currentLength = 0;
    setDialogueLine("");

    const typingInterval = setInterval(() => {
      currentLength++;
      setDialogueLine(fullText.slice(0, currentLength));
      if (currentLength >= fullText.length) {
        clearInterval(typingInterval);
        // Cümle bitince diğerine geçmeden önce 1.5 saniye bekle
        setTimeout(() => setDialogueIndex((prev) => prev + 1), 1500);
      }
    }, 50); // Harf yazılma hızı

    return () => clearInterval(typingInterval);
  }, [phase, dialogueIndex, pickNewWords]);

  // 2. Boss AI: Hedef Seçme
  useEffect(() => {
    if (phase !== "combat" || bossHealth <= 0 || playerHealth <= 0) return;
    
    // Boss'un hedefi yoksa kendine rastgele bir kelime seçsin
    if (!bossTarget && activeWords.length > 0) {
      const randomWord = activeWords[Math.floor(Math.random() * activeWords.length)].word;
      setBossTarget(randomWord);
      setBossTyped("");
    }
  }, [phase, bossTarget, activeWords, bossHealth, playerHealth]);

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
    }, 350); // Boss'un hızı: 350ms'de bir harf

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
            // Hedef yoksa, basılan harfle başlayan bir kelime bul ve kilitlen
            const match = activeWords.find(w => w.word.startsWith(char));
            if (match) {
              setPlayerTarget(match.word);
              return char;
            }
            return prev;
          } else {
            // Hedef varsa kelimeyi yazmaya devam et
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
          if (newVal === "") setPlayerTarget(null); // Kelime silinirse kilidi aç
          return newVal;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, playerTarget, activeWords, bossHealth, playerHealth]);

  // 5. Kelime Tamamlanma Kontrolü (Win/Loss)
  const handleWordComplete = useCallback((completedWord: string, winner: 'player' | 'boss') => {
    const wordObj = activeWords.find(w => w.word === completedWord);
    if (!wordObj) return;

    // Hasar Vur
    if (winner === 'player') {
      setBossHealth(prev => Math.max(0, prev - wordObj.damage));
    } else {
      setPlayerHealth(prev => Math.max(0, prev - wordObj.damage));
    }

    // Tamamlanan kelimeyi listeden çıkarıp yenisini getir
    setActiveWords(prev => {
      const nextWords = [...prev];
      const idx = nextWords.findIndex(w => w.word === completedWord);
      if (idx !== -1) {
        const available = WORD_POOL.filter(w => !nextWords.some(nw => nw.word === w.word));
        const randomNext = available[Math.floor(Math.random() * available.length)] || WORD_POOL[0];
        nextWords[idx] = randomNext;
      }
      return nextWords;
    });

    // Eğer oyuncu veya boss bu kelimeye odaklanmışsa hedeflerini sıfırla
    if (playerTarget === completedWord) {
      setPlayerTarget(null);
      setPlayerTyped("");
    }
    if (bossTarget === completedWord) {
      setBossTarget(null);
      setBossTyped("");
    }
  }, [activeWords, playerTarget, bossTarget, setBossHealth, setPlayerHealth]);

  useEffect(() => {
    if (phase !== "combat") return;

    if (playerTarget && playerTyped === playerTarget) {
      handleWordComplete(playerTarget, 'player');
    } else if (bossTarget && bossTyped === bossTarget) {
      handleWordComplete(bossTarget, 'boss');
    }
  }, [playerTyped, bossTyped, playerTarget, bossTarget, handleWordComplete, phase]);

  return (
    <div className="w-full h-full bg-black border border-green-900 shadow-[0_0_20px_rgba(0,255,0,0.1)] rounded p-4 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Eski CRT/Terminal tarama çizgisi efekti */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[length:100%_4px] opacity-20"></div>

      {phase === "dialogue" ? (
        <div className="z-10 text-red-500 font-mono text-xl sm:text-2xl text-center max-w-lg drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] min-h-[4rem]">
          {dialogueLine}
          <span className="animate-pulse bg-red-500 w-3 h-6 inline-block align-middle ml-2"></span>
        </div>
      ) : bossHealth <= 0 ? (
        <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-green-500 text-3xl font-bold animate-pulse text-center z-10">BAĞLANTI KESİLDİ.<br/>BOSS YENİLDİ.</motion.h2>
      ) : playerHealth <= 0 ? (
        <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-red-500 text-3xl font-bold animate-pulse text-center z-10">SİSTEM ÇÖKTÜ.<br/>ÖLDÜN.</motion.h2>
      ) : (
        <div className="flex flex-col gap-6 sm:gap-10 items-center font-mono text-xl sm:text-2xl tracking-[0.1em] relative w-full mt-4">
          
          {activeWords.map((wordObj, i) => {
            const isPlayerTarget = playerTarget === wordObj.word;
            const isBossTarget = bossTarget === wordObj.word;

            return (
              <div key={i} className="flex flex-col items-center relative w-full group">
                {/* BOSS PROGRESS (Üst - Kırmızı) */}
                <div className="text-red-500 mb-1 flex drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] h-6 justify-center w-full transition-all">
                  {wordObj.word.split('').map((char, idx) => (
                    <span key={`boss-${idx}`} className={isBossTarget && idx < bossTyped.length ? 'opacity-100' : 'opacity-0'}>{char}</span>
                  ))}
                </div>

                {/* TARGET WORD (Orta) */}
                <div className="text-gray-600 font-bold relative z-10 flex justify-center w-full items-center gap-3">
                  <span className="flex transition-colors duration-300">
                    {wordObj.word.split('').map((char, idx) => {
                      // Eğer kelime kilitlenmemişse, yazılan karakterler tüm uygun kelimelerde parlayabilir
                      // Ancak biz kilitlenme mantığı yaptık, o yüzden sadece kilitliyse parlasın.
                      const isTyped = isPlayerTarget && idx < playerTyped.length;
                      return (
                        <span key={`target-${idx}`} className={isTyped ? 'opacity-0' : 'opacity-50'}>{char}</span>
                      );
                    })}
                  </span>
                  <span className="text-yellow-600 text-sm tracking-normal">[-{wordObj.damage}]</span>
                </div>

                {/* PLAYER PROGRESS (Alt - Yeşil) */}
                <div className="text-green-400 mt-1 flex drop-shadow-[0_0_5px_rgba(74,222,128,0.8)] h-6 justify-center w-full absolute top-[1.75rem]">
                  {wordObj.word.split('').map((char, idx) => (
                    <span key={`player-${idx}`} className={isPlayerTarget && idx < playerTyped.length ? 'opacity-100' : 'opacity-0'}>{char}</span>
                  ))}
                </div>
              </div>
            );
          })}

        </div>
      )}
      
      {/* Terminal Input Satırı */}
      <div className="absolute bottom-4 left-4 border-t border-green-900 pt-2 text-sm sm:text-base font-mono w-[calc(100%-2rem)] flex justify-between">
        <div className="text-green-500">
          <span>&gt; {playerTyped}</span>
          <span className="animate-pulse bg-green-500 w-2 sm:w-3 h-4 sm:h-5 inline-block align-middle ml-1"></span>
        </div>
        <div className="text-red-500">
          <span className="text-xs text-gray-500 mr-2">FIREWALL_AI:</span>
          <span>{bossTyped}</span>
          <span className="animate-pulse bg-red-500 w-2 sm:w-3 h-4 sm:h-5 inline-block align-middle ml-1"></span>
        </div>
      </div>
    </div>
  );
}