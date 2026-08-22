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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#F7F6F3]/95 dark:bg-zinc-950/95 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Header: Close chat pill */}
      <div className="w-full flex items-center justify-center pt-2">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-zinc-800 shadow-sm hover:scale-105 transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Close chat</span>
        </button>
      </div>

      {/* Center 3D Iridescent Orb & Spoken Typography */}
      <div className="flex flex-col items-center text-center max-w-xl w-full my-auto space-y-6">
        
        {/* Large Iridescent Orb */}
        <div className="my-4">
          <IridescentOrb size="xl" isListening={isListening} audioLevel={audioLevel} />
        </div>

        {/* Listening / Status pill */}
        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center justify-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
            {isListening ? 'VoiceCart is listening...' : 'Ready to listen'}
          </span>
        </div>

        {/* Dynamic Spoken Text Display */}
        <div className="min-h-[90px] flex items-center justify-center px-4">
          {liveTranscript ? (
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight animate-in fade-in">
              "{liveTranscript}"
            </p>
          ) : lastFeedback ? (
            <p className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-slate-300">
              {lastFeedback.message}
            </p>
          ) : (
            <p className="text-xl sm:text-2xl font-bold text-slate-400 dark:text-zinc-600">
              "Add 2 gallons of milk and 3 organic apples..."
            </p>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Bar (Pause, Big Mic, Done) */}
      <div className="w-full max-w-sm flex items-center justify-center gap-6 pb-4">
        
        {/* Pause / Mute TTS Audio */}
        <button
          onClick={onToggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
            isMuted
              ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:text-rose-400'
              : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-800 shadow-sm'
          }`}
          title={isMuted ? 'Unmute Voice Responses' : 'Mute Voice Responses'}
        >
          {isMuted ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Big Orange-Coral Glowing Mic Button */}
        <div className="relative">
          {isListening && (
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 opacity-30 blur-lg animate-ping" />
          )}
          <button
            onClick={onToggleListen}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 ${
              isListening
                ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-orange-500/40 animate-pulse'
                : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        {/* Send / Process Done Button */}
        <button
          onClick={onDoneProcessing}
          disabled={!liveTranscript}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-800 shadow-sm disabled:opacity-30 hover:scale-105 transition-all"
          title="Process command now"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
