"use client";

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameState, ProjectileData } from '../types/game';
import { Projectile } from '../Projectile';

export function FightBox() {
  const status = useGameStore((state: GameState) => state.status);
  const language = useGameStore((state: GameState) => state.language);
  const setGameStatus = useGameStore((state: GameState) => state.setGameStatus);
  const [projectiles, setProjectiles] = useState<ProjectileData[]>([]);

  // Düşman mermilerini üreten basit bir spawner (Şimdilik Test Amaçlı)
  useEffect(() => {
    if (status !== 'FIGHTING') return;

    const spawnInterval = setInterval(() => {
      const newProjectile: ProjectileData = {
        id: Math.random().toString(36).substring(2, 9),
        startX: Math.random() * 90 + 5, // %5 ile %95 arasında rastgele X noktası
        speed: Math.random() * 1.5 + 1.5, // 1.5s ile 3s arasında rastgele hız
        damage: 10,
      };
      
      setProjectiles((prev) => [...prev, newProjectile]);
    }, 800); // Saniyede 1'den biraz fazla mermi

    return () => clearInterval(spawnInterval);
  }, [status]);

  // Mermi aşağıya düştüğünde (kalkan ile yakalanamadığında) çalışır
  const handleMiss = (id: string) => {
    setProjectiles((prev) => prev.filter((p) => p.id !== id));
    // TODO: Burada Zustand store üzerinden şehre (veya kardeşe) hasar verme mantığı çalışacak.
  };

  return (
    <div className="w-[400px] h-[300px] border-2 border-gray-600 bg-black relative overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)]">
      {status === 'IDLE' ? (
        <button 
          className="px-4 py-2 z-10 bg-red-900 hover:bg-red-700 text-white font-bold tracking-widest transition-colors border border-red-500"
          onClick={() => setGameStatus('FIGHTING')}
        >
          {language === 'en' ? 'DISCONNECT' : 'BAĞLANTIYI KOPAR'}
        </button>
      ) : (
        <>
          {projectiles.map((p) => (
            <Projectile key={p.id} data={p} onMiss={handleMiss} />
          ))}
          {/* PlayerBar (Kalkan) bileşeni ileride buraya eklenecek */}
        </>
      )}
    </div>
  );
}