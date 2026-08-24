import React from 'react';

interface IridescentOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  isListening?: boolean;
  audioLevel?: number;
  className?: string;
  onClick?: () => void;
}

export const IridescentOrb: React.FC<IridescentOrbProps> = ({
  size = 'lg',
  isListening = false,
  audioLevel = 0,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-12 h-12',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-28 h-28 sm:w-32 sm:h-32',
    hero: 'w-28 h-28 sm:w-32 sm:h-32 m-3 sm:m-5',
  };

  const dynamicScale = isListening ? 1 + Math.min(0.22, audioLevel / 380) : 1;

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer select-none group ${sizeMap[size]} ${className}`}
      style={{
        transform: `scale(${dynamicScale})`,
        transition: 'transform 0.14s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      title={isListening ? 'Listening... Click to stop' : 'Click to Speak with AI Assistant'}
    >
      {/* 1. Dynamic Audio-Reactive Sound Wave Halo Rings (With Generous Breathing Room) */}
      {isListening && (
        <>
          {/* Outermost Expanding Sound Wave */}
          <div
            className="absolute inset-[-20px] sm:inset-[-26px] rounded-full border border-emerald-400/40 dark:border-emerald-400/30 animate-ping pointer-events-none"
            style={{ animationDuration: '2.4s' }}
          />
          {/* Secondary Harmonic Wave */}
          <div
            className="absolute inset-[-12px] sm:inset-[-16px] rounded-full border border-sky-400/35 dark:border-sky-400/25 animate-ping pointer-events-none"
            style={{ animationDuration: '1.8s', animationDelay: '0.4s' }}
          />
          {/* Radiant Middle Glow */}
          <div
            className="absolute inset-[-10px] rounded-full animate-pulse pointer-events-none blur-lg"
            style={{
              background: `radial-gradient(circle, rgba(56, 189, 248, ${0.4 + audioLevel / 200}) 0%, rgba(244, 114, 182, ${0.3 + audioLevel / 250}) 50%, transparent 75%)`,
            }}
          />
        </>
      )}

      {/* 2. Idle Ambient Floating Glow */}
      {!isListening && (
        <div
          className="absolute inset-[-8px] rounded-full opacity-60 group-hover:opacity-100 blur-lg transition-opacity pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(244, 114, 182, 0.25) 50%, transparent 70%)',
          }}
        />
      )}

      {/* 3. 3D Glass Pearl Sphere with Pearlescent Gradients */}
      <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl animate-soft-float ring-2 ring-white/80 dark:ring-white/20 group-hover:ring-emerald-400/70 transition-all">
        
        {/* Multi-layered Liquid Plasma Gradient */}
        <div
          className="absolute inset-0 rounded-full animate-fluid-flow"
          style={{
            background: `
              radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.6) 18%, transparent 38%),
              radial-gradient(circle at 75% 25%, rgba(244, 114, 182, 0.95) 0%, transparent 42%),
              radial-gradient(circle at 25% 75%, rgba(56, 189, 248, 0.95) 0%, transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.9) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.85) 0%, transparent 60%),
              conic-gradient(from 180deg at 50% 50%, #38bdf8 0deg, #f472b6 90deg, #fb923c 180deg, #a855f7 270deg, #38bdf8 360deg)
            `,
            backgroundSize: '140% 140%',
            filter: 'contrast(1.15) brightness(1.05)',
          }}
        />

        {/* Primary Specular Light Highlight Arc */}
        <div
          className="absolute top-1.5 left-3 right-3 h-[42%] rounded-[100%] pointer-events-none animate-specular-drift"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.15) 100%)',
            filter: 'blur(0.2px)',
          }}
        />

        {/* Specular Point Glint */}
        <div
          className="absolute top-3 left-6 w-3 h-2 rounded-full bg-white opacity-95 pointer-events-none transform -rotate-25 shadow-xs"
        />

        {/* Secondary Edge Rim Highlight */}
        <div
          className="absolute bottom-1.5 right-3 w-1/3 h-1/4 rounded-[100%] opacity-65 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.85) 0%, transparent 100%)',
            transform: 'rotate(12deg)',
            filter: 'blur(0.4px)',
          }}
        />

        {/* Inner 3D Sphere Depth Rim */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: 'inset 0 -10px 22px rgba(15, 23, 42, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.95)',
          }}
        />
      </div>

      {/* Ground Depth Shadow */}
      <div
        className="absolute -bottom-3 w-[70%] h-3 rounded-full blur-xs opacity-35 pointer-events-none bg-slate-900/40 dark:bg-black/60"
      />
    </div>
  );
};
