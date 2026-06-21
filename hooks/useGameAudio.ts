"use client";

import { useCallback, useEffect, useRef } from 'react';

export function useGameAudio(bpm: number, heartbeatEnabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!contextRef.current) contextRef.current = new AudioContext();
    return contextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') => {
    const context = getContext();
    const emitTone = () => {
      if (context.state !== 'running') return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
    };

    if (context.state === 'suspended') {
      void context.resume().then(emitTone);
    } else {
      emitTone();
    }
  }, [getContext]);

  useEffect(() => {
    const unlockAudio = () => {
      const context = getContext();
      if (context.state === 'suspended') void context.resume();
    };

    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
    };
  }, [getContext]);

  useEffect(() => () => {
    const context = contextRef.current;
    if (context && context.state !== 'closed') void context.close();
  }, []);

  useEffect(() => {
    if (!heartbeatEnabled) return;

    let secondBeat: ReturnType<typeof setTimeout> | undefined;
    const beat = () => {
      playTone(62, 0.1, 0.08, 'sine');
      secondBeat = setTimeout(() => playTone(52, 0.12, 0.055, 'sine'), 130);
    };
    const interval = setInterval(beat, Math.max(280, 60000 / Math.max(60, bpm)));
    beat();

    return () => {
      clearInterval(interval);
      if (secondBeat) clearTimeout(secondBeat);
    };
  }, [bpm, heartbeatEnabled, playTone]);

  useEffect(() => {
    if (!heartbeatEnabled) return;

    const melody = [110, 130.81, 146.83, 164.81, 146.83, 130.81, 98, 130.81];
    let step = 0;
    const playMusicStep = () => {
      playTone(melody[step % melody.length], 0.38, 0.011, 'triangle');
      if (step % 4 === 0) playTone(melody[step % melody.length] / 2, 0.55, 0.007, 'sine');
      step += 1;
    };
    const interval = setInterval(playMusicStep, 520);
    playMusicStep();
    return () => clearInterval(interval);
  }, [heartbeatEnabled, playTone]);

  const playSuccess = useCallback(() => playTone(620, 0.08, 0.035, 'square'), [playTone]);
  const playDamage = useCallback(() => playTone(95, 0.22, 0.08, 'sawtooth'), [playTone]);
  const playEmp = useCallback(() => {
    playTone(48, 0.5, 0.12, 'sawtooth');
    playTone(880, 0.18, 0.05, 'square');
  }, [playTone]);
  const playDecision = useCallback(() => playTone(180, 0.35, 0.06, 'triangle'), [playTone]);
  const playKey = useCallback((correct = true) => {
    playTone(correct ? 310 : 105, 0.035, correct ? 0.025 : 0.035, correct ? 'square' : 'sawtooth');
  }, [playTone]);

  return { playSuccess, playDamage, playEmp, playDecision, playKey };
}
