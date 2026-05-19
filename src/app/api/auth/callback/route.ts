import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    console.log("[AUTH CALLBACK] Exchanging code for session...");

    if (code) {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        console.log("[AUTH CALLBACK] Exchange successful, redirecting to:", next);
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        console.error("[AUTH CALLBACK] Supabase code exchange error:", error);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
      }
    }

    return NextResponse.redirect(`${origin}/login?error=Missing authentication code`);
  } catch (error: any) {
    console.error("[AUTH CALLBACK] Catch handler error:", error);
    return NextResponse.redirect(`${request.url.split('/api')[0]}/login?error=internal_callback_error`);
  }
}
