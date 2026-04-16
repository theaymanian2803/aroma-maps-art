import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, EyeOff, Loader2 } from 'lucide-react';

const ADMIN_SECRET_KEY = 'admin_api_secret';
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/r2-settings`;

interface R2SettingsResponse {
  account_id: string;
  bucket_name: string;
  access_key_id: string;
  public_domain: string;
  secret_access_key_preview: string | null;
  has_secret: boolean;
}

const AdminR2Settings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [adminSecret, setAdminSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  const [accountId, setAccountId] = useState('');
  const [bucketName, setBucketName] = useState('');
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [publicDomain, setPublicDomain] = useState('');
  const [hasStoredSecret, setHasStoredSecret] = useState(false);
  const [secretPreview, setSecretPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    const stored = localStorage.getItem(ADMIN_SECRET_KEY) || '';
    setAdminSecret(stored);
    if (stored) {
      void loadSettings(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadSettings = async (secret: string) => {
    setLoading(true);
    try {
      const res = await fetch(FN_URL, {
        method: 'GET',
        headers: { 'x-admin-secret': secret },
      });
      if (res.status === 401) {
        toast({ title: 'Unauthorized', description: 'Admin API secret is incorrect.', variant: 'destructive' });
        return;
      }
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const data: R2SettingsResponse = await res.json();
      setAccountId(data.account_id || '');
      setBucketName(data.bucket_name || '');
      setAccessKeyId(data.access_key_id || '');
      setPublicDomain(data.public_domain || '');
      setHasStoredSecret(data.has_secret);
      setSecretPreview(data.secret_access_key_preview);
      localStorage.setItem(ADMIN_SECRET_KEY, secret);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Load failed';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!adminSecret) {
      toast({ title: 'Missing admin secret', description: 'Enter your admin API secret first.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, string> = {
        account_id: accountId,
        bucket_name: bucketName,
        access_key_id: accessKeyId,
        public_domain: publicDomain,
      };
      if (secretAccessKey) body.secret_access_key = secretAccessKey;

      const res = await fetch(FN_URL, {
        method: 'POST',
        headers: { 'x-admin-secret': adminSecret, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        toast({ title: 'Unauthorized', description: 'Admin API secret is incorrect.', variant: 'destructive' });
        return;
      }
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      toast({ title: 'Saved', description: 'R2 settings updated.' });
      setSecretAccessKey('');
      await loadSettings(adminSecret);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
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
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">R2 Storage Settings</h1>
              <p className="text-sm text-muted-foreground">Cloudflare R2 credentials for image uploads</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container-max px-6 py-8 max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Admin API Secret</label>
            <p className="text-xs text-muted-foreground mb-2">
              Required to read or write R2 settings. This is the value of the <code>ADMIN_API_SECRET</code> server secret.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showSecret ? 'text' : 'password'}
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Enter admin API secret"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button variant="outline" onClick={() => loadSettings(adminSecret)} disabled={!adminSecret || loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load'}
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">R2 Account ID</label>
              <Input value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="e.g. 1234abcd5678..." />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Bucket Name</label>
              <Input value={bucketName} onChange={(e) => setBucketName(e.target.value)} placeholder="my-bucket" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Access Key ID</label>
              <Input value={accessKeyId} onChange={(e) => setAccessKeyId(e.target.value)} placeholder="R2 access key ID" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Secret Access Key</label>
              {hasStoredSecret && (
                <p className="text-xs text-muted-foreground mb-2">
                  Currently stored: <code>{secretPreview}</code>. Leave blank to keep it.
                </p>
              )}
              <Input
                type="password"
                value={secretAccessKey}
                onChange={(e) => setSecretAccessKey(e.target.value)}
                placeholder={hasStoredSecret ? 'Leave blank to keep current' : 'R2 secret access key'}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Public Domain</label>
              <p className="text-xs text-muted-foreground mb-2">
                Your R2 public bucket URL or custom domain (e.g. <code>https://cdn.yoursite.com</code> or <code>https://pub-xxx.r2.dev</code>).
              </p>
              <Input value={publicDomain} onChange={(e) => setPublicDomain(e.target.value)} placeholder="https://cdn.example.com" />
            </div>

            <Button onClick={handleSave} disabled={saving} className="bg-terracotta hover:bg-terracotta/90 w-full">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Settings
            </Button>
          </div>
        </div>

        <div className="mt-6 text-sm text-muted-foreground bg-muted/50 border border-border rounded-lg p-4">
          <strong className="text-foreground">⚠️ Security note:</strong> R2 credentials are stored server-side and only readable by the upload edge function. Make sure your R2 bucket has CORS configured to allow PUT requests from this site.
        </div>
      </main>
    </div>
  );
};

export default AdminR2Settings;
