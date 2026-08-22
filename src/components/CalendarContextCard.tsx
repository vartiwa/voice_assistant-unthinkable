import React, { useState, useEffect } from 'react';
import { Calendar, Clock, RotateCcw } from 'lucide-react';

export const CalendarContextCard: React.FC = () => {
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [isMonthEnd, setIsMonthEnd] = useState(false);
  const [daysToMonthEnd, setDaysToMonthEnd] = useState(0);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      };
      setCurrentDateStr(now.toLocaleDateString('en-US', options));
      setCurrentTimeStr(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));

      // Calculate days left in current month
      const currentDay = now.getDate();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const daysLeft = lastDayOfMonth - currentDay;
      setDaysToMonthEnd(daysLeft);
      setIsMonthEnd(daysLeft <= 10);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-2.5">
      
      {/* Date & Time Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{currentDateStr}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{currentTimeStr}</span>
        </div>
      </div>

      {/* Subtle Calendar Context: Month-End Restock Cycle */}
      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <RotateCcw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{isMonthEnd ? 'Month-End Restock Cycle' : 'Mid-Month Restock Cycle'}</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300">
            {daysToMonthEnd} days left in month
          </span>
        </div>

        <p className="text-[11px] text-slate-400 leading-normal">
          {isMonthEnd
            ? 'Monthly household restock window active. Pantry staples & toiletries typically reordered now.'
            : 'Weekly fresh replenishment cycle active.'}
        </p>
      </div>

    </div>
  );
};
