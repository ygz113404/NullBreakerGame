"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types/game';
import { FightBox } from './FightBox';
import { getDialogues, DialogueLine } from '../../game/constants/dialogues';
import { motion } from 'framer-motion';

// --- ARA BÖLÜM BİLEŞENLERİ ---

function StoryInterlude({ dialogues, onComplete, isMinigame = false }: { dialogues: DialogueLine[], onComplete: () => void, isMinigame?: boolean }) {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDecrypted, setIsDecrypted] = useState(!isMinigame);
  const [decryptWord, setDecryptWord] = useState("");
  const language = useGameStore((state: GameState) => state.language);
  
  const [playerTyped, setPlayerTyped] = useState("");

  useEffect(() => {
    if (isMinigame && !isDecrypted && index < dialogues.length) {
      setDecryptWord("DECRYPT_" + Math.floor(100 + Math.random() * 900));
      setPlayerTyped("");
    }
  }, [index, isMinigame, isDecrypted, dialogues.length]);

  useEffect(() => {
    if (!isMinigame || isDecrypted || index >= dialogues.length) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1 && /[a-zA-Z0-9_ıiIİ]/.test(e.key)) {
        let char = e.key.toUpperCase();
        if (e.key === 'ı' || e.key === 'i' || char === 'İ') {
          char = 'I';
        }

        setPlayerTyped(prev => (decryptWord.startsWith(prev + char) ? prev + char : prev));
      } else if (e.key === "Backspace") {
        setPlayerTyped(prev => prev.slice(0, -1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMinigame, isDecrypted, decryptWord, index, dialogues.length]);

  useEffect(() => {
    if (isMinigame && !isDecrypted && playerTyped === decryptWord && decryptWord !== "") setIsDecrypted(true);
  }, [playerTyped, decryptWord, isMinigame, isDecrypted]);

  useEffect(() => {
    if (index >= dialogues.length) return;
    const text = dialogues[index].text;
    if (isMinigame && !isDecrypted) {
      const interval = setInterval(() => {
        const garbled = text.split('').map(c => (/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(c) ? String.fromCharCode(33 + Math.floor(Math.random() * 60)) : c)).join('');
        setDisplayedText(garbled);
      }, 50);
      return () => clearInterval(interval);
    }
    let currentLength = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      currentLength++;
      setDisplayedText(text.slice(0, currentLength));
      if (currentLength >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [index, dialogues, isMinigame, isDecrypted]);

  const handleNext = () => {
    if (index < dialogues.length - 1) {
      setIndex(prev => prev + 1);
      if (isMinigame) setIsDecrypted(false);
    } else {
      onComplete();
    }
  };

  if (index >= dialogues.length) return null;

  return (
    <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-8 backdrop-blur-md">
      <div className="max-w-2xl text-center space-y-6 w-full relative">
        <p className="text-gray-500 font-mono text-sm tracking-widest">[{dialogues[index].speaker}]</p>
        <p className={`text-2xl font-mono leading-relaxed min-h-[6rem] transition-colors duration-500 ${isMinigame && !isDecrypted ? 'text-red-500 font-bold tracking-widest' : 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'}`}>
          {displayedText}<span className={`animate-pulse w-3 h-6 inline-block align-middle ml-2 ${isMinigame && !isDecrypted ? 'bg-red-500' : 'bg-cyan-400'}`}></span>
        </p>
        {isMinigame && !isDecrypted && (
          <div className="mt-8 border border-red-900 bg-red-950/30 p-4 rounded-md">
            <p className="text-red-400 text-sm mb-2 uppercase">{language === 'tr' ? 'Kritik Veri Şifrelendi. Şifreyi Çözmek İçin Terminale Girin:' : 'Critical Data Encrypted. Enter the Terminal to Decrypt:'}</p>
            <div className="flex flex-col items-center">
              <div className="text-gray-600 font-bold relative z-10 flex justify-center w-full items-center text-xl tracking-widest gap-1 mb-2">
                {decryptWord.split('').map((char, idx) => (<span key={idx} className={idx < playerTyped.length ? 'opacity-0' : 'opacity-100'}>{char}</span>))}
              </div>
              <div className="text-green-500 flex absolute bottom-4 text-xl tracking-widest gap-1 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
                {decryptWord.split('').map((char, idx) => (<span key={`p-${idx}`} className={idx < playerTyped.length ? 'opacity-100' : 'opacity-0'}>{char}</span>))}
              </div>
            </div>
          </div>
        )}
      </div>
      <button onClick={handleNext} disabled={isMinigame && !isDecrypted} className={`mt-16 px-8 py-3 border font-mono tracking-widest transition-colors ${isMinigame && !isDecrypted ? 'border-gray-800 text-gray-700 cursor-not-allowed' : 'border-cyan-500 text-cyan-400 hover:bg-cyan-900 animate-pulse'}`}>
        {index < dialogues.length - 1 ? (language === 'tr' ? "> DEVAM" : "> NEXT") : (language === 'tr' ? "> İLERİ" : "> FORWARD")}
      </button>
    </div>
  );
}

// Mükemmel oturan 3x3'lük SVG tabanlı yeni Grid Sistemi
const initialPuzzleGrid = [
  [
    { id: '0-0', type: 'start', rot: 0, correct: [0] },
    { id: '0-1', type: 'line', rot: 90, correct: [0, 180] },
    { id: '0-2', type: 'corner', rot: 90, correct: [180] },
  ],
  [
    { id: '1-0', type: 'line', rot: 0, correct: [0, 90, 180, 270] }, // Tuzak (decoy) boru
    { id: '1-1', type: 'corner', rot: 0, correct: [90] },
    { id: '1-2', type: 'corner', rot: 180, correct: [270] },
  ],
  [
    { id: '2-0', type: 'end', rot: 180, correct: [180] }, // HATA DÜZELTİLDİ: rot: 180 ile çıkış ucu sağa bakacak.
    { id: '2-1', type: 'corner', rot: 90, correct: [270] },
    { id: '2-2', type: 'corner', rot: 270, correct: [0, 90, 180, 270] }, // Tuzak (decoy) boru
  ]
];

const randomizeGrid = () => {
  let newGrid;
  let isAlreadySolved = true;
  // Tablo baştan çözülü gelmesin diye kontrol ediyoruz
  while (isAlreadySolved) {
    newGrid = initialPuzzleGrid.map(row =>
      row.map(cell => {
        if (cell.type === 'start' || cell.type === 'end') return { ...cell };
        return { ...cell, rot: Math.floor(Math.random() * 4) * 90 };
      })
    );
    isAlreadySolved = newGrid.every(row => 
      row.every(cell => cell.correct.includes(cell.rot))
    );
  }
  return newGrid as typeof initialPuzzleGrid;
};

function NodeRotationPuzzle({ onComplete }: { onComplete: () => void }) {
  const [grid, setGrid] = useState(randomizeGrid());
  const [isSolved, setIsSolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const rotateCell = (rIndex: number, cIndex: number) => {
    if (isSolved) return;
    const newGrid = [...grid];
    const row = [...newGrid[rIndex]];
    const cell = { ...row[cIndex] };
    
    if (cell.type === 'start' || cell.type === 'end') return;

    cell.rot = (cell.rot + 90) % 360;
    row[cIndex] = cell;
    newGrid[rIndex] = row;
    setGrid(newGrid);
  };

  useEffect(() => {
    const solved = grid.every(row => 
      row.every(cell => cell.correct.includes(cell.rot))
    );
    if (solved && !isSolved) {
      setIsSolved(true);
      setTimeout(onComplete, 1200);
    }
  }, [grid, isSolved, onComplete]);

  // Zamanlayıcı Efekti
  useEffect(() => {
    if (isSolved) return;
    
    if (timeLeft <= 0) {
      setGrid(randomizeGrid()); // Süre bitince parçaları tekrar karıştır
      setTimeLeft(30);
      setFailedAttempts(prev => prev + 1);
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSolved]);

  const renderPipe = (type: string, isSolved: boolean) => {
    const color = isSolved ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" : "text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]";
    
    if (type === 'start') return (
      <svg viewBox="0 0 100 100" className={`w-full h-full ${color}`}>
        <rect x="50" y="40" width="50" height="20" fill="currentColor" />
        <circle cx="50" cy="50" r="25" fill="#22c55e" />
      </svg>
    );
    if (type === 'end') return (
      <svg viewBox="0 0 100 100" className={`w-full h-full ${color}`}>
        <rect x="0" y="40" width="50" height="20" fill="currentColor" />
        <circle cx="50" cy="50" r="25" fill="#ef4444" />
      </svg>
    );
    if (type === 'line') return (
      <svg viewBox="0 0 100 100" className={`w-full h-full ${color}`}><rect x="0" y="40" width="100" height="20" fill="currentColor" /></svg>
    );
    if (type === 'corner') return (
      <svg viewBox="0 0 100 100" className={`w-full h-full ${color}`}><path d="M40 0 L60 0 L60 40 L100 40 L100 60 L40 60 Z" fill="currentColor" /></svg>
    );
  };
    const language = useGameStore((state: GameState) => state.language);


  return (
    <div className="w-full h-full bg-black border border-cyan-900 shadow-[0_0_20px_rgba(34,211,238,0.1)] rounded p-4 flex flex-col items-center justify-center relative">
      {failedAttempts > 0 && (
        <p className="text-red-500 text-xs font-mono absolute top-4 right-4 animate-pulse">
          {language === 'tr' ? `SÜRE BİTTİ. SIFIRLANDI: ${failedAttempts}` : `TIME'S UP. RESET: ${failedAttempts}`}
        </p>
      )}
      <h2 className="text-xl sm:text-2xl text-cyan-400 font-bold mb-2 tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] text-center">{language === 'tr' ? 'SİSTEM AĞI YÖNLENDİRMESİ' : 'SYSTEM NETWORK ROUTING'}</h2>
      <p className="text-gray-400 mb-4 font-mono text-xs sm:text-sm text-center">{language === 'tr' ? "Firewall'a giden veri akışını sağlamak için düğümleri hizala." : "Align the nodes to ensure data flow to the firewall."}</p>
      
      <div className="w-full max-w-[200px] bg-gray-900 h-2 mb-1 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${timeLeft < 10 ? 'bg-red-500' : 'bg-cyan-500'}`}
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        />
      </div>
      <p className={`font-mono mb-6 text-sm ${timeLeft < 10 ? 'text-red-500 animate-pulse font-bold' : 'text-cyan-400'}`}>
        {language === 'tr' ? `KALAN SÜRE: ${timeLeft}s` : `TIME LEFT: ${timeLeft}s`}
      </p>

      <div className="p-4 bg-gray-950/80 border border-cyan-900 rounded-lg shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]">
        <div className="grid grid-rows-3 gap-0 bg-gray-900/50 border border-gray-800 p-2 rounded">
          {grid.map((row, rIndex) => (
            <div key={`row-${rIndex}`} className="flex">
              {row.map((cell, cIndex) => (
                <div 
                  key={cell.id} 
                  onClick={() => rotateCell(rIndex, cIndex)} 
                  className={`w-16 h-16 sm:w-24 sm:h-24 border border-gray-800/80 flex items-center justify-center cursor-pointer hover:bg-cyan-950/30 transition-colors
                    ${cell.type !== 'start' && cell.type !== 'end' ? 'active:scale-95' : ''}`}
                >
                  <motion.div 
                    animate={{ rotate: cell.rot }} 
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-full h-full"
                  >
                    {renderPipe(cell.type, isSolved)}
                  </motion.div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {isSolved && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-green-500 font-bold tracking-widest animate-pulse text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] text-center"
        >
          {language === 'tr' ? '> BAĞLANTI SAĞLANDI. GİRİŞ AÇILIYOR...' : '> CONNECTION ESTABLISHED. ACCESS GRANTED...'}
        </motion.p>
      )}
    </div>
  );
}


// --- ANA OYUN EKRANI ---

export function GameScreen() {
  const { city, sibling, currentBoss, setCurrentBoss, damageCity, resetGame } = useGameStore();
  const language = useGameStore((state: GameState) => state.language);
  const DIALOGUES = useMemo(() => getDialogues(language), [language]);
  const [bossHealth, setBossHealth] = useState(250);
  const [playerHealth, setPlayerHealth] = useState(1000);
  const [phase, setPhase] = useState<"story" | "puzzle" | "combat">("story");
  const [storyDialogues, setStoryDialogues] = useState<DialogueLine[]>(DIALOGUES.pre_firewall_logs);
  const [isStoryMinigame, setIsStoryMinigame] = useState(false);

  const handleStoryComplete = () => {
    if (storyDialogues === DIALOGUES.pre_firewall_logs) {
      setPhase("puzzle");
    } else if (storyDialogues === DIALOGUES.exploration_1) {
      setCurrentBoss('ANTIVIRUS');
      setBossHealth(250);
      setPlayerHealth(1000);
      setPhase("combat"); // Antivirus'ten önce puzzle yok, direkt savaş
    } else if (storyDialogues === DIALOGUES.exploration_2) {
      setCurrentBoss('CORE_AI');
      setBossHealth(250);
      setPlayerHealth(1000);
      setPhase("combat");
    } else if (storyDialogues === DIALOGUES.breaking_point) {
      setCurrentBoss('FINAL_BOSS');
      setBossHealth(250);
      setPlayerHealth(1000);
      setPhase("combat");
    }
  };
  
  const handlePuzzleComplete = () => {
    setPhase("combat");
  };

  const handleBossDefeat = () => {
    if (currentBoss === 'FIREWALL') {
      damageCity(20, 50000);
      setStoryDialogues(DIALOGUES.exploration_1);
      setIsStoryMinigame(false);
      setPhase("story");
    } else if (currentBoss === 'ANTIVIRUS') {
      damageCity(30, 250000);
      setStoryDialogues(DIALOGUES.exploration_2);
      setIsStoryMinigame(true);
      setPhase("story");
    } else if (currentBoss === 'CORE_AI') {
      damageCity(50, 1000000);
      setStoryDialogues(DIALOGUES.breaking_point);
      setIsStoryMinigame(false);
      setPhase("story");
    } else if (currentBoss === 'FINAL_BOSS') {
      alert((language === 'tr' ? "OYUN BİTTİ. " : "GAME OVER. ") + DIALOGUES.endings.A_DARKNESS);
    }
  };

  const bossInfo = useMemo(() => {
    switch (currentBoss) {
      case 'FIREWALL': return { name: "THE FIREWALL", title: language === 'tr' ? "KAPI GARDİYANI" : "GATEKEEPER", dialogues: DIALOGUES.boss1_firewall.pre_fight };
      case 'ANTIVIRUS': return { name: "ANTIVIRUS", title: language === 'tr' ? "ŞÖVALYE" : "KNIGHT", dialogues: DIALOGUES.boss2_antivirus.pre_fight };
      case 'CORE_AI': return { name: "CORE AI", title: language === 'tr' ? "BÜYÜCÜ" : "SORCERER", dialogues: DIALOGUES.boss3_coreai.pre_fight };
      case 'FINAL_BOSS': return { name: "KARDEŞ", title: language === 'tr' ? "KUKLACI" : "PUPPETEER", dialogues: DIALOGUES.final_boss_sibling.pre_fight };
      default: return { name: "BİLİNMEYEN", title: "HATA", dialogues: [] };
    }
  }, [currentBoss, language, DIALOGUES]);

  const renderMainContent = () => {
    switch (phase) {
      case "story": return <StoryInterlude dialogues={storyDialogues} onComplete={handleStoryComplete} isMinigame={isStoryMinigame} />;
      case "puzzle": return <NodeRotationPuzzle onComplete={handlePuzzleComplete} />;
      case "combat": return <FightBox currentBoss={currentBoss} key={currentBoss} bossHealth={bossHealth} setBossHealth={setBossHealth} playerHealth={playerHealth} setPlayerHealth={setPlayerHealth} dialogues={bossInfo.dialogues} onBossDefeat={handleBossDefeat} onRestart={resetGame} />;
      default: return null;
    }
  };

  return (
    <main className="flex h-screen w-full bg-black text-white font-mono overflow-hidden relative">
      <section className="relative isolate w-1/4 h-full border-r border-cyan-800 bg-gray-950 p-4 flex flex-col">
        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-cyan-900 opacity-20 pointer-events-none -z-10" style={{ clipPath: 'polygon(0 100%, 0 60%, 10% 60%, 10% 30%, 25% 30%, 25% 50%, 40% 50%, 40% 10%, 55% 10%, 55% 40%, 70% 40%, 70% 20%, 85% 20%, 85% 50%, 100% 50%, 100% 100%)' }} />
        <h2 className="text-cyan-400 text-xl font-bold mb-4 tracking-widest">{language === 'tr' ? 'AETHERIA' : 'AETHERIA'}</h2>
        <div className="space-y-6 mt-4">
          <div>
            <p className="text-gray-400 mb-1">{language === 'tr' ? 'ŞEHİR SAĞLIĞI' : 'CITY HEALTH'}</p>
            <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden"><div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${city.cityHealth}%` }}></div></div>
          </div>
          <div>
            <p className="text-gray-400 mb-1">{language === 'tr' ? 'ŞEBEKE DURUMU' : 'NETWORK STATUS'}</p>
            <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden"><div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${city.gridStatus}%` }}></div></div>
          </div>
          <div>
            <p className="text-gray-400">{language === 'tr' ? 'SİVİL KAYIP' : 'CIVILIAN CASUALTIES'}</p>
            <p className="text-3xl text-red-500 font-bold">{city.civilianCasualtyCount.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <section className="w-2/4 h-full flex flex-col">
        <div className="h-[25%] border-b border-gray-800 p-4 flex flex-col">
          <div className="mb-2 mt-1">
            <div className="flex justify-between items-end mb-1">
              <h2 className="text-red-500 text-2xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                {bossInfo.name} <span className="text-xs text-gray-500 font-normal">:: {bossInfo.title}</span>
              </h2>
              <span className="text-red-500 font-mono text-sm">{bossHealth} / 1000</span>
            </div>
            <div className="w-full bg-black border border-red-900 h-4 rounded-sm overflow-hidden">
              <div className="bg-red-600 h-full transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.8)]" style={{ width: `${Math.max(0, (bossHealth / 1000) * 100)}%` }}></div>
            </div>
          </div>
          <div className="flex-1 bg-gray-950/50 border border-gray-800 p-2 rounded font-mono text-xs overflow-y-auto">
            <p className="text-gray-500 mb-2">{language === 'tr' ? 'Bağlantı kuruldu... Hedef sistem: Aetheria_Core' : 'Connection established... Target system: Aetheria_Core'}  </p>
            <p className="text-cyan-500 mb-2">{language === 'tr' ? '> Null Breaker sızma işlemi başarılı.' : '> Null Breaker infiltration successful.'}</p>
            {currentBoss === 'ANTIVIRUS' && DIALOGUES.boss2_antivirus.mid_fight_logs.map((log, i) => (<p key={i} className="text-yellow-500 mb-1">[{log.speaker}]: {log.text}</p>))}
            {currentBoss === 'FINAL_BOSS' && DIALOGUES.final_boss_sibling.mid_fight_hacks.map((hack, i) => (<p key={i} className="text-red-600 mb-1">[{hack.speaker}]: {hack.text}</p>))}
          </div>
        </div>
        <div className="h-[60%] p-4 flex items-center justify-center bg-gray-900 relative">
          {renderMainContent()}
        </div>
        <div className="h-[15%] border-t border-gray-800 p-4 flex flex-col justify-center bg-gray-950 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]">
          <div className="mb-1">
            <div className="flex justify-between items-end mb-1">
              <h2 className="text-green-500 text-xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">
                {language === 'tr' ? 'NULL BREAKER' : 'NULL BREAKER'} <span className="text-xs text-gray-500 font-normal">:: {language === 'tr' ? 'SİSTEM SIZICISI' : 'SYSTEM INFILTRATOR'}</span>
              </h2>
              <span className="text-green-500 font-mono text-sm">{playerHealth} / 1000</span>
            </div>
            <div className="w-full bg-black border border-green-900 h-4 rounded-sm overflow-hidden">
              <div className="bg-green-600 h-full transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.8)]" style={{ width: `${Math.max(0, (playerHealth / 1000) * 100)}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      <section className={`relative isolate w-1/4 h-full border-l bg-gray-950 p-4 flex flex-col transition-all duration-1000 ${currentBoss === 'FINAL_BOSS' ? 'border-red-900 shadow-[inset_0_0_50px_rgba(220,38,38,0.2)]' : 'border-green-900'}`}>
        <div className="absolute bottom-0 left-0 w-full h-[45%] opacity-10 pointer-events-none flex justify-center items-end pb-4 -z-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" className={`w-2/3 h-full ${currentBoss === 'FINAL_BOSS' ? 'fill-red-700 animate-pulse' : 'fill-red-500'}`}>
            <path d="M50,15 C42,15 38,22 40,30 C42,38 48,38 50,38 C52,38 58,38 60,30 C62,22 58,15 50,15 Z M45,40 C35,42 30,50 30,65 L35,100 L45,100 L45,75 L55,75 L55,100 L65,100 L70,65 C70,50 65,42 55,40 C50,45 45,40 45,40 Z" />
          </svg>
        </div>
        <h2 className={`text-xl font-bold mb-4 tracking-widest ${currentBoss === 'FINAL_BOSS' ? 'text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'text-red-500'}`}>
          {currentBoss === 'FINAL_BOSS' ? 'NEW GOD_AI' : 'CATALYST'}
        </h2>
        <div className="space-y-6 mt-4">
          <div>
            <p className="text-gray-400 mb-1">{language === 'tr' ? 'KALP ATIŞI (BPM)' : 'HEART RATE (BPM)'}</p>
            <div className="flex items-center gap-3">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-8 h-8 sm:w-10 sm:h-10 ${currentBoss === 'FINAL_BOSS' ? 'text-red-700' : sibling.heartRate > 120 ? 'text-red-500' : 'text-green-500'}`}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 60 / (currentBoss === 'FINAL_BOSS' ? 220 : sibling.heartRate || 60), ease: "easeInOut" }}
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </motion.svg>
              <p className={`text-4xl font-bold ${currentBoss === 'FINAL_BOSS' ? 'text-red-600 animate-bounce' : sibling.heartRate > 120 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                {currentBoss === 'FINAL_BOSS' ? 'ERR_OVERFLOW' : sibling.heartRate}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-400 mb-1">{language === 'tr' ? 'SİNİRSEL STRES' : 'NEURAL STRESS'}</p>
            <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden"><div className={`h-full transition-all duration-500 ${currentBoss === 'FINAL_BOSS' ? 'bg-red-700 w-full' : 'bg-red-500'}`} style={{ width: currentBoss === 'FINAL_BOSS' ? '100%' : `${sibling.neuroStress}%` }}></div></div>
          </div>
          <div>
            <p className="text-gray-400 mb-1">{language === 'tr' ? 'STABİLİTE İNDEKSİ' : 'STABILITY INDEX'}</p>
            <p className="text-3xl font-bold mb-1">{currentBoss === 'FINAL_BOSS' ? 'ERR_OVERFLOW' : sibling.stabilityIndex}</p>
            <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden"><div className={`h-full transition-all duration-500 ${currentBoss === 'FINAL_BOSS' ? 'bg-red-700 w-full' : 'bg-green-500'}`} style={{ width: currentBoss === 'FINAL_BOSS' ? '100%' : `${sibling.stabilityIndex}%` }}></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}