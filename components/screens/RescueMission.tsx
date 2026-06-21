"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGameAudio } from '../../hooks/useGameAudio';
import { useGameStore } from '../../store/useGameStore';
import { Language, RescueMission as RescueMissionType } from '../../types/game';

interface RescueMissionProps {
  mission: RescueMissionType;
  onComplete: (mission: RescueMissionType, mistakes: number) => void;
}

interface MissionCopy {
  location: string;
  title: string;
  speaker: string;
  message: string;
  command: string;
  stakes: string;
  success: string;
}

const getMissionCopy = (language: Language): Record<RescueMissionType, MissionCopy> => language === 'tr' ? {
  CLINIC: {
    location: 'KLİNİK-4 // ACİL GÜÇ HATTI',
    title: 'YAŞAM DESTEĞİNİ GERİ GETİR',
    speaker: 'DR. LENA',
    message: 'Burada on iki bin hasta var. Solunum cihazları kapanıyor. Beni kahraman yapma; yalnızca ışıkları geri getir.',
    command: 'RESTORE_CLINIC_POWER',
    stakes: 'Başarılı bağlantı Dr. Lena’yı ve 12.000 sivili güvene alır.',
    success: 'Güç geri geldi. Monitörler yeniden ötüyor. Bugün bu ses güzel.',
  },
  EVACUATION: {
    location: 'SEKTÖR-6 // TAHLİYE KORİDORU',
    title: 'SON TAHLİYE ROTASINI AÇ',
    speaker: 'DENİZ // KURTARMA-2',
    message: 'Son araç dolu. Nehir, küçük kardeşi Arda’nın elini bırakmıyor. Yetmiş beş bin kişi senin açacağın yolu bekliyor.',
    command: 'OPEN_EVAC_ROUTE',
    stakes: 'Rota Deniz, Nehir, Arda ve 75.000 sivili alt güverteye taşır.',
    success: 'Son araç çıktı. Nehir hâlâ Arda’nın elini tutuyor. İkisi de yaşıyor.',
  },
  GRID: {
    location: 'ŞEBEKE KONTROL // DENGE DÜĞÜMÜ',
    title: 'ŞEHRİN DÜŞÜŞÜNÜ YAVAŞLAT',
    speaker: 'MİRA // ŞEBEKE MÜHENDİSİ',
    message: 'Aetheria irtifa kaybediyor. Bu düğümü sabitlersen otuz bin kişi sığınaklara ulaşmak için zaman kazanacak.',
    command: 'STABILIZE_CITY_GRID',
    stakes: 'Düğüm Mira’yı korur ve 30.000 sivile zaman kazandırır.',
    success: 'Denge sağlandı. Şehir hâlâ düşüyor ama artık insanların koşabileceği kadar yavaş.',
  },
} : {
  CLINIC: {
    location: 'CLINIC-4 // EMERGENCY POWER LINE',
    title: 'RESTORE LIFE SUPPORT',
    speaker: 'DR. LENA',
    message: 'Twelve thousand patients are here. The ventilators are shutting down. Do not make me a hero; just bring the lights back.',
    command: 'RESTORE_CLINIC_POWER',
    stakes: 'A successful link secures Dr. Lena and 12,000 civilians.',
    success: 'Power is back. The monitors are beeping again. Today, that sound is beautiful.',
  },
  EVACUATION: {
    location: 'SECTOR-6 // EVACUATION CORRIDOR',
    title: 'OPEN THE FINAL EVACUATION ROUTE',
    speaker: 'DENIZ // RESCUE-2',
    message: "The last transport is full. Nehir won't let go of her little brother Arda. Seventy-five thousand people are waiting for your route.",
    command: 'OPEN_EVAC_ROUTE',
    stakes: 'The route carries Deniz, Nehir, Arda, and 75,000 civilians to the lower deck.',
    success: "The last transport is clear. Nehir is still holding Arda's hand. They are both alive.",
  },
  GRID: {
    location: 'GRID CONTROL // BALANCE NODE',
    title: "SLOW THE CITY'S FALL",
    speaker: 'MIRA // GRID ENGINEER',
    message: 'Aetheria is losing altitude. Stabilize this node and thirty thousand people will have time to reach the shelters.',
    command: 'STABILIZE_CITY_GRID',
    stakes: 'The node protects Mira and buys time for 30,000 civilians.',
    success: 'Balance restored. The city is still falling, but now it is slow enough for people to run.',
  },
};

