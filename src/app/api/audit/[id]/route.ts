import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized user access.' }, { status: 401 });
    // }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Audit ID is required.' }, { status: 400 });
    }

    // Fetch the audit row from the database and verify it belongs to the user
    const { data: audit, error: fetchError } = await supabaseAdmin
      .from('audits')
      .select('*')
      .eq('id', id)
      // .eq('user_id', session.user.id)
      .single();

    if (fetchError || !audit) {
      console.error("Audit fetch error or access denied:", fetchError);
      return NextResponse.json({ error: 'Audit report not found or access denied.' }, { status: 404 });
    }

    // Fetch associated audit issues
    const { data: issues } = await supabaseAdmin
      .from('audit_issues')
      .select('*')
      .eq('audit_id', id);

    // Fetch associated redesign previews if they exist
    const { data: redesigns } = await supabaseAdmin
      .from('redesign_previews')
      .select('*')
      .eq('audit_id', id);

    // Fetch associated competitors if they exist
    const { data: competitors } = await supabaseAdmin
      .from('competitors')
      .select('*')
      .eq('audit_id', id);

    return NextResponse.json({
      success: true,
      audit,
      issues: issues || [],
      redesigns: redesigns || [],
      competitors: competitors || []
    });

  } catch (error: any) {
    console.error('Audit GET route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
