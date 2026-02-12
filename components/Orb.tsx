import React from 'react';
import { AppMode } from '../types';

interface OrbProps {
  mode: AppMode;
  onClick?: () => void;
}

export const Orb: React.FC<OrbProps> = ({ mode, onClick }) => {
  let colorClass = "bg-white shadow-[0_0_50px_rgba(255,255,255,0.3)]";
  let animateClass = "animate-pulse";

  if (mode === AppMode.PROCESSING) {
    colorClass = "bg-amber-100 shadow-[0_0_80px_rgba(251,191,36,0.6)]"; // Working hard
    animateClass = "animate-spin-slow"; // Custom spin defined in tailwind config conceptually or just pulse
  } else if (mode === AppMode.LOCKED) {
    colorClass = "bg-red-900 shadow-[0_0_60px_rgba(153,27,27,0.8)]"; // The Shakedown
    animateClass = "";
  } else if (mode === AppMode.TELEPROMPTER) {
    colorClass = "bg-emerald-900 opacity-20"; // Subtle
    animateClass = "";
  }

  return (
    <div 
      onClick={onClick}
      className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-700 ${animateClass}`}
    >
      <div className={`absolute inset-0 rounded-full blur-xl opacity-50 ${colorClass}`} />
      <div className={`relative z-10 w-20 h-20 rounded-full border border-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden bg-black/20`}>
        <span className="font-serif-display text-xs text-white/40 tracking-widest lowercase">sigh.</span>
      </div>
    </div>
  );
};
