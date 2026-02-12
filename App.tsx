import React, { useState, useEffect, useRef } from 'react';
import { Orb } from './components/Orb';
import { Teleprompter } from './components/Teleprompter';
import { ShakedownModal } from './components/ShakedownModal';
import { refineContent } from './services/geminiService';
import { AppMode, GeneratedContent, EditorState } from './types';
import { EDITOR_QUIPS } from './constants';
import ReactMarkdown from 'react-markdown';

// Icons
const MicIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const MagicIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const TrashIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const SendIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>; // Using as "Inject/Publish"

export default function App() {
  const [state, setState] = useState<EditorState>({
    fogLevel: 10, // Starts foggy
    inputTranscript: '',
    output: null,
    mode: AppMode.IDLE,
    editorMessage: "What do you want?"
  });
  
  const [inputText, setInputText] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize camera for the "Vibe"
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.log("Camera access denied or not available - Vibe diminished but functional."));
  }, []);

  const handleGhostwrite = async () => {
    if (!inputText.trim()) return;

    setState(prev => ({ 
      ...prev, 
      mode: AppMode.PROCESSING, 
      fogLevel: 50, // Deep fog while thinking
      editorMessage: "Thinking... try not to interrupt."
    }));

    try {
      const result = await refineContent(inputText);
      
      const randomQuip = EDITOR_QUIPS[Math.floor(Math.random() * EDITOR_QUIPS.length)];

      setState(prev => ({
        ...prev,
        mode: AppMode.REVIEW,
        output: result,
        fogLevel: 0, // Clarity achieved
        editorMessage: randomQuip
      }));
    } catch (e) {
      setState(prev => ({
        ...prev,
        mode: AppMode.IDLE,
        fogLevel: 20,
        editorMessage: "I couldn't fix that. Try again."
      }));
    }
  };

  const handleAction = (action: 'SHOO' | 'HUSH' | 'DROP') => {
    switch (action) {
      case 'SHOO':
        // Crumple effect logic would go here
        setState(prev => ({
          ...prev,
          output: null,
          mode: AppMode.IDLE,
          fogLevel: 10,
          editorMessage: "Trash. Gone. Next."
        }));
        setInputText("");
        break;
      case 'HUSH':
        // Enter Teleprompter
        setState(prev => ({ ...prev, mode: AppMode.TELEPROMPTER }));
        break;
      case 'DROP':
        // Trigger Shakedown
        setState(prev => ({ ...prev, mode: AppMode.LOCKED }));
        break;
    }
  };

  const unlockContent = () => {
    // Simulate payment success
    setState(prev => ({ ...prev, mode: AppMode.REVIEW }));
    alert("Payment processed. Sigh Inc thanks you.");
    // In a real app, actually inject content to Twitter here
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(state.output?.rawText || "")}`, '_blank');
  };

  // Enhanced Blur/Fog Animation
  // We use a cubic-bezier for a "premium" feel (starts fast, slows down gently)
  // We also scale slightly to simulate "focusing" the lens.
  const fogStyle: React.CSSProperties = {
    filter: `blur(${state.fogLevel}px)`,
    opacity: state.mode === AppMode.PROCESSING ? 0.6 : 1,
    transform: state.mode === AppMode.REVIEW ? 'scale(1)' : 'scale(0.98)',
    transition: 'filter 2.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 2.5s ease-out, transform 2.5s cubic-bezier(0.19, 1, 0.22, 1)'
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-hidden">
      
      {/* Background Camera Layer (The "Mirror") */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        
        {/* The Editor's Orb - Persistent */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
          <Orb mode={state.mode} />
          <p className="mt-4 text-center font-serif-display text-white/50 text-sm tracking-widest uppercase animate-pulse">
            {state.editorMessage}
          </p>
        </div>

        {/* Content Area */}
        <div 
          style={fogStyle} 
          className="w-full max-w-3xl min-h-[60vh] flex flex-col justify-center will-change-[filter,transform,opacity]"
        >
          {state.mode === AppMode.IDLE || state.mode === AppMode.PROCESSING ? (
             <div className="glass-panel p-8 rounded-sm">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ramble here. I'll fix it..."
                  className="w-full h-64 bg-transparent border-none focus:ring-0 text-white/80 font-serif-display text-2xl resize-none placeholder:text-white/20"
                />
                <div className="mt-6 flex justify-between items-center">
                   <div className="flex gap-4">
                      <button className="p-3 rounded-full hover:bg-white/10 transition text-white/50 hover:text-white">
                        <MicIcon />
                      </button>
                   </div>
                   <button 
                    onClick={handleGhostwrite}
                    disabled={state.mode === AppMode.PROCESSING}
                    className="px-8 py-3 bg-white text-black font-serif-display tracking-wide hover:bg-gray-200 transition-colors disabled:opacity-50"
                   >
                     {state.mode === AppMode.PROCESSING ? "Fixing..." : "Fix My Mess"}
                   </button>
                </div>
             </div>
          ) : (
             <div className="glass-panel p-10 rounded-sm relative group animate-fade-in">
                {/* The "Asset Class" Content */}
                <div className="prose prose-invert prose-lg max-w-none font-serif-display">
                    {state.output && (
                      <ReactMarkdown 
                        components={{
                          strong: ({node, ...props}) => <span className="font-bold text-white bg-white/10 px-0.5" {...props} />
                        }}
                      >
                        {state.output.formattedText}
                      </ReactMarkdown>
                    )}
                </div>

                {/* Legitimacy Protocol Footer */}
                {state.output && state.output.citations.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-white/10">
                    <h4 className="text-xs font-mono-code uppercase tracking-widest text-white/40 mb-4">Legitimacy Protocol / Sources</h4>
                    <ul className="space-y-2">
                      {state.output.citations.map((cite, idx) => (
                        <li key={idx} className="text-xs font-mono-code text-white/60 flex items-center gap-2">
                           <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px]">{idx + 1}</span>
                           <a href={cite.url} target="_blank" rel="noreferrer" className="hover:text-white underline decoration-white/30 underline-offset-4 truncate max-w-md">
                             {cite.title}
                           </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
             </div>
          )}
        </div>

        {/* Gesture/Action Bar (Only visible when reviewing) */}
        {state.mode === AppMode.REVIEW && (
          <div className="fixed bottom-10 z-40 flex gap-6">
            <button 
              onClick={() => handleAction('SHOO')}
              className="flex flex-col items-center gap-2 text-white/40 hover:text-red-400 transition-colors group"
            >
              <div className="p-4 rounded-full glass-panel group-hover:border-red-400/50 transition-colors">
                 <TrashIcon />
              </div>
              <span className="text-[10px] font-mono-code uppercase tracking-widest">Shoo</span>
            </button>

            <button 
              onClick={() => handleAction('HUSH')}
              className="flex flex-col items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors group"
            >
              <div className="p-4 rounded-full glass-panel group-hover:border-emerald-400/50 transition-colors">
                 <MagicIcon />
              </div>
              <span className="text-[10px] font-mono-code uppercase tracking-widest">Hush</span>
            </button>

            <button 
              onClick={() => handleAction('DROP')}
              className="flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors group"
            >
              <div className="p-4 rounded-full glass-panel bg-white/5 hover:bg-white/20 group-hover:border-white/50 transition-colors">
                 <SendIcon />
              </div>
              <span className="text-[10px] font-mono-code uppercase tracking-widest">Drop</span>
            </button>
          </div>
        )}

      </div>

      {/* Modes Overlay */}
      {state.mode === AppMode.TELEPROMPTER && state.output && (
        <Teleprompter 
          content={state.output} 
          onExit={() => setState(prev => ({ ...prev, mode: AppMode.REVIEW }))} 
        />
      )}

      {state.mode === AppMode.LOCKED && (
        <ShakedownModal 
          onPay={unlockContent} 
          onCancel={() => setState(prev => ({ ...prev, mode: AppMode.REVIEW }))} 
        />
      )}

    </div>
  );
}
