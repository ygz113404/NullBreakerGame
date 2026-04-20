import { useEffect, useRef } from 'react';
import { useGameStore } from './store/useGameStore';
import { GameState } from './types/game';

export function useGameLoop(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  
  // React re-render'larında döngüyü bozmamak için callback'i bir ref içinde tutuyoruz
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const status = useGameStore((state: GameState) => state.status);

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        // Döngü yalnızca savaş esnasında dönsün
        if (status === 'FIGHTING') {
          callbackRef.current(deltaTime);
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [status]);
}