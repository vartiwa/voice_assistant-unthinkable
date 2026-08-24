export type Category =
  | 'Produce'
  | 'Dairy & Eggs'
  | 'Bakery'
  | 'Meat & Seafood'
  | 'Pantry'
  | 'Beverages'
  | 'Snacks'
  | 'Frozen'
  | 'Electronics'
  | 'Household'
  | 'Personal Care'
  | 'Other';

export interface ShoppingItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  price: number;
  completed: boolean;
  brand?: string;
  isOrganic?: boolean;
  addedAt: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  unit: string;
  imageIcon: string;
  isOrganic?: boolean;
  isGlutenFree?: boolean;
  isVegan?: boolean;
  isDairyFree?: boolean;
  inSeason?: boolean;
  seasonName?: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Year-round';
  onSale?: boolean;
  originalPrice?: number;
  substitutes?: string[];
}

export type SuggestionType = 'history' | 'seasonal' | 'substitute' | 'sale';

export interface SmartSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  item: Omit<ShoppingItem, 'id' | 'addedAt' | 'completed'>;
  reason: string;
  originalItemName?: string;
  savings?: number;
  badge: string;
}

export type VoiceIntent =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'UPDATE_QUANTITY'
  | 'SEARCH_ITEMS'
  | 'FILTER_ITEMS'
  | 'SHOW_SUGGESTIONS'
  | 'CLEAR_LIST'
  | 'HELP'
  | 'WAKE_GREETING'
  | 'STOP_LISTENING'
  | 'UNKNOWN';

export interface ExtractedItemDetail {
  name: string;
  quantity: number;
  unit: string;
  category?: Category;
  brand?: string;
  maxPrice?: number;
  isOrganic?: boolean;
}

export interface ParsedVoiceCommand {
  intent: VoiceIntent;
  rawText: string;
  itemDetails?: ExtractedItemDetail;
  items?: ExtractedItemDetail[]; // Multi-item additions support
  searchQuery?: string;
  priceFilter?: number;
  confidenceScore?: number; // 0.0 to 1.0 NLU match confidence
  feedbackMessage: string;
  success: boolean;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
}
