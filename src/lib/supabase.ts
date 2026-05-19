import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mndkqgdkbvvebyydzuar.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_lVULMmhEqJ7U1-p2wtz2CQ_xjbJnNI8';

// SSR-compatible Browser/Client-side Supabase client (using anon key)
export const supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
