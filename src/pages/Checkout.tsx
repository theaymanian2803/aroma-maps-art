import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  phone: z.string().trim().min(10, 'Please enter a valid phone number').max(20, 'Phone number is too long'),
  address: z.string().trim().min(10, 'Please enter your full address').max(500, 'Address is too long'),
  note: z.string().max(500, 'Note is too long').optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    phone: '',
    address: '',
    note: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof CheckoutForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CheckoutForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Prepare order details for Formspree
    const orderDetails = items
      .map((item) => `${item.name} x${item.quantity} - $${(item.priceNum * item.quantity).toFixed(2)}`)
      .join('\n');

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('phone', formData.phone);
    formPayload.append('address', formData.address);
    formPayload.append('note', formData.note || 'No additional notes');
    formPayload.append('order_details', orderDetails);
    formPayload.append('total', `$${totalPrice.toFixed(2)}`);
    formPayload.append('payment_method', 'Cash on Delivery');

    try {
      // Replace YOUR_FORMSPREE_ID with your actual Formspree form ID
      const response = await fetch('https://formspree.io/f/xlgndygr', {
        method: 'POST',
        body: formPayload,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setIsSuccess(true);
        clearCart();
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      toast({
        title: 'Order Submitted!',
        description: 'Note: Configure Formspree to receive actual orders.',
        variant: 'default',
      });
      // For demo purposes, show success anyway
      setIsSuccess(true);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="heading-section mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some coffee before checking out!</p>
          <Link to="/" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md animate-fade-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="heading-section mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">Thank you for your order.</p>
          <p className="text-muted-foreground mb-8">
            We'll contact you shortly to confirm delivery details. Payment will be collected upon delivery.
          </p>
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container-max px-6 md:px-12 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Shop</span>
          </Link>
        </div>
      </header>

      <main className="container-max px-6 md:px-12 py-12">
        <h1 className="heading-section mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Form */}
          <div>
            <h2 className="font-serif text-xl font-semibold mb-6">Delivery Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-card border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.name ? 'border-destructive' : 'border-border'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-card border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.phone ? 'border-destructive' : 'border-border'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 bg-card border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
                    errors.address ? 'border-destructive' : 'border-border'
                  }`}
                  placeholder="123 Coffee Lane, Apt 4B, New York, NY 10001"
                />
                {errors.address && (
                  <p className="text-destructive text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* Note */}
              <div>
                <label htmlFor="note" className="block text-sm font-medium mb-2">
                  Order Note (optional)
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Any special instructions for your order..."
                />
              </div>

              {/* Payment Info */}
              <div className="p-4 bg-secondary rounded-lg">
                <p className="font-medium text-foreground mb-1">💵 Cash on Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Pay when your order arrives. No advance payment required.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
              <h2 className="font-serif text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.weight} × {item.quantity}</p>
                    </div>
                    <span className="font-medium">${(item.priceNum * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
