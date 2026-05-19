"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, RefreshCw, AlertCircle, Copy, Check, ArrowRight, Eye, Code, Paintbrush } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

function RedesignStudioContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [audits, setAudits] = useState<any[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [redesign, setRedesign] = useState<any>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<'visual' | 'code'>('visual');

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();
      if (data.success && data.stats.recentAudits.length > 0) {
        const completed = data.stats.recentAudits.filter((a: any) => a.status === 'completed');
        setAudits(completed);
        
        // Check if report ID query param exists
        const queryId = searchParams.get("auditId");
        const activeId = queryId || (completed.length > 0 ? completed[0].id : null);
        
        if (activeId) {
          loadAuditDetails(activeId);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.warn(err);
      setLoading(false);
    }
  };

  const loadAuditDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/audit/${id}`);
      const data = await response.json();
      if (data.success && data.audit) {
        setSelectedAudit(data.audit);
        // Pre-load redesign option if it exists in DB, or construct fallback from original report JSON
        if (data.redesigns && data.redesigns.length > 0) {
          setRedesign(data.redesigns[data.redesigns.length - 1]);
        } else if (data.audit.report_json?.redesign_direction) {
          setRedesign({
            html_concept: data.audit.report_json.redesign_direction.tailwind_preview_concept,
            prompt: "Standard Report Generation"
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRedesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAudit || generating) return;
    setGenerating(true);

    try {
      const response = await fetch("/api/redesign/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId: selectedAudit.id,
          prompt: customPrompt.trim()
        })
      });

      if (!response.ok) throw new Error("Failed to generate custom specification.");
      
      const data = await response.json();
      if (data.success) {
        setRedesign(data.redesign);
      }
    } catch (err: any) {
      alert(err.message || "Failed to trigger AI designer. Operating with report pre-caches.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!redesign?.html_concept) return;
    navigator.clipboard.writeText(redesign.html_concept);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe wrapper to load live spec into iframe sandbox
  const getSandboxIframeSrc = (html: string) => {
    const cleanHtml = html || "<div>Preview Loading...</div>";
    return `
      data:text/html;charset=utf-8,
      ${encodeURIComponent(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background-color: #000; margin: 0; padding: 24px; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 90vh; }
          </style>
        </head>
        <body>
          <div style="width: 100%; max-width: 900px;">
            ${cleanHtml}
          </div>
        </body>
        </html>
      `)}
    `;
  };

  const reportData = selectedAudit?.report_json?.redesign_direction;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-zinc-900/50">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Redesign Studio</h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">Generative premium layout blueprints</p>
          </div>

          {audits.length > 0 && (
            <select
              value={selectedAudit?.id || ""}
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
              <Sparkles className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">No Design Redesigns setup.</h2>
              <p className="text-zinc-500 text-sm">
                Run your first website audit in the Diagnostic Center to unlock the AI Redesign Studio capabilities.
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 text-left">
            {/* Control Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Form trigger custom prompt */}
              <div className="glass-card rounded-3xl p-8 space-y-4">
                <span className="text-[10px] font-black text-purple-400 tracking-widest uppercase block">PROMPT SYSTEM</span>
                <h2 className="text-xl font-bold text-white">Trigger Visual Upgrade</h2>
                
                <form onSubmit={handleGenerateRedesign} className="space-y-4">
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="make it look like a high-contrast futuristic SaaS landing page with neon purples and dark elegant glassmorphic grids..."
                    rows={4}
                    disabled={generating}
                    className="w-full px-4 py-3 text-xs rounded-xl bg-zinc-950/60 border border-zinc-900 focus:border-purple-500/50 outline-none text-white font-semibold resize-none disabled:opacity-50"
                    required
                  />

                  <button
                    type="submit"
                    disabled={generating || !customPrompt}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group glow-btn"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        AI Architect working...
                      </>
                    ) : (
                      <>
                        <Paintbrush className="h-4 w-4 text-purple-200" />
                        Generate Custom Concept
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Design Recommendations Blueprint */}
              {reportData && (
                <div className="glass-card rounded-3xl p-8 space-y-6">
                  <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase block">AI DESIGN GUIDELINES</span>
                  
                  <div className="space-y-4 text-xs font-semibold leading-relaxed">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">VISUAL UPGRADE STRATEGY</span>
                      <p className="text-zinc-300 font-medium">{reportData.strategy || "Implement modern luxurious high-contrast glass layout components."}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">CTA PLACEMENT ADVICE</span>
                      <p className="text-zinc-300 font-medium">{reportData.cta_improvement || "Apply glow-effects and scale transformations."}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Spec Output Sandbox */}
            <div className="lg:col-span-3 space-y-6">
              <div className="glass-card rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-zinc-950/20">
                {/* Header bar controls */}
                <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-900 flex justify-between items-center shrink-0">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewMode('visual')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        previewMode === 'visual' ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                      Visual Spec Sandbox
                    </button>
                    <button
                      onClick={() => setPreviewMode('code')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        previewMode === 'code' ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Code className="h-4 w-4" />
                      HTML Code
                    </button>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    disabled={!redesign?.html_concept}
                    className="p-2 rounded-lg border border-zinc-900 hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all"
                    title="Copy Tailwind HTML"
                  >
                    {copied ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Copy className="h-4.5 w-4.5" />}
                  </button>
                </div>

                {/* Content area */}
                <div className="p-4 bg-black/60 h-[480px]">
                  {generating ? (
                    <div className="h-full w-full flex flex-col items-center justify-center space-y-4 animate-pulse">
                      <div className="h-10 w-10 rounded-full border-t-2 border-purple-500 animate-spin"></div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Compiling responsive visual concept in sandbox...</p>
                    </div>
                  ) : !redesign?.html_concept ? (
                    <div className="h-full w-full flex items-center justify-center text-zinc-500 text-xs italic font-semibold">
                      Sandbox empty. Select audited domain or trigger visual upgrades.
                    </div>
                  ) : previewMode === 'visual' ? (
                    /* Sandboxed visual rendering frame */
                    <iframe
                      src={getSandboxIframeSrc(redesign.html_concept)}
                      title="Visual Spec Preview"
                      className="w-full h-full border-none rounded-2xl bg-black"
                    ></iframe>
                  ) : (
                    /* Syntax rendering block */
                    <pre className="w-full h-full overflow-auto p-6 rounded-2xl bg-zinc-950 font-mono text-[10px] text-zinc-400 border border-zinc-900 select-all text-left">
                      {redesign.html_concept}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function RedesignStudio() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-background items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>}>
      <RedesignStudioContent />
    </Suspense>
  );
}
