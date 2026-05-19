"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  ChevronRight, 
  PlusCircle, 
  ShieldAlert, 
  CheckCircle,
  FileSpreadsheet,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Failed to load statistics.");
      }
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.error || "Failed to load dashboard.");
      }
    } catch (err: any) {
      console.warn("Using simulated dashboard state due to environment offline setup:", err);
      // Construct an absolute clean ZERO-STATE or simulated offline dashboard if database is not mounted
      // This allows the application to render the required layout even on fresh, unconnected systems!
      setStats({
        totalAudits: 0,
        completedAudits: 0,
        averageScore: 0,
        totalLeads: 0,
        totalCritical: 0,
        issuesBreakdown: { design: 0, seo: 0, speed: 0, mobile: 0, trust: 0, conversion: 0 },
        recentAudits: [],
        improvementTrend: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 z-10">
        {/* Top bar header */}
        <div className="flex justify-between items-center pb-6 border-b border-zinc-900/50">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">SaaS Console</h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">Real-time AI diagnostic systems</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-900 text-zinc-400 hover:text-white transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw className="h-4.5 w-4.5" />
            </button>
            <Link
              href="/audit/new"
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-md shadow-purple-500/10 flex items-center gap-1.5 glow-btn"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              New Audit
            </Link>
          </div>
        </div>

        {loading ? (
          /* Loading Skeletons */
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-28 rounded-2xl bg-zinc-900/40 border border-zinc-900"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 rounded-3xl bg-zinc-900/40 border border-zinc-900"></div>
              <div className="h-96 rounded-3xl bg-zinc-900/40 border border-zinc-900"></div>
            </div>
          </div>
        ) : stats && stats.totalAudits === 0 ? (
          /* Beautiful Empty State */
          <div className="py-20 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 animate-bounce">
              <FolderOpen className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Run your first website audit.</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Analyze key metadata performance, visual design errors, mobile viewports, trust ratings, and conversion leaks instantly using deep AI heuristics.
              </p>
            </div>
            <Link
              href="/audit/new"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2 group glow-btn"
            >
              Analyze Your First URL
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ) : stats ? (
          /* Dashboard Analytics View */
          <div className="space-y-8">
            {/* Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card rounded-2xl p-6 text-left relative overflow-hidden">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block">Total Audits</span>
                <span className="text-4xl font-extrabold text-white mt-2 block">{stats.totalAudits}</span>
                <div className="absolute top-6 right-6 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Activity className="h-5 w-5" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 text-left relative overflow-hidden">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block">Average Score</span>
                <span className="text-4xl font-extrabold text-white mt-2 block">
                  {stats.averageScore ? `${stats.averageScore}/100` : "N/A"}
                </span>
                <div className="absolute top-6 right-6 h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 text-left relative overflow-hidden">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block">Critical Issues</span>
                <span className="text-4xl font-extrabold text-rose-400 mt-2 block">{stats.totalCritical}</span>
                <div className="absolute top-6 right-6 h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 text-left relative overflow-hidden">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block">Leads Captured</span>
                <span className="text-4xl font-extrabold text-white mt-2 block">{stats.totalLeads}</span>
                <div className="absolute top-6 right-6 h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Content Splits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Audits Timeline */}
              <div className="lg:col-span-2 glass-card rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                    <h3 className="font-extrabold text-lg text-white">Recent Audit Timelines</h3>
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">REAL DATA</span>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    {stats.recentAudits.map((audit: any) => (
                      <Link 
                        key={audit.id}
                        href={`/audit/${audit.id}`}
                        className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900/60 hover:border-purple-500/20 hover:bg-zinc-900/30 transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-1">
                          <span className="font-extrabold text-sm text-white group-hover:text-purple-400 transition-colors block">
                            {audit.domain}
                          </span>
                          <span className="text-zinc-500 text-[10px] block font-mono">
                            {audit.url}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`px-2.5 py-1 rounded text-[10px] uppercase font-black ${
                            audit.status === 'completed' 
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                              : audit.status === 'failed'
                              ? "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                              : "bg-purple-500/10 border border-purple-500/30 text-purple-400 animate-pulse"
                          }`}>
                            {audit.status}
                          </div>
                          {audit.overall_score && (
                            <span className="font-black text-sm text-zinc-300">
                              {audit.overall_score}/100
                            </span>
                          )}
                          <ChevronRight className="h-4.5 w-4.5 text-zinc-600 group-hover:text-white transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Issues Breakdown Panel */}
              <div className="glass-card rounded-3xl p-8 space-y-6">
                <div className="pb-4 border-b border-zinc-900">
                  <h3 className="font-extrabold text-lg text-white">Vulnerability Breakdown</h3>
                  <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block mt-0.5">Aggregated issue count</span>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  {Object.entries(stats.issuesBreakdown).map(([category, count]: any) => (
                    <div key={category} className="space-y-1.5">
                      <div className="flex justify-between items-center text-zinc-400 uppercase tracking-wider text-[10px]">
                        <span>{category} Issues</span>
                        <span className="text-white font-extrabold">{count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-600 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(5, count * 20))}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-zinc-500">Failed to render dashboard workspace.</div>
        )}
      </main>
    </div>
  );
}
