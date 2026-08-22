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
    hero: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  const dynamicScale = isListening ? 1 + Math.min(0.25, audioLevel / 350) : 1;

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer select-none group ${sizeMap[size]} ${className}`}
      style={{
        transform: `scale(${dynamicScale})`,
        transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      title={isListening ? 'Listening... Click to stop' : 'Click to Speak with AI'}
    >
      {/* 1. Dynamic Audio-Reactive Sound Wave Halo Rings */}
      {isListening && (
        <>
          {/* Outermost Expanding Sound Wave */}
          <div
            className="absolute inset-[-14px] rounded-full border border-emerald-400/40 dark:border-emerald-400/30 animate-ping pointer-events-none"
            style={{ animationDuration: '2s' }}
          />
          {/* Middle Radiant Iridescent Glow */}
          <div
            className="absolute inset-[-8px] rounded-full animate-pulse pointer-events-none blur-md"
            style={{
              background: `radial-gradient(circle, rgba(56, 189, 248, ${0.35 + audioLevel / 200}) 0%, rgba(244, 114, 182, ${0.25 + audioLevel / 250}) 50%, transparent 75%)`,
            }}
          />
        </>
      )}

      {/* 2. Idle Ambient Floating Glow */}
      {!isListening && (
        <div
          className="absolute inset-[-4px] rounded-full opacity-50 group-hover:opacity-90 blur-md transition-opacity pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(192, 132, 252, 0.25) 50%, transparent 70%)',
          }}
        />
      )}

      {/* 3. 3D Glass Pearl Sphere with Crisp Layering */}
      <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl animate-soft-float ring-2 ring-white/70 dark:ring-white/20 group-hover:ring-white/90 transition-all">
        
        {/* Multi-layered Liquid Plasma Gradient */}
        <div
          className="absolute inset-0 rounded-full animate-fluid-flow"
          style={{
            background: `
              radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.55) 14%, transparent 38%),
              radial-gradient(circle at 75% 25%, rgba(147, 197, 253, 0.95) 0%, transparent 40%),
              radial-gradient(circle at 25% 75%, rgba(244, 114, 182, 0.95) 0%, transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(252, 211, 77, 0.9) 0%, transparent 45%),
              radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.85) 0%, transparent 60%),
              conic-gradient(from 180deg at 50% 50%, #38BDF8 0deg, #F472B6 90deg, #FBBF24 180deg, #34D399 270deg, #38BDF8 360deg)
            `,
            backgroundSize: '140% 140%',
            filter: 'contrast(1.12) brightness(1.05)',
          }}
        />

        {/* Primary Specular Light Highlight Arc */}
        <div
          className="absolute top-1.5 left-3 right-3 h-[42%] rounded-[100%] pointer-events-none animate-specular-drift"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.1) 100%)',
            filter: 'blur(0.2px)',
          }}
        />

        {/* Specular Point Glint (Pristine Light Source Reflection) */}
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
            boxShadow: 'inset 0 -8px 18px rgba(15, 23, 42, 0.25), inset 0 2px 10px rgba(255, 255, 255, 0.95)',
          }}
        />
      </div>

      {/* Ground Depth Shadow */}
      <div
        className="absolute -bottom-2 w-[70%] h-2.5 rounded-full blur-xs opacity-25 pointer-events-none bg-slate-800 dark:bg-black"
      />
    </div>
  );
};
