"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowRight, Sparkles, RefreshCw, Terminal, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

function NewAuditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'crawling' | 'analyzing' | 'completed' | 'failed'>('idle');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setUrl(urlParam);
      // Automatically trigger audit if passed via URL param
      triggerAudit(urlParam);
    }
  }, [searchParams]);

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const triggerAudit = async (targetUrl: string) => {
    if (!targetUrl) return;
    setError("");
    setLoading(true);
    setStatus('pending');
    setConsoleLogs([]);
    addLog(`System initiated. Target host resolved to: ${targetUrl}`);

    try {
      // 1. Call api to create audit entry
      addLog("Authenticating profile parameters and rate limits...");
      const response = await fetch("/api/audit/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to initialize audit workspace.");
      }

      const data = await response.json();
      if (!data.success || !data.auditId) {
        throw new Error("Audit initialization did not return a valid identifier.");
      }

      const newAuditId = data.auditId;
      setAuditId(newAuditId);
      addLog(`Database workspace established. Audit ID: ${newAuditId}`);
      
      // 2. Start polling the audit status
      pollAuditStatus(newAuditId);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to initiate auditing pipeline.");
      setStatus('failed');
      addLog(`[ERROR] Pipeline aborted: ${err.message}`);
      setLoading(false);
    }
  };

  const pollAuditStatus = async (id: string) => {
    let pollingInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/audit/${id}`);
        if (!response.ok) {
          throw new Error("Status polling failure.");
        }
        
        const data = await response.json();
        if (data.success && data.audit) {
          const currentStatus = data.audit.status;
          setStatus(currentStatus);

          if (currentStatus === 'crawling') {
            if (consoleLogs.length < 5) {
              addLog("Establishing Puppeteer/Cheerio HTML crawler socket...");
              addLog("Parsing headers, page metadata, headings, and CTA button anchors...");
              addLog("Capturing high-fidelity mobile & desktop screenshots...");
            }
          } else if (currentStatus === 'analyzing') {
            if (consoleLogs.filter(l => l.includes("Lighthouse")).length === 0) {
              addLog("Crawling successfully completed. HTML parsed.");
              addLog("Opening Lighthouse API connection strategy...");
              addLog("Running PageSpeed performance index & Core Web Vitals diagnostics...");
              addLog("Feeding visual screenshots and tags into Google Gemini models...");
              addLog("Evaluating design patterns, spacing grids, and SEO structure...");
            }
          } else if (currentStatus === 'completed') {
            addLog("AI reports compiled and written into database matrices.");
            addLog("Audit completed successfully! Redirecting...");
            clearInterval(pollingInterval);
            setLoading(false);
            setTimeout(() => {
              router.push(`/audit/${id}`);
            }, 1000);
          } else if (currentStatus === 'failed') {
            clearInterval(pollingInterval);
            setStatus('failed');
            addLog("[CRITICAL] AI Model returned an invalid json or crawling was blocked.");
            setError("The website audit failed. Please make sure the domain is public and reachable.");
            setLoading(false);
          }
        }
      } catch (err) {
        console.warn("Polling status exception:", err);
      }
    }, 2000);

    // Stop polling after 120s (safety timeout)
    setTimeout(() => {
      clearInterval(pollingInterval);
      if (loading) {
        setStatus('failed');
        addLog("[TIMEOUT] Server response time exceeded 120 seconds limit.");
        setError("Auditing timed out. Please try running again.");
        setLoading(false);
      }
    }, 120000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || loading) return;
    triggerAudit(url.trim());
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 z-10">
        {/* Header */}
        <div className="pb-6 border-b border-zinc-900/50">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Diagnostic Center</h1>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">Deploy automated AI crawlers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-8 space-y-6">
              <span className="text-[10px] font-black text-purple-400 tracking-widest uppercase block">AUDIT PARAMETERS</span>
              <h2 className="text-xl font-bold text-white">Start New Audit Workspace</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">Target Website URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://my-brand-landing.com"
                    disabled={loading}
                    className="w-full px-4 py-3 text-sm rounded-xl bg-zinc-950/60 border border-zinc-900 focus:border-purple-500/50 outline-none text-white disabled:opacity-50"
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex gap-2 items-center">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !url}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 group glow-btn"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Analyzing Site Assets...
                    </>
                  ) : (
                    <>
                      Analyze website
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Console / Interactive Diagnostic Terminal */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-3xl overflow-hidden h-[400px] flex flex-col bg-zinc-950/90 shadow-2xl relative border border-purple-500/10">
              {/* Header */}
              <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-900 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4.5 w-4.5 text-purple-400" />
                  <span className="text-xs font-extrabold text-white font-mono tracking-wider">AI CRAWLER TERMINAL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    status === 'idle' ? 'bg-zinc-700' :
                    status === 'completed' ? 'bg-emerald-500 animate-pulse' :
                    status === 'failed' ? 'bg-rose-500' : 'bg-purple-500 animate-pulse'
                  }`}></span>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">{status}</span>
                </div>
              </div>

              {/* Console Logs Output */}
              <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] space-y-2 text-zinc-400">
                {consoleLogs.length === 0 ? (
                  <div className="text-zinc-600 italic">Console idle. Enter target website parameters to start AI scanner sockets...</div>
                ) : (
                  consoleLogs.map((log, index) => {
                    const isErr = log.includes("[ERROR]") || log.includes("[CRITICAL]");
                    const isSuccess = log.includes("completed") || log.includes("successfully");
                    return (
                      <div 
                        key={index} 
                        className={`${
                          isErr ? 'text-rose-400' :
                          isSuccess ? 'text-emerald-400' : 'text-zinc-400'
                        }`}
                      >
                        {log}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NewAudit() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-background items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>}>
      <NewAuditContent />
    </Suspense>
  );
}
