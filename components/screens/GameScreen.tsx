"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types/game';
import { FightBox } from './FightBox';
import { DIALOGUES, DialogueLine } from '../../game/constants/dialogues';
import { motion } from 'framer-motion';

// --- ARA BÖLÜM BİLEŞENLERİ ---

function StoryInterlude({ dialogues, onComplete, isMinigame = false }: { dialogues: DialogueLine[], onComplete: () => void, isMinigame?: boolean }) {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDecrypted, setIsDecrypted] = useState(!isMinigame);
  const [decryptWord, setDecryptWord] = useState("");
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
      if (e.key.length === 1 && /[a-zA-Z0-9_]/.test(e.key)) {
        setPlayerTyped(prev => (decryptWord.startsWith(prev + e.key.toUpperCase()) ? prev + e.key.toUpperCase() : prev));
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
            <p className="text-red-400 text-sm mb-2 uppercase">Kritik Veri Şifrelendi. Şifreyi Çözmek İçin Terminale Girin:</p>
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
        {index < dialogues.length - 1 ? "> DEVAM" : "> İLERİ"}
      </button>
    </div>
  );
}

const initialGrid = [
  [{ type: 'start', rotation: 0, connections: ['right'] }],
  [{ type: 'corner', rotation: 0, connections: ['left', 'bottom'] }, { type: 'line', rotation: 90, connections: ['top', 'bottom'] }, { type: 'corner', rotation: 270, connections: ['top', 'left'] }],
  [{ type: 'line', rotation: 0, connections: ['left', 'right'] }, { type: 'corner', rotation: 90, connections: ['top', 'right'] }, { type: 'line', rotation: 90, connections: ['top', 'bottom'] }, { type: 'corner', rotation: 180, connections: ['bottom', 'left'] }],
  [{ type: 'corner', rotation: 90, connections: ['top', 'right'] }, { type: 'line', rotation: 0, connections: ['left', 'right'] }, { type: 'corner', rotation: 0, connections: ['left', 'bottom'] }, { type: 'end', rotation: 0, connections: ['top'] }]
];

function NodeRotationPuzzle({ onComplete }: { onComplete: () => void }) {
  const [grid, setGrid] = useState(initialGrid.map(row => row.map(cell => ({ ...cell, rotation: Math.floor(Math.random() * 4) * 90 }))));
  const [isSolved, setIsSolved] = useState(false);

  const rotateCell = (rowIndex: number, cellIndex: number) => {
    if (isSolved) return;
    const newGrid = [...grid];
    const cell = newGrid[rowIndex][cellIndex];
    if (cell.type === 'start' || cell.type === 'end') return;
    cell.rotation = (cell.rotation + 90) % 360;
    setGrid(newGrid);
  };

  useEffect(() => {
    // Check for win condition
    // This is a simplified check. A real implementation would trace the path.
    const isPathComplete = grid.every(row => row.every(cell => cell.rotation === 0));
    if(isPathComplete) {
      setIsSolved(true);
      setTimeout(onComplete, 1500);
    }
  }, [grid, onComplete]);

  return (
    <div className="w-full h-full bg-black border border-yellow-900 shadow-[0_0_20px_rgba(255,165,0,0.1)] rounded p-4 flex flex-col items-center justify-center">
      <h2 className="text-2xl text-yellow-500 font-bold mb-2">GÜÇ YÖNLENDİRME BULMACASI</h2>
      <p className="text-gray-400 mb-6">Firewall'a giden yolu açmak için düğümleri döndürerek devreyi tamamla.</p>
      <div className='p-4 bg-gray-950/50 border border-yellow-800 rounded-md'>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} onClick={() => rotateCell(rowIndex, cellIndex)} className={`w-16 h-16 border border-gray-800 flex items-center justify-center cursor-pointer hover:bg-yellow-950/50 transition-colors`}>
                <motion.div animate={{ rotate: cell.rotation }} className="w-full h-full">
                  {/* Visual representation of nodes - simplified */}
                  {cell.type === 'start' && <div className="w-full h-full bg-green-500 rounded-full" />}
                  {cell.type === 'end' && <div className="w-full h-full bg-red-500 rounded-full" />}
                  {cell.type === 'line' && <div className="w-full h-2 bg-yellow-500 my-7" />}
                  {cell.type === 'corner' && <div className="w-8 h-8 border-l-8 border-t-8 border-yellow-500" />}
                </motion.div>
              </div>
            ))}
          </div>
        ))}
      </div>
       {isSolved && <p className="mt-4 text-green-500 animate-pulse text-xl">DEVRE TAMAMLANDI. GİRİŞ AÇILIYOR...</p>}
    </div>
  );
}


