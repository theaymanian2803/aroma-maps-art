import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const products = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    description: 'Bright, fruity notes with hints of blueberry and citrus. Light roast.',
    fullDescription: 'Our Ethiopian Yirgacheffe is sourced from the birthplace of coffee, where the bean originated thousands of years ago. This light roast brings out the naturally bright and fruity characteristics of the bean, with prominent notes of blueberry and citrus that dance on your palate. Perfect for pour-over or drip brewing methods.',
    price: '$18.00',
    priceNum: 18,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    tag: 'Best Seller',
    origin: 'Yirgacheffe, Ethiopia',
    roastLevel: 'Light',
    flavorNotes: ['Blueberry', 'Citrus', 'Floral'],
    brewMethods: ['Pour Over', 'Drip', 'Aeropress'],
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    description: 'Rich, smooth body with caramel sweetness and nutty undertones. Medium roast.',
    fullDescription: 'Colombian Supremo represents the finest grade of Colombian coffee beans. This medium roast showcases a rich, smooth body with beautiful caramel sweetness balanced by subtle nutty undertones. It\'s incredibly versatile and works wonderfully in any brewing method, making it a perfect everyday coffee.',
    price: '$16.00',
    priceNum: 16,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    tag: null,
    origin: 'Huila, Colombia',
    roastLevel: 'Medium',
    flavorNotes: ['Caramel', 'Nutty', 'Chocolate'],
    brewMethods: ['Espresso', 'French Press', 'Drip'],
  },
  {
    id: 3,
    name: 'Sumatra Mandheling',
    description: 'Full-bodied, earthy with notes of dark chocolate and herbs. Dark roast.',
    fullDescription: 'Sumatra Mandheling is a legendary coffee known for its unique processing method that creates an unmistakable flavor profile. This dark roast delivers a full-bodied, earthy experience with deep notes of dark chocolate and subtle herbal undertones. Perfect for those who love bold, intense coffee.',
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
    fullDescription: 'Our House Blend is the result of years of careful crafting and refinement. We\'ve combined beans from multiple origins to create a perfectly balanced cup that showcases the best of what coffee has to offer. Smooth, approachable, and endlessly drinkable - this is the coffee we\'re most proud of.',
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

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container-max text-center">
            <h1 className="heading-section mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
            <Link to="/#products" className="btn-primary">
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNum: product.priceNum,
      weight: product.weight,
      image: product.image,
    });
    toast({
      title: 'Added to cart!',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container-max px-6 md:px-12">
          {/* Back Link */}
          <Link
            to="/#products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 bg-terracotta text-cream text-sm font-medium px-4 py-2 rounded-sm">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span className="text-terracotta font-medium tracking-widest uppercase text-sm">
                  {product.origin}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mt-2 mb-4">
                  {product.name}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {product.fullDescription}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground w-24">Roast Level</span>
                  <span className="text-foreground">{product.roastLevel}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground w-24">Weight</span>
                  <span className="text-foreground">{product.weight}</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-sm font-medium text-muted-foreground w-24">Flavor Notes</span>
                  <div className="flex flex-wrap gap-2">
                    {product.flavorNotes.map((note) => (
                      <span
                        key={note}
                        className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-sm font-medium text-muted-foreground w-24">Best For</span>
                  <div className="flex flex-wrap gap-2">
                    {product.brewMethods.map((method) => (
                      <span
                        key={method}
                        className="border border-border text-foreground text-sm px-3 py-1 rounded-full"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="mt-auto pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl font-semibold text-foreground">
                    {product.price}
                  </span>
                  <span className="text-muted-foreground">{product.weight}</span>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="w-full btn-primary py-6 text-lg"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
