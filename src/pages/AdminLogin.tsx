import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/admin/products');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(email, password)) {
      toast({
        title: 'Login successful',
        description: 'Welcome to the admin panel.',
      });
      navigate('/admin/products');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-terracotta" />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">Admin Login</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta/90">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
