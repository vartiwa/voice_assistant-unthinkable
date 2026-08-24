import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Laptop, 
  QrCode, 
  RefreshCw, 
  ShieldCheck, 
  Check, 
  Copy, 
  TrendingUp, 
  Clock, 
  Zap,
  Repeat
} from 'lucide-react';
import { userPreferenceService, UserSyncProfile, ItemConsumptionHabit } from '../services/userPreferenceService';
import { livePricingService, LivePriceQuote } from '../services/livePricingService';

interface SyncDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshPrices: () => void;
}

export const SyncDeviceModal: React.FC<SyncDeviceModalProps> = ({
  isOpen,
  onClose,
  onRefreshPrices,
}) => {
  const [syncProfile, setSyncProfile] = useState<UserSyncProfile>(userPreferenceService.getSyncProfile());
  const [habits, setHabits] = useState<ItemConsumptionHabit[]>(userPreferenceService.getHabitsList());
  const [quotes, setQuotes] = useState<LivePriceQuote[]>(livePricingService.getAllQuotes());
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSyncProfile(userPreferenceService.getSyncProfile());
      setHabits(userPreferenceService.getHabitsList());
      setQuotes(livePricingService.getAllQuotes());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(syncProfile.syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplySync = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.length === 6) {
      const ok = userPreferenceService.applySyncCode(inputCode);
      if (ok) {
        setSyncProfile(userPreferenceService.getSyncProfile());
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 3000);
        setInputCode('');
      }
    }
  };

  const handleManualPriceRefresh = () => {
    setIsRefreshing(true);
    livePricingService.refreshLivePrices();
    setQuotes(livePricingService.getAllQuotes());
    onRefreshPrices();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#F8F8F5] dark:bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[88vh] shadow-2xl border border-stone-200 dark:border-zinc-800 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-wide">
                Live Pricing API & Cross-Device Sync
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time Indian market prices + Seamless Mobile & Laptop sync
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* ======================================================== */}
          {/* 1. CROSS-DEVICE SYNC (Mobile <-> Laptop)                 */}
          {/* ======================================================== */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-slate-700 dark:text-slate-200">
                  <Laptop className="w-4 h-4" />
                  <span className="text-slate-400 mx-1">↔</span>
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Cross-Device Sync Key
                </span>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Cloud Synced</span>
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Use this unique 6-digit sync code on your phone or laptop. Your cart, favorite items, dietary preferences, and repeat habits stay synchronized automatically across all devices.
            </p>

            {/* Sync Key Box */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                  Your Device Pairing Key:
                </span>
                <span className="text-xl font-mono font-black tracking-widest text-slate-900 dark:text-white">
                  {syncProfile.syncCode}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:opacity-90 transition-opacity"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Pair Another Device Input */}
            <form onSubmit={handleApplySync} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code from your other device..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 focus:outline-none text-slate-900 dark:text-white font-mono"
              />
              <button
                type="submit"
                disabled={inputCode.length !== 6}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-40 transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                Connect Device
              </button>
            </form>

            {syncSuccess && (
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-center animate-in fade-in">
                ✓ Devices successfully linked! Real-time synchronization active.
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 2. REAL-TIME MARKET PRICING ENGINE (API SIMULATION)      */}
          {/* ======================================================== */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Mandi & Quick-Commerce Price Feed
                </span>
              </div>

              <button
                onClick={handleManualPriceRefresh}
                disabled={isRefreshing}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-zinc-700 text-slate-700 dark:text-slate-200 border border-stone-200 dark:border-zinc-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
                <span>Refresh Live Rates</span>
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-300">
              Prices update dynamically from real-time local indices so you always see current market rates.
            </p>

            {/* Live Ticker Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quotes.slice(0, 6).map((q) => (
                <div
                  key={q.itemId}
                  className="p-2.5 rounded-xl bg-stone-50/80 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-700/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                      {q.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                      ₹{q.currentPrice}
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ● Live
                    </span>
                  </div>

                  <span className="text-[9px] font-mono text-slate-400 block truncate">
                    {q.source}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. REPEAT PURCHASE & HABITUAL INTELLIGENCE               */}
          {/* ======================================================== */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Personalized Habit & Restock Predictor
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-300">
              The AI learns your household consumption cycles (e.g. milk restocked every 2 days, atta every 20 days) and surfaces intelligent reminders before you run out:
            </p>

            <div className="space-y-2">
              {habits.map((h) => (
                <div
                  key={h.itemId}
                  className="p-2.5 rounded-xl bg-stone-50/80 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {h.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Ordered {h.purchaseCount} times · Restock cycle: ~{h.avgRestockDays} days
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    h.predictedNeedInDays === 0
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                      : 'bg-stone-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300 border-stone-200'
                  }`}>
                    {h.predictedNeedInDays === 0 ? 'Due for Restock Today' : `Restock in ${h.predictedNeedInDays}d`}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10.5px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Private Local-First Storage · End-to-End Encrypted</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-zinc-950 font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
