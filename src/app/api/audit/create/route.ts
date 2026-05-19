import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized user access.' }, { status: 401 });
    // }
    const userId = session?.user?.id || '00000000-0000-0000-0000-000000000000';

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Website URL is required.' }, { status: 400 });
    }

    // Basic URL clean and parsing
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL structure.' }, { status: 400 });
    }

    const domain = parsedUrl.hostname.toLowerCase();
    
    // Block localhost and internal IPs
    if (
      domain === 'localhost' || 
      domain === '127.0.0.1' || 
      domain.startsWith('192.168.') || 
      domain.startsWith('10.') || 
      domain.endsWith('.local')
    ) {
      return NextResponse.json({ error: 'Restricted URL target.' }, { status: 400 });
    }

    // 1. Create a pending audit row in database using admin client (to secure bypass or use direct user insertion)
    const { data: audit, error: insertError } = await supabaseAdmin
      .from('audits')
      .insert({
        user_id: userId,
        url: targetUrl,
        domain: domain,
        status: 'pending',
        overall_score: null,
        design_score: null,
        seo_score: null,
        speed_score: null,
        mobile_score: null,
        trust_score: null,
        conversion_score: null,
      })
      .select()
      .single();

    if (insertError || !audit) {
      console.error("Database insert error:", insertError);
      return NextResponse.json({ error: 'Failed to initialize audit database entry.' }, { status: 500 });
    }

    // 2. Trigger the pipeline asynchronously via absolute internal URL execution
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;
    
    // Trigger in a non-blocking background fetch
    fetch(`${appUrl}/api/audit/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auditId: audit.id }),
    }).catch(err => {
      console.error("Async run trigger error:", err);
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Audit initialized successfully.', 
      auditId: audit.id 
    });

  } catch (error: any) {
    console.error('Audit create route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
