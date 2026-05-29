// Public, guest order tracking. No auth required.
// Lookup requires BOTH the order id (UUID) and the phone number used at checkout.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizePhone(p: string): string {
  return p.replace(/\D+/g, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    let id = '';
    let phone = '';
    if (req.method === 'GET') {
      const u = new URL(req.url);
      id = (u.searchParams.get('id') ?? '').trim();
      phone = (u.searchParams.get('phone') ?? '').trim();
    } else if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      id = typeof body.id === 'string' ? body.id.trim() : '';
      phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    } else {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    if (!UUID_RE.test(id) || phone.length < 4) {
      return new Response(JSON.stringify({ error: 'Invalid order id or phone' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(url, serviceKey);

    const { data, error } = await supabase
      .from('orders')
      .select('id, customer_name, phone, address, note, items, total, status, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (!data || normalizePhone(data.phone) !== normalizePhone(phone)) {
      // Don't leak existence.
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ order: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('order-track error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
