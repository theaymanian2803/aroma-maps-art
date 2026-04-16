// Admin-only function to read/write R2 settings stored in the DB.
// Auth: client must send the admin secret as `X-Admin-Secret` header.
// The shared secret lives in Lovable Cloud env var ADMIN_API_SECRET.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface R2Settings {
  account_id: string | null;
  bucket_name: string | null;
  access_key_id: string | null;
  secret_access_key: string | null;
  public_domain: string | null;
}

function maskSecret(value: string | null): string | null {
  if (!value) return null;
  if (value.length <= 8) return '****';
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const adminSecret = Deno.env.get('ADMIN_API_SECRET');
  const provided = req.headers.get('x-admin-secret');
  if (!adminSecret || !provided || provided !== adminSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const url = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(url, serviceKey);

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('r2_settings')
        .select('account_id, bucket_name, access_key_id, secret_access_key, public_domain')
        .eq('id', true)
        .maybeSingle();
      if (error) throw error;
      const safe = {
        account_id: data?.account_id ?? '',
        bucket_name: data?.bucket_name ?? '',
        access_key_id: data?.access_key_id ?? '',
        public_domain: data?.public_domain ?? '',
        secret_access_key_preview: maskSecret(data?.secret_access_key ?? null),
        has_secret: !!data?.secret_access_key,
      };
      return new Response(JSON.stringify(safe), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const update: Partial<R2Settings> = {
        account_id: typeof body.account_id === 'string' ? body.account_id.trim() : null,
        bucket_name: typeof body.bucket_name === 'string' ? body.bucket_name.trim() : null,
        access_key_id: typeof body.access_key_id === 'string' ? body.access_key_id.trim() : null,
        public_domain: typeof body.public_domain === 'string' ? body.public_domain.trim() : null,
      };
      // Only overwrite secret if a non-empty value was sent
      if (typeof body.secret_access_key === 'string' && body.secret_access_key.length > 0) {
        update.secret_access_key = body.secret_access_key;
      }

      const { error } = await supabase
        .from('r2_settings')
        .update({ ...update, updated_at: new Date().toISOString() })
        .eq('id', true);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('r2-settings error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
