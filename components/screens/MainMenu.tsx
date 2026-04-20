"use client";

import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types/game';

export function MainMenu() {
  const language = useGameStore((state: GameState) => state.language);
  const setLanguage = useGameStore((state: GameState) => state.setLanguage);
  const setGameStatus = useGameStore((state: GameState) => state.setGameStatus);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-green-500 font-mono">
      <h1 className="text-6xl font-bold mb-8 tracking-widest text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
        NULL BREAKER
      </h1>
      <div className="flex gap-4 mb-8">
        <button onClick={() => setLanguage('tr')} className={`px-6 py-2 border transition-colors ${language === 'tr' ? 'bg-cyan-900 border-cyan-500 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-400'}`}>TÜRKÇE</button>
        <button onClick={() => setLanguage('en')} className={`px-6 py-2 border transition-colors ${language === 'en' ? 'bg-cyan-900 border-cyan-500 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-400'}`}>ENGLISH</button>
      </div>
      <button onClick={() => setGameStatus('INTRO')} className="px-8 py-3 bg-red-900 text-white font-bold tracking-widest hover:bg-red-700 transition-colors border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
        {language === 'tr' ? 'SİSTEME BAĞLAN' : 'CONNECT TO SYSTEM'}
      </button>
    </div>
  );
}