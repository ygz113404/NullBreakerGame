"use client";

import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { MainMenu } from '../components/screens/MainMenu';
import { IntroScreen } from '../components/screens/IntroScreen';
import { GameScreen } from '../components/screens/GameScreen';
import { ChildhoodMemory } from '../components/screens/ChildhoodMemory';

export default function GameLayout() {
  const scene = useGameStore((state) => state.scene);
  const language = useGameStore((state) => state.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  switch (scene) {
    case 'MENU':
      return <MainMenu />;
    case 'CHILDHOOD_MEMORY':
      return <ChildhoodMemory />;
    case 'INTRO':
      return <IntroScreen />;
    default:
      return <GameScreen />;
  }
}
