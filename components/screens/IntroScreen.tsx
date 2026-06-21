"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types/game';
import { getDialogues } from '../../game/constants/dialogues';

export function IntroScreen() {
  const language = useGameStore((state: GameState) => state.language);
  const completeIntro = useGameStore((state: GameState) => state.completeIntro);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  const DIALOGUES = useMemo(() => getDialogues(language), [language]);
  const introDialogues = DIALOGUES.intro;

  useEffect(() => {
    if (dialogueIndex >= introDialogues.length) return;

    const currentLine = introDialogues[dialogueIndex];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex <= currentLine.text.length) {
        setDisplayedText(currentLine.text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [dialogueIndex, introDialogues]);

  const handleNext = () => {
    if (dialogueIndex < introDialogues.length - 1) {
      setDisplayedText('');
      setDialogueIndex(prev => prev + 1);
    } else {
      completeIntro();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-gray-300 font-mono p-8">
      <div className="max-w-3xl text-center space-y-6">
        {dialogueIndex < introDialogues.length && (
          <div>
            <p className="text-sm text-gray-500 mb-2">[{introDialogues[dialogueIndex].speaker}]</p>
            <p className={`text-xl leading-relaxed min-h-[4rem] ${introDialogues[dialogueIndex].speaker.includes('ANI_LOG') ? 'text-yellow-500 italic drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]' : ''} ${['KARDEŞ', 'SIBLING'].includes(introDialogues[dialogueIndex].speaker) ? 'text-red-400' : ''}`}>
              {displayedText}
              <span className="animate-pulse bg-gray-300 w-3 h-6 inline-block align-middle ml-2"></span>
            </p>
          </div>
        )}
      </div>
      <button onClick={handleNext} className="mt-12 px-6 py-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 transition-colors animate-pulse">
        {dialogueIndex < introDialogues.length - 1 
          ? (language === 'tr' ? "> DEVAM" : "> NEXT") 
          : (language === 'tr' ? "> AETHERIA'YA GİRİŞ YAP" : "> ENTER AETHERIA")}
      </button>
    </div>
  );
}
