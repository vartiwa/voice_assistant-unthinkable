import { SmartSuggestion } from '../types';

export const INITIAL_SMART_SUGGESTIONS: SmartSuggestion[] = [
  // History / Running Low recommendation
  {
    id: 'sug-hist-1',
    type: 'history',
    title: 'Running Low Alert',
    description: "It looks like you're running low on Whole Wheat Bread based on your weekly routine.",
    badge: 'Routine Reorder',
    reason: 'Last purchased 6 days ago',
    item: {
      name: 'Whole Wheat Sandwich Bread',
      category: 'Bakery',
      quantity: 1,
      unit: 'loaf',
      price: 3.29,
      brand: "Nature's Own"
    }
  },
  {
    id: 'sug-hist-2',
    type: 'history',
    title: 'Frequently Bought Together',
    description: 'You often purchase Fresh Hass Avocados and Roma Tomatoes for weekend meals.',
    badge: 'Favorite Pair',
    reason: 'Bought together in 4 of your last 5 trips',
    item: {
      name: 'Fresh Hass Avocados',
      category: 'Produce',
      quantity: 3,
      unit: 'item',
      price: 1.25,
      brand: 'Avocados from Mexico'
    }
  },

  // Seasonal & On Sale recommendation
  {
    id: 'sug-season-1',
    type: 'seasonal',
    title: 'Fresh In-Season Produce',
    description: 'Organic Honeycrisp Apples are in peak season right now with exceptional flavor.',
    badge: 'Peak Harvest',
    reason: 'Autumn Harvest Special',
    item: {
      name: 'Organic Honeycrisp Apples',
      category: 'Produce',
      quantity: 2,
      unit: 'lb',
      price: 3.99,
      brand: 'FreshFarm Organic',
      isOrganic: true
    }
  },
  {
    id: 'sug-sale-1',
    type: 'sale',
    title: 'Weekly Discount Special',
    description: 'Fresh Strawberries are 25% off this week — fresh from Driscoll\'s.',
    badge: 'Save $1.50',
    savings: 1.50,
    reason: 'Weekly Flyer Deal',
    item: {
      name: 'Fresh Strawberries',
      category: 'Produce',
      quantity: 1,
      unit: 'pack',
      price: 4.49,
      brand: "Driscoll's"
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
    substituteName: 'Almond Milk Unsweetened',
    category: 'Dairy & Eggs',
    price: 3.49,
    unit: 'carton',
    brand: 'Silk',
    reason: 'Popular plant-based & dairy-free alternative'
  },
  'whole milk': {
    substituteName: 'Almond Milk Unsweetened',
    category: 'Dairy & Eggs',
    price: 3.49,
    unit: 'carton',
    brand: 'Silk',
    reason: 'Plant-based, lactose-free alternative'
  },
  'bread': {
    substituteName: 'Gluten-Free Multigrain Bread',
    category: 'Bakery',
    price: 6.49,
    unit: 'loaf',
    brand: 'Canyon Bakehouse',
    reason: 'Gluten-free certified alternative'
  },
  'chicken': {
    substituteName: 'Organic Firm Tofu',
    category: 'Meat & Seafood',
    price: 2.99,
    unit: 'pack',
    brand: 'Nasoya',
    reason: 'High protein plant-based alternative',
    savings: 5.00
  },
  'pasta': {
    substituteName: 'Gluten-Free Chickpea Pasta',
    category: 'Pantry',
    price: 3.29,
    unit: 'box',
    brand: 'Banza',
    reason: 'High protein & gluten-free alternative'
  },
  'toothpaste': {
    substituteName: 'Sensodyne Rapid Relief Toothpaste',
    category: 'Personal Care',
    price: 6.29,
    unit: 'tube',
    brand: 'Sensodyne',
    reason: 'Sensitive enamel care alternative'
  }
};
