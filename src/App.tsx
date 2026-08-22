import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingItem, SmartSuggestion, LanguageOption } from './types';
import { INITIAL_SMART_SUGGESTIONS, SMART_SUBSTITUTES_MAP } from './data/suggestionsData';
import { speechService, SUPPORTED_LANGUAGES } from './services/speechService';
import { nlpEngine } from './services/nlpService';

import { MobileStatusBar } from './components/MobileStatusBar';
import { Navbar } from './components/Navbar';
import { HomeCanvasView } from './components/HomeCanvasView';
import { VoiceChatStream, ChatMessage } from './components/VoiceChatStream';
import { BottomFloatingBar } from './components/BottomFloatingBar';
import { ImmersiveVoiceOverlay } from './components/ImmersiveVoiceOverlay';
import { ShoppingListView } from './components/ShoppingListView';
import { SuggestionsView } from './components/SuggestionsView';
import { SearchModal } from './components/SearchModal';
import { CommandHelpModal } from './components/CommandHelpModal';

const STORAGE_KEY = 'voice_cart_items_v3';
const CHAT_STORAGE_KEY = 'voice_cart_chat_v3';

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
        text: 'Hello! I am VoiceCart AI. Speak naturally to add items, search products, or say "Hey Assistant" to command hands-free.',
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

  // 5. Views & Modals State
  const [activeView, setActiveView] = useState<'voice' | 'cart' | 'suggestions'>('voice');
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
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-15)));
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

      // Automatically switch to Voice Chat view if command received
      if (activeView !== 'voice') {
        setActiveView('voice');
      }

      // Speak response back to user
      if (!isMuted) {
        speechService.speak(parsed.feedbackMessage, selectedLanguage.speechCode);
      }

      switch (parsed.intent) {
        case 'WAKE_GREETING': {
          break;
        }

        case 'ADD_ITEM': {
          if (parsed.itemDetails) {
            const detail = parsed.itemDetails;
            setItems((prev) => {
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
    [selectedLanguage, isMuted, activeView]
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
        }, 1800);
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
    <div className="min-h-screen bg-[#F4F3EF] dark:bg-zinc-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-orange-500 selection:text-white">
      
      {/* iOS Styled Mobile Status Bar */}
      <MobileStatusBar />

      {/* Top Navbar */}
      <Navbar
        selectedLang={selectedLanguage.speechCode}
        onLanguageChange={handleLanguageChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHelp={() => setIsHelpOpen(true)}
        itemCount={items.length}
        totalPrice={totalPrice}
        isListening={isListening}
        activeView={activeView}
        onSelectView={setActiveView}
        isHandsFree={isHandsFree}
        onToggleHandsFree={handleToggleHandsFree}
      />

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-4 w-full flex-1">
        
        {/* Dynamic Views */}
        {activeView === 'voice' && (
          messages.length <= 1 ? (
            <HomeCanvasView
              onQuickPrompt={executeCommand}
              onOpenImmersiveVoice={() => setIsImmersiveOpen(true)}
              onOpenCatalog={() => {
                setSearchQuery('');
                setSearchMaxPrice(undefined);
                setIsSearchOpen(true);
              }}
              onOpenCart={() => setActiveView('cart')}
              itemCount={items.length}
              totalPrice={totalPrice}
              isListening={isListening}
              audioLevel={audioLevel}
            />
          ) : (
            <VoiceChatStream
              messages={messages}
              liveTranscript={liveTranscript}
              isListening={isListening}
              onQuickPrompt={executeCommand}
              onOpenCart={() => setActiveView('cart')}
            />
          )
        )}

        {activeView === 'cart' && (
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
        )}

        {activeView === 'suggestions' && (
          <SuggestionsView
            suggestions={suggestions}
            onAddSuggestion={handleAddSuggestion}
            addedSuggestionIds={addedSuggestionIds}
          />
        )}
      </main>

      {/* Bottom Floating Pill Bar with Language Selector & Orange Glowing Mic */}
      <BottomFloatingBar
        isListening={isListening}
        onToggleListen={toggleListening}
        onOpenImmersiveVoice={() => setIsImmersiveOpen(true)}
        onOpenCatalog={() => {
          setSearchQuery('');
          setSearchMaxPrice(undefined);
          setIsSearchOpen(true);
        }}
        onExecuteCommand={executeCommand}
        selectedLang={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        isHandsFree={isHandsFree}
        onToggleHandsFree={handleToggleHandsFree}
      />

      {/* Immersive 3D Iridescent Voice Screen Overlay matching Screen 3 */}
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
