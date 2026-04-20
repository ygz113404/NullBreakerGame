"use client";

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameState } from '../types/game';
import { MainMenu } from '../components/screens/MainMenu';
import { IntroScreen } from '../components/screens/IntroScreen';
import { GameScreen } from '../components/screens/GameScreen';

export default function GameLayout() {
  const status = useGameStore((state: GameState) => state.status);

  switch (status) {
    case 'MENU':
      return <MainMenu />;
    case 'INTRO':
      return <IntroScreen />;
    case 'IDLE':
    case 'FIGHTING':
    case 'DIALOGUE':
    case 'GAME_OVER':
      return <GameScreen />;
    default:
      // Bilinmeyen bir durum olursa ana menüye dön.
      return <MainMenu />;
  }
}