import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

const products = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    description: 'Bright, fruity notes with hints of blueberry and citrus. Light roast.',
    price: '$18.00',
    priceNum: 18,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    tag: 'Best Seller',
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    description: 'Rich, smooth body with caramel sweetness and nutty undertones. Medium roast.',
    price: '$16.00',
    priceNum: 16,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    tag: null,
  },
  {
    id: 3,
    name: 'Sumatra Mandheling',
    description: 'Full-bodied, earthy with notes of dark chocolate and herbs. Dark roast.',
    price: '$19.00',
    priceNum: 19,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80',
    tag: 'New',
  },
  {
    id: 4,
    name: 'House Blend',
    description: 'Our signature blend - balanced, versatile, perfect for any brewing method.',
    price: '$14.00',
    priceNum: 14,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80',
    tag: null,
  },
  {
    id: 5,
    name: 'Guatemalan Antigua',
    description: 'Velvety body with cocoa and spice notes, subtle smoky finish. Medium-dark roast.',
    price: '$17.00',
    priceNum: 17,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&q=80',
    tag: null,
  },
  {
    id: 6,
    name: 'Kenya AA',
    description: 'Wine-like acidity with blackcurrant and tomato notes. Medium roast.',
    price: '$20.00',
    priceNum: 20,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    tag: 'Premium',
  },
  {
    id: 7,
    name: 'Brazilian Santos',
    description: 'Mild, nutty sweetness with low acidity. Perfect for espresso. Medium roast.',
    price: '$15.00',
    priceNum: 15,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    tag: null,
  },
  {
    id: 8,
    name: 'Costa Rican Tarrazú',
    description: 'Bright, clean cup with honey sweetness and citrus zest. Light-medium roast.',
    price: '$18.00',
    priceNum: 18,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    tag: 'Staff Pick',
  },
];

const Products = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: typeof products[0]) => {
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
    <section id="products" className="section-padding bg-background">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-terracotta font-medium tracking-widest uppercase text-sm mb-4">
            Our Selection
          </span>
          <h2 className="heading-section text-foreground mb-4">
            Freshly Roasted Coffee
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Each batch is carefully roasted to bring out the unique characteristics 
            of every origin. Discover your perfect cup.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="card-product group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.tag && (
                  <span className="absolute top-4 left-4 bg-terracotta text-cream text-xs font-medium px-3 py-1 rounded-sm">
                    {product.tag}
                  </span>
                )}
              </Link>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-terracotta transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <span className="text-sm text-muted-foreground">{product.weight}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{product.price}</span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="text-sm font-medium text-terracotta hover:text-terracotta/80 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a href="#products" className="btn-secondary">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default Products;
