// Admin-only function to list/update/delete orders.
// Auth: client must send the admin secret as `X-Admin-Secret` header.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
  'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
};

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
    const u = new URL(req.url);
    const id = u.searchParams.get('id');

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ orders: data ?? [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'PATCH') {
      if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const body = await req.json();
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

      const allowedStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
      if (body.status !== undefined) {
        if (!allowedStatuses.includes(body.status)) {
          return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        updates.status = body.status;
      }

      if (body.address !== undefined) {
        if (typeof body.address !== 'string') {
          return new Response(JSON.stringify({ error: 'Invalid address' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        updates.address = body.address.trim();
      }

      if (body.note !== undefined) {
        if (body.note !== null && typeof body.note !== 'string') {
          return new Response(JSON.stringify({ error: 'Invalid note' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        updates.note = body.note === null ? null : body.note.trim();
      }

      if (Object.keys(updates).length === 1) {
        return new Response(JSON.stringify({ error: 'No valid fields to update' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const { error } = await supabase.from('orders').update(updates).eq('id', id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (req.method === 'DELETE') {
      if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('orders-admin error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
