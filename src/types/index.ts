export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'pro' | 'agency';
  created_at: string;
}

export interface Audit {
  id: string;
  user_id: string;
  url: string;
  domain: string;
  status: 'pending' | 'crawling' | 'analyzing' | 'completed' | 'failed';
  overall_score: number | null;
  design_score: number | null;
  seo_score: number | null;
  speed_score: number | null;
  mobile_score: number | null;
  trust_score: number | null;
  conversion_score: number | null;
  desktop_screenshot_url: string | null;
  mobile_screenshot_url: string | null;
  report_json: AuditReportData | null;
  created_at: string;
}

export interface AuditIssue {
  id: string;
  audit_id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  created_at: string;
}

export interface Competitor {
  id: string;
  audit_id: string;
  competitor_url: string;
  competitor_score: number;
  notes: string | null;
  created_at: string;
}

export interface RedesignPreview {
  id: string;
  audit_id: string;
  prompt: string;
  preview_url: string | null;
  html_concept: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  business_name: string;
  email: string;
  phone: string | null;
  website: string;
  source: string | null;
  created_at: string;
}

export interface AuditReportData {
  design_score: number;
  seo_score: number;
  speed_score: number;
  mobile_score: number;
  trust_score: number;
  conversion_score: number;
  overall_score: number;
  top_issues: Array<{
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    recommendation: string;
  }>;
  quick_wins: Array<{
    title: string;
    description: string;
    effort: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
  }>;
  detailed_recommendations: Array<{
    category: string;
    title: string;
    description: string;
    steps: string[];
  }>;
  homepage_feedback: string;
  mobile_feedback: string;
  SEO_feedback: string;
  conversion_feedback: string;
  redesign_direction: {
    strategy: string;
    copy: {
      hero_title: string;
      hero_subtitle: string;
      cta_text: string;
    };
    color_palette: string[];
    typography: {
      headings: string;
      body: string;
    };
    layout_wireframe: string;
    tailwind_preview_concept: string;
    cta_improvement: string;
  };
  seo_checklist: Array<{ check: string; passed: boolean; details: string }>;
  design_checklist: Array<{ check: string; passed: boolean; details: string }>;
  mobile_checklist: Array<{ check: string; passed: boolean; details: string }>;
  conversion_checklist: Array<{ check: string; passed: boolean; details: string }>;
}
