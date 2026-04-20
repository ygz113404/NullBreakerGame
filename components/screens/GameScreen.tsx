"use client";

import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types/game';
import { FightBox } from '../../game/FightBox';

export function GameScreen() {
  const city = useGameStore((state: GameState) => state.city);
  const sibling = useGameStore((state: GameState) => state.sibling);
  const status = useGameStore((state: GameState) => state.status);

  return (
    <main className="flex h-screen w-full bg-black text-white font-mono overflow-hidden">
      {/* Sol Panel: Aetheria Şehir Ağı (%25) */}
      <section className="relative isolate w-1/4 h-full border-r border-cyan-800 bg-gray-950 p-4 flex flex-col">
        {/* CSS ile Şehir Silüeti (Clip-Path) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[35%] bg-cyan-900 opacity-20 pointer-events-none -z-10"
          style={{ clipPath: 'polygon(0 100%, 0 60%, 10% 60%, 10% 30%, 25% 30%, 25% 50%, 40% 50%, 40% 10%, 55% 10%, 55% 40%, 70% 40%, 70% 20%, 85% 20%, 85% 50%, 100% 50%, 100% 100%)' }}
        />
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

      {/* Orta Panel: Ana Konsol (%50) */}
      <section className="w-2/4 h-full flex flex-col">
        <div className="h-[30%] border-b border-gray-800 p-4 flex flex-col justify-end pb-8">
          <p className="text-green-400 animate-pulse">&gt; SİSTEME GİRİŞ YAPILDI...</p>
          <p className="text-gray-300">&gt; OYUN DURUMU: {status}</p>
        </div>
        <div className="h-[70%] p-4 flex items-center justify-center bg-gray-900 relative">
          <FightBox />
        </div>
      </section>

      {/* Sağ Panel: Katalizör [Kardeş] Vitalleri (%25) */}
      <section className="relative isolate w-1/4 h-full border-l border-green-900 bg-gray-950 p-4 flex flex-col">
        {/* CSS & SVG ile Kız Silüeti */}
        <div className="absolute bottom-0 left-0 w-full h-[45%] opacity-10 pointer-events-none flex justify-center items-end pb-4 -z-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" className="w-2/3 h-full fill-red-500">
            <path d="M50,15 C42,15 38,22 40,30 C42,38 48,38 50,38 C52,38 58,38 60,30 C62,22 58,15 50,15 Z M45,40 C35,42 30,50 30,65 L35,100 L45,100 L45,75 L55,75 L55,100 L65,100 L70,65 C70,50 65,42 55,40 C50,45 45,40 45,40 Z" />
          </svg>
        </div>
        <h2 className="text-red-500 text-xl font-bold mb-4 tracking-widest">CATALYST</h2>
        <div className="space-y-6 mt-4">
          <div>
            <p className="text-gray-400 mb-1">KALP ATIŞI (BPM)</p>
            <p className={`text-4xl font-bold ${sibling.heartRate > 120 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
              {sibling.heartRate}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">SİNİRSEL STRES</p>
            <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden"><div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${sibling.neuroStress}%` }}></div></div>
          </div>
          <div>
            <p className="text-gray-400 mb-1">STABİLİTE İNDEKSİ</p>
            <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden"><div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${sibling.stabilityIndex}%` }}></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}