import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized user access.' }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Fetch total audits count
    const { count: totalAudits, error: totalError } = await supabaseAdmin
      .from('audits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // 2. Fetch completed audits count
    const { count: completedAudits, error: completedError } = await supabaseAdmin
      .from('audits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed');

    // 3. Fetch average score of completed audits
    const { data: scoresData, error: scoresError } = await supabaseAdmin
      .from('audits')
      .select('overall_score')
      .eq('user_id', userId)
      .eq('status', 'completed');

    let averageScore = 0;
    if (scoresData && scoresData.length > 0) {
      const validScores = scoresData.map(d => d.overall_score).filter((s): s is number => s !== null);
      if (validScores.length > 0) {
        averageScore = Math.round(validScores.reduce((sum, val) => sum + val, 0) / validScores.length);
      }
    }

    // 4. Fetch recent audits (top 5)
    const { data: recentAudits, error: recentError } = await supabaseAdmin
      .from('audits')
      .select('id, url, domain, status, overall_score, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // 5. Fetch counts of captured leads
    const { count: totalLeads, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // 6. Aggregate Top Issue Categories
    // Query issues associated with this user's audits
    const { data: userIssues, error: issuesError } = await supabaseAdmin
      .from('audit_issues')
      .select('category, severity')
      .in('audit_id', (
        await supabaseAdmin
          .from('audits')
          .select('id')
          .eq('user_id', userId)
      ).data?.map(a => a.id) || []);

    const issuesBreakdown: { [key: string]: number } = {
      design: 0,
      seo: 0,
      speed: 0,
      mobile: 0,
      trust: 0,
      conversion: 0
    };

    let totalCritical = 0;
    if (userIssues && userIssues.length > 0) {
      userIssues.forEach(issue => {
        if (issue.category) {
          const cat = issue.category.toLowerCase();
          if (cat in issuesBreakdown) {
            issuesBreakdown[cat]++;
          } else {
            issuesBreakdown[cat] = 1;
          }
        }
        if (issue.severity === 'critical' || issue.severity === 'high') {
          totalCritical++;
        }
      });
    }

    // 7. Improvement trend data over time (last 8 completed audits)
    const { data: trendData } = await supabaseAdmin
      .from('audits')
      .select('created_at, overall_score')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: true })
      .limit(8);

    const improvementTrend = (trendData || [])
      .filter(t => t.overall_score !== null)
      .map(t => ({
        date: new Date(t.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: t.overall_score
      }));

    return NextResponse.json({
      success: true,
      stats: {
        totalAudits: totalAudits || 0,
        completedAudits: completedAudits || 0,
        averageScore,
        totalLeads: totalLeads || 0,
        totalCritical,
        issuesBreakdown,
        recentAudits: recentAudits || [],
        improvementTrend
      }
    });

  } catch (error: any) {
    console.error('Dashboard stats route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
