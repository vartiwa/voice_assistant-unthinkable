import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingItem, SmartSuggestion, LanguageOption } from './types';
import { INITIAL_SMART_SUGGESTIONS, SMART_SUBSTITUTES_MAP } from './data/suggestionsData';
import { speechService, SUPPORTED_LANGUAGES } from './services/speechService';
import { nlpEngine } from './services/nlpService';

import { Navbar } from './components/Navbar';
import { CenterHeroStage } from './components/CenterHeroStage';
import { InteractionFeedCard } from './components/InteractionFeedCard';
import { CompactSuggestionsWidget } from './components/CompactSuggestionsWidget';
import { ChatMessage } from './components/VoiceChatStream';
import { ImmersiveVoiceOverlay } from './components/ImmersiveVoiceOverlay';
import { ShoppingListView } from './components/ShoppingListView';
import { SuggestionsView } from './components/SuggestionsView';
import { SearchModal } from './components/SearchModal';
import { CommandHelpModal } from './components/CommandHelpModal';
import { ShoppingBag, Compass } from 'lucide-react';

const STORAGE_KEY = 'voice_cart_items_v7';
const CHAT_STORAGE_KEY = 'voice_cart_chat_v7';

export const App: React.FC = () => {
  // 1. Shopping List State
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
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
      {
        id: 'init-3',
        name: 'Wireless Bluetooth Earphones',
        category: 'Electronics',
        quantity: 1,
        unit: 'pair',
        price: 29.99,
        brand: 'Sony',
        completed: false,
        addedAt: new Date().toISOString(),
      },
    ];
  });

  // 2. Chat Stream Messages State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: 'Hello! I am VoiceCart AI. Speak naturally into your microphone or say "Hey Assistant" to add items hands-free.',
        timestamp: 'Just now',
      },
    ];
  });

  // 3. Suggestions State
  const [suggestions] = useState<SmartSuggestion[]>(INITIAL_SMART_SUGGESTIONS);
  const [addedSuggestionIds, setAddedSuggestionIds] = useState<Set<string>>(new Set());

  // 4. Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [isHandsFree, setIsHandsFree] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{
    message: string;
    success: boolean;
    intent?: string;
  } | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('voice_cart_dark_mode');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('voice_cart_dark_mode', String(isDarkMode));
    } catch (e) {}
  }, [isDarkMode]);

  // 5. Views & Modals State
  const [activeRightTab, setActiveRightTab] = useState<'cart' | 'suggestions'>('cart');
  const [isImmersiveOpen, setIsImmersiveOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState<number | undefined>(undefined);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Persist items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  // Persist chat
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch (e) {}
  }, [messages]);

  // Voice Command Execution Engine
  const executeCommand = useCallback(
    (rawTranscript: string) => {
      const parsed = nlpEngine.parseCommand(rawTranscript, selectedLanguage.code);
      setLastFeedback({
        message: parsed.feedbackMessage,
        success: parsed.success,
        intent: parsed.intent,
      });

      // Add to conversation log
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: rawTranscript,
        timestamp: 'Just now',
      };

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now() + 1}`,
        sender: 'assistant',
        text: parsed.feedbackMessage,
        timestamp: 'Just now',
        itemDetails: parsed.itemDetails,
        intent: parsed.intent,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      // Speak response back to user
      if (!isMuted) {
        speechService.speak(parsed.feedbackMessage, selectedLanguage.speechCode);
      }

      switch (parsed.intent) {
        case 'WAKE_GREETING': {
          break;
        }

        case 'ADD_ITEM': {
          const itemsToAdd = parsed.items && parsed.items.length > 0
            ? parsed.items
            : parsed.itemDetails ? [parsed.itemDetails] : [];

          if (itemsToAdd.length > 0) {
            setItems((prev) => {
              let updated = [...prev];
              for (const detail of itemsToAdd) {
                const existingIdx = updated.findIndex(
                  (i) => i.name.toLowerCase() === detail.name.toLowerCase()
                );
                if (existingIdx !== -1) {
                  updated[existingIdx] = {
                    ...updated[existingIdx],
                    quantity: updated[existingIdx].quantity + detail.quantity,
                  };
                } else {
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
                  updated = [newItem, ...updated];
                }
              }
              return updated;
            });

            try {
              confetti({
                particleCount: 25,
                spread: 45,
                origin: { y: 0.8 },
                colors: ['#f97316', '#fbbf24', '#34d399'],
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
          setActiveRightTab('suggestions');
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

  // Continuous speech accumulation refs
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestTranscriptRef = useRef<string>('');

  const startListeningSession = useCallback(() => {
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

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Snappy 900ms silence timer
        silenceTimerRef.current = setTimeout(() => {
          const finalCmd = latestTranscriptRef.current.trim();
          if (finalCmd) {
            if (!isHandsFree) {
              speechService.stopListening();
              setIsListening(false);
            }
            setLiveTranscript('');
            latestTranscriptRef.current = '';
            executeCommand(finalCmd);
          }
        }, 900);
      },
      onAudioLevel: (level) => setAudioLevel(level),
    });
  }, [executeCommand, isHandsFree]);

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
      startListeningSession();
    }
  };

  const handleToggleHandsFree = () => {
    const nextState = !isHandsFree;
    setIsHandsFree(nextState);

    if (nextState) {
      startListeningSession();
      setLastFeedback({
        message: 'Hands-Free Mode activated! Say "Hey Assistant, add milk" anytime.',
        success: true,
      });
      if (!isMuted) {
        speechService.speak('Hands free mode active. You can say: Hey Assistant, add milk.', selectedLanguage.speechCode);
      }
    } else {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      speechService.stopListening();
      setIsListening(false);
      setLiveTranscript('');
      setLastFeedback({
        message: 'Hands-Free Mode disabled.',
        success: true,
      });
    }
  };

  const handleForceProcessNow = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const finalCmd = latestTranscriptRef.current.trim();
    if (!isHandsFree) {
      speechService.stopListening();
      setIsListening(false);
    }
    setLiveTranscript('');
    latestTranscriptRef.current = '';
    if (finalCmd) {
      executeCommand(finalCmd);
    }
  };

  const handleLanguageChange = (lang: LanguageOption) => {
    setSelectedLanguage(lang);
    speechService.setLanguage(lang.speechCode);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    speechService.setMuted(nextMuted);
  };

  // Cart operations
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

    const feedbackMsg = `Switched to ${substitute.substituteName}.`;
    setLastFeedback({ message: feedbackMsg, success: true });

    if (!isMuted) {
      speechService.speak(feedbackMsg, selectedLanguage.speechCode);
    }
  };

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
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0C0D0E] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors selection:bg-[#F25C3B] selection:text-white">
      
      {/* Full-width Top Navbar */}
      <Navbar
        selectedLang={selectedLanguage.speechCode}
        onLanguageChange={handleLanguageChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHelp={() => setIsHelpOpen(true)}
        itemCount={items.length}
        totalPrice={totalPrice}
        activeView={activeRightTab === 'cart' ? 'cart' : 'suggestions'}
        onSelectView={(v) => {
          if (v === 'cart') setActiveRightTab('cart');
          if (v === 'suggestions') setActiveRightTab('suggestions');
        }}
        isHandsFree={isHandsFree}
        onToggleHandsFree={handleToggleHandsFree}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Desktop Workspace Canvas with Framed Boundary */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 space-y-5">
        
        {/* 1. TRUE CENTER HERO SECTION: The 3D Orb Flanked by Context (Left) and Routine/Seasonal Suggestions (Right) */}
        <CenterHeroStage
          liveTranscript={liveTranscript}
          isListening={isListening}
          audioLevel={audioLevel}
          onToggleListen={toggleListening}
          onQuickPrompt={executeCommand}
          onOpenCatalog={() => {
            setSearchQuery('');
            setSearchMaxPrice(undefined);
            setIsSearchOpen(true);
          }}
          onExecuteCommand={executeCommand}
          isHandsFree={isHandsFree}
          suggestions={suggestions}
          onAddSuggestion={handleAddSuggestion}
          addedSuggestionIds={addedSuggestionIds}
        />

        {/* 2. Side-by-Side Lower Desktop Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column (5 cols / 42%): Interaction Feed */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            <InteractionFeedCard
              messages={messages}
              onOpenCart={() => setActiveRightTab('cart')}
            />
          </div>

          {/* Right Column (7 cols / 58%): Shopping Cart + Compact Habitual & Seasonal Suggestions */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            
            {/* View Switcher Tabs on Right Canvas */}
            <div className="flex items-center p-1 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs text-xs font-bold">
              <button
                onClick={() => setActiveRightTab('cart')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                  activeRightTab === 'cart'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shopping Cart ({items.length} items)</span>
              </button>

              <button
                onClick={() => setActiveRightTab('suggestions')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                  activeRightTab === 'suggestions'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <Compass className="w-4 h-4 text-blue-500" />
                <span>Full Intelligence Explorer</span>
              </button>
            </div>

            {/* Main Shopping Cart or Full Explorer */}
            {activeRightTab === 'suggestions' ? (
              <SuggestionsView
                suggestions={suggestions}
                onAddSuggestion={handleAddSuggestion}
                addedSuggestionIds={addedSuggestionIds}
              />
            ) : (
              <>
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

                {/* Compact Habitual Reorder & Seasonal Suggestions Widget */}
                <CompactSuggestionsWidget
                  suggestions={suggestions}
                  onAddSuggestion={handleAddSuggestion}
                  addedSuggestionIds={addedSuggestionIds}
                />
              </>
            )}
          </div>

        </div>
      </main>

      {/* Fullscreen Immersive 3D Voice Screen Modal */}
      <ImmersiveVoiceOverlay
        isOpen={isImmersiveOpen}
        onClose={() => setIsImmersiveOpen(false)}
        isListening={isListening}
        onToggleListen={toggleListening}
        liveTranscript={liveTranscript}
        lastFeedback={lastFeedback}
        audioLevel={audioLevel}
        onDoneProcessing={handleForceProcessNow}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Product Catalog Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchQuery}
        initialMaxPrice={searchMaxPrice}
        onAddItem={handleAddCustomItem}
      />

      {/* Command Guide Modal */}
      <CommandHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};

export default App;
