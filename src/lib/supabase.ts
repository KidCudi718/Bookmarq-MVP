// /src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

const anonUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!anonUrl || !anonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

if (!serviceUrl || !serviceKey) {
  console.warn('⚠️ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — service client will not be created');
}

export const supabase = createClient(anonUrl, anonKey, {
  auth: { persistSession: false },
});

export const supabaseService = serviceUrl && serviceKey
  ? createClient(serviceUrl, serviceKey, {
      auth: { persistSession: false },
    })
  : null;