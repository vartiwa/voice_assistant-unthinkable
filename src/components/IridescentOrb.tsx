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
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-32 h-32',
  };

  const dynamicScale = isListening ? 1 + (audioLevel / 400) : 1;

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer select-none ${sizeMap[size]} ${className}`}
      style={{
        transform: `scale(${dynamicScale})`,
        transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {/* Sharp 3D Glass Pearl Sphere */}
      <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg animate-soft-float">
        
        {/* Multi-layered Liquid Plasma Gradient */}
        <div
          className="absolute inset-0 rounded-full animate-fluid-flow"
          style={{
            background: `
              radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.5) 12%, transparent 38%),
              radial-gradient(circle at 75% 25%, rgba(147, 197, 253, 0.95) 0%, transparent 40%),
              radial-gradient(circle at 25% 75%, rgba(244, 114, 182, 0.95) 0%, transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(252, 211, 77, 0.9) 0%, transparent 45%),
              radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.85) 0%, transparent 60%),
              conic-gradient(from 180deg at 50% 50%, #38BDF8 0deg, #F472B6 90deg, #FBBF24 180deg, #34D399 270deg, #38BDF8 360deg)
            `,
            backgroundSize: '140% 140%',
            filter: 'contrast(1.08) brightness(1.02)',
          }}
        />

        {/* Specular Curved Light Reflection Arc */}
        <div
          className="absolute top-1 left-2.5 right-2.5 h-[40%] rounded-[100%] pointer-events-none animate-specular-drift"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.05) 100%)',
            filter: 'blur(0.3px)',
          }}
        />

        {/* Secondary Rim Reflection */}
        <div
          className="absolute bottom-1 right-2.5 w-1/3 h-1/4 rounded-[100%] opacity-50 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%)',
            transform: 'rotate(12deg)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Inner 3D Sphere Rim */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: 'inset 0 -6px 14px rgba(15, 23, 42, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.9)',
          }}
        />
      </div>

      {/* Ground Shadow */}
      <div
        className="absolute -bottom-2 w-[60%] h-2 rounded-full blur-xs opacity-20 pointer-events-none bg-slate-800 dark:bg-black"
      />
    </div>
  );
};
