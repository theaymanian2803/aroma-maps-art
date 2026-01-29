import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Product, getProducts } from '@/data/products';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleAddToCart = (product: Product) => {
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
