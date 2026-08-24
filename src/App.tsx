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
import { ShoppingListView } from './components/ShoppingListView';
import { SearchModal } from './components/SearchModal';
import { CommandHelpModal } from './components/CommandHelpModal';
import { SyncDeviceModal } from './components/SyncDeviceModal';
import { userPreferenceService } from './services/userPreferenceService';
import { livePricingService } from './services/livePricingService';

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
        id: 'item-1',
        name: 'Fresh Shimla Apples',
        category: 'Produce',
        quantity: 1,
        unit: 'kg',
        price: 140,
        brand: 'Shimla Fresh',
        isOrganic: true,
        completed: false,
        addedAt: new Date().toISOString(),
      },
      {
        id: 'item-2',
        name: 'Amul Taaza Fresh Milk',
        category: 'Dairy & Eggs',
        quantity: 2,
        unit: 'packet',
        price: 35,
        brand: 'Amul',
        completed: false,
        addedAt: new Date().toISOString(),
      },
      {
        id: 'item-3',
        name: 'Fresh Whole Wheat Bread',
        category: 'Bakery',
        quantity: 1,
        unit: 'loaf',
        price: 45,
        brand: 'Britannia',
        completed: false,
        addedAt: new Date().toISOString(),
      },
      {
        id: 'item-4',
        name: 'Farm Fresh Organic Eggs',
        category: 'Dairy & Eggs',
        quantity: 1,
        unit: 'dozen',
        price: 84,
        brand: 'Eggoz',
        isOrganic: true,
        completed: false,
        addedAt: new Date().toISOString(),
      },
    ];
  });

  // 2. Chat Stream Messages State
  const [messages, setMessages] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: 'Hello! I am Voice Assistance AI. Speak naturally or say "Hey Assistant" to add groceries and items.',
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
  const [activeView, setActiveView] = useState<'chat' | 'cart' | 'suggestions'>('cart');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState<number | undefined>(undefined);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

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
      const parsed = nlpEngine.parseCommand(rawTranscript, selectedLanguage.speechCode);

      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: rawTranscript,
        timestamp: 'Just now',
      };

      const assistantMsg = {
        id: `ast-${Date.now() + 1}`,
        sender: 'assistant',
        text: parsed.feedbackMessage,
        timestamp: 'Just now',
        itemDetails: parsed.itemDetails,
        intent: parsed.intent,
        confidenceScore: parsed.confidenceScore,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      // Play soft harmonic earcon chime on intent match
      if (parsed.intent !== 'UNKNOWN') {
        speechService.playEarcon('success');
      }

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
                    price: detail.maxPrice || 50,
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
                colors: ['#10b981', '#f59e0b', '#3b82f6'],
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

  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestTranscriptRef = useRef<string>('');

  const startListeningSession = useCallback(() => {
    latestTranscriptRef.current = '';
    setLiveTranscript('');
    speechService.playEarcon('listen');
    speechService.startListening({
      onStart: () => setIsListening(true),
      onEnd: () => {
        setIsListening(false);
        setAudioLevel(0);
      },
      onError: (_err) => {
        setIsListening(false);
      },
      onResult: (transcript) => {
        latestTranscriptRef.current = transcript;
        setLiveTranscript(transcript);

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Patient Speech Debounce: Wait 1600ms after user stops speaking before executing command
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
        }, 1600);
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
      speechService.playEarcon('cancel');
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
      if (!isMuted) {
        speechService.speak('Hands free active. Say: Hey Assistant, add milk.', selectedLanguage.speechCode);
      }
    } else {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      speechService.stopListening();
      setIsListening(false);
      setLiveTranscript('');
    }
  };

  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearList = () => {
    setItems([]);
  };

  const handleApplySubstitute = (originalItem: ShoppingItem) => {
    const key = Object.keys(SMART_SUBSTITUTES_MAP).find((k) =>
      originalItem.name.toLowerCase().includes(k)
    );
    if (!key) return;

    const substitute = SMART_SUBSTITUTES_MAP[key];
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === originalItem.id) {
          return {
            ...item,
            name: substitute.substituteName,
            price: substitute.price,
            category: substitute.category,
            isOrganic: (substitute as any).isOrganic ?? item.isOrganic,
          };
        }
        return item;
      })
    );
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
    <div className="min-h-screen bg-[#F8F8F5] dark:bg-[#111215] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-[#1E3A8A] selection:text-white scroll-smooth">
      
      {/* Top Header matching V-Cart from sketch */}
      <Navbar
        selectedLang={selectedLanguage.speechCode}
        onLanguageChange={(lang) => {
          setSelectedLanguage(lang);
          speechService.setLanguage(lang.speechCode);
        }}
        isMuted={isMuted}
        onToggleMute={() => {
          const next = !isMuted;
          setIsMuted(next);
          speechService.setMuted(next);
        }}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSync={() => setIsSyncOpen(true)}
        itemCount={items.length}
        totalPrice={totalPrice}
        activeView={activeView}
        onSelectView={setActiveView}
        isHandsFree={isHandsFree}
        onToggleHandsFree={handleToggleHandsFree}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Container matching the User's Hand-Drawn Sketch */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex-1">
        
        {/* Main 2-Column Blueprint Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================= */}
          {/* LEFT MAIN AREA (8 Cols / 67%): HERO (Time + Orb) + [CHAT & RECOMEDS] */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. TOP HERO SECTION: Time/Date box on left + 3D Orb in center (From Sketch) */}
            <div>
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
              />
            </div>

            {/* 2. BOTTOM 2-COLUMN ROW (From Sketch): Left = CHAT, Right = RECOMEDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* CHAT Box (From Sketch) */}
              <div className="flex flex-col">
                <InteractionFeedCard
                  messages={messages}
                  onOpenCart={() => setActiveView('cart')}
                  onQuickIncrement={(itemName) => {
                    const existing = items.find(
                      (i) => i.name.toLowerCase() === itemName.toLowerCase()
                    );
                    if (existing) {
                      handleUpdateQuantity(existing.id, 1);
                    }
                  }}
                  onQuickUndo={(itemName) => {
                    const existing = items.find(
                      (i) => i.name.toLowerCase() === itemName.toLowerCase()
                    );
                    if (existing) {
                      handleDeleteItem(existing.id);
                    }
                  }}
                />
              </div>

              {/* RECOMEDS Box (From Sketch) */}
              <div className="flex flex-col">
                <CompactSuggestionsWidget
                  suggestions={suggestions}
                  onAddSuggestion={handleAddSuggestion}
                  addedSuggestionIds={addedSuggestionIds}
                />
              </div>

            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDEBAR (4 Cols / 33%): Dedicated CART            */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
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
          </div>

        </div>

      </main>

      {/* Product Catalog Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchQuery}
        initialMaxPrice={searchMaxPrice}
        onAddItem={handleAddCustomItem}
      />

      {/* Command Help Syntax Modal */}
      <CommandHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Cross-Device Sync & Live Mandi Pricing Modal */}
      <SyncDeviceModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        onRefreshPrices={() => {
          // Re-evaluate prices for items in cart based on live rates
          setItems((prev) =>
            prev.map((item) => {
              const livePrice = livePricingService.getPriceForKeyword(item.name);
              return livePrice ? { ...item, price: livePrice } : item;
            })
          );
        }}
      />

    </div>
  );
};

export default App;
