"use client";

import { useCallback, useEffect, useState } from 'react';
import { useGameAudio } from '../../hooks/useGameAudio';
import { useGameStore } from '../../store/useGameStore';

const MEMORY_COMMAND = 'STILL_HERE';

export function ChildhoodMemory() {
  const language = useGameStore((state) => state.language);
  const completeChildhoodMemory = useGameStore((state) => state.completeChildhoodMemory);
  const [typed, setTyped] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { playKey, playSuccess } = useGameAudio(82, false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (completed || event.ctrlKey || event.altKey || event.metaKey) return;

    if (event.key === 'Backspace') {
      event.preventDefault();
      setTyped((current) => current.slice(0, -1));
      return;
    }

    if (event.key.length !== 1 || !/[a-zA-Z_]/.test(event.key)) return;
    event.preventDefault();

    const character = event.key.toUpperCase();
    const nextValue = typed + character;
    const correct = MEMORY_COMMAND.startsWith(nextValue);
    playKey(correct);

    if (!correct) {
      setMistakes((current) => current + 1);
      return;
    }

    setTyped(nextValue);
    if (nextValue === MEMORY_COMMAND) {
      setCompleted(true);
      playSuccess();
    }
  }, [completed, playKey, playSuccess, typed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!completed) return;
    const timer = setTimeout(completeChildhoodMemory, 1800);
    return () => clearTimeout(timer);
  }, [completed, completeChildhoodMemory]);

  const remaining = MEMORY_COMMAND.slice(typed.length);

  return (
    <main className="min-h-screen w-full bg-[#070604] text-amber-100 font-mono flex items-center justify-center p-5 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12),transparent_60%)] pointer-events-none" />
      <section className="relative w-full max-w-3xl border border-amber-900/60 bg-black/70 p-6 sm:p-10 shadow-[0_0_50px_rgba(180,83,9,0.12)]">
        <p className="text-[10px] tracking-[0.35em] text-amber-700 mb-8">
          {language === 'tr' ? 'ANI ARŞİVİ // 11 YIL ÖNCE' : 'MEMORY ARCHIVE // 11 YEARS AGO'}
        </p>

        <div className="space-y-5 text-sm sm:text-base leading-relaxed">
          <p className="text-gray-500">
            {language === 'tr'
              ? 'Elektrikler yine kesilmişti. Aynı eski terminalin başında, karanlığın içinde birbirinize mesaj yazıyordunuz.'
              : 'The power was out again. In the dark, you were messaging each other through the same old terminal.'}
          </p>
          <p className="text-cyan-600">[KARDEŞ // YATAK ODASI]</p>
          <p className="text-cyan-200">
            {language === 'tr'
              ? 'Abi? Hat gitti sandım. Hâlâ orada mısın? Bizim kodumuzu yaz.'
              : 'Brother? I thought the line died. Are you still there? Type our code.'}
          </p>
        </div>

        <div className="mt-9 border-l-2 border-amber-700 bg-amber-950/10 px-5 py-6">
          <p className="text-[10px] tracking-[0.25em] text-amber-700 mb-3">
            {language === 'tr' ? 'CEVABI YAZ' : 'TYPE THE RESPONSE'}
          </p>
          <p className="text-2xl sm:text-4xl tracking-[0.18em] break-all" aria-label={MEMORY_COMMAND}>
            <span className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.55)]">{typed}</span>
            <span className="text-gray-700">{remaining}</span>
            {!completed && <span className="ml-1 text-amber-400 animate-pulse">_</span>}
          </p>
          {mistakes > 0 && !completed && (
            <p className="mt-3 text-[10px] text-red-500">
              {language === 'tr' ? 'Yanlış tuş sayılmaz. Kodu hatırla.' : 'Wrong keys do not count. Remember the code.'}
            </p>
          )}
        </div>

        <div className={`mt-7 min-h-16 transition-opacity duration-500 ${completed ? 'opacity-100' : 'opacity-0'}`} aria-live="polite">
          <p className="text-cyan-600 text-xs">[KARDEŞ // CANLI SİNYAL]</p>
          <p className="mt-2 text-cyan-200">
            {language === 'tr' ? 'Her zaman. Sen yazarsan ben cevap veririm.' : 'Always. If you type, I answer.'}
          </p>
        </div>
      </section>
    </main>
  );
}
