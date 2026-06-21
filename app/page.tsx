"use client";

import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { MainMenu } from '../components/screens/MainMenu';
import { IntroScreen } from '../components/screens/IntroScreen';
import { GameScreen } from '../components/screens/GameScreen';

export default function GameLayout() {
  const scene = useGameStore((state) => state.scene);
  const language = useGameStore((state) => state.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  switch (scene) {
    case 'MENU':
      return <MainMenu />;
    case 'INTRO':
      return <IntroScreen />;
    default:
      return <GameScreen />;
  }
}
