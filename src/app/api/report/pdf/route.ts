import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized user access.' }, { status: 401 });
    }

    const { auditId } = await req.json();

    if (!auditId) {
      return NextResponse.json({ error: 'Audit ID is required.' }, { status: 400 });
    }

    // Fetch the audit row from the database
    const { data: audit, error: fetchError } = await supabaseAdmin
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .eq('user_id', session.user.id)
      .single();

    if (fetchError || !audit) {
      return NextResponse.json({ error: 'Audit report not found or access denied.' }, { status: 404 });
    }

    const report = audit.report_json;
    if (!report) {
      return NextResponse.json({ error: 'Audit report contents are not compiled yet.' }, { status: 400 });
    }

    // Fetch associated issues
    const { data: issues } = await supabaseAdmin
      .from('audit_issues')
      .select('*')
      .eq('audit_id', auditId);

    // Return the pre-compiled printable HTML report
    const htmlReport = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>AuditX AI - Website Audit Report for ${audit.domain}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { background: white; color: black; }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
          }
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; }
        </style>
      </head>
      <body class="bg-zinc-50 text-zinc-900 p-8 md:p-16">
        <!-- Floating PDF header -->
        <div class="no-print max-w-5xl mx-auto mb-8 flex justify-between items-center bg-black text-white p-4 rounded-xl shadow-lg">
          <div>
            <span class="font-extrabold tracking-wider text-purple-400">AUDITX AI</span>
            <span class="text-xs text-zinc-400 ml-2">PDF Report Console</span>
          </div>
          <button onclick="window.print()" class="px-6 py-2 bg-purple-600 hover:bg-purple-500 font-bold text-sm rounded-lg transition-all">
            Download / Print PDF
          </button>
        </div>

        <div class="max-w-5xl mx-auto bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
          <!-- Header Cover -->
          <div class="border-b border-zinc-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span class="text-xs font-black tracking-widest text-purple-600 uppercase">AI-POWERED AUDIT REPORT</span>
              <h1 class="text-4xl font-extrabold tracking-tight mt-1 text-black">${audit.domain}</h1>
              <p class="text-zinc-500 text-sm mt-1">Audit URL: <a href="${audit.url}" target="_blank" class="text-purple-600 underline">${audit.url}</a></p>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-zinc-400 text-xs font-medium">REPORT GENERATED ON</span>
              <span class="font-bold text-sm text-zinc-800">${new Date(audit.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              <div class="mt-2 px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 font-bold text-xs rounded-full uppercase">
                Overall: ${audit.overall_score}/100
              </div>
            </div>
          </div>

          <!-- Score Overview -->
          <div class="grid grid-cols-2 md:grid-cols-6 gap-4 my-8">
            <div class="p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-center">
              <span class="text-xs text-zinc-400 font-semibold block uppercase">Design</span>
              <span class="text-3xl font-black text-purple-600">${audit.design_score}</span>
            </div>
            <div class="p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-center">
              <span class="text-xs text-zinc-400 font-semibold block uppercase">SEO</span>
              <span class="text-3xl font-black text-blue-600">${audit.seo_score}</span>
            </div>
            <div class="p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-center">
              <span class="text-xs text-zinc-400 font-semibold block uppercase">Speed</span>
              <span class="text-3xl font-black text-amber-600">${audit.speed_score}</span>
            </div>
            <div class="p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-center">
              <span class="text-xs text-zinc-400 font-semibold block uppercase">Mobile</span>
              <span class="text-3xl font-black text-emerald-600">${audit.mobile_score}</span>
            </div>
            <div class="p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-center">
              <span class="text-xs text-zinc-400 font-semibold block uppercase">Trust</span>
              <span class="text-3xl font-black text-indigo-600">${audit.trust_score}</span>
            </div>
            <div class="p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-center">
              <span class="text-xs text-zinc-400 font-semibold block uppercase">Conversion</span>
              <span class="text-3xl font-black text-rose-600">${audit.conversion_score}</span>
            </div>
          </div>

          <!-- Executive Summary -->
          <div class="my-8">
            <h2 class="text-xl font-bold text-zinc-900 border-b border-zinc-100 pb-2 mb-4">Executive AI Summaries</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-bold text-purple-700">Design & UX Feedback</h3>
                <p class="text-zinc-600 text-sm mt-1 leading-relaxed">${report.homepage_feedback || 'Not provided.'}</p>
                
                <h3 class="text-sm font-bold text-emerald-700 mt-4">Mobile Experience</h3>
                <p class="text-zinc-600 text-sm mt-1 leading-relaxed">${report.mobile_feedback || 'Not provided.'}</p>
              </div>
              <div>
                <h3 class="text-sm font-bold text-blue-700">SEO Integrity</h3>
                <p class="text-zinc-600 text-sm mt-1 leading-relaxed">${report.SEO_feedback || 'Not provided.'}</p>
                
                <h3 class="text-sm font-bold text-rose-700 mt-4">Conversion Strategy</h3>
                <p class="text-zinc-600 text-sm mt-1 leading-relaxed">${report.conversion_feedback || 'Not provided.'}</p>
              </div>
            </div>
          </div>

          <div class="page-break"></div>

          <!-- Critical Issues List -->
          <div class="my-8">
            <h2 class="text-xl font-bold text-zinc-900 border-b border-zinc-100 pb-2 mb-4">Critical Issues Identified (${issues?.length || 0})</h2>
            ${issues && issues.length > 0 ? `
              <div class="space-y-4">
                ${issues.map(issue => `
                  <div class="p-5 border-l-4 rounded-r-xl bg-zinc-50 border-${issue.severity === 'critical' || issue.severity === 'high' ? 'rose' : 'amber'}-500">
                    <div class="flex justify-between items-start">
                      <span class="font-extrabold text-sm text-zinc-950">${issue.title}</span>
                      <span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-zinc-200 text-zinc-700">${issue.severity}</span>
                    </div>
                    <p class="text-zinc-600 text-xs mt-1 leading-relaxed">${issue.description}</p>
                    <div class="mt-3 p-3 bg-white border border-zinc-100 rounded-lg">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">AI Recommendation</span>
                      <p class="text-zinc-700 text-xs font-medium mt-0.5">${issue.recommendation}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p class="text-zinc-500 text-sm italic">No high severity issues detected on the homepage.</p>
            `}
          </div>

          <div class="page-break"></div>

          <!-- Redesign Direction & Strategy -->
          <div class="my-8">
            <h2 class="text-xl font-bold text-zinc-900 border-b border-zinc-100 pb-2 mb-4">AI Redesign Studio Blueprint</h2>
            <div class="p-6 bg-purple-50/50 border border-purple-100 rounded-2xl">
              <span class="text-xs font-bold text-purple-600 uppercase tracking-widest block">Proposed Layout & Copy Strategy</span>
              <h3 class="text-lg font-bold text-zinc-950 mt-1">${report.redesign_direction?.strategy || 'Modern luxury redesign approach.'}</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 class="text-xs uppercase text-zinc-400 font-bold">Optimized Hero Header Copy</h4>
                  <p class="text-zinc-800 font-extrabold text-base mt-1">"${report.redesign_direction?.copy?.hero_title || 'Elevate Your Digital Experience'}"</p>
                  
                  <h4 class="text-xs uppercase text-zinc-400 font-bold mt-4">Optimized Hero Subtitle</h4>
                  <p class="text-zinc-600 text-xs mt-1">"${report.redesign_direction?.copy?.hero_subtitle || 'A fast, secure, and beautiful interface designed for maximum conversions.'}"</p>
                </div>
                <div>
                  <h4 class="text-xs uppercase text-zinc-400 font-bold">Primary Call To Action (CTA)</h4>
                  <p class="text-zinc-800 font-extrabold text-xs mt-1">"${report.redesign_direction?.copy?.cta_text || 'Get Audited Now'}"</p>
                  
                  <h4 class="text-xs uppercase text-zinc-400 font-bold mt-4">Color Palette Hexes</h4>
                  <div class="flex gap-2 mt-2">
                    ${(report.redesign_direction?.color_palette || ['#09090B', '#7C3AED', '#10B981']).map((c: string) => `
                      <div class="flex flex-col items-center">
                        <div class="h-6 w-12 rounded border border-zinc-200 shadow-sm" style="background-color: ${c}"></div>
                        <span class="text-[9px] font-semibold text-zinc-400 mt-1 uppercase">${c}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return NextResponse.json({
      success: true,
      html: htmlReport
    });

  } catch (error: any) {
    console.error('PDF route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
