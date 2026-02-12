import React from 'react';
import { SHAKEDOWN_PRICE, PUBLISHER_PASS_PRICE } from '../constants';

interface ShakedownModalProps {
  onPay: () => void;
  onCancel: () => void;
}

export const ShakedownModal: React.FC<ShakedownModalProps> = ({ onPay, onCancel }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="max-w-md w-full glass-panel p-8 rounded-none border-l-4 border-l-red-900 relative">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-white/30 hover:text-white"
        >
          ✕
        </button>
        
        <h2 className="text-3xl font-serif-display mb-2 text-white">Value isn't free.</h2>
        <div className="h-px w-12 bg-red-900 mb-6"></div>
        
        <p className="text-white/70 font-light mb-6 leading-relaxed">
          I just saved you 4 hours of research and a potential lawsuit. 
          This is asset class content. 
        </p>

        <div className="space-y-4">
          <button 
            onClick={onPay}
            className="w-full py-4 bg-white text-black font-serif-display text-lg tracking-wide hover:bg-gray-200 transition-colors flex justify-between px-6 items-center"
          >
            <span>Single Unlock</span>
            <span className="font-bold">{SHAKEDOWN_PRICE}</span>
          </button>
          
          <button 
            onClick={onPay}
            className="w-full py-4 border border-white/20 text-white/60 font-serif-display text-lg tracking-wide hover:bg-white/5 transition-colors flex justify-between px-6 items-center"
          >
            <span>Publisher Pass</span>
            <span className="font-bold">{PUBLISHER_PASS_PRICE}</span>
          </button>
        </div>

        <p className="mt-6 text-xs text-center text-white/20 font-mono-code uppercase tracking-widest">
          Secured by Sigh Inc.
        </p>
      </div>
    </div>
  );
};
