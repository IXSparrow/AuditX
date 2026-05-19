"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchCode, AlertCircle, CheckCircle2, ChevronRight, HelpCircle, ArrowRight } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

export default function SEOCenter() {
  const [loading, setLoading] = useState(true);
  const [audits, setAudits] = useState<any[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();
      if (data.success && data.stats.recentAudits.length > 0) {
        setAudits(data.stats.recentAudits.filter((a: any) => a.status === 'completed'));
        // Load the full details of the most recent completed audit
        loadAuditDetails(data.stats.recentAudits[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.warn("Offline fallback", err);
      setLoading(false);
    }
  };

  const loadAuditDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/audit/${id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedAudit(data.audit);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-zinc-900/50">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">SEO Center</h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">Search Engine Index Visibility audits</p>
          </div>

          {audits.length > 0 && (
            <select
              onChange={(e) => loadAuditDetails(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-950/60 border border-zinc-900 text-xs font-bold text-white outline-none"
            >
              {audits.map((a: any) => (
                <option key={a.id} value={a.id}>{a.domain}</option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-44 rounded-3xl bg-zinc-900/40 border border-zinc-900"></div>
            <div className="h-96 rounded-3xl bg-zinc-900/40 border border-zinc-900"></div>
          </div>
        ) : !selectedAudit ? (
          <div className="py-20 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <SearchCode className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">No SEO Audit Data Yet.</h2>
              <p className="text-zinc-500 text-sm">
                Run your first website audit in the Diagnostic Center to unlock search rankings indexing analysis.
              </p>
            </div>
            <Link
              href="/audit/new"
              className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-1.5 glow-btn"
            >
              Analyze Website
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8 text-left">
            {/* SEO Summary Card */}
            <div className="glass-card rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col justify-center items-center md:border-r border-zinc-900 pb-6 md:pb-0">
                <span className="text-[10px] font-black text-blue-400 tracking-wider uppercase block">SEO SCORE</span>
                <span className="text-6xl font-black text-white mt-2 block">{selectedAudit.seo_score}/100</span>
              </div>
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block">AI INTEGRITY ASSESSMENT</span>
                <p className="text-zinc-400 text-sm leading-relaxed">{selectedAudit.report_json?.SEO_feedback}</p>
              </div>
            </div>

            {/* Simulated Search Engine Snippet Preview */}
            <div className="glass-card rounded-3xl p-8 space-y-4">
              <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase block">GOOGLE SNIPPET SIMULATION</span>
              <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-2xl max-w-2xl font-sans space-y-1">
                <span className="text-xs text-zinc-400 font-normal block font-mono">https://www.google.com/search?q={selectedAudit.domain}</span>
                <a href="#" className="text-xl font-medium text-[#8ab4f8] hover:underline block leading-tight font-serif">
                  {selectedAudit.report_json?.seo_checklist?.[0]?.passed ? selectedAudit.domain : selectedAudit.domain.toUpperCase() + " | AI Redeveloped Engine"}
                </a>
                <p className="text-xs text-[#bdc1c6] font-normal leading-relaxed">
                  {selectedAudit.report_json?.seo_checklist?.[1]?.passed ? selectedAudit.report_json.SEO_feedback.slice(0, 160) : "Review metadata options. Find out why organic search engine indexing rates might be falling on this domain due to empty descriptive components."}
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="glass-card rounded-3xl p-8 space-y-6">
              <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase block">SEO COMPLIANCE MATRIX</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedAudit.report_json?.seo_checklist?.map((item: any) => (
                  <div key={item.check} className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900/60 flex items-start gap-3">
                    {item.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 font-semibold text-xs">
                      <span className="text-zinc-200 block leading-tight">{item.check}</span>
                      <span className="text-zinc-500 text-[10px] leading-relaxed block">{item.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
