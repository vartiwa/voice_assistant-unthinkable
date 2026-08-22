import { CatalogProduct } from '../types';

export const PRODUCT_CATALOG: CatalogProduct[] = [
  // Produce
  {
    id: 'prod-1',
    name: 'Organic Honeycrisp Apples',
    category: 'Produce',
    brand: 'FreshFarm Organic',
    price: 3.99,
    unit: 'lb',
    imageIcon: '🍎',
    isOrganic: true,
    isVegan: true,
    inSeason: true,
    seasonName: 'Autumn',
    substitutes: ['Fuji Apples', 'Gala Apples', 'Pears']
  },
  {
    id: 'prod-2',
    name: 'Bananas',
    category: 'Produce',
    brand: 'Chiquita',
    price: 0.69,
    unit: 'lb',
    imageIcon: '🍌',
    isVegan: true,
    inSeason: true,
    seasonName: 'Year-round',
    substitutes: ['Plantains', 'Apples']
  },
  {
    id: 'prod-3',
    name: 'Fresh Strawberries',
    category: 'Produce',
    brand: 'Driscoll\'s',
    price: 4.49,
    unit: 'pack',
    imageIcon: '🍓',
    isVegan: true,
    inSeason: true,
    seasonName: 'Spring',
    onSale: true,
    originalPrice: 5.99,
    substitutes: ['Blueberries', 'Raspberries']
  },
  {
    id: 'prod-4',
    name: 'Organic Baby Spinach',
    category: 'Produce',
    brand: 'Earthbound Farm',
    price: 2.99,
    unit: 'pack',
    imageIcon: '🥬',
    isOrganic: true,
    isVegan: true,
    inSeason: true,
    seasonName: 'Year-round',
    substitutes: ['Kale', 'Arugula']
  },
  {
    id: 'prod-5',
    name: 'Fresh Hass Avocados',
    category: 'Produce',
    brand: 'Avocados from Mexico',
    price: 1.25,
    unit: 'item',
    imageIcon: '🥑',
    isVegan: true,
    inSeason: true,
    seasonName: 'Year-round',
    onSale: true,
    originalPrice: 1.75,
    substitutes: ['Guacamole Pack']
  },
  {
    id: 'prod-6',
    name: 'Roma Tomatoes',
    category: 'Produce',
    brand: 'Local Farm',
    price: 1.99,
    unit: 'lb',
    imageIcon: '🍅',
    isVegan: true,
    inSeason: true,
    seasonName: 'Summer',
    substitutes: ['Vine Ripe Tomatoes', 'Canned Diced Tomatoes']
  },
  {
    id: 'prod-7',
    name: 'Sweet Oranges',
    category: 'Produce',
    brand: 'Sunkist',
    price: 4.99,
    unit: 'bag',
    imageIcon: '🍊',
    isVegan: true,
    inSeason: true,
    seasonName: 'Winter',
    substitutes: ['Mandarins', 'Grapefruit']
  },

  // Dairy & Eggs
  {
    id: 'dairy-1',
    name: 'Whole Milk (Gallon)',
    category: 'Dairy & Eggs',
    brand: 'Horizon Organic',
    price: 4.89,
    unit: 'gallon',
    imageIcon: '🥛',
    isOrganic: true,
    substitutes: ['Almond Milk Unsweetened', 'Oat Milk Creamy', 'Lactose-Free Whole Milk']
  },
  {
    id: 'dairy-2',
    name: 'Almond Milk Unsweetened',
    category: 'Dairy & Eggs',
    brand: 'Silk',
    price: 3.49,
    unit: 'carton',
    imageIcon: '🥛',
    isVegan: true,
    isDairyFree: true,
    isGlutenFree: true,
    onSale: true,
    originalPrice: 4.19,
    substitutes: ['Whole Milk (Gallon)', 'Oat Milk Creamy', 'Soy Milk']
  },
  {
    id: 'dairy-3',
    name: 'Oat Milk Creamy',
    category: 'Dairy & Eggs',
    brand: 'Oatly',
    price: 4.29,
    unit: 'carton',
    imageIcon: '🌾',
    isVegan: true,
    isDairyFree: true,
    substitutes: ['Almond Milk Unsweetened', 'Whole Milk (Gallon)']
  },
  {
    id: 'dairy-4',
    name: 'Pasture-Raised Grade A Large Eggs',
    category: 'Dairy & Eggs',
    brand: 'Vital Farms',
    price: 5.99,
    unit: 'dozen',
    imageIcon: '🥚',
    isOrganic: true,
    substitutes: ['Organic Cage-Free Eggs', 'Liquid Egg Whites', 'Just Egg Vegan Substitute']
  },
  {
    id: 'dairy-5',
    name: 'Greek Yogurt Plain',
    category: 'Dairy & Eggs',
    brand: 'Chobani',
    price: 3.89,
    unit: 'tub',
    imageIcon: '🥣',
    isGlutenFree: true,
    substitutes: ['Almond Milk Yogurt', 'Vanilla Greek Yogurt']
  },
  {
    id: 'dairy-6',
    name: 'Sharp Cheddar Cheese Block',
    category: 'Dairy & Eggs',
    brand: 'Cabot',
    price: 3.79,
    unit: 'block',
    imageIcon: '🧀',
    substitutes: ['Plant-Based Cheddar Slices', 'Mozzarella Cheese']
  },
  {
    id: 'dairy-7',
    name: 'Unsalted Butter',
    category: 'Dairy & Eggs',
    brand: 'Kerrygold',
    price: 4.99,
    unit: 'pack',
    imageIcon: '🧈',
    substitutes: ['Plant-Based Butter', 'Olive Oil']
  },

  // Bakery
  {
    id: 'bak-1',
    name: 'Whole Wheat Sandwich Bread',
    category: 'Bakery',
    brand: 'Nature\'s Own',
    price: 3.29,
    unit: 'loaf',
    imageIcon: '🍞',
    substitutes: ['Gluten-Free Multigrain Bread', 'Sourdough Artisanal Bread']
  },
  {
    id: 'bak-2',
    name: 'Gluten-Free Multigrain Bread',
    category: 'Bakery',
    brand: 'Canyon Bakehouse',
    price: 6.49,
    unit: 'loaf',
    imageIcon: '🍞',
    isGlutenFree: true,
    substitutes: ['Whole Wheat Sandwich Bread', 'Corn Tortillas']
  },
  {
    id: 'bak-3',
    name: 'Sourdough Artisanal Bread',
    category: 'Bakery',
    brand: 'Bakery Fresh',
    price: 4.79,
    unit: 'loaf',
    imageIcon: '🥖',
    isVegan: true,
    substitutes: ['French Baguette', 'Whole Wheat Sandwich Bread']
  },
  {
    id: 'bak-4',
    name: 'Everything Bagels (6-Pack)',
    category: 'Bakery',
    brand: 'Thomas\'',
    price: 3.99,
    unit: 'pack',
    imageIcon: '🥯',
    onSale: true,
    originalPrice: 4.59,
    substitutes: ['Plain Bagels', 'English Muffins']
  },

  // Meat & Seafood
  {
    id: 'meat-1',
    name: 'Boneless Skinless Chicken Breasts',
    category: 'Meat & Seafood',
    brand: 'Perdue',
    price: 8.99,
    unit: 'pack',
    imageIcon: '🍗',
    substitutes: ['Chicken Thighs', 'Organic Firm Tofu', 'Plant-Based Chicken']
  },
  {
    id: 'meat-2',
    name: 'Lean Ground Beef (93/7)',
    category: 'Meat & Seafood',
    brand: 'Laura\'s Lean',
    price: 7.49,
    unit: 'lb',
    imageIcon: '🥩',
    substitutes: ['Ground Turkey', 'Beyond Meat Plant-Based Beef']
  },
  {
    id: 'meat-3',
    name: 'Wild Caught Atlantic Salmon Fillet',
    category: 'Meat & Seafood',
    brand: 'SeaFresh',
    price: 11.99,
    unit: 'lb',
    imageIcon: '🐟',
    substitutes: ['Tilapia Fillets', 'Canned Wild Tuna']
  },

  // Pantry
  {
    id: 'pantry-1',
    name: 'Extra Virgin Olive Oil',
    category: 'Pantry',
    brand: 'California Olive Ranch',
    price: 10.99,
    unit: 'bottle',
    imageIcon: '🫒',
    isVegan: true,
    isOrganic: true,
    substitutes: ['Avocado Oil', 'Canola Oil']
  },
  {
    id: 'pantry-2',
    name: 'Organic Jasmine Brown Rice',
    category: 'Pantry',
    brand: 'Lundberg',
    price: 4.99,
    unit: 'bag',
    imageIcon: '🍚',
    isOrganic: true,
    isGlutenFree: true,
    substitutes: ['White Jasmine Rice', 'Quinoa']
  },
  {
    id: 'pantry-3',
    name: 'Organic Penne Rigate Pasta',
    category: 'Pantry',
    brand: 'Barilla',
    price: 1.89,
    unit: 'box',
    imageIcon: '🍝',
    substitutes: ['Gluten-Free Chickpea Pasta', 'Whole Wheat Spaghetti']
  },
  {
    id: 'pantry-4',
    name: 'Marinara Tomato Basil Pasta Sauce',
    category: 'Pantry',
    brand: 'Rao\'s Homemade',
    price: 7.99,
    unit: 'jar',
    imageIcon: '🥫',
    onSale: true,
    originalPrice: 8.99,
    substitutes: ['Barilla Traditional Sauce', 'Crushed Tomatoes']
  },
  {
    id: 'pantry-5',
    name: 'Organic Peanut Butter Creamy',
    category: 'Pantry',
    brand: 'Santa Cruz',
    price: 4.49,
    unit: 'jar',
    imageIcon: '🥜',
    isOrganic: true,
    isVegan: true,
    substitutes: ['Almond Butter', 'Sunflower Seed Butter']
  },

  // Beverages
  {
    id: 'bev-1',
    name: 'Natural Spring Water (24-pack)',
    category: 'Beverages',
    brand: 'Poland Spring',
    price: 5.49,
    unit: 'pack',
    imageIcon: '💧',
    substitutes: ['Purified Water 1-Gallon', 'Sparkling Mineral Water']
  },
  {
    id: 'bev-2',
    name: 'Pure Squeezed Orange Juice No Pulp',
    category: 'Beverages',
    brand: 'Tropicana',
    price: 4.29,
    unit: 'bottle',
    imageIcon: '🧃',
    substitutes: ['Fresh Oranges', 'Apple Juice']
  },
  {
    id: 'bev-3',
    name: 'Sparkling Water Lime (8-Pack)',
    category: 'Beverages',
    brand: 'LaCroix',
    price: 3.99,
    unit: 'pack',
    imageIcon: '🫧',
    onSale: true,
    originalPrice: 4.99,
    substitutes: ['Spindrift Lime', 'San Pellegrino']
  },
  {
    id: 'bev-4',
    name: 'Dark Roast Ground Coffee',
    category: 'Beverages',
    brand: 'Peet\'s Coffee',
    price: 9.49,
    unit: 'bag',
    imageIcon: '☕',
    substitutes: ['Medium Roast Coffee', 'Matcha Green Tea']
  },

  // Snacks
  {
    id: 'snack-1',
    name: 'Sea Salt Tortilla Chips',
    category: 'Snacks',
    brand: 'Late July Organic',
    price: 3.49,
    unit: 'bag',
    imageIcon: '🌽',
    isOrganic: true,
    isGlutenFree: true,
    substitutes: ['Pita Chips', 'Potato Chips']
  },
  {
    id: 'snack-2',
    name: 'Dark Chocolate Sea Salt Bar (70%)',
    category: 'Snacks',
    brand: 'Lindt',
    price: 2.99,
    unit: 'bar',
    imageIcon: '🍫',
    onSale: true,
    originalPrice: 3.79,
    substitutes: ['Milk Chocolate Bar', 'Organic Dark Chocolate Almond']
  },
  {
    id: 'snack-3',
    name: 'Roasted Salted Almonds',
    category: 'Snacks',
    brand: 'Blue Diamond',
    price: 4.99,
    unit: 'bag',
    imageIcon: '🌰',
    substitutes: ['Raw Walnuts', 'Mixed Nuts']
  },

  // Household & Personal Care
  {
    id: 'house-1',
    name: 'Ultra Strong Paper Towels (6 Rolls)',
    category: 'Household',
    brand: 'Bounty',
    price: 8.99,
    unit: 'pack',
    imageIcon: '🧻',
    substitutes: ['Recycled Paper Towels', 'Microfiber Cloths']
  },
  {
    id: 'house-2',
    name: 'Plant-Based Dish Soap Citrus',
    category: 'Household',
    brand: 'Seventh Generation',
    price: 3.29,
    unit: 'bottle',
    imageIcon: '🧼',
    isVegan: true,
    substitutes: ['Dawn Ultra Dish Soap']
  },
  {
    id: 'care-1',
    name: 'Total Whitening Toothpaste (2-pack)',
    category: 'Personal Care',
    brand: 'Colgate',
    price: 4.49,
    unit: 'pack',
    imageIcon: '🪥',
    substitutes: ['Sensodyne Gentle Whitening', 'Tom\'s of Maine Natural']
  },
  {
    id: 'care-2',
    name: 'Sensodyne Rapid Relief Toothpaste',
    category: 'Personal Care',
    brand: 'Sensodyne',
    price: 6.29,
    unit: 'tube',
    imageIcon: '🪥',
    substitutes: ['Colgate Total Whitening', 'Crest 3D White']
  }
];

