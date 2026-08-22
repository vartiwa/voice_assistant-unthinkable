import React from 'react';
import { IridescentOrb } from './IridescentOrb';
import { X, Mic, MicOff, Send, Pause, Play } from 'lucide-react';

interface ImmersiveVoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  onToggleListen: () => void;
  liveTranscript: string;
  lastFeedback: { message: string; success: boolean } | null;
  audioLevel: number;
  onDoneProcessing: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ImmersiveVoiceOverlay: React.FC<ImmersiveVoiceOverlayProps> = ({
  isOpen,
  onClose,
  isListening,
  onToggleListen,
  liveTranscript,
  lastFeedback,
  audioLevel,
  onDoneProcessing,
  isMuted,
  onToggleMute,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#F7F6F3]/98 dark:bg-zinc-950/98 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Header: Close chat pill matching inspiration */}
      <div className="w-full flex items-center justify-center pt-2">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-white/95 dark:bg-zinc-900/95 text-xs font-extrabold text-slate-900 dark:text-white border border-slate-200/90 dark:border-zinc-800 shadow-md hover:scale-105 transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Close chat</span>
        </button>
      </div>

      {/* Center 3D Iridescent Orb & Spoken Typography */}
      <div className="flex flex-col items-center text-center max-w-xl w-full my-auto space-y-6">
        
        {/* Large Iridescent Orb */}
        <div className="my-2">
          <IridescentOrb size="xl" isListening={isListening} audioLevel={audioLevel} />
        </div>

        {/* Listening / Status subtitle */}
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase flex items-center justify-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
            {isListening ? 'VoiceCart is listening...' : 'Tap the mic or speak to begin'}
          </span>
        </div>

        {/* Dynamic Spoken Text Display in huge luxury typography */}
        <div className="min-h-[100px] flex items-center justify-center px-4">
          {liveTranscript ? (
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight animate-in fade-in">
              "{liveTranscript}"
            </p>
          ) : lastFeedback ? (
            <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
              {lastFeedback.message}
            </p>
          ) : (
            <p className="text-xl sm:text-2xl font-bold text-slate-400 dark:text-zinc-600">
              "Add 2 gallons of whole milk and 3 organic Honeycrisp apples."
            </p>
          )}
        </div>
      </div>

      {/* Bottom Floating Action Bar (Pause/Mute, Big Glowing Mic, Send/Done) */}
      <div className="w-full max-w-xs sm:max-w-sm flex items-center justify-center gap-6 pb-6">
        
        {/* Left: Pause / Play Button */}
        <button
          onClick={onToggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
            isMuted
              ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:border-rose-900'
              : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-800 shadow-md hover:scale-105'
          }`}
          title={isMuted ? 'Unmute Voice Responses' : 'Mute Voice Responses'}
        >
          {isMuted ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Center: Big Vibrant Orange-Coral Glowing Mic Button */}
        <div className="relative">
          {isListening && (
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 opacity-40 blur-xl animate-ping" />
          )}
          <button
            onClick={onToggleListen}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 ${
              isListening
                ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-orange-500/50 animate-pulse ring-4 ring-orange-200 dark:ring-orange-950'
                : 'bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/30 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        {/* Right: Send / Done Button */}
        <button
          onClick={onDoneProcessing}
          disabled={!liveTranscript}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-800 shadow-md disabled:opacity-30 hover:scale-105 transition-all"
          title="Process command now"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
