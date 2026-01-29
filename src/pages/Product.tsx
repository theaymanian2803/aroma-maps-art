import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Product as ProductType, getProducts } from '@/data/products';

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const products = getProducts();
    const found = products.find((p) => p.id === Number(id));
    setProduct(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container-max text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                {product.flavorNotes && product.flavorNotes.length > 0 && (
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
                )}
                {product.brewMethods && product.brewMethods.length > 0 && (
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
                )}
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
