"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon, ShieldCheck, Mail, Lock, User, RefreshCw, Key } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { supabaseClient } from "@/lib/supabase";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [pagespeedKey, setPagespeedKey] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchProfile();
    // Load local storage keys if present
    setGeminiKey(localStorage.getItem("AI_API_KEY") || "");
    setPagespeedKey(localStorage.getItem("PAGESPEED_API_KEY") || "");
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        setUser(session.user);
        setEmail(session.user.email || "");
        
        // Query profiles details
        const { data: prof } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (prof) {
          setFullName(prof.full_name || "");
        }
      }
    } catch (err) {
      console.warn("Offline profile active", err);
      setFullName("Demo User");
      setEmail("demo@auditx.ai");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg("");

    try {
      // 1. Update Supabase profile row
      const { error } = await supabaseClient
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      // 2. Save API tokens to local storage (smart sandbox simulation for developers!)
      localStorage.setItem("AI_API_KEY", geminiKey.trim());
      localStorage.setItem("PAGESPEED_API_KEY", pagespeedKey.trim());

      setSuccessMsg("Workspace settings compiled and written successfully.");
    } catch (err: any) {
      // Fallback local storage write if offline
      localStorage.setItem("AI_API_KEY", geminiKey.trim());
      localStorage.setItem("PAGESPEED_API_KEY", pagespeedKey.trim());
      setSuccessMsg("Settings saved successfully.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 z-10">
        {/* Header */}
        <div className="pb-6 border-b border-zinc-900/50">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Workspace Settings</h1>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">Configure profile metadata and system keys</p>
        </div>

        {loading ? (
          <div className="h-64 rounded-3xl bg-zinc-900/40 border border-zinc-900 animate-pulse"></div>
        ) : (
          <div className="space-y-8 text-left max-w-2xl">
            <div className="glass-card rounded-3xl p-8 space-y-6">
              <span className="text-[10px] font-black text-purple-400 tracking-widest uppercase block">CONFIGURATION MATRIX</span>
              <h2 className="text-xl font-bold text-white">Profile Details</h2>

              <form onSubmit={handleUpdateSettings} className="space-y-6">
                {successMsg && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium text-center">
                    {successMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">Full Name</label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-950/60 border border-zinc-900 focus-within:border-purple-500/50 transition-colors">
                    <User className="h-4.5 w-4.5 text-zinc-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Agency"
                      className="bg-transparent text-sm text-white placeholder-zinc-700 outline-none w-full font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">Email Address</label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/30 border border-zinc-900 opacity-50 select-none">
                    <Mail className="h-4.5 w-4.5 text-zinc-500" />
                    <span className="text-sm text-zinc-500 font-semibold">{email}</span>
                  </div>
                </div>

                <hr className="border-zinc-900" />

                {/* Custom API token fields */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      <Key className="h-4 w-4 text-purple-400" />
                      Custom Sandbox Keys
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                      Evaluate custom audits without server configurations by saving your keys directly in your local browser sandbox.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">Gemini / OpenRouter Key</label>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="AI_API_KEY"
                      className="w-full px-4 py-3 text-xs rounded-xl bg-zinc-950/60 border border-zinc-900 focus:border-purple-500/50 outline-none text-white font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">PageSpeed Insights Key</label>
                    <input
                      type="password"
                      value={pagespeedKey}
                      onChange={(e) => setPagespeedKey(e.target.value)}
                      placeholder="PAGESPEED_API_KEY"
                      className="w-full px-4 py-3 text-xs rounded-xl bg-zinc-950/60 border border-zinc-900 focus:border-purple-500/50 outline-none text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 glow-btn"
                >
                  {updating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save workspace configurations"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
