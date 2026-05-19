"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit, AlertCircle, CheckCircle2, ArrowRight, Paintbrush } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

export default function UXIntelligence() {
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
            <h1 className="text-3xl font-extrabold tracking-tight text-white">UX Intelligence</h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">Design system and user flow evaluation</p>
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
              <BrainCircuit className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">No UX Intelligence Data Yet.</h2>
              <p className="text-zinc-500 text-sm">
                Run your first website audit in the Diagnostic Center to unlock detailed visual and user experience diagnostic checks.
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
            {/* UX Executive Summary */}
            <div className="glass-card rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col justify-center items-center md:border-r border-zinc-900 pb-6 md:pb-0">
                <span className="text-[10px] font-black text-purple-400 tracking-wider uppercase block">DESIGN SCORE</span>
                <span className="text-6xl font-black text-white mt-2 block">{selectedAudit.design_score}/100</span>
              </div>
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block">AI DESIGN FEEDBACK</span>
                <p className="text-zinc-400 text-sm leading-relaxed">{selectedAudit.report_json?.homepage_feedback}</p>
              </div>
            </div>

            {/* Design System elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Spacing & Hierarchy Checks */}
              <div className="glass-card rounded-3xl p-8 space-y-6">
                <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase block">DESIGN COMPLIANCE MATRIX</span>
                <div className="space-y-4">
                  {selectedAudit.report_json?.design_checklist?.map((item: any) => (
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

              {/* Typography / Color Blueprints */}
              <div className="glass-card rounded-3xl p-8 space-y-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase block mb-4">EXTRACTED DESIGN TOKENS</span>
                  
                  <div className="space-y-6 text-xs font-semibold">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase block tracking-wider">Identified Font Families</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedAudit.report_json?.redesign_direction?.typography?.headings ? (
                          <span className="px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-900 text-zinc-200 font-mono text-[10px]">
                            {selectedAudit.report_json.redesign_direction.typography.headings}
                          </span>
                        ) : (
                          <span className="text-zinc-600 italic">No custom web fonts parsed. Using system defaults.</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase block tracking-wider">Color Palette Suggestions</span>
                      <div className="flex gap-2">
                        {(selectedAudit.report_json?.redesign_direction?.color_palette || ['#09090b', '#7c3aed', '#10b981']).map((c: string) => (
                          <div key={c} className="flex flex-col items-center">
                            <div className="h-6 w-12 rounded border border-zinc-900 shadow" style={{ backgroundColor: c }}></div>
                            <span className="text-[9px] font-mono font-bold text-zinc-500 mt-1 uppercase">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/redesign?auditId=${selectedAudit.id}`}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 glow-btn"
                >
                  <Paintbrush className="h-4 w-4" />
                  AI Redesign Concept Studio
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
