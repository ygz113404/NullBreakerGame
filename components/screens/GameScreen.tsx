"use client";

import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types/game';
import { FightBox } from './FightBox';

export function GameScreen() {
  const city = useGameStore((state: GameState) => state.city);
  const sibling = useGameStore((state: GameState) => state.sibling);
  const status = useGameStore((state: GameState) => state.status);

  // Boss ve Oyuncu Can Durumları
  const [bossHealth, setBossHealth] = useState(1000);
  const [playerHealth, setPlayerHealth] = useState(1000);

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
        <div className="h-[25%] border-b border-gray-800 p-4 flex flex-col">
          {/* Boss Info & Health Bar */}
          <div className="mb-2 mt-1">
            <div className="flex justify-between items-end mb-1">
              <h2 className="text-red-500 text-2xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                THE FIREWALL <span className="text-xs text-gray-500 font-normal">:: KAPI GARDİYANI</span>
              </h2>
              <span className="text-red-500 font-mono text-sm">{bossHealth} / 1000</span>
            </div>
            <div className="w-full bg-black border border-red-900 h-4 rounded-sm overflow-hidden">
              <div className="bg-red-600 h-full transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.8)]" style={{ width: `${Math.max(0, (bossHealth / 1000) * 100)}%` }}></div>
            </div>
          </div>

          {/* Boss Dialogue / Terminal Logs */}
          <div className="flex-1 bg-gray-950/50 border border-gray-800 p-2 rounded font-mono text-xs overflow-y-auto">
            <p className="text-gray-500 mb-2">Bağlantı kuruldu... Hedef sistem: Aetheria_Core</p>
            <p className="text-cyan-500 mb-2">&gt; Null Breaker sızma işlemi başarılı.</p>
            <p className="text-red-400 leading-relaxed">
              <span className="font-bold text-red-500">FIREWALL:</span> "Aetheria ağına yetkisiz erişim tespit edildi. Bu kusursuz şehri ve içindeki enerjiyi korumakla programlandım. Kendi kanın için milyonları feda edemezsin. Geri dön, yoksa yok edilirsin!"
            </p>
          </div>
        </div>
        <div className="h-[60%] p-4 flex items-center justify-center bg-gray-900 relative">
          <FightBox 
            bossHealth={bossHealth} setBossHealth={setBossHealth}
            playerHealth={playerHealth} setPlayerHealth={setPlayerHealth}
          />
        </div>
        
        {/* Player Health Bar (Alt %15) */}
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