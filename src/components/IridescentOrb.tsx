import React from 'react';

interface IridescentOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isListening?: boolean;
  audioLevel?: number;
  className?: string;
  onClick?: () => void;
}

export const IridescentOrb: React.FC<IridescentOrbProps> = ({
  size = 'md',
  isListening = false,
  audioLevel = 0,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64 sm:w-80 sm:h-80',
  };

  const dynamicScale = isListening ? 1 + (audioLevel / 200) : 1;

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer select-none ${sizeMap[size]} ${className}`}
      style={{
        transform: `scale(${dynamicScale})`,
        transition: 'transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Ambient Pulsing Aura behind the orb */}
      {isListening && (
        <>
          <div
            className="absolute -inset-6 rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-400 to-amber-300 opacity-40 blur-2xl animate-ping"
            style={{ animationDuration: '3s' }}
          />
          <div
            className="absolute -inset-10 rounded-full bg-gradient-to-r from-violet-400 via-pink-300 to-teal-300 opacity-30 blur-3xl animate-pulse"
          />
        </>
      )}

      {/* Realistic 3D Soap Bubble / Pearl Orb */}
      <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl animate-float">
        
        {/* Base Pearl & Glass Gradient */}
        <div
          className="absolute inset-0 rounded-full animate-iridescent"
          style={{
            background: `
              radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.6) 15%, transparent 45%),
              radial-gradient(circle at 75% 20%, rgba(165, 243, 252, 0.9) 0%, transparent 40%),
              radial-gradient(circle at 20% 75%, rgba(244, 114, 182, 0.9) 0%, transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(253, 224, 71, 0.9) 0%, transparent 45%),
              radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.8) 0%, transparent 55%),
              conic-gradient(from 180deg at 50% 50%, #67E8F9 0deg, #F472B6 90deg, #FDE047 180deg, #34D399 270deg, #67E8F9 360deg)
            `,
            backgroundSize: '150% 150%',
            filter: 'contrast(1.15) brightness(1.05)',
          }}
        />

        {/* Liquid Swirl Wave */}
        <div
          className="absolute inset-0 rounded-full opacity-70 mix-blend-color-dodge pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 45% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 60%)',
            transform: `scale(${1 + audioLevel / 250}) rotate(${audioLevel * 3}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        />

        {/* Specular Curved Light Reflection Arc (Realistic Glass Bubble Arc) */}
        <div
          className="absolute top-2 left-4 right-4 h-[42%] rounded-[100%] opacity-90 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.1) 100%)',
            transform: 'rotate(-12deg)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Secondary Rim Reflection (Bottom-Right Reflection) */}
        <div
          className="absolute bottom-2 right-4 w-1/3 h-1/4 rounded-[100%] opacity-60 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.85) 0%, transparent 100%)',
            transform: 'rotate(15deg)',
            filter: 'blur(1px)',
          }}
        />

        {/* Inner 3D Sphere Depth Shadow Rim */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: 'inset 0 -12px 28px rgba(30, 27, 75, 0.25), inset 0 2px 12px rgba(255, 255, 255, 0.9)',
          }}
        />
      </div>

      {/* Floating Ground Contact Shadow */}
      <div
        className="absolute -bottom-4 w-[70%] h-4 rounded-full blur-md opacity-35 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.6) 0%, rgba(0,0,0,0) 75%)',
        }}
      />
    </div>
  );
};
