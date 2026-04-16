import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, RotateCcw } from 'lucide-react';
import { getCategories, saveCategories, resetCategories } from '@/data/categories';

const AdminCategories = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    setCategories(getCategories());
  }, [isAuthenticated, navigate]);

  const handleAdd = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      toast({ title: 'Already exists', description: 'That category already exists.', variant: 'destructive' });
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    saveCategories(updated);
    setNewCategory('');
  };

  const handleDelete = (cat: string) => {
    const updated = categories.filter((c) => c !== cat);
    setCategories(updated);
    saveCategories(updated);
  };

  const handleReset = () => {
    setCategories(resetCategories());
    toast({ title: 'Categories reset' });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container-max px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">Categories</h1>
              <p className="text-sm text-muted-foreground">Manage product categories</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </header>

      <main className="container-max px-6 py-8 max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="New category name"
            />
            <Button onClick={handleAdd} className="bg-terracotta hover:bg-terracotta/90">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No categories yet.</p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between p-3 bg-background border border-border rounded-md"
                >
                  <span className="font-medium">{cat}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(cat)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCategories;
