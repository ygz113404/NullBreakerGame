import React from 'react';
import { motion } from 'framer-motion';
import { ProjectileData } from './types/game';

interface ProjectileProps {
  data: ProjectileData;
  onMiss: (id: string) => void;
}

export function Projectile({ data, onMiss }: ProjectileProps) {
  return (
    <motion.div
      initial={{ y: -20, x: `${data.startX}%` }} // FightBox'ın hemen üstünde başlar
      animate={{ y: 320 }} // FightBox h:300px olduğu için altına geçene kadar düşer
      transition={{ duration: data.speed, ease: "linear" }}
      onAnimationComplete={() => onMiss(data.id)} // Animasyon tamamlanınca (mermi yere değdiğinde) tetiklenir
      className="absolute top-0 left-0 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"
      style={{ marginLeft: '-8px' }} // Merkeze hizalamak için yarı genişlik kadar margin
    >
      {/* İsteğe bağlı: çekirdek efekti için iç div */}
      <div className="w-2 h-2 m-auto mt-1 bg-white rounded-full opacity-80" />
    </motion.div>
  );
}