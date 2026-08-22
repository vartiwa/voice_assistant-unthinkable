import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingItem, SmartSuggestion, LanguageOption } from './types';
import { INITIAL_SMART_SUGGESTIONS, SMART_SUBSTITUTES_MAP } from './data/suggestionsData';
import { speechService, SUPPORTED_LANGUAGES } from './services/speechService';
import { nlpEngine } from './services/nlpService';

import { Navbar } from './components/Navbar';
import { VoiceController } from './components/VoiceController';
import { ShoppingListView } from './components/ShoppingListView';
import { SuggestionsView } from './components/SuggestionsView';
import { SearchModal } from './components/SearchModal';
import { CommandHelpModal } from './components/CommandHelpModal';
import { Sparkles, ShoppingCart, Search } from 'lucide-react';

const STORAGE_KEY = 'voice_cart_items_v1';

export const App: React.FC = () => {
  // 1. Core Shopping List State (Persistent in localStorage)
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved items', e);
    }
    // Default initial starter items for better first-time UX
    return [
      {
        id: 'init-1',
        name: 'Organic Honeycrisp Apples',
        category: 'Produce',
        quantity: 3,
        unit: 'lb',
        price: 3.99,
        brand: 'FreshFarm Organic',
        isOrganic: true,
        completed: false,
        addedAt: new Date().toISOString(),
      },
      {
        id: 'init-2',
        name: 'Whole Milk (Gallon)',
        category: 'Dairy & Eggs',
        quantity: 1,
        unit: 'gallon',
        price: 4.89,
        brand: 'Horizon Organic',
        isOrganic: true,
        completed: false,
        addedAt: new Date().toISOString(),
      },
    ];
  });

  // 2. Suggestions State
  const [suggestions] = useState<SmartSuggestion[]>(INITIAL_SMART_SUGGESTIONS);
  const [addedSuggestionIds, setAddedSuggestionIds] = useState<Set<string>>(new Set());

  // 3. Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{
    message: string;
    success: boolean;
    intent?: string;
  } | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [isMuted, setIsMuted] = useState(false);

  // 4. Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState<number | undefined>(undefined);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'suggestions'>('list');

  // Persist items to LocalStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist items', e);
    }
  }, [items]);

  // Voice Command Execution Engine
  const executeCommand = useCallback(
    (rawTranscript: string) => {
      const parsed = nlpEngine.parseCommand(rawTranscript, selectedLanguage.code);
      setLastFeedback({
        message: parsed.feedbackMessage,
        success: parsed.success,
        intent: parsed.intent,
      });

      // Speak response back to user
      if (!isMuted) {
        speechService.speak(parsed.feedbackMessage, selectedLanguage.speechCode);
      }

      switch (parsed.intent) {
        case 'ADD_ITEM': {
          if (parsed.itemDetails) {
            const detail = parsed.itemDetails;
            setItems((prev) => {
              // Check if item already in list (case-insensitive name match)
              const existingIdx = prev.findIndex(
                (i) => i.name.toLowerCase() === detail.name.toLowerCase()
              );
              if (existingIdx !== -1) {
                const updated = [...prev];
                updated[existingIdx].quantity += detail.quantity;
                return updated;
              }

              const newItem: ShoppingItem = {
                id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                name: detail.name,
                category: detail.category || 'Other',
                quantity: detail.quantity,
                unit: detail.unit,
                price: detail.maxPrice || 3.49,
                brand: detail.brand,
                isOrganic: detail.isOrganic,
                completed: false,
                addedAt: new Date().toISOString(),
              };
              return [newItem, ...prev];
            });

            // Trigger celebration confetti
            try {
              confetti({
                particleCount: 25,
                spread: 45,
                origin: { y: 0.8 },
                colors: ['#10b981', '#059669', '#34d399'],
              });
            } catch (e) {}
          }
          break;
        }

        case 'REMOVE_ITEM': {
          if (parsed.itemDetails) {
            const target = parsed.itemDetails.name.toLowerCase();
            setItems((prev) =>
              prev.filter(
                (i) =>
                  !i.name.toLowerCase().includes(target) &&
                  !target.includes(i.name.toLowerCase())
              )
            );
          }
          break;
        }

        case 'SEARCH_ITEMS': {
          setSearchQuery(parsed.searchQuery || '');
          setSearchMaxPrice(undefined);
          setIsSearchOpen(true);
          break;
        }

        case 'FILTER_ITEMS': {
          setSearchQuery(parsed.searchQuery || '');
          setSearchMaxPrice(parsed.priceFilter);
          setIsSearchOpen(true);
          break;
        }

        case 'SHOW_SUGGESTIONS': {
          setActiveView('suggestions');
          break;
        }

        case 'CLEAR_LIST': {
          setItems([]);
          break;
        }

        case 'HELP': {
          setIsHelpOpen(true);
          break;
        }

        default:
          break;
      }
    },
    [selectedLanguage, isMuted]
  );

  // Refs for continuous speech accumulation and silence debounce
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestTranscriptRef = useRef<string>('');

  // Toggle Voice Recognition
  const toggleListening = () => {
    if (isListening) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      const pendingText = latestTranscriptRef.current.trim();
      speechService.stopListening();
      setIsListening(false);
      setLiveTranscript('');
      setAudioLevel(0);
      if (pendingText) {
        executeCommand(pendingText);
      }
    } else {
      latestTranscriptRef.current = '';
      setLiveTranscript('');
      speechService.startListening({
        onStart: () => setIsListening(true),
        onEnd: () => {
          setIsListening(false);
          setAudioLevel(0);
        },
        onError: (err) => {
          setIsListening(false);
          setLastFeedback({ message: err, success: false });
        },
        onResult: (transcript) => {
          latestTranscriptRef.current = transcript;
          setLiveTranscript(transcript);

          // Reset silence timer on every new word
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Wait 1.8s of silence after speech ends before auto-processing
          silenceTimerRef.current = setTimeout(() => {
            const finalCmd = latestTranscriptRef.current.trim();
            if (finalCmd) {
              speechService.stopListening();
              setIsListening(false);
              setLiveTranscript('');
              executeCommand(finalCmd);
            }
          }, 1800);
        },
        onAudioLevel: (level) => setAudioLevel(level),
      });
    }
  };

  // Immediate dispatch when user clicks Done button
  const handleForceProcessNow = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const finalCmd = latestTranscriptRef.current.trim();
    speechService.stopListening();
    setIsListening(false);
    setLiveTranscript('');
    if (finalCmd) {
      executeCommand(finalCmd);
    }
  };

  // Language selection change
  const handleLanguageChange = (lang: LanguageOption) => {
    setSelectedLanguage(lang);
    speechService.setLanguage(lang.speechCode);
  };

  // Toggle TTS Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    speechService.setMuted(nextMuted);
  };

  // Shopping List item handlers
  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as ShoppingItem[]
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearList = () => {
    if (window.confirm('Are you sure you want to clear your entire shopping list?')) {
      setItems([]);
      setLastFeedback({ message: 'Shopping list cleared', success: true });
    }
  };

  // Apply Smart Substitute
  const handleApplySubstitute = (originalItem: ShoppingItem) => {
    const subKey = Object.keys(SMART_SUBSTITUTES_MAP).find((k) =>
      originalItem.name.toLowerCase().includes(k)
    );
    if (!subKey) return;

    const substitute = SMART_SUBSTITUTES_MAP[subKey];

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === originalItem.id) {
          return {
            ...item,
            name: substitute.substituteName,
            category: substitute.category,
            brand: substitute.brand,
            price: substitute.price,
            unit: substitute.unit,
          };
        }
        return item;
      })
    );

    const feedbackMsg = `Substituted ${originalItem.name} with ${substitute.substituteName}.`;
    setLastFeedback({ message: feedbackMsg, success: true });

    if (!isMuted) {
      speechService.speak(feedbackMsg, selectedLanguage.speechCode);
    }
  };

  // Add Item from Suggestion or Search Modal
  const handleAddCustomItem = (
    itemData: Omit<ShoppingItem, 'id' | 'addedAt' | 'completed'>
  ) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      completed: false,
      addedAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);
    const feedbackMsg = `Added ${newItem.name} to ${newItem.category}.`;
    setLastFeedback({ message: feedbackMsg, success: true });

    if (!isMuted) {
      speechService.speak(feedbackMsg, selectedLanguage.speechCode);
    }
  };

  const handleAddSuggestion = (suggestion: SmartSuggestion) => {
    handleAddCustomItem(suggestion.item);
    setAddedSuggestionIds((prev) => new Set([...prev, suggestion.id]));
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        selectedLang={selectedLanguage.speechCode}
        onLanguageChange={handleLanguageChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSuggestions={() => setActiveView(activeView === 'suggestions' ? 'list' : 'suggestions')}
        itemCount={items.length}
        totalPrice={totalPrice}
        isListening={isListening}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
        
        {/* Voice Command & Control Center */}
        <VoiceController
          isListening={isListening}
          onToggleListen={toggleListening}
          liveTranscript={liveTranscript}
          lastFeedback={lastFeedback}
          audioLevel={audioLevel}
          onExecuteCommand={executeCommand}
          selectedLangCode={selectedLanguage.speechCode}
          onForceProcessNow={handleForceProcessNow}
        />

        {/* View Switcher Tabs (Shopping List vs Smart Suggestions) */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeView === 'list'
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Shopping List ({items.length})</span>
            </button>

            <button
              onClick={() => setActiveView('suggestions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeView === 'suggestions'
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Smart Suggestions ({suggestions.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setSearchMaxPrice(undefined);
              setIsSearchOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search Catalog</span>
          </button>
        </div>

        {/* Dynamic View Display */}
        {activeView === 'list' ? (
          <ShoppingListView
            items={items}
            onToggleComplete={handleToggleComplete}
            onUpdateQuantity={handleUpdateQuantity}
            onDeleteItem={handleDeleteItem}
            onApplySubstitute={handleApplySubstitute}
            onClearList={handleClearList}
            onQuickAddItem={(name, category, price) => {
              handleAddCustomItem({
                name,
                category,
                quantity: 1,
                unit: 'item',
                price,
              });
            }}
          />
        ) : (
          <SuggestionsView
            suggestions={suggestions}
            onAddSuggestion={handleAddSuggestion}
            addedSuggestionIds={addedSuggestionIds}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        <p>Voice Command Shopping Assistant • Built with Web Speech API & NLP</p>
      </footer>

      {/* Voice-Activated Catalog Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchQuery}
        initialMaxPrice={searchMaxPrice}
        onAddItem={handleAddCustomItem}
      />

      {/* Voice Command Guide Modal */}
      <CommandHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};
export default App;