// --- ANA OYUN EKRANI ---

export function GameScreen() {
  const { city, sibling, currentBoss, setCurrentBoss, damageCity, resetGame } = useGameStore();
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
      alert("OYUN BİTTİ. " + DIALOGUES.endings.A_DARKNESS);
    }
  };

  const bossInfo = useMemo(() => {
    switch (currentBoss) {
      case 'FIREWALL': return { name: "THE FIREWALL", title: "KAPI GARDİYANI", dialogues: DIALOGUES.boss1_firewall.pre_fight };
      case 'ANTIVIRUS': return { name: "ANTIVIRUS", title: "ŞÖVALYE", dialogues: DIALOGUES.boss2_antivirus.pre_fight };
      case 'CORE_AI': return { name: "CORE AI", title: "BÜYÜCÜ", dialogues: DIALOGUES.boss3_coreai.pre_fight };
      case 'FINAL_BOSS': return { name: "KARDEŞ", title: "KUKLACI", dialogues: DIALOGUES.final_boss_sibling.pre_fight };
      default: return { name: "BİLİNMEYEN", title: "HATA", dialogues: [] };
    }
  }, [currentBoss]);

  const renderMainContent = () => {
    switch (phase) {
      case "story": return <StoryInterlude dialogues={storyDialogues} onComplete={handleStoryComplete} isMinigame={isStoryMinigame} />;
      case "puzzle": return <NodeRotationPuzzle onComplete={handlePuzzleComplete} />;
      case "combat": return <FightBox key={currentBoss} bossHealth={bossHealth} setBossHealth={setBossHealth} playerHealth={playerHealth} setPlayerHealth={setPlayerHealth} dialogues={bossInfo.dialogues} onBossDefeat={handleBossDefeat} onRestart={resetGame} />;
      default: return null;
    }
  };

  return (
    <main className="flex h-screen w-full bg-black text-white font-mono overflow-hidden relative">
      <section className="relative isolate w-1/4 h-full border-r border-cyan-800 bg-gray-950 p-4 flex flex-col">
        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-cyan-900 opacity-20 pointer-events-none -z-10" style={{ clipPath: 'polygon(0 100%, 0 60%, 10% 60%, 10% 30%, 25% 30%, 25% 50%, 40% 50%, 40% 10%, 55% 10%, 55% 40%, 70% 40%, 70% 20%, 85% 20%, 85% 50%, 100% 50%, 100% 100%)' }} />
        <h2 className="text-cyan-400 text-xl font-bold mb-4 tracking-widest">AETHERIA</h2>
        <div className="space-y-6 mt-4">
          <div>
            <p className="text-gray-400 mb-1">ŞEHİR SAĞLIĞI</p>
            <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden"><div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${city.cityHealth}%` }}></div></div>
          </div>
          <div>
            <p className="text-gray-400 mb-1">ŞEBEKE DURUMU</p>
            <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden"><div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${city.gridStatus}%` }}></div></div>
          </div>
          <div>
            <p className="text-gray-400">SİVİL KAYIP</p>
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
            <p className="text-gray-500 mb-2">Bağlantı kuruldu... Hedef sistem: Aetheria_Core</p>
            <p className="text-cyan-500 mb-2">&gt; Null Breaker sızma işlemi başarılı.</p>
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
                NULL BREAKER <span className="text-xs text-gray-500 font-normal">:: SİSTEM SIZICISI</span>
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
            <p className="text-gray-400 mb-1">KALP ATIŞI (BPM)</p>
            <p className={`text-4xl font-bold ${currentBoss === 'FINAL_BOSS' ? 'text-red-600 animate-bounce' : sibling.heartRate > 120 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
              {currentBoss === 'FINAL_BOSS' ? 'ERR_OVERFLOW' : sibling.heartRate}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">SİNİRSEL STRES</p>
            <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden"><div className={`h-full transition-all duration-500 ${currentBoss === 'FINAL_BOSS' ? 'bg-red-700 w-full' : 'bg-red-500'}`} style={{ width: currentBoss === 'FINAL_BOSS' ? '100%' : `${sibling.neuroStress}%` }}></div></div>
          </div>
          <div>
            <p className="text-gray-400 mb-1">STABİLİTE İNDEKSİ</p>
            <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden"><div className={`h-full transition-all duration-500 ${currentBoss === 'FINAL_BOSS' ? 'bg-red-700 w-full' : 'bg-green-500'}`} style={{ width: currentBoss === 'FINAL_BOSS' ? '100%' : `${sibling.stabilityIndex}%` }}></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}