export interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription?: string;
  price: string;
  priceNum: number;
  weight: string;
  image: string;
  tag: string | null;
  origin?: string;
  roastLevel?: string;
  flavorNotes?: string[];
  brewMethods?: string[];
}

const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    description: 'Bright, fruity notes with hints of blueberry and citrus. Light roast.',
    fullDescription: 'Sourced from the birthplace of coffee, our Ethiopian Yirgacheffe is a testament to centuries of coffee cultivation tradition. Grown at elevations above 1,800 meters, these beans develop slowly, resulting in complex flavors that dance on your palate. Expect bright, wine-like acidity with pronounced notes of fresh blueberry, jasmine, and a clean citrus finish.',
    price: '$18.00',
    priceNum: 18,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    tag: 'Best Seller',
    origin: 'Yirgacheffe, Ethiopia',
    roastLevel: 'Light',
    flavorNotes: ['Blueberry', 'Citrus', 'Jasmine'],
    brewMethods: ['Pour Over', 'Chemex', 'Aeropress'],
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    description: 'Rich, smooth body with caramel sweetness and nutty undertones. Medium roast.',
    fullDescription: 'From the misty highlands of Colombia comes this exceptional Supremo grade coffee. The rich volcanic soil and perfect climate create beans with remarkable balance and depth. This medium roast reveals layers of caramel sweetness, complemented by subtle nutty undertones and a silky smooth body that makes every sip a pleasure.',
    price: '$16.00',
    priceNum: 16,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    tag: null,
    origin: 'Huila, Colombia',
    roastLevel: 'Medium',
    flavorNotes: ['Caramel', 'Nutty', 'Chocolate'],
    brewMethods: ['Drip', 'French Press', 'Espresso'],
  },
  {
    id: 3,
    name: 'Sumatra Mandheling',
    description: 'Full-bodied, earthy with notes of dark chocolate and herbs. Dark roast.',
    fullDescription: 'The unique wet-hulling process used in Sumatra creates a coffee like no other. Our Mandheling is full-bodied and earthy, with an almost syrupy texture that coats the palate. Dark roasted to perfection, it reveals deep notes of dark chocolate, forest herbs, and a subtle spiciness that lingers long after the last sip.',
    price: '$19.00',
    priceNum: 19,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80',
    tag: 'New',
    origin: 'Sumatra, Indonesia',
    roastLevel: 'Dark',
    flavorNotes: ['Dark Chocolate', 'Earthy', 'Herbal'],
    brewMethods: ['French Press', 'Cold Brew', 'Espresso'],
  },
  {
    id: 4,
    name: 'House Blend',
    description: 'Our signature blend - balanced, versatile, perfect for any brewing method.',
    fullDescription: 'Our master roasters have crafted this signature blend to be the perfect everyday coffee. Combining beans from three continents, we\'ve achieved a harmonious balance of body, acidity, and sweetness. Whether you prefer it black or with milk, brewed in a drip machine or an espresso maker, this blend delivers consistent excellence every time.',
    price: '$14.00',
    priceNum: 14,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80',
    tag: null,
    origin: 'Multi-Origin Blend',
    roastLevel: 'Medium',
    flavorNotes: ['Balanced', 'Smooth', 'Sweet'],
    brewMethods: ['Any Method'],
  },
  {
    id: 5,
    name: 'Guatemalan Antigua',
    description: 'Velvety body with cocoa and spice notes, subtle smoky finish. Medium-dark roast.',
    fullDescription: 'Grown in the shadow of three volcanoes, Guatemalan Antigua benefits from rich volcanic soil and ideal growing conditions. This medium-dark roast reveals a velvety body with layers of cocoa and warm spice, finishing with a subtle smokiness that lingers pleasantly. A sophisticated choice for discerning palates.',
    price: '$17.00',
    priceNum: 17,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&q=80',
    tag: null,
    origin: 'Antigua, Guatemala',
    roastLevel: 'Medium-Dark',
    flavorNotes: ['Cocoa', 'Spice', 'Smoky'],
    brewMethods: ['Espresso', 'Moka Pot', 'French Press'],
  },
  {
    id: 6,
    name: 'Kenya AA',
    description: 'Wine-like acidity with blackcurrant and tomato notes. Medium roast.',
    fullDescription: 'Kenya AA represents the highest grade of Kenyan coffee, known worldwide for its bold, complex flavor profile. This medium roast showcases a wine-like acidity that\'s both bright and juicy, with distinctive notes of blackcurrant and a subtle tomato-like quality that makes it truly unique. A coffee for adventurous taste buds.',
    price: '$20.00',
    priceNum: 20,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    tag: 'Premium',
    origin: 'Nyeri, Kenya',
    roastLevel: 'Medium',
    flavorNotes: ['Blackcurrant', 'Wine-like', 'Citrus'],
    brewMethods: ['Pour Over', 'Chemex', 'Aeropress'],
  },
  {
    id: 7,
    name: 'Brazilian Santos',
    description: 'Mild, nutty sweetness with low acidity. Perfect for espresso. Medium roast.',
    fullDescription: 'Brazilian Santos is the workhorse of the coffee world, beloved for its reliability and approachable flavor. This medium roast offers a mild, nutty sweetness with remarkably low acidity, making it gentle on the stomach and perfect as the base for espresso blends. A crowd-pleaser that never disappoints.',
    price: '$15.00',
    priceNum: 15,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    tag: null,
    origin: 'Santos, Brazil',
    roastLevel: 'Medium',
    flavorNotes: ['Nutty', 'Mild', 'Chocolate'],
    brewMethods: ['Espresso', 'Drip', 'Cold Brew'],
  },
  {
    id: 8,
    name: 'Costa Rican Tarrazú',
    description: 'Bright, clean cup with honey sweetness and citrus zest. Light-medium roast.',
    fullDescription: 'From the highlands of Tarrazú comes one of Costa Rica\'s most celebrated coffees. This light-medium roast delivers a remarkably clean cup with bright acidity, honey-like sweetness, and refreshing citrus zest. Grown at high altitude under strict quality standards, it represents the pinnacle of Central American coffee.',
    price: '$18.00',
    priceNum: 18,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    tag: 'Staff Pick',
    origin: 'Tarrazú, Costa Rica',
    roastLevel: 'Light-Medium',
    flavorNotes: ['Honey', 'Citrus', 'Clean'],
    brewMethods: ['Pour Over', 'Drip', 'Chemex'],
  },
];

const PRODUCTS_STORAGE_KEY = 'admin_products_override';

export const getProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading products from localStorage:', e);
  }
  return defaultProducts;
};

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage:', e);
  }
};

export const resetProducts = (): Product[] => {
  localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  return defaultProducts;
};

export { defaultProducts };
