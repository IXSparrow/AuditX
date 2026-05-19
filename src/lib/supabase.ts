import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mndkqgdkbvvebyydzuar.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_lVULMmhEqJ7U1-p2wtz2CQ_xjbJnNI8';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// SSR-compatible Browser/Client-side Supabase client (using anon key)
export const supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server-side Administrative Supabase client (using service key to bypass RLS in secure backend contexts like crawler or AI analysis)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
