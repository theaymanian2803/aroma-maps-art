import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, RefreshCw, Trash2, Loader2, Eye, Pencil } from 'lucide-react';

const ADMIN_SECRET_KEY = 'admin_api_secret';
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/orders-admin`;

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
  phone: string;
  address: string;
  note: string | null;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

const STATUS_VARIANT: Record<Order['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  confirmed: 'default',
  delivered: 'outline',
  cancelled: 'destructive',
};

const AdminOrders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [adminSecret, setAdminSecret] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState<Order | null>(null);
  const [editing, setEditing] = useState(false);
  const [editAddress, setEditAddress] = useState('');
  const [editNote, setEditNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    const stored = localStorage.getItem(ADMIN_SECRET_KEY) || '';
    setAdminSecret(stored);
    if (stored) void load(stored);
  }, [isAuthenticated, navigate]);

  const load = async (secret: string) => {
    setLoading(true);
    try {
      const res = await fetch(FN_URL, { headers: { 'x-admin-secret': secret } });
      if (res.status === 401) {
        toast({ title: 'Unauthorized', description: 'Admin API secret is incorrect.', variant: 'destructive' });
        return;
      }
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const data = await res.json();
      setOrders(data.orders || []);
      localStorage.setItem(ADMIN_SECRET_KEY, secret);
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Load failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Order['status']) => {
    try {
      const res = await fetch(`${FN_URL}?id=${id}`, {
        method: 'PATCH',
        headers: { 'x-admin-secret': adminSecret, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast({ title: 'Updated', description: `Order marked as ${status}.` });
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Update failed', variant: 'destructive' });
    }
  };

  const removeOrder = async (id: string) => {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    try {
      const res = await fetch(`${FN_URL}?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminSecret },
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast({ title: 'Deleted', description: 'Order removed.' });
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Delete failed', variant: 'destructive' });
    }
  };

  const openEdit = (o: Order) => {
    setViewing(o);
    setEditing(true);
    setEditAddress(o.address);
    setEditNote(o.note ?? '');
  };

  const saveOrderDetails = async () => {
    if (!viewing) return;
    setSaving(true);
    try {
      const payload: { address?: string; note?: string | null } = {};
      if (editAddress.trim() !== viewing.address) payload.address = editAddress.trim();
      const nextNote = editNote.trim() || null;
      if (nextNote !== viewing.note) payload.note = nextNote;

      if (Object.keys(payload).length === 0) {
        setEditing(false);
        return;
      }

      const res = await fetch(`${FN_URL}?id=${viewing.id}`, {
        method: 'PATCH',
        headers: { 'x-admin-secret': adminSecret, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === viewing.id ? { ...o, ...payload, updated_at: new Date().toISOString() } : o
        )
      );
      setViewing((prev) => (prev ? { ...prev, ...payload, updated_at: new Date().toISOString() } : null));
      setEditing(false);
      toast({ title: 'Saved', description: 'Order details updated.' });
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Save failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container-max px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">Orders</h1>
              <p className="text-sm text-muted-foreground">Manage customer orders</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => load(adminSecret)} disabled={!adminSecret || loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </header>

      <main className="container-max px-6 py-8">
        <div className="bg-card border border-border rounded-lg p-4 mb-6 flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Admin API Secret</label>
            <Input
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="Enter admin API secret"
            />
          </div>
          <Button onClick={() => load(adminSecret)} disabled={!adminSecret || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load'}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    {loading ? 'Loading…' : 'No orders yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="text-sm">{new Date(o.created_at).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{o.customer_name}</TableCell>
                    <TableCell>{o.phone}</TableCell>
                    <TableCell>{(o.items || []).reduce((s, i) => s + (i.quantity || 0), 0)}</TableCell>
                    <TableCell>${Number(o.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[o.status]}>{o.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setViewing(o)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as Order['status'])}>
                          <SelectTrigger className="w-[130px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" onClick={() => removeOrder(o.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={!!viewing} onOpenChange={(o) => { if (!o) { setViewing(null); setEditing(false); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Order Details</DialogTitle>
              {!editing && (
                <Button variant="ghost" size="sm" onClick={() => viewing && openEdit(viewing)}>
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}
            </div>
          </DialogHeader>
          {viewing && editing && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Customer</p>
                <p className="font-medium">{viewing.customer_name}</p>
                <p>{viewing.phone}</p>
              </div>
              <div>
                <label className="text-muted-foreground block mb-1">Address</label>
                <Input
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Delivery address"
                />
              </div>
              <div>
                <label className="text-muted-foreground block mb-1">Note</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Customer note"
                />
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {(viewing.items || []).map((i, idx) => (
                    <div key={idx} className="flex justify-between border-b border-border pb-2">
                      <span>{i.name} {i.weight && `(${i.weight})`} × {i.quantity}</span>
                      <span>${(i.priceNum * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span>${Number(viewing.total).toFixed(2)}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={saveOrderDetails} disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {viewing && !editing && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Customer</p>
                <p className="font-medium">{viewing.customer_name}</p>
                <p>{viewing.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="whitespace-pre-wrap">{viewing.address}</p>
              </div>
              {viewing.note && (
                <div>
                  <p className="text-muted-foreground">Note</p>
                  <p className="whitespace-pre-wrap">{viewing.note}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {(viewing.items || []).map((i, idx) => (
                    <div key={idx} className="flex justify-between border-b border-border pb-2">
                      <span>{i.name} {i.weight && `(${i.weight})`} × {i.quantity}</span>
                      <span>${(i.priceNum * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span>${Number(viewing.total).toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
