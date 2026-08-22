import { Category, ParsedVoiceCommand, ExtractedItemDetail } from '../types';
import { CATEGORY_MAP, PRODUCT_CATALOG } from '../data/catalog';

// Number words map across supported languages (including Indian English, Hindi & Tamil)
const NUMBER_WORDS: Record<string, number> = {
  // English
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  dozen: 12,
  half: 0.5,
  quarter: 0.25,

  // Hindi & Hinglish
  'एक': 1,
  'दो': 2,
  'तीन': 3,
  'चार': 4,
  'पाँच': 5,
  'पांच': 5,
  'छह': 6,
  'सात': 7,
  'आठ': 8,
  'नौ': 9,
  'दस': 10,
  'आधा': 0.5,
  'पाव': 0.25,
  'डेढ़': 1.5,
  'ढाई': 2.5,
  ek: 1,
  do: 2,
  teen: 3,
  chaar: 4,
  char: 4,
  paanch: 5,
  panch: 5,
  chhah: 6,
  che: 6,
  saat: 7,
  aath: 8,
  ath: 8,
  nau: 9,
  das: 10,
  aadha: 0.5,
  adha: 0.5,
  dedh: 1.5,
  dhaai: 2.5,

  // Tamil & Tanglish
  'ஒன்று': 1,
  'ஒன்னு': 1,
  'இரண்டு': 2,
  'ரெண்டு': 2,
  'மூன்று': 3,
  'மூணு': 3,
  'நான்கு': 4,
  'நாலு': 4,
  'ஐந்து': 5,
  'அஞ்சு': 5,
  'ஆறு': 6,
  'ஏழு': 7,
  'எட்டு': 8,
  'ஒன்பது': 9,
  'பத்து': 10,
  'அரை': 0.5,
  'கால்': 0.25,
  onnu: 1,
  ondru: 1,
  rendu: 2,
  irandu: 2,
  moonu: 3,
  moondru: 3,
  naalu: 4,
  naangu: 4,
  anju: 5,
  aindhu: 5,
  aaru: 6,
  ezhu: 7,
  ettu: 8,
  ombodhu: 9,
  pathu: 10,
  arai: 0.5,
  kaal: 0.25,

  // Spanish
  un: 1,
  una: 1,
  uno: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
  docena: 12,

  // French
  deux: 2,
  trois: 3,
  quatre: 4,
  cinq: 5,
  sept: 7,
  huit: 8,
  neuf: 9,
  dix: 10,

  // German
  ein: 1,
  eine: 1,
  einen: 1,
  eins: 1,
  zwei: 2,
  drei: 3,
  vier: 4,
  fünf: 5,
  sechs: 6,
  sieben: 7,
  acht: 8,
  neun: 9,
  zehn: 10,
};

const COMMON_UNITS = [
  'bottle',
  'bottles',
  'pack',
  'packs',
  'packet',
  'packets',
  'pkt',
  'pkts',
  'bag',
  'bags',
  'loaf',
  'loaves',
  'carton',
  'cartons',
  'gallon',
  'gallons',
  'box',
  'boxes',
  'dabba',
  'lb',
  'lbs',
  'kg',
  'kgs',
  'kilo',
  'kilos',
  'kilogram',
  'kilograms',
  'gram',
  'grams',
  'gm',
  'gms',
  'g',
  'litre',
  'litres',
  'liter',
  'liters',
  'ltr',
  'ltrs',
  'can',
  'cans',
  'jar',
  'jars',
  'item',
  'items',
  'pair',
  'pairs',
  'tube',
  'tubes',
  'dozen',
  'darjan',
  'bunch',
  'bunches',
  'kattu',
  // Multilingual Indian units
  'किलो',
  'ग्राम',
  'लीटर',
  'पैकेट',
  'डब्बा',
  'கிலோ',
  'கிராம்',
  'லிட்டர்',
  'பாக்கெட்',
  'கட்டு',
  // European units
  'botella',
  'botellas',
  'bolsa',
  'bolsas',
  'paquete',
  'paquetes',
  'paquet',
  'bouteille',
  'bouteilles',
  'flasche',
  'flaschen',
];

// Helper to infer category with whole-word regex matching
export const inferCategory = (itemName: string): Category => {
  const lower = itemName.toLowerCase().trim();
  if (!lower) return 'Other';

  // 1. Whole-word boundary match in CATEGORY_MAP
  for (const [key, category] of Object.entries(CATEGORY_MAP)) {
    const regex = new RegExp(`(^|\\s|[^a-zA-Z0-9])${key}($|\\s|[^a-zA-Z0-9])`, 'i');
    if (regex.test(lower)) {
      return category;
    }
  }

  // 2. Check catalog for exact or substring product names
  const matchedCatalog = PRODUCT_CATALOG.find((p) => {
    const pName = p.name.toLowerCase();
    return pName === lower || pName.includes(lower) || lower.includes(pName);
  });

  if (matchedCatalog) {
    return matchedCatalog.category;
  }

  // 3. Fallback keyword checks
  if (/\b(earphones?|headphones?|earbuds?|airpods?|charger|cable|battery|batteries|mouse|keyboard|phone|laptop|headset)\b/i.test(lower)) {
    return 'Electronics';
  }

  return 'Other';
};

// Helper to determine default price and unit without corrupting item name
export const inferProductDefaults = (
  itemName: string
): { price: number; unit: string; brand?: string; isOrganic?: boolean; fullName?: string } => {
  const lower = itemName.toLowerCase().trim();

  // Check catalog for close product matches
  const matched = PRODUCT_CATALOG.find((p) => {
    const pLower = p.name.toLowerCase();
    return pLower === lower || pLower.includes(lower) || lower.includes(pLower);
  });

  if (matched) {
    return {
      price: matched.price,
      unit: matched.unit,
      brand: matched.brand,
      isOrganic: matched.isOrganic,
      fullName: matched.name,
    };
  }

  // Smart defaults based on category
  const cat = inferCategory(itemName);
  switch (cat) {
    case 'Produce':
      return { price: 2.99, unit: 'lb' };
    case 'Dairy & Eggs':
      return { price: 3.49, unit: 'item' };
    case 'Bakery':
      return { price: 3.29, unit: 'pack' };
    case 'Electronics':
      return { price: 24.99, unit: 'pair' };
    case 'Meat & Seafood':
      return { price: 8.99, unit: 'lb' };
    case 'Beverages':
      return { price: 2.49, unit: 'bottle' };
    case 'Snacks':
      return { price: 3.99, unit: 'pack' };
    case 'Pantry':
      return { price: 4.29, unit: 'pack' };
    case 'Household':
      return { price: 5.99, unit: 'item' };
    case 'Personal Care':
      return { price: 4.49, unit: 'tube' };
    default:
      return { price: 3.99, unit: 'item' };
  }
};

export class NLPEngine {
  // Extract quantity and unit with support for Indian, Tamil, and English accents
  public extractQuantityAndUnit(
    rawText: string
  ): { quantity: number; unit: string; cleanedName: string } {
    let text = rawText.trim();
    let quantity = 1;
    let unit = 'item';

    // Strip leading conversational phrases
    text = text
      .replace(/^(?:i want to add|please add to cart|please add|can you add|can you please add|could you add|add to cart|put into cart|put in cart|add|buy|get|need|put|include|i want|i need|mujhe chahiye|chahiye|daalo|jodo|lao|venum|podu|podunga)\s+/i, '')
      .replace(/^(?:the|some|a|an)\s+/i, '')
      .trim();

    // 1. Check for numeric digits or decimals (e.g. "3", "2.5", "0.5", "1/2")
    const numericMatch = text.match(/^(?:add\s+|buy\s+|need\s+|get\s+|chahiye\s+|venum\s+)?(\d+(?:\.\d+)?|\d+\/\d+)\s*(.*)/i);
    if (numericMatch) {
      const numStr = numericMatch[1];
      if (numStr.includes('/')) {
        const [nom, denom] = numStr.split('/');
        quantity = parseFloat(nom) / parseFloat(denom);
      } else {
        quantity = parseFloat(numStr);
      }
      text = numericMatch[2].trim();
    } else {
      // 2. Check for number words in English, Hindi, Tamil
      const tokens = text.split(/\s+/);
      const firstWord = tokens[0]?.toLowerCase();
      const secondWord = tokens[1]?.toLowerCase();

      if (tokens.length > 1 && NUMBER_WORDS[firstWord] !== undefined) {
        quantity = NUMBER_WORDS[firstWord];
        text = tokens.slice(1).join(' ');
      } else if (
        tokens.length > 2 &&
        (firstWord === 'add' || firstWord === 'buy' || firstWord === 'get' || firstWord === 'need' || firstWord === 'ek' || firstWord === 'onnu') &&
        NUMBER_WORDS[secondWord] !== undefined
      ) {
        quantity = NUMBER_WORDS[secondWord];
        text = tokens.slice(2).join(' ');
      }
    }

    // 3. Check for unit
    const unitTokens = text.split(/\s+/);
    const potentialUnit = unitTokens[0]?.toLowerCase();
    const cleanUnit = potentialUnit?.replace(/s$/, ''); // normalize plural

    if (COMMON_UNITS.includes(potentialUnit) || COMMON_UNITS.includes(cleanUnit)) {
      unit = potentialUnit;
      // Strip "of" / "ka" / "kooda"
      const remaining = unitTokens.slice(1);
      if (remaining[0]?.toLowerCase() === 'of' || remaining[0]?.toLowerCase() === 'ka' || remaining[0]?.toLowerCase() === 'kooda') {
        text = remaining.slice(1).join(' ');
      } else {
        text = remaining.join(' ');
      }
    }

    // 4. Strip Indian / Hinglish / Tanglish filler suffixes & prefixes
    text = text
      .replace(/\b(chahiye|lao|daalo|jodo|de do|add karo|kharido)\b/gi, '')
      .replace(/\b(venum|podu|podunga|vaanganum|edunga|add pannu|add pannunga)\b/gi, '')
      .replace(/\b(to my list|to the list|to my cart|to the cart|to list|in list|in cart|into cart|into the cart)\b/gi, '')
      .replace(/\b(please|please add|can you add|i want to buy|i want|give me|also|and also|thanks|thank you)\b/gi, '')
      .trim();

    return {
      quantity: Math.max(quantity, 0.25),
      unit,
      cleanedName: text.trim(),
    };
  }

  // Parse a single item clause into an ExtractedItemDetail
  private parseItemClause(clause: string, rawTextForOrganic: string): ExtractedItemDetail | null {
    const { quantity, unit, cleanedName } = this.extractQuantityAndUnit(clause);
    if (!cleanedName || cleanedName.length < 2) return null;

    const category = inferCategory(cleanedName);
    const defaults = inferProductDefaults(cleanedName);
    const displayName = defaults.fullName || cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
    const finalUnit = unit !== 'item' ? unit : defaults.unit;

    return {
      name: displayName,
      category,
      quantity,
      unit: finalUnit,
      brand: defaults.brand,
      isOrganic: defaults.isOrganic || /organic/i.test(clause) || /organic/i.test(rawTextForOrganic),
      maxPrice: defaults.price,
    };
  }

