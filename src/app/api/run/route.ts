import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { crawlWebsite } from '@/lib/crawler';
import { runSpeedAudit } from '@/lib/lighthouse';
import { generateAuditReport } from '@/lib/ai';

export async function POST(req: Request) {
  let auditId: string | null = null;
  
  try {
    const body = await req.json();
    auditId = body.auditId;

    if (!auditId) {
      return NextResponse.json({ error: 'Audit ID is required.' }, { status: 400 });
    }

    // 1. Fetch audit details from database
    const { data: audit, error: auditError } = await supabaseAdmin
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .single();

    if (auditError || !audit) {
      console.error("Audit lookup error:", auditError);
      return NextResponse.json({ error: 'Audit entry not found.' }, { status: 404 });
    }

    // Skip processing if audit is already completed
    if (audit.status === 'completed') {
      return NextResponse.json({ success: true, message: 'Audit already completed.' });
    }

    // 2. Set status to 'crawling'
    await supabaseAdmin
      .from('audits')
      .update({ status: 'crawling' })
      .eq('id', auditId);

    console.log(`[Audit Pipeline] Started crawling url: ${audit.url}`);
    
    // 3. Execute homepage crawling & screenshot extraction
    const crawledData = await crawlWebsite(audit.url);

    // 4. Update status to 'analyzing'
    await supabaseAdmin
      .from('audits')
      .update({ 
        status: 'analyzing',
        desktop_screenshot_url: crawledData.desktopScreenshot,
        mobile_screenshot_url: crawledData.mobileScreenshot
      })
      .eq('id', auditId);

    console.log(`[Audit Pipeline] Crawl complete. Fetching performance audits via Lighthouse API...`);

    // 5. Execute PageSpeed performance audits
    const speedData = await runSpeedAudit(audit.url);

    console.log(`[Audit Pipeline] Performance complete. Starting AI audit report generation...`);

    // 6. Execute AI Audit report generation
    const reportJson = await generateAuditReport(audit.url, crawledData, speedData);

    console.log(`[Audit Pipeline] AI processing complete. Saving results...`);

    // 7. Save issues into the audit_issues table
    if (reportJson.top_issues && reportJson.top_issues.length > 0) {
      const issueRecords = reportJson.top_issues.map((issue: any) => ({
        audit_id: auditId,
        category: issue.category,
        severity: issue.severity,
        title: issue.title,
        description: issue.description,
        recommendation: issue.recommendation
      }));

      const { error: issuesInsertError } = await supabaseAdmin
        .from('audit_issues')
        .insert(issueRecords);

      if (issuesInsertError) {
        console.error("Failed to insert issues into database:", issuesInsertError);
      }
    }

    // 8. Update final audit entry with all metrics and report json
    const { error: updateError } = await supabaseAdmin
      .from('audits')
      .update({
        status: 'completed',
        overall_score: reportJson.overall_score,
        design_score: reportJson.design_score,
        seo_score: reportJson.seo_score,
        speed_score: reportJson.speed_score,
        mobile_score: reportJson.mobile_score,
        trust_score: reportJson.trust_score,
        conversion_score: reportJson.conversion_score,
        report_json: reportJson as any,
        desktop_screenshot_url: crawledData.desktopScreenshot,
        mobile_screenshot_url: crawledData.mobileScreenshot
      })
      .eq('id', auditId);

    if (updateError) {
      throw updateError;
    }

    console.log(`[Audit Pipeline] Audit successfully completed for id: ${auditId}`);
    return NextResponse.json({ success: true, message: 'Audit pipeline executed successfully.' });

  } catch (error: any) {
    console.error(`[Audit Pipeline Error] Failed to process audit ${auditId}:`, error);
    
    if (auditId) {
      // Mark as failed in DB
      await supabaseAdmin
        .from('audits')
        .update({ 
          status: 'failed',
          report_json: { error: error.message || 'Audit processing failed due to internal exception.' } as any 
        })
        .eq('id', auditId);
    }

    return NextResponse.json({ error: error.message || 'Audit pipeline execution failed.' }, { status: 500 });
  }
}
