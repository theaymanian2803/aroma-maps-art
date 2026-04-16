// Generates a presigned PUT URL for Cloudflare R2 (S3-compatible) using AWS SigV4
// Reads R2 credentials from the r2_settings table (admin-managed), falls back to env vars.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function hmac(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
}

async function sha256Hex(data: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getSigningKey(secret: string, dateStamp: string, region: string, service: string) {
  const kDate = await hmac(new TextEncoder().encode('AWS4' + secret), dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  return hmac(kService, 'aws4_request');
}

async function presignPutUrl(opts: {
  accountId: string; accessKeyId: string; secretAccessKey: string;
  bucket: string; key: string; expiresIn: number;
}) {
  const { accountId, accessKeyId, secretAccessKey, bucket, key, expiresIn } = opts;
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const region = 'auto';
  const service = 's3';

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  const canonicalUri = `/${bucket}/${encodedKey}`;

  const params: Record<string, string> = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${accessKeyId}/${credentialScope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(expiresIn),
    'X-Amz-SignedHeaders': 'host',
  };

  const canonicalQuery = Object.keys(params).sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');

  const canonicalRequest = [
    'PUT', canonicalUri, canonicalQuery,
    `host:${host}\n`, 'host', 'UNSIGNED-PAYLOAD',
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256', amzDate, credentialScope, await sha256Hex(canonicalRequest),
  ].join('\n');

  const signingKey = await getSigningKey(secretAccessKey, dateStamp, region, service);
  const signature = toHex(await hmac(signingKey, stringToSign));

  return `https://${host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}

async function loadR2Config() {
  // Prefer DB settings; fall back to env vars
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  let cfg = {
    accountId: Deno.env.get('R2_ACCOUNT_ID') || '',
    accessKeyId: Deno.env.get('R2_ACCESS_KEY_ID') || '',
    secretAccessKey: Deno.env.get('R2_SECRET_ACCESS_KEY') || '',
    bucket: Deno.env.get('R2_BUCKET_NAME') || '',
    publicDomain: Deno.env.get('R2_PUBLIC_URL') || Deno.env.get('R2_PUBLIC_DOMAIN') || '',
  };

  if (url && serviceKey) {
    try {
      const supabase = createClient(url, serviceKey);
      const { data } = await supabase.from('r2_settings').select('*').eq('id', true).maybeSingle();
      if (data) {
        cfg = {
          accountId: data.account_id || cfg.accountId,
          accessKeyId: data.access_key_id || cfg.accessKeyId,
          secretAccessKey: data.secret_access_key || cfg.secretAccessKey,
          bucket: data.bucket_name || cfg.bucket,
          publicDomain: data.public_domain || cfg.publicDomain,
        };
      }
    } catch (e) {
      console.error('Failed to load r2_settings:', e);
    }
  }
  return cfg;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const cfg = await loadR2Config();
    if (!cfg.accountId || !cfg.accessKeyId || !cfg.secretAccessKey || !cfg.bucket || !cfg.publicDomain) {
      return new Response(
        JSON.stringify({ error: 'R2 not configured. Configure it in Admin → R2 Settings.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const fileName: string = body.fileName || 'upload.bin';

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `products/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;

    const uploadUrl = await presignPutUrl({
      accountId: cfg.accountId,
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
      bucket: cfg.bucket,
      key,
      expiresIn: 300,
    });

    const base = cfg.publicDomain.startsWith('http') ? cfg.publicDomain : `https://${cfg.publicDomain}`;
    const publicFileUrl = `${base.replace(/\/$/, '')}/${key}`;

    return new Response(
      JSON.stringify({ uploadUrl, publicUrl: publicFileUrl, key }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('r2-upload-url error:', msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
