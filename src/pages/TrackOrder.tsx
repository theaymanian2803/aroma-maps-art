import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Loader2, Package, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrderItem {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  weight: string;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  address: string;
  note: string | null;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-track`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const STATUS_META: Record<Order['status'], { label: string; icon: React.ElementType; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', icon: Clock, variant: 'secondary' },
  confirmed: { label: 'Confirmed', icon: Package, variant: 'default' },
  delivered: { label: 'Delivered', icon: CheckCircle2, variant: 'default' },
  cancelled: { label: 'Cancelled', icon: XCircle, variant: 'destructive' },
};

const STATUS_ORDER: Order['status'][] = ['pending', 'confirmed', 'delivered'];

const TrackOrder = () => {
  const [params] = useSearchParams();
  const [orderId, setOrderId] = useState(params.get('id') ?? '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch(FN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` },
        body: JSON.stringify({ id: orderId.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Unable to find that order');
        return;
      }
      setOrder(data.order as Order);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container-max px-6 md:px-12 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Shop</span>
          </Link>
        </div>
      </header>

      <main className="container-max px-6 md:px-12 py-12 max-w-3xl">
        <h1 className="heading-section mb-2">Track Your Order</h1>
        <p className="text-muted-foreground mb-8">
          Enter the order ID we sent you along with the phone number used at checkout.
        </p>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4 mb-10">
          <div>
            <label htmlFor="orderId" className="block text-sm font-medium mb-2">Order ID</label>
            <input
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              placeholder="e.g. 1a2b3c4d-5e6f-7890-abcd-ef1234567890"
              className="w-full px-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="The phone used to place the order"
              className="w-full px-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {order && (
          <div className="bg-card border border-border rounded-lg p-6 animate-fade-up">
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order</p>
                <p className="font-mono text-sm break-all">{order.id}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Placed {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <Badge variant={STATUS_META[order.status].variant} className="text-sm py-1 px-3">
                {STATUS_META[order.status].label}
              </Badge>
            </div>

            {/* Timeline */}
            {order.status !== 'cancelled' ? (
              <div className="flex items-center justify-between mb-8">
                {STATUS_ORDER.map((s, i) => {
                  const reached = STATUS_ORDER.indexOf(order.status) >= i;
                  const Icon = STATUS_META[s].icon;
                  return (
                    <div key={s} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${reached ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs ${reached ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {STATUS_META[s].label}
                        </span>
                      </div>
                      {i < STATUS_ORDER.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${STATUS_ORDER.indexOf(order.status) > i ? 'bg-primary' : 'bg-border'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mb-8 p-4 bg-destructive/10 text-destructive rounded-sm text-sm">
                This order has been cancelled.
              </div>
            )}

            <div className="space-y-1 text-sm mb-6">
              <p><span className="text-muted-foreground">Name:</span> {order.customer_name}</p>
              <p><span className="text-muted-foreground">Address:</span> {order.address}</p>
              {order.note && <p><span className="text-muted-foreground">Note:</span> {order.note}</p>}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="font-medium">Items</h3>
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-md" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.weight} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">${(item.priceNum * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-lg font-semibold pt-4 mt-4 border-t border-border">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackOrder;
