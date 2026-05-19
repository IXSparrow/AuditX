"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Zap, 
  SearchCode, 
  Sparkles, 
  Tablet, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  FileDown, 
  ArrowRight,
  Monitor,
  LayoutDashboard,
  Smartphone
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

export default function AuditReport() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [audit, setAudit] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [redesigns, setRedesigns] = useState<any[]>([]);
  const [activeViewport, setActiveViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [error, setError] = useState("");
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReport(id as string);
    }
  }, [id]);

  const fetchReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/audit/${reportId}`);
      if (!response.ok) {
        throw new Error("Report not found or access restricted.");
      }
      const data = await response.json();
      if (data.success) {
        setAudit(data.audit);
        setIssues(data.issues);
        setRedesigns(data.redesigns);
      } else {
        throw new Error(data.error || "Failed to fetch report.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch report parameters.");
    } finally {
      setLoading(false);
    }
  };

  const triggerPDFExport = async () => {
    if (!id || pdfGenerating) return;
    setPdfGenerating(true);
    try {
      const response = await fetch("/api/report/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId: id })
      });
      if (!response.ok) throw new Error("Failed to compile PDF stream.");
      
      const data = await response.json();
      if (data.success && data.html) {
        // Open the precompiled HTML in a new printing frame
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(data.html);
          printWindow.document.close();
        }
      }
    } catch (err) {
      alert("Failed to export PDF: " + err);
    } finally {
      setPdfGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 animate-pulse">
            <div className="h-12 w-12 rounded-full border-t-2 border-purple-500 animate-spin mx-auto"></div>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Decoding report database...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-xl mx-auto space-y-4">
          <AlertCircle className="h-16 w-16 text-rose-500" />
          <h2 className="text-xl font-bold text-white">Report Access Denied</h2>
          <p className="text-zinc-500 text-sm">{error || "Ensure the target audit is completed and belongs to your workspace profile."}</p>
          <button 
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl font-semibold text-xs uppercase"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const report = audit.report_json;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 z-10">
        {/* Top Report Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-zinc-900/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-400">
              <span>Audit Completed</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">{audit.domain}</h1>
            <p className="text-zinc-500 text-xs mt-1">Target link: <a href={audit.url} target="_blank" className="hover:underline text-purple-400 font-mono">{audit.url}</a></p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerPDFExport}
              disabled={pdfGenerating}
              className="px-5 py-3 rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all"
            >
              <FileDown className="h-4.5 w-4.5" />
              {pdfGenerating ? "Compiling PDF..." : "Export PDF"}
            </button>
            <button
              onClick={() => router.push(`/redesign?auditId=${id}`)}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-purple-500/10 transition-all glow-btn"
            >
              <Sparkles className="h-4.5 w-4.5 text-yellow-300 animate-pulse" />
              AI Redesign Concept
            </button>
          </div>
        </div>

        {/* Dynamic Score Ring Section */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Ring Box */}
          <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-zinc-950 to-zinc-900 relative overflow-hidden">
            <span className="text-[10px] font-black text-purple-500 tracking-wider uppercase">OVERALL AUDIT SCORE</span>
            
            {/* SVG Progress Ring */}
            <div className="relative h-44 w-44 flex items-center justify-center mt-6">
              <svg className="h-full w-full transform -rotate-90">
                <circle cx="88" cy="88" r="70" stroke="rgba(255,255,255,0.02)" strokeWidth="12" fill="transparent" />
                <circle cx="88" cy="88" r="70" stroke="url(#purpleGlow)" strokeWidth="12" fill="transparent" 
                  strokeDasharray="440" strokeDashoffset={440 - (440 * (audit.overall_score || 0)) / 100}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white">{audit.overall_score}</span>
                <span className="text-[10px] text-zinc-500 font-bold tracking-widest block uppercase mt-0.5">/100 scale</span>
              </div>
            </div>
          </div>

          {/* Sub Score Breakdown Cards */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: "Design & UX", score: audit.design_score, icon: Sparkles, color: "text-purple-400" },
              { label: "SEO Integrity", score: audit.seo_score, icon: SearchCode, color: "text-blue-400" },
              { label: "Load Speed", score: audit.speed_score, icon: Zap, color: "text-amber-400" },
              { label: "Mobile Inspector", score: audit.mobile_score, icon: Tablet, color: "text-emerald-400" },
              { label: "Trust Elements", score: audit.trust_score, icon: ShieldCheck, color: "text-indigo-400" },
              { label: "Conversion rate", score: audit.conversion_score, icon: TrendingUp, color: "text-rose-400" }
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="glass-card rounded-2xl p-6 text-left flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{item.label}</span>
                    <Icon className={`h-4.5 w-4.5 ${item.color}`} />
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{item.score}</span>
                    <span className="text-zinc-500 text-[10px] font-bold">/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Screenshots Grid and Issues timeline */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Screenshot Display Block */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center bg-zinc-950/60 border border-zinc-900 p-2.5 rounded-xl shrink-0">
              <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase ml-1">SCREENSHOT PREVIEW</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveViewport('desktop')}
                  className={`p-2 rounded ${activeViewport === 'desktop' ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Desktop Viewport"
                >
                  <Monitor className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setActiveViewport('mobile')}
                  className={`p-2 rounded ${activeViewport === 'mobile' ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Mobile Viewport"
                >
                  <Smartphone className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 overflow-hidden relative group max-h-[460px] flex items-center justify-center">
              {/* If no screenshots, load thum.io dynamically as fallback */}
              <img 
                src={activeViewport === 'desktop' ? (audit.desktop_screenshot_url || `https://image.thum.io/get/width/1280/crop/800/${audit.url}`) : (audit.mobile_screenshot_url || `https://image.thum.io/get/width/375/crop/800/${audit.url}`)}
                alt={`${audit.domain} preview`}
                className="w-full h-auto object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Issue Timeline Block */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card rounded-3xl p-8 space-y-6 max-h-[520px] overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                <h3 className="font-extrabold text-lg text-white">Diagnostics Timeline</h3>
                <span className="text-xs uppercase tracking-widest text-rose-500 font-extrabold">Active Issues ({issues.length})</span>
              </div>

              {issues.length === 0 ? (
                <div className="text-zinc-500 italic text-sm">Perfect status. No SEO or design issues detected.</div>
              ) : (
                <div className="space-y-6 relative border-l border-zinc-900 ml-3 pl-6">
                  {issues.map((issue, idx) => (
                    <div key={issue.id} className="relative group text-left space-y-2">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 bg-rose-500"></span>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-sm text-white group-hover:text-purple-400 transition-colors">{issue.title}</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 uppercase font-bold text-[8px] ml-2 tracking-wider">{issue.category}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold ${
                          issue.severity === 'critical' || issue.severity === 'high' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                      
                      <p className="text-zinc-500 text-xs leading-relaxed">{issue.description}</p>
                      
                      <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl text-xs font-semibold">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">AI recommendation</span>
                        <p className="text-zinc-300 font-medium mt-0.5 leading-relaxed">{issue.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Wins panel */}
        {report && report.quick_wins && report.quick_wins.length > 0 && (
          <section className="space-y-6">
            <div className="pb-2 border-b border-zinc-900">
              <h3 className="font-extrabold text-xl text-white">Actionable Quick Wins</h3>
              <p className="text-zinc-500 text-xs font-medium mt-0.5">High-impact modifications requiring minimum effort.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.quick_wins.map((win: any) => (
                <div key={win.title} className="glass-card rounded-2xl p-6 text-left flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-sm text-white">{win.title}</h4>
                      <div className="flex gap-2 text-[8px] font-bold uppercase tracking-wider">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/35 text-emerald-400">Impact: {win.impact}</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/35 text-purple-400">Effort: {win.effort}</span>
                      </div>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed">{win.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Checklists Sections */}
        {report && (
          <section className="space-y-8 border-t border-zinc-900/50 pt-12">
            <h3 className="font-extrabold text-xl text-white">Compliance Checklists</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                { title: "SEO Core Audit Checks", checklist: report.seo_checklist },
                { title: "Design & Accessibility Audit Checks", checklist: report.design_checklist },
                { title: "Mobile & Viewport Responsiveness Checks", checklist: report.mobile_checklist },
                { title: "Conversion & CTA Placement Checks", checklist: report.conversion_checklist }
              ].map(section => {
                if (!section.checklist) return null;
                return (
                  <div key={section.title} className="glass-card rounded-3xl p-8 space-y-6">
                    <h4 className="font-bold text-base text-white border-b border-zinc-900 pb-3">{section.title}</h4>
                    
                    <div className="space-y-4">
                      {section.checklist.map((item: any) => (
                        <div key={item.check} className="flex gap-3 text-left items-start text-xs font-semibold">
                          {item.passed ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-0.5">
                            <span className="font-bold text-zinc-200 block leading-tight">{item.check}</span>
                            <span className="text-zinc-500 text-[10px] leading-relaxed block">{item.details}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
