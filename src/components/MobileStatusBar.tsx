import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const MobileStatusBar: React.FC = () => {
  const [time, setTime] = useState('8:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-7 pt-3 pb-1 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 select-none tracking-tight">
      <span>{time}</span>
      <div className="flex items-center gap-1.5 opacity-90">
        <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        <Battery className="w-4 h-4 stroke-[2.5]" />
      </div>
    </div>
  );
};
