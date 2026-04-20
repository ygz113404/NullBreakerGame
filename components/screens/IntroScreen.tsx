"use client";

import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types/game';

export function IntroScreen() {
  const language = useGameStore((state: GameState) => state.language);
  const setGameStatus = useGameStore((state: GameState) => state.setGameStatus);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-gray-300 font-mono p-8">
      <div className="max-w-3xl text-center space-y-6">
        <p className="text-xl leading-relaxed">
          {language === 'tr' ? "Aetheria. Gökyüzünde süzülen, kusursuz ve ölümsüz bir ütopya." : "Aetheria. A flawless, immortal utopia floating in the sky."}
        </p>
        <p className="text-xl leading-relaxed">
          {language === 'tr' ? "Ancak bu kusursuzluğun bir bedeli var: Aşağı dünyadan kaçırılan ve sisteme bağlanan 'Katalizör'ler." : "But this perfection comes at a cost: 'Catalysts' kidnapped from the world below and plugged into the system."}
        </p>
        <p className="text-xl leading-relaxed text-red-400 font-bold">
          {language === 'tr' ? "Benim kardeşim de onlardan biri. Dünyamı kurtarmak için... bu dünyayı yakmaya hazırım." : "My sibling is one of them. To save my world... I am ready to burn this one to the ground."}
        </p>
      </div>
      <button onClick={() => setGameStatus('IDLE')} className="mt-12 px-6 py-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 transition-colors animate-pulse">
        {language === 'tr' ? "> AETHERIA'YA GİRİŞ YAP" : "> ENTER AETHERIA"}
      </button>
    </div>
  );
}