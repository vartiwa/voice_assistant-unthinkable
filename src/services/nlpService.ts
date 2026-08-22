import { Category, ParsedVoiceCommand } from '../types';
import { CATEGORY_MAP, PRODUCT_CATALOG } from '../data/catalog';

// Number words map across supported languages
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

  // Hindi
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
};

const COMMON_UNITS = [
  'bottle',
  'bottles',
  'pack',
  'packs',
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
  'lb',
  'lbs',
  'kg',
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
  // Multilingual units
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
  'पैकेट',
  'बोतल',
];

// Helper to determine category from item name with whole-word regex matching
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
  if (/\b(earphones?|headphones?|earbuds?|airpods?|charger|cable|battery|batteries|mouse|keyboard|phone|laptop)\b/i.test(lower)) {
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
    return pLower === lower || pLower.includes(lower);
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

  // Reasonable defaults for electronics
  if (/\b(earphones?|headphones?|earbuds?|airpods?)\b/i.test(lower)) {
    return {
      price: 19.99,
      unit: 'pair',
      brand: 'Sony',
    };
  }
  if (/\b(charger|cable|usb)\b/i.test(lower)) {
    return {
      price: 9.99,
      unit: 'item',
      brand: 'Anker',
    };
  }

  return {
    price: 3.49,
    unit: 'item',
  };
};

export class NLPEngine {
  /**
   * Main entry point: parses raw speech transcript into structured intent and entities
   */
  public parseCommand(rawTranscript: string, _lang: string = 'en'): ParsedVoiceCommand {
    const text = rawTranscript.trim();
    const lower = text.toLowerCase();

    if (!text) {
      return {
        intent: 'UNKNOWN',
        rawText: text,
        feedbackMessage: "I didn't catch that. Try saying 'Add milk' or 'Find apples'.",
        success: false,
      };
    }

    // 1. HELP COMMANDS
    if (
      lower.includes('help') ||
      lower.includes('what can i say') ||
      lower.includes('ayuda') ||
      lower.includes('aide') ||
      lower.includes('hilfe') ||
      lower.includes('मदद')
    ) {
      return {
        intent: 'HELP',
        rawText: text,
        feedbackMessage: 'Here are the available voice commands you can use.',
        success: true,
      };
    }

    // 2. SUGGESTIONS & SEASONAL COMMANDS
    if (
      lower.includes('suggest') ||
      lower.includes('recommend') ||
      lower.includes('running low') ||
      lower.includes('in season') ||
      lower.includes('on sale') ||
      lower.includes('sugerencias') ||
      lower.includes('suggestions') ||
      lower.includes('empfehlungen') ||
      lower.includes('सुझाव')
    ) {
      return {
        intent: 'SHOW_SUGGESTIONS',
        rawText: text,
        feedbackMessage: 'Opening smart suggestions based on your routine and seasonal specials.',
        success: true,
      };
    }

    // 3. CLEAR ALL COMMANDS
    if (
      (lower.includes('clear') && (lower.includes('list') || lower.includes('all') || lower.includes('cart'))) ||
      lower.includes('delete all') ||
      lower.includes('borrar todo') ||
      lower.includes('vaciar lista') ||
      lower.includes('tout supprimer') ||
      lower.includes('alles löschen') ||
      lower.includes('सब हटाओ')
    ) {
      return {
        intent: 'CLEAR_LIST',
        rawText: text,
        feedbackMessage: 'Cleared all items from your shopping list.',
        success: true,
      };
    }

    // 4. PRICE FILTER COMMANDS (e.g. "Find toothpaste under $5", "Show items under 4 dollars", "bajo 5 dolares")
    const priceMatch = lower.match(
      /(?:under|below|less than|max|cheaper than|under \$|bajo|menos de|sous|unter|से कम)\s*\$?(\d+(?:\.\d+)?)\s*(?:dollars?|bucks?|\$|euros?|रुपये)?/i
    );

    if (
      priceMatch ||
      lower.startsWith('find') ||
      lower.startsWith('search') ||
      lower.startsWith('buscar') ||
      lower.startsWith('chercher') ||
      lower.startsWith('suchen') ||
      lower.startsWith('ढूँढो') ||
      lower.startsWith('खोजो')
    ) {
      // Check if price filtering was requested
      if (priceMatch) {
        const maxPrice = parseFloat(priceMatch[1]);
        let cleanQuery = lower
          .replace(priceMatch[0], '')
          .replace(/^(find|search for|search|show me|show|look for|buscar|chercher|suchen|ढूँढो|खोजो)\s*/i, '')
          .replace(/(items?|products?|artículos|produits|produkte)/i, '')
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

      // Pure item search (e.g. "Find me organic apples")
      let cleanQuery = lower
        .replace(/^(find me|find|search for|search|look for|buscar|chercher|suchen|ढूँढो|खोजो)\s*/i, '')
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

    // 5. REMOVE ITEM COMMANDS (e.g. "Remove milk from my list", "Delete bananas", "Take off 2 apples", "Eliminar pan")
    const isRemove =
      lower.startsWith('remove') ||
      lower.startsWith('delete') ||
      lower.startsWith('drop') ||
      lower.startsWith('take off') ||
      lower.includes('from my list') ||
      lower.includes('from the list') ||
      lower.startsWith('eliminar') ||
      lower.startsWith('quitar') ||
      lower.startsWith('borrar') ||
      lower.startsWith('supprimer') ||
      lower.startsWith('enlever') ||
      lower.startsWith('entfernen') ||
      lower.startsWith('löschen') ||
      lower.includes('हटाओ') ||
      lower.includes('निकालो');

    if (isRemove) {
      let targetName = lower
        .replace(/^(remove|delete|drop|take off|quitar|eliminar|borrar|supprimer|enlever|entfernen|löschen)\s*/i, '')
        .replace(/(from my list|from the list|from list|from cart|de mi lista|de la liste|aus der liste|हटाओ|निकालो)/i, '')
        .replace(/^(the|a|an|some|el|la|los|las|le|la|les|die|der|das)\s*/i, '')
        .trim();

      const { quantity, cleanedName } = this.extractQuantityAndUnit(targetName);
      const finalName = cleanedName || 'Item';
      const category = inferCategory(finalName);

      return {
        intent: 'REMOVE_ITEM',
        rawText: text,
        itemDetails: {
          name: this.formatItemName(finalName),
          quantity: quantity || 1,
          unit: 'item',
          category,
        },
        feedbackMessage: `Removed ${this.formatItemName(finalName)} from your list.`,
        success: true,
      };
    }

    // 6. ADD ITEM COMMANDS (Default intent for varied natural phrases)
    let addText = lower
      .replace(/^(i need to buy|i want to buy|i want|i need|please add|can you add|add|buy|get me|get|put|quiero comprar|necesito|añadir|agregar|comprar|j'ai besoin de|ajouter|acheter|ich brauche|hinzufügen|kaufen|चाहिए|जोड़ो|खरीदना है)\s*/i, '')
      .replace(/(to my list|to the list|to list|to cart|to my cart|in my cart|en mi lista|à ma liste|zu meiner liste|जोड़ो|में डालो)/i, '')
      .trim();

    if (!addText) {
      addText = lower; // fallback
    }

    const { quantity, unit, cleanedName, isOrganic } = this.extractQuantityAndUnit(addText);
    const finalName = cleanedName || 'Item';
    const category = inferCategory(finalName);
    const defaults = inferProductDefaults(finalName);

    // Keep the user's item name formatted cleanly
    const formattedName = this.formatItemName(finalName);

    return {
      intent: 'ADD_ITEM',
      rawText: text,
      itemDetails: {
        name: formattedName,
        quantity: quantity || 1,
        unit: unit || defaults.unit || 'item',
        category,
        brand: defaults.brand,
        isOrganic: isOrganic || defaults.isOrganic || false,
        maxPrice: defaults.price,
      },
      feedbackMessage: `Added ${quantity || 1} ${unit ? unit + ' of ' : ''}${formattedName} to ${category}.`,
      success: true,
    };
  }

  /**
   * Extracts numerical quantities, word numbers, units, and tags from phrase
   */
  private extractQuantityAndUnit(text: string): {
    quantity: number;
    unit: string;
    cleanedName: string;
    isOrganic: boolean;
  } {
    let quantity = 1;
    let unit = '';
    let isOrganic = false;
    let tokens = text.split(/\s+/).filter(Boolean);

    // Check for organic keyword
    if (tokens.includes('organic') || tokens.includes('orgánico') || tokens.includes('bio')) {
      isOrganic = true;
      tokens = tokens.filter((t) => t !== 'organic' && t !== 'orgánico' && t !== 'bio');
    }

    // 1. Check numeric digits (e.g. "2", "5.5")
    const firstDigitIndex = tokens.findIndex((t) => /^\d+(\.\d+)?$/.test(t));
    if (firstDigitIndex !== -1) {
      quantity = parseFloat(tokens[firstDigitIndex]);
      tokens.splice(firstDigitIndex, 1);
    } else {
      // 2. Check number words (e.g. "two", "five", "dos", "दो")
      const wordNumIndex = tokens.findIndex((t) => NUMBER_WORDS[t] !== undefined);
      if (wordNumIndex !== -1) {
        quantity = NUMBER_WORDS[tokens[wordNumIndex]];
        tokens.splice(wordNumIndex, 1);
      }
    }

    // 3. Check for units (e.g. "bottles", "packs", "kg", "gallons", "pair")
    const unitIndex = tokens.findIndex((t) => COMMON_UNITS.includes(t.toLowerCase()));
    if (unitIndex !== -1) {
      unit = tokens[unitIndex];
      tokens.splice(unitIndex, 1);

      // Remove preposition "of" / "de" / "von" following unit
      if (tokens[0] === 'of' || tokens[0] === 'de' || tokens[0] === 'von' || tokens[0] === 'du') {
        tokens.shift();
      }
    }

    // Remove leading filler articles
    while (
      tokens.length > 0 &&
      ['a', 'an', 'the', 'some', 'el', 'la', 'los', 'las', 'un', 'una', 'le', 'la', 'les', 'des', 'der', 'die', 'das', 'ein', 'eine'].includes(
        tokens[0].toLowerCase()
      )
    ) {
      tokens.shift();
    }

    const cleanedName = tokens.join(' ').trim();

    return {
      quantity: quantity > 0 ? quantity : 1,
      unit,
      cleanedName,
      isOrganic,
    };
  }

  /**
   * Title-cases the item name
   */
  private formatItemName(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
}

export const nlpEngine = new NLPEngine();
