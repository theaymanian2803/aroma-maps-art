import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Product, getProducts, saveProducts, resetProducts } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, LogOut, RotateCcw } from 'lucide-react';

const AdminProducts = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    setProducts(getProducts());
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsNewProduct(false);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setEditingProduct({
      id: newId,
      name: '',
      description: '',
      fullDescription: '',
      price: '$0.00',
      priceNum: 0,
      weight: '250g',
      image: '',
      tag: null,
      origin: '',
      roastLevel: 'Medium',
      flavorNotes: [],
      brewMethods: [],
    });
    setIsNewProduct(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
    toast({
      title: 'Product deleted',
      description: 'The product has been removed.',
    });
  };

  const handleSave = () => {
    if (!editingProduct) return;

    let updated: Product[];
    if (isNewProduct) {
      updated = [...products, editingProduct];
    } else {
      updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    }
    
    setProducts(updated);
    saveProducts(updated);
    setIsDialogOpen(false);
    setEditingProduct(null);
    
    toast({
      title: isNewProduct ? 'Product added' : 'Product updated',
      description: `${editingProduct.name} has been ${isNewProduct ? 'added' : 'updated'}.`,
    });
  };

  const handleReset = () => {
    const defaultProds = resetProducts();
    setProducts(defaultProds);
    toast({
      title: 'Products reset',
      description: 'All products have been reset to defaults.',
    });
  };

  const updateField = (field: keyof Product, value: any) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container-max px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-semibold text-foreground">Product Management</h1>
            <p className="text-sm text-muted-foreground">Manage your coffee products</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-max px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">All Products ({products.length})</h2>
          <Button onClick={handleAddNew} className="bg-terracotta hover:bg-terracotta/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Roast</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">{product.id}</TableCell>
                  <TableCell>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{product.origin || '-'}</TableCell>
                  <TableCell className="text-sm">{product.roastLevel || '-'}</TableCell>
                  <TableCell>
                    {product.tag && (
                      <span className="px-2 py-1 bg-terracotta/10 text-terracotta text-xs rounded">
                        {product.tag}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNewProduct ? 'Add New Product' : 'Edit Product'}</DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tag (optional)</label>
                  <Input
                    value={editingProduct.tag || ''}
                    onChange={(e) => updateField('tag', e.target.value || null)}
                    placeholder="e.g., Best Seller, New"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Display</label>
                  <Input
                    value={editingProduct.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="$18.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Price (Number)</label>
                  <Input
                    type="number"
                    value={editingProduct.priceNum}
                    onChange={(e) => updateField('priceNum', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Weight</label>
                  <Input
                    value={editingProduct.weight}
                    onChange={(e) => updateField('weight', e.target.value)}
                    placeholder="250g"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Image URL</label>
                <Input
                  value={editingProduct.image}
                  onChange={(e) => updateField('image', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Short Description</label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Full Description</label>
                <Textarea
                  value={editingProduct.fullDescription || ''}
                  onChange={(e) => updateField('fullDescription', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Origin</label>
                  <Input
                    value={editingProduct.origin || ''}
                    onChange={(e) => updateField('origin', e.target.value)}
                    placeholder="Yirgacheffe, Ethiopia"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Roast Level</label>
                  <Input
                    value={editingProduct.roastLevel || ''}
                    onChange={(e) => updateField('roastLevel', e.target.value)}
                    placeholder="Light, Medium, Dark"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Flavor Notes (comma-separated)</label>
                <Input
                  value={editingProduct.flavorNotes?.join(', ') || ''}
                  onChange={(e) => updateField('flavorNotes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Blueberry, Citrus, Jasmine"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Brew Methods (comma-separated)</label>
                <Input
                  value={editingProduct.brewMethods?.join(', ') || ''}
                  onChange={(e) => updateField('brewMethods', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Pour Over, Chemex, Aeropress"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-terracotta hover:bg-terracotta/90">
              {isNewProduct ? 'Add Product' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
