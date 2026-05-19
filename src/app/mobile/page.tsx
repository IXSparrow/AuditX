"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tablet, AlertCircle, CheckCircle2, ArrowRight, Smartphone } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

export default function MobileInspector() {
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
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Mobile Inspector</h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">Responsive viewport and usability metrics</p>
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
              <Tablet className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">No Mobile Audits Conducted.</h2>
              <p className="text-zinc-500 text-sm">
                Run your first website audit in the Diagnostic Center to unlock mobile screen rendering and responsive checklist evaluations.
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
            {/* Mobile Summary */}
            <div className="glass-card rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col justify-center items-center md:border-r border-zinc-900 pb-6 md:pb-0">
                <span className="text-[10px] font-black text-emerald-400 tracking-wider uppercase block">MOBILE SCORE</span>
                <span className="text-6xl font-black text-white mt-2 block">{selectedAudit.mobile_score}/100</span>
              </div>
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block">MOBILE USABILITY OPINION</span>
                <p className="text-zinc-400 text-sm leading-relaxed">{selectedAudit.report_json?.mobile_feedback}</p>
              </div>
            </div>

            {/* Split Screen Mockup and Checks */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Mobile Device Mockup */}
              <div className="lg:col-span-2 flex flex-col items-center">
                <div className="pb-4 w-full flex justify-between items-center text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                  <span>viewport: 375px (iphone)</span>
                  <Smartphone className="h-4 w-4 text-purple-400" />
                </div>
                
                <div className="rounded-[40px] border-[12px] border-zinc-900 bg-zinc-950 overflow-hidden shadow-2xl relative w-full max-w-[280px] h-[520px]">
                  <img 
                    src={selectedAudit.mobile_screenshot_url || `https://image.thum.io/get/width/375/crop/800/${selectedAudit.url}`}
                    alt="Mobile screen preview"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Mobile Checks */}
              <div className="lg:col-span-3 glass-card rounded-3xl p-8 space-y-6">
                <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase block">RESPONSIVENESS COMPLIANCE CHECKLIST</span>
                <div className="space-y-4">
                  {selectedAudit.report_json?.mobile_checklist?.map((item: any) => (
                    <div key={item.check} className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex items-start gap-3">
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
          </div>
        )}
      </main>
    </div>
  );
}