  // Main NLP command parser
  public parseCommand(rawText: string, _language: string = 'en-IN'): ParsedVoiceCommand {
    const text = rawText.trim();
    if (!text) {
      return {
        intent: 'UNKNOWN',
        rawText: '',
        feedbackMessage: "I didn't catch that. Please speak your command or say 'Help'.",
        success: false,
      };
    }

    // Comprehensive Wake Word Detection with phonetic mis-hearings & "hey add to cart"
    const wakeWordMatches = [
      /^(?:hey|ok|okay|hello|namaste|vanakkam|hi|oye|listen|yo)\s+(?:assistant|assistent|asistant|acistant|assistance|assistence|assist|cart|add\s+to\s+cart|google|voice\s*cart|voicecart)[,\s]*/i,
      /^(?:voice\s*cart|voicecart|assistant|assistent|asistant|acistant|assistance|assistence|shopping assistant|hey\s+add\s+to\s+cart|add\s+to\s+cart|put\s+in\s+cart|cart\s+mein\s+daalo)[,\s]*/i,
    ];

    let cleanedText = text;
    let hadWakeWord = false;

    for (const rx of wakeWordMatches) {
      if (rx.test(cleanedText)) {
        hadWakeWord = true;
        cleanedText = cleanedText.replace(rx, '').trim();
        break;
      }
    }

    // If user ONLY said the wake word ("Hey Assistant", "Hey Assistance", "Hey add to cart", etc.)
    if (hadWakeWord && !cleanedText) {
      return {
        intent: 'WAKE_GREETING',
        rawText: text,
        feedbackMessage: "Yes, I'm listening! Tell me what to add to your list.",
        success: true,
      };
    }

    const lower = (cleanedText || text).toLowerCase().trim();

    // 1. HELP COMMANDS (English, Hindi, Tamil)
    if (
      lower.includes('help') ||
      lower.includes('what can i say') ||
      lower.includes('kaise use kare') ||
      lower.includes('eppadi use panradhu') ||
      lower.includes('मदद') ||
      lower.includes('உதவி')
    ) {
      return {
        intent: 'HELP',
        rawText: text,
        feedbackMessage: 'Here are the available voice commands you can use.',
        success: true,
      };
    }

    // 2. SUGGESTIONS & REORDERS (English, Hindi, Tamil)
    if (
      lower.includes('suggest') ||
      lower.includes('recommend') ||
      lower.includes('running low') ||
      lower.includes('in season') ||
      lower.includes('on sale') ||
      lower.includes('routine') ||
      lower.includes('offers') ||
      lower.includes('सुझाव') ||
      lower.includes('பரிந்துரை') ||
      lower.includes('enna iruku')
    ) {
      return {
        intent: 'SHOW_SUGGESTIONS',
        rawText: text,
        feedbackMessage: 'Showing smart suggestions for routine reorders, in-season produce, and weekly deals.',
        success: true,
      };
    }

    // 3. CLEAR ALL COMMANDS
    if (
      (lower.includes('clear') && (lower.includes('list') || lower.includes('all') || lower.includes('cart'))) ||
      lower.includes('delete all') ||
      lower.includes('sab hatao') ||
      lower.includes('ellathayum delete pannu') ||
      lower.includes('सब हटाओ') ||
      lower.includes('அனைத்தும் நீக்கு')
    ) {
      return {
        intent: 'CLEAR_LIST',
        rawText: text,
        feedbackMessage: 'Cleared all items from your shopping list.',
        success: true,
      };
    }

    // 4. PRICE FILTER COMMANDS (Handles ₹, Rupees, Rs, INR, $, Dollars)
    const priceMatch = lower.match(
      /(?:under|below|less than|max|cheaper than|under ₹|under \$|se kam|kulla|kamti)\s*(?:₹|\$|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:dollars?|bucks?|\$|rupees?|rs|inr|₹)?/i
    );

    if (
      priceMatch ||
      lower.startsWith('find') ||
      lower.startsWith('search') ||
      lower.startsWith('dhoondo') ||
      lower.startsWith('thedu') ||
      lower.startsWith('kaatu') ||
      lower.startsWith('ढूँढो') ||
      lower.startsWith('தேடு')
    ) {
      if (priceMatch) {
        const maxPrice = parseFloat(priceMatch[1]);
        let cleanQuery = lower
          .replace(priceMatch[0], '')
          .replace(/^(find|search for|search|show me|show|look for|dhoondo|thedu|kaatu|ढूँढो|தேடு)\s*/i, '')
          .replace(/(items?|products?|things?)/i, '')
          .trim();

        return {
          intent: 'FILTER_ITEMS',
          rawText: text,
          searchQuery: cleanQuery,
          priceFilter: maxPrice,
          feedbackMessage: `Filtering items ${cleanQuery ? `for "${cleanQuery}"` : ''} under $${maxPrice.toFixed(2)}.`,
          success: true,
        };
      }

      // Pure item search
      let cleanQuery = lower
        .replace(/^(find me|find|search for|search|look for|dhoondo|thedu|kaatu|ढूँढो|தேடு)\s*/i, '')
        .trim();

      if (cleanQuery) {
        return {
          intent: 'SEARCH_ITEMS',
          rawText: text,
          searchQuery: cleanQuery,
          feedbackMessage: `Searching catalog for "${cleanQuery}".`,
          success: true,
        };
      }
    }

    // 5. REMOVE ITEM COMMANDS
    const isRemove =
      lower.startsWith('remove') ||
      lower.startsWith('delete') ||
      lower.startsWith('drop') ||
      lower.startsWith('take off') ||
      lower.includes('from my list') ||
      lower.includes('from the list') ||
      lower.includes('hatao') ||
      lower.includes('nikalo') ||
      lower.includes('delete pannu') ||
      lower.includes('theva illa') ||
      lower.includes('हटाओ') ||
      lower.includes('நீக்கு');

    if (isRemove) {
      let targetName = lower
        .replace(/^(remove|delete|drop|take off)\s*/i, '')
        .replace(/(from my list|from the list|from list|from cart|hatao|nikalo|delete pannu|theva illa|हटाओ|நீக்கு)/i, '')
        .replace(/^(the|a|an|some)\s*/i, '')
        .trim();

      const { quantity, cleanedName } = this.extractQuantityAndUnit(targetName);
      const finalName = cleanedName || 'Item';
      const category = inferCategory(finalName);

      return {
        intent: 'REMOVE_ITEM',
        rawText: text,
        itemDetails: {
          name: finalName,
          category,
          quantity,
          unit: 'item',
        },
        feedbackMessage: `Removed ${finalName} from your shopping list.`,
        success: true,
      };
    }

    // 6. ADD ITEM COMMANDS (With Smart Multi-Item Splitting e.g. "milk and apples", "2 kg atta, milk and eggs")
    let itemInput = lower
      .replace(/^(?:i want to add|please add to cart|please add|can you please add|can you add|could you add|add to cart|put into cart|put in cart|add|buy|get|need|put|include|i want|i need|mujhe chahiye|chahiye|daalo|jodo|lao|venum|podu|podunga)\s+/i, '')
      .replace(/(?:to my list|to the list|to my cart|to the cart|to list|in list|in cart|into cart|into the cart|add karo|add pannu|add pannunga|kharido|vaanganum)$/i, '')
      .replace(/^(?:the|some|a|an)\s+/i, '')
      .trim();

    if (!itemInput) {
      itemInput = lower;
    }

    // Check for multi-item connectors (" and ", " & ", ", ", " aur ", " matrum ")
    const clauses = itemInput
      .split(/\s+(?:and|&|aur|matrum)\s+|,\s*/i)
      .map((c) => c.trim())
      .filter((c) => c.length > 1);

    if (clauses.length > 1) {
      const extractedList: ExtractedItemDetail[] = [];
      for (const clause of clauses) {
        const item = this.parseItemClause(clause, text);
        if (item) extractedList.push(item);
      }

      if (extractedList.length > 1) {
        const itemNames = extractedList.map((i) => `${i.quantity} ${i.unit !== 'item' ? i.unit + ' ' : ''}${i.name}`).join(' and ');
        return {
          intent: 'ADD_ITEM',
          rawText: text,
          items: extractedList,
          itemDetails: extractedList[0],
          feedbackMessage: `Added ${itemNames} to your cart.`,
          success: true,
        };
      }
    }

    // Single item fallback
    const singleItem = this.parseItemClause(itemInput, text);
    if (singleItem) {
      return {
        intent: 'ADD_ITEM',
        rawText: text,
        items: [singleItem],
        itemDetails: singleItem,
        feedbackMessage: `Added ${singleItem.quantity} ${singleItem.unit !== 'item' ? singleItem.unit + ' of ' : ''}${singleItem.name} to ${singleItem.category || 'your cart'}.`,
        success: true,
      };
    }

    // Default fallback
    const category = inferCategory(itemInput);
    const defaults = inferProductDefaults(itemInput);
    const displayName = defaults.fullName || itemInput.charAt(0).toUpperCase() + itemInput.slice(1);

    const fallbackDetail: ExtractedItemDetail = {
      name: displayName,
      category,
      quantity: 1,
      unit: defaults.unit,
      brand: defaults.brand,
      isOrganic: defaults.isOrganic || /organic/i.test(text),
      maxPrice: defaults.price,
    };

    return {
      intent: 'ADD_ITEM',
      rawText: text,
      items: [fallbackDetail],
      itemDetails: fallbackDetail,
      feedbackMessage: `Added ${displayName} to ${category}.`,
      success: true,
    };
  }
}

export const nlpEngine = new NLPEngine();