export function RescueMission({ mission, onComplete }: RescueMissionProps) {
  const language = useGameStore((state) => state.language);
  const copy = useMemo(() => getMissionCopy(language)[mission], [language, mission]);
  const [typed, setTyped] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { playKey, playSuccess } = useGameAudio(84, false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (completed || event.ctrlKey || event.altKey || event.metaKey) return;

    if (event.key === 'Backspace' || event.key === 'Escape') {
      event.preventDefault();
      playKey(true);
      setTyped((current) => current.slice(0, -1));
      return;
    }

    if (event.key.length !== 1 || !/[a-zA-Z0-9_]/.test(event.key)) return;
    event.preventDefault();

    const nextValue = typed + event.key.toUpperCase();
    const correct = copy.command.startsWith(nextValue);
    playKey(correct);
    if (!correct) {
      setMistakes((current) => current + 1);
      return;
    }

    setTyped(nextValue);
    if (nextValue === copy.command) {
      setCompleted(true);
      playSuccess();
    }
  }, [completed, copy.command, playKey, playSuccess, typed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (completed) return;
    const timer = setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => clearInterval(timer);
  }, [completed]);

  useEffect(() => {
    if (!completed) return;
    const timer = setTimeout(() => onComplete(mission, mistakes), 1900);
    return () => clearTimeout(timer);
  }, [completed, mistakes, mission, onComplete]);

  return (
    <div className="w-full h-full bg-black border border-yellow-900/70 p-4 sm:p-6 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(202,138,4,0.08),transparent_52%)]" />
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="flex justify-between text-[9px] sm:text-[10px] tracking-[0.2em] text-yellow-700 mb-4">
          <span>{copy.location}</span>
          <span>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</span>
        </div>

        <h2 className="text-lg sm:text-2xl text-yellow-300 font-bold tracking-widest mb-4">{copy.title}</h2>
        <div className="border-l-2 border-yellow-700 bg-yellow-950/10 px-4 py-3 mb-5">
          <p className="text-[10px] text-yellow-600 tracking-wider">[{copy.speaker}{' // '}{language === 'tr' ? 'CANLI TELSİZ' : 'LIVE RADIO'}]</p>
          <p className="text-xs sm:text-sm text-yellow-100 mt-2 leading-relaxed">“{completed ? copy.success : copy.message}”</p>
        </div>

        <p className="text-[10px] text-gray-500 mb-2">{language === 'tr' ? 'YÖNLENDİRME KOMUTU' : 'ROUTING COMMAND'}</p>
        <div className={`border p-3 sm:p-4 transition-colors ${completed ? 'border-green-700 bg-green-950/20' : 'border-cyan-900 bg-cyan-950/10'}`}>
          <p className="text-base sm:text-2xl tracking-wider break-all">
            <span className="text-green-400">{typed}</span>
            <span className="text-gray-600">{copy.command.slice(typed.length)}</span>
            {!completed && <span className="text-cyan-400 animate-pulse ml-1">_</span>}
          </p>
        </div>

        <div className="flex justify-between gap-4 mt-3 text-[9px] sm:text-[10px]">
          <p className="text-gray-600">{copy.stakes}</p>
          <p className={mistakes > 0 ? 'text-red-600 shrink-0' : 'text-gray-700 shrink-0'}>
            {language === 'tr' ? 'HATA' : 'ERRORS'}: {mistakes}
          </p>
        </div>
      </div>
    </div>
  );
}
