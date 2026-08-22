import React from 'react';

interface IridescentOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isListening?: boolean;
  audioLevel?: number;
  className?: string;
}

export const IridescentOrb: React.FC<IridescentOrbProps> = ({
  size = 'md',
  isListening = false,
  audioLevel = 0,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64 sm:w-72 sm:h-72',
  };

  const dynamicScale = isListening ? 1 + (audioLevel / 220) : 1;

  return (
    <div
      className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}
      style={{
        transform: `scale(${dynamicScale})`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      {/* Outer Glow Pulse Rings */}
      {isListening && (
        <>
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-pink-400 to-amber-300 opacity-30 blur-2xl animate-ping"
            style={{ animationDuration: '3s' }}
          />
          <div
            className="absolute -inset-4 rounded-full bg-gradient-to-r from-violet-400 via-emerald-300 to-orange-300 opacity-25 blur-xl animate-pulse"
          />
        </>
      )}

      {/* Main 3D Holographic Orb Base */}
      <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl animate-float">
        
        {/* Holographic Multi-Color Rotating Gradient */}
        <div
          className="absolute inset-0 rounded-full animate-iridescent"
          style={{
            background: `
              radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.4) 20%, transparent 50%),
              radial-gradient(circle at 80% 20%, #A5F3FC 0%, transparent 40%),
              radial-gradient(circle at 20% 80%, #F472B6 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #FDE047 0%, transparent 45%),
              radial-gradient(circle at 50% 50%, #C084FC 0%, transparent 60%),
              linear-gradient(135deg, #67E8F9 0%, #E879F9 40%, #FBBF24 80%, #34D399 100%)
            `,
            backgroundSize: '160% 160%',
          }}
        />

        {/* Dynamic Ripple Waves Overlay */}
        <div
          className="absolute inset-0 rounded-full opacity-60 mix-blend-overlay"
          style={{
            background: 'radial-gradient(circle at 40% 40%, transparent 20%, rgba(255,255,255,0.8) 45%, transparent 60%)',
            transform: `scale(${1 + (audioLevel / 300)}) rotate(${audioLevel * 2}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        />

        {/* 3D Glass Specular Reflection Highlight (Apple-like finish) */}
        <div
          className="absolute top-1.5 left-3 right-3 h-[45%] rounded-[100%] opacity-80 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.05) 100%)',
            transform: 'rotate(-10deg)',
          }}
        />

        {/* Ambient Inner Shadow Rim */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: 'inset 0 -8px 20px rgba(0, 0, 0, 0.15), inset 0 2px 10px rgba(255, 255, 255, 0.8)',
          }}
        />
      </div>

      {/* Ground Soft Glow Shadow */}
      <div
        className="absolute -bottom-3 w-[75%] h-3 rounded-full blur-md opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.6) 0%, rgba(0,0,0,0) 70%)',
        }}
      />
    </div>
  );
};
