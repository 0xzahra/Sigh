import React, { useEffect, useRef, useState } from 'react';
import { GeneratedContent } from '../types';

interface TeleprompterProps {
  content: GeneratedContent;
  onExit: () => void;
}

export const Teleprompter: React.FC<TeleprompterProps> = ({ content, onExit }) => {
  const [scrollSpeed, setScrollSpeed] = useState(1); // 0 = pause, 1 = slow, 3 = fast
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const scroll = () => {
      if (containerRef.current && isPlaying) {
        containerRef.current.scrollTop += scrollSpeed * 0.5;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, scrollSpeed]);

  // Magical Gesture Simulation Controls
  const togglePlay = () => setIsPlaying(!isPlaying);
  const speedUp = () => setScrollSpeed(prev => Math.min(prev + 1, 5));
  const slowDown = () => setScrollSpeed(prev => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 z-40 bg-black text-white flex flex-col">
      {/* Controls Overlay (Simulated Gestures) */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 z-50 pointer-events-none">
        <div className="pointer-events-auto flex gap-4 glass-panel px-6 py-3 rounded-full">
            <button onClick={slowDown} className="text-sm font-mono-code hover:text-amber-400">{'[ LOWER HAND ]'}</button>
            <button onClick={togglePlay} className="text-sm font-mono-code hover:text-amber-400">{isPlaying ? '[ PINCH ]' : '[ RELEASE ]'}</button>
            <button onClick={speedUp} className="text-sm font-mono-code hover:text-amber-400">{'[ RAISE HAND ]'}</button>
        </div>
        <button onClick={onExit} className="pointer-events-auto glass-panel px-6 py-3 rounded-full text-sm font-mono-code text-red-400 hover:text-red-300">
            {'[ END SESSION ]'}
        </button>
      </div>

      {/* Scrolling Content */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto no-scrollbar px-8 md:px-32 py-24 scroll-smooth"
        style={{ scrollBehavior: 'auto' }} // Disable native smooth scroll for JS control
      >
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Director's Notes */}
            {content.directorNotes.length > 0 && (
                <div className="text-emerald-500 font-mono-code text-sm mb-12 border-l-2 border-emerald-900 pl-4 py-2">
                    DIRECTOR NOTES: {content.directorNotes.join(" • ")}
                </div>
            )}

            {/* The Script */}
            <div className="text-5xl md:text-7xl font-serif-display leading-tight text-white/90">
                 {/* Remove markdown for teleprompter, or keep bold for emphasis? Keeping bold logic but rendering as standard text for readability */}
                 {content.rawText.split('\n').map((line, i) => (
                     <p key={i} className="mb-12">{line}</p>
                 ))}
            </div>
            
            <div className="h-screen"></div> {/* Spacer for scroll end */}
        </div>
      </div>
    </div>
  );
};
