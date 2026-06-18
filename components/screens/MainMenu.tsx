"use client";

import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types/game';

// Matrix Yağmuru Efekti Bileşeni
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=<>?';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Hafif siyah silinme efekti
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0'; // Klasik matrix yeşili
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none" />;
};

export function MainMenu() {
  const language = useGameStore((state: GameState) => state.language);
  const setLanguage = useGameStore((state: GameState) => state.setLanguage);
  const setGameStatus = useGameStore((state: GameState) => state.setGameStatus);

  // Dil desteğine göre oyun rehberi metinleri
  const instructionsTr = {
    title: "SİSTEM TALİMATLARI",
    goal: "Amacın: Ekranda beliren sistem düğümlerini (kelimeleri) düşmandan önce hatasız yazarak yokedip Aetheria'yı çökertmek.",
    controls: [
      "🟢 YEŞİL KELİMELER: Normal saldırı. Klavyenle yazarak yok edebilirsin.",
      "🔴 [TRAP] KIRMIZI KELİMELER: Tuzaktır! Yazarsan sen hasar alırsın. Görmezden gel.",
      "🟣 [ENCRYPTED] MOR KELİMELER: Önce 'DECRYPT' yazarak kalkanı kır, sonra asıl kelimeyi yaz.",
      "⚡ [SPACE] OVERLOAD EMP: Canından 200 feda edip düşmana 300 vurur ve ekranı temizler (Savaş başına 1 kez)."
    ]
  };
  const instructionsEn = {
    title: "SYSTEM INSTRUCTIONS",
    goal: "Goal: Destroy the system nodes (words) by typing them faster than the enemy without mistakes to bring down Aetheria.",
    controls: [
      "🟢 GREEN WORDS: Normal attack. Type them with your keyboard to destroy them.",
      "🔴 [TRAP] RED WORDS: It's a trap! If you type it, you take damage. Ignore them.",
      "🟣 [ENCRYPTED] PURPLE WORDS: Type 'DECRYPT' to break the shield, then type the revealed word.",
      "⚡ [SPACE] OVERLOAD EMP: Sacrifices 200 HP to deal 300 damage and clear the screen (Once per fight)."
    ]
  };
  const inst = language === 'tr' ? instructionsTr : instructionsEn;

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-green-500 font-mono p-4 relative overflow-hidden">
      <MatrixRain />
      
      <h1 className="text-6xl font-bold mb-8 tracking-widest text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10">
        NULL BREAKER
      </h1>

      <div className="max-w-2xl bg-gray-950/80 border border-cyan-900 p-6 rounded-lg mb-8 shadow-[0_0_20px_rgba(6,182,212,0.1)] text-gray-300 z-10 backdrop-blur-sm">
        <h2 className="text-cyan-400 text-lg sm:text-xl mb-4 font-bold tracking-widest border-b border-cyan-900/50 pb-2">{inst.title}</h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-400">{inst.goal}</p>
        <ul className="space-y-3 text-xs sm:text-sm">
          {inst.controls.map((ctrl, i) => (
            <li key={i} className="flex items-start">
              <span className="mr-2 text-cyan-500">&gt;</span>
              <span>{ctrl}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 mb-8 z-10">
        <button onClick={() => setLanguage('tr')} className={`px-6 py-2 border transition-colors ${language === 'tr' ? 'bg-cyan-900 border-cyan-500 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-400'}`}>TÜRKÇE</button>
        <button onClick={() => setLanguage('en')} className={`px-6 py-2 border transition-colors ${language === 'en' ? 'bg-cyan-900 border-cyan-500 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-400'}`}>ENGLISH</button>
      </div>
      <button onClick={() => setGameStatus('INTRO')} className="px-8 py-3 bg-red-900 text-white font-bold tracking-widest hover:bg-red-700 transition-colors border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] z-10">
        {language === 'tr' ? 'SİSTEME BAĞLAN' : 'CONNECT TO SYSTEM'}
      </button>
    </div>
  );
}