"use client";

import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, ShieldCheck, Activity, RefreshCw } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { supabaseClient } from "@/lib/supabase";

export default function Billing() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        setUser(session.user);
        
        // Fetch matching profile row
        const { data: prof, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (prof) setProfile(prof);
      }
    } catch (err) {
      console.warn("Offline backup profile resolver active", err);
      // Local fallback mock profile if DB offline
      setProfile({ plan: 'free', email: 'demo@auditx.ai' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (newPlan: 'free' | 'pro' | 'agency') => {
    if (!profile || updating) return;
    setUpdating(true);

    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({ plan: newPlan })
        .eq('id', user.id);

      if (error) throw error;
      setProfile((prev: any) => ({ ...prev, plan: newPlan }));
    } catch (err) {
      console.warn("Updating plan inside offline local state mock:", err);
      setProfile((prev: any) => ({ ...prev, plan: newPlan }));
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Billing & Pricing</h1>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">Upgrade or modify subscription parameters</p>
        </div>

        {loading ? (
          <div className="h-64 rounded-3xl bg-zinc-900/40 border border-zinc-900 animate-pulse"></div>
        ) : (
          <div className="space-y-8 text-left max-w-5xl">
            {/* Active Plan Indicator */}
            <div className="glass-card rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-gradient-to-br from-zinc-950 to-zinc-900 relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-purple-400 tracking-wider uppercase block">CURRENT MEMBERSHIP</span>
                <h2 className="text-2xl font-black text-white capitalize">{profile?.plan || 'Free'} Plan Workspace</h2>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Account: {profile?.email || user?.email}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">MONTHLY RESOURCE USAGE</span>
                <div className="flex justify-between items-center text-zinc-400 text-xs font-semibold">
                  <span>Audits Completed</span>
                  <span className="text-white font-extrabold">{profile?.plan === 'free' ? "1 / 1" : "Unlimited"}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: profile?.plan === 'free' ? '100%' : '10%' }}></div>
                </div>
              </div>

              <div className="flex md:justify-end">
                <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Pricing Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  key: 'free',
                  name: 'Starter / Free',
                  price: '$0',
                  desc: 'Perfect for basic testing.',
                  features: ['1 Audit per week', 'Standard SEO list', 'Lighthouse diagnostics']
                },
                {
                  key: 'pro',
                  name: 'Growth Agency Pro',
                  price: '$49',
                  desc: 'Configured for high-performing web pros.',
                  features: ['Unlimited website audits', 'AI Redesign Studio spec sandbox', 'PDF white-label reports', 'Competitor benchmark matrix']
                },
                {
                  key: 'agency',
                  name: 'Enterprise Custom',
                  price: '$199',
                  desc: 'Automated crawling APIs slots.',
                  features: ['Unlimited website audits', 'Team shared slots (15 seats)', 'Custom LLM API prompt keys', 'Direct database export endpoints']
                }
              ].map((tier) => {
                const isActive = profile?.plan === tier.key;
                return (
                  <div 
                    key={tier.key} 
                    className={`glass-card rounded-3xl p-8 flex flex-col justify-between min-h-[420px] relative ${
                      isActive ? "border-purple-500/30 bg-purple-500/5" : ""
                    }`}
                  >
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center">
                          <h3 className="font-extrabold text-white text-base">{tier.name}</h3>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[8px] uppercase tracking-wider font-extrabold">Active</span>
                          )}
                        </div>
                        <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{tier.desc}</p>
                      </div>

                      <div className="text-3xl font-black text-white">
                        {tier.price}
                        <span className="text-zinc-500 text-xs font-semibold">/month</span>
                      </div>

                      <hr className="border-zinc-900" />

                      <ul className="space-y-3 text-zinc-400 text-xs font-semibold">
                        {tier.features.map(f => (
                          <li key={f} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleUpdatePlan(tier.key as any)}
                      disabled={isActive || updating}
                      className={`mt-8 w-full py-3.5 text-center font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-default"
                          : "bg-purple-600 hover:bg-purple-500 disabled:bg-purple-700 text-white shadow-lg shadow-purple-500/10 glow-btn"
                      }`}
                    >
                      {updating ? (
                        <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                      ) : isActive ? (
                        "Current Active Plan"
                      ) : (
                        `Upgrade to ${tier.key}`
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
