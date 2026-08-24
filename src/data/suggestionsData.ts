import { SmartSuggestion } from '../types';

export const INITIAL_SMART_SUGGESTIONS: SmartSuggestion[] = [
  // History / Running Low recommendation
  {
    id: 'sug-hist-1',
    type: 'history',
    title: 'Running Low Alert',
    description: "It looks like you're running low on Whole Wheat Bread based on your weekly routine.",
    badge: 'Routine Reorder',
    reason: 'Last purchased 5 days ago',
    item: {
      name: 'Fresh Whole Wheat Bread',
      category: 'Bakery',
      quantity: 1,
      unit: 'loaf',
      price: 45,
      brand: "Britannia"
    }
  },
  {
    id: 'sug-hist-2',
    type: 'history',
    title: 'Frequently Bought Together',
    description: 'You often purchase Fresh Dahi Curd and Fresh Paneer together for meals.',
    badge: 'Favorite Pair',
    reason: 'Bought together in 4 of your last 5 orders',
    item: {
      name: 'Fresh Dahi Curd / Yogurt',
      category: 'Dairy & Eggs',
      quantity: 2,
      unit: 'tub',
      price: 35,
      brand: 'Mother Dairy'
    }
  },

  // Seasonal & On Sale recommendation
  {
    id: 'sug-season-1',
    type: 'seasonal',
    title: 'Fresh In-Season Produce',
    description: 'Fresh Shimla Apples are in peak season right now with exceptional crispness.',
    badge: 'Peak Harvest',
    reason: 'Himachal Harvest Special',
    item: {
      name: 'Fresh Shimla Apples',
      category: 'Produce',
      quantity: 1,
      unit: 'kg',
      price: 140,
      brand: 'Shimla Fresh',
      isOrganic: true
    }
  },
  {
    id: 'sug-sale-1',
    type: 'sale',
    title: 'Weekly Discount Special',
    description: 'Tata Sampann Toor Dal has a special price this week.',
    badge: 'Save ₹20',
    savings: 20,
    reason: 'Weekly Market Deal',
    item: {
      name: 'Tata Sampann Toor Dal',
      category: 'Pantry',
      quantity: 1,
      unit: 'kg',
      price: 145,
      brand: "Tata Sampann"
    }
  }
];

export const SMART_SUBSTITUTES_MAP: Record<
  string,
  {
    substituteName: string;
    category: import('../types').Category;
    price: number;
    unit: string;
    brand: string;
    reason: string;
    savings?: number;
  }
> = {
  'milk': {
    substituteName: 'Soy / Almond Milk',
    category: 'Dairy & Eggs',
    price: 120,
    unit: 'carton',
    brand: 'Sofit',
    reason: 'Popular plant-based & lactose-free alternative'
  },
  'whole milk': {
    substituteName: 'Toned Cow Milk (Low Fat)',
    category: 'Dairy & Eggs',
    price: 32,
    unit: 'packet',
    brand: 'Amul Taaza',
    reason: 'Lighter low-fat alternative'
  },
  'butter': {
    substituteName: 'Amul Lite Low Fat Spread',
    category: 'Dairy & Eggs',
    price: 52,
    unit: 'pack',
    brand: 'Amul',
    reason: 'Lower cholesterol cooking option'
  },
  'sugar': {
    substituteName: 'Organic Jaggery / Gur',
    category: 'Pantry',
    price: 65,
    unit: 'pack',
    brand: 'Organic Tattva',
    reason: 'Natural unrefined sweetener'
  },
  'atta': {
    substituteName: 'Multigrain Atta',
    category: 'Pantry',
    price: 280,
    unit: 'kg',
    brand: 'Aashirvaad',
    reason: 'High fiber multigrain alternative'
  },
  'white rice': {
    substituteName: 'Brown Basmati Rice',
    category: 'Pantry',
    price: 150,
    unit: 'kg',
    brand: 'India Gate',
    reason: 'Whole grain high fiber rice'
  },
};