export const CATEGORY_MAP: Record<string, CatalogProduct['category']> = {
  // Produce
  apple: 'Produce',
  apples: 'Produce',
  banana: 'Produce',
  bananas: 'Produce',
  orange: 'Produce',
  oranges: 'Produce',
  strawberry: 'Produce',
  strawberries: 'Produce',
  spinach: 'Produce',
  avocado: 'Produce',
  avocados: 'Produce',
  tomato: 'Produce',
  tomatoes: 'Produce',
  potato: 'Produce',
  potatoes: 'Produce',
  onion: 'Produce',
  onions: 'Produce',
  carrot: 'Produce',
  carrots: 'Produce',
  lemon: 'Produce',
  lemons: 'Produce',
  lime: 'Produce',
  limes: 'Produce',
  lettuce: 'Produce',
  garlic: 'Produce',
  cucumber: 'Produce',
  cucumbers: 'Produce',
  berry: 'Produce',
  berries: 'Produce',
  fruit: 'Produce',
  vegetable: 'Produce',

  // Dairy & Eggs
  milk: 'Dairy & Eggs',
  egg: 'Dairy & Eggs',
  eggs: 'Dairy & Eggs',
  cheese: 'Dairy & Eggs',
  butter: 'Dairy & Eggs',
  yogurt: 'Dairy & Eggs',
  cream: 'Dairy & Eggs',
  almond_milk: 'Dairy & Eggs',
  oat_milk: 'Dairy & Eggs',
  cheddar: 'Dairy & Eggs',

  // Bakery
  bread: 'Bakery',
  bagel: 'Bakery',
  bagels: 'Bakery',
  croissant: 'Bakery',
  croissants: 'Bakery',
  muffin: 'Bakery',
  muffins: 'Bakery',
  tortilla: 'Bakery',
  tortillas: 'Bakery',
  bun: 'Bakery',
  buns: 'Bakery',
  pita: 'Bakery',

  // Meat & Seafood
  chicken: 'Meat & Seafood',
  beef: 'Meat & Seafood',
  steak: 'Meat & Seafood',
  fish: 'Meat & Seafood',
  salmon: 'Meat & Seafood',
  turkey: 'Meat & Seafood',
  pork: 'Meat & Seafood',
  shrimp: 'Meat & Seafood',
  tuna: 'Meat & Seafood',
  tofu: 'Meat & Seafood',

  // Pantry
  oil: 'Pantry',
  'olive oil': 'Pantry',
  rice: 'Pantry',
  pasta: 'Pantry',
  sauce: 'Pantry',
  flour: 'Pantry',
  sugar: 'Pantry',
  salt: 'Pantry',
  pepper: 'Pantry',
  cereal: 'Pantry',
  beans: 'Pantry',
  peanut_butter: 'Pantry',

  // Beverages
  water: 'Beverages',
  juice: 'Beverages',
  coffee: 'Beverages',
  tea: 'Beverages',
  soda: 'Beverages',
  'sparkling water': 'Beverages',
  coke: 'Beverages',

  // Snacks
  chips: 'Snacks',
  chocolate: 'Snacks',
  nuts: 'Snacks',
  cookies: 'Snacks',
  crackers: 'Snacks',
  popcorn: 'Snacks',

  // Household & Personal
  'paper towels': 'Household',
  'toilet paper': 'Household',
  soap: 'Household',
  detergent: 'Household',
  toothpaste: 'Personal Care',
  shampoo: 'Personal Care',
  conditioner: 'Personal Care'
};
