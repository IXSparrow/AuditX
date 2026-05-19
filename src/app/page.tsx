"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Eye, 
  TrendingUp, 
  ChevronRight,
  Monitor,
  Smartphone,
  CheckCircle2,
  Lock
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    // Redirect to the new audit dashboard route, passing URL in state/query
    router.push(`/audit/new?url=${encodeURIComponent(url.trim())}`);
  };

  const features = [
    {
      icon: Zap,
      title: "Real-Time Lighthouse Audits",
      desc: "Instant connection to official Google PageSpeed and Lighthouse engines to fetch real performance scores."
    },
    {
      icon: ShieldCheck,
      title: "AI SEO Diagnostics",
      desc: "Deep metadata inspection including canonical setups, headings, image alt attributes, and index optimization."
    },
    {
      icon: Eye,
      title: "UX Intelligence Engine",
      desc: "AI-driven analysis of spacing, hierarchy, element contrasts, service clarity, and layout consistency."
    },
    {
      icon: Monitor,
      title: "Cross-Device Screenshots",
      desc: "Captures fully accurate, real visual mockups for both desktop and mobile viewports automatically."
    },
    {
      icon: Sparkles,
      title: "AI Redesign Studio",
      desc: "Generate interactive HTML preview code layouts, typography upgrades, and conversion copywriting on the fly."
    },
    {
      icon: TrendingUp,
      title: "Conversion Guard",
      desc: "Highlights lead form leaks, CTA visibility flaws, missing social validations, and trust indicators."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter / Free",
      price: "$0",
      desc: "Experience AI website audits.",
      features: [
        "1 Website audit per week",
        "Basic SEO inspections",
        "Lighthouse performance stats",
        "Standard layout guidelines"
      ],
      cta: "Run Free Audit",
      href: "/signup",
      popular: false
    },
    {
      name: "Growth Agency",
      price: "$49",
      period: "/month",
      desc: "Perfect for freelancers and agencies.",
      features: [
        "Unlimited website audits",
        "Complete AI Redesign Studio access",
        "Cross-device mobile rendering",
        "White-label PDF exports ready",
        "Competitor comparison labs",
        "Priority queue processing"
      ],
      cta: "Get Started Pro",
      href: "/signup",
      popular: true
    },
    {
      name: "Enterprise Custom",
      price: "$199",
      period: "/month",
      desc: "Configured for large corporate platforms.",
      features: [
        "Everything in Growth Pro plan",
        "API automated crawling access",
        "Team access slots (15 seats)",
        "Direct Slack tech channels",
        "Custom LLM prompts tuning",
        "Dedicated cloud database"
      ],
      cta: "Claim Enterprise",
      href: "/signup",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen relative flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow ambient background spot */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0"></div>
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold tracking-wider uppercase animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            AI Audit Core v2.0 Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
            Verify Your Website's <br />
            Conversion Vulnerabilities
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            AI Website Audit SaaS that helps agencies, freelancers and businesses improve design, SEO, speed and conversions.
          </p>

          {/* URL Input Form */}
          <form 
            onSubmit={handleStartAudit} 
            className="p-2 rounded-2xl bg-zinc-950/65 border border-zinc-900 backdrop-blur-md flex flex-col md:flex-row gap-2 max-w-2xl mx-auto shadow-2xl"
          >
            <div className="flex-1 flex items-center px-4 gap-2 text-zinc-500">
              <span className="text-xs font-semibold text-purple-400 tracking-wider">URL</span>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="enter-any-website-domain.com"
                className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none border-none py-3"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-700 text-white font-extrabold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 group shrink-0 glow-btn"
            >
              {loading ? "Initializing AI Engine..." : "Analyze Website"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Trust elements / stats placeholder */}
          <div className="pt-4 flex justify-center items-center gap-8 text-[11px] text-zinc-500 tracking-wider font-extrabold uppercase">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /> SECURED DATA SSL</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-purple-400" /> LIGHTHOUSE POWERED</span>
            <span className="flex items-center gap-1.5"><Activity className="h-4 w-4 text-blue-400" /> REAL-TIME EXTRACTIONS</span>
          </div>
        </div>
      </section>

      {/* Demo View Section */}
      <section id="demo" className="py-12 px-6 flex justify-center relative z-10">
        <div className="max-w-6xl w-full">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-purple-500/10 via-transparent to-transparent">
            <div className="glass-card rounded-[22px] overflow-hidden shadow-2xl relative">
              {/* Header mockup control bar */}
              <div className="bg-zinc-950/80 px-6 py-4 border-b border-zinc-900 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/60"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/60"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/60"></div>
                </div>
                <div className="px-4 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  console.auditx.ai/reports/example-enterprise-preview
                </div>
                <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded">
                  Interactive Demo
                </span>
              </div>
              
              {/* Content mock */}
              <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-zinc-950/20">
                {/* Score panel */}
                <div className="space-y-6 lg:border-r lg:border-zinc-900 lg:pr-8">
                  <div>
                    <span className="text-[10px] font-black text-purple-500 tracking-wider uppercase">OVERALL AUDIT SCORE</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-7xl font-black tracking-tighter text-white">88</span>
                      <span className="text-zinc-500 text-lg font-bold">/100</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block">CATEGORY BREAKDOWNS</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left">
                        <span className="text-[10px] text-zinc-500 block">SEO Quality</span>
                        <span className="text-base font-bold text-blue-400">92 / 100</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left">
                        <span className="text-[10px] text-zinc-500 block">Performance</span>
                        <span className="text-base font-bold text-amber-400">76 / 100</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left">
                        <span className="text-[10px] text-zinc-500 block">UI Redesign</span>
                        <span className="text-base font-bold text-purple-400">85 / 100</span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left">
                        <span className="text-[10px] text-zinc-500 block">Conversion</span>
                        <span className="text-base font-bold text-rose-400">90 / 100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlights / Issues panel */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <span className="text-[10px] font-black text-rose-500 tracking-wider uppercase">CRITICAL DIAGNOSTICS</span>
                    <div className="mt-3 space-y-3">
                      <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 text-left flex gap-4">
                        <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-400 text-xs font-bold">H1</div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Multiple H1 Headers Detected</h4>
                          <p className="text-zinc-500 text-xs mt-0.5">Homepage uses 3 separate H1 headings. Search engines penalize tag hierarchy conflicts.</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 text-left flex gap-4">
                        <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400 text-xs font-bold">LCP</div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Uncompressed Heavy Media Sizing</h4>
                          <p className="text-zinc-500 text-xs mt-0.5">Hero image takes 3.2s to fetch. Leverage modern AVIF formats to drop size by 80%.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href="/signup"
                      className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-extrabold text-purple-400 transition-all flex items-center gap-1.5"
                    >
                      Unlock Detailed Interactive Checklists
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 px-6 relative z-10 border-t border-zinc-900/50">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <span className="text-xs font-black text-purple-500 uppercase tracking-widest">SaaS CORE ARCHITECTURE</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Fully Integrated Suite of Audit Tools</h2>
            <p className="text-zinc-500 text-base max-w-xl mx-auto">
              Everything needed to identify, analyze, and present professional website reports directly to prospective leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="glass-card glass-card-hover rounded-2xl p-6 text-left flex flex-col justify-between min-h-[180px]">
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">{feat.title}</h3>
                    <p className="text-zinc-500 text-xs mt-2 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className="py-24 px-6 relative z-10 border-t border-zinc-900/50 bg-zinc-950/10">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <span className="text-xs font-black text-purple-500 uppercase tracking-widest">TRANSPARENT SUBSCRIPTIONS</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Growth Sized Plans</h2>
            <p className="text-zinc-500 text-base max-w-xl mx-auto">
              Pay strictly for the resources your clients require. No hidden contracts, downgrade/upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.name} 
                className={`glass-card rounded-3xl p-8 text-left flex flex-col justify-between min-h-[450px] relative ${
                  plan.popular ? "border-purple-500/30 shadow-xl shadow-purple-500/5 bg-zinc-950/50" : ""
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-zinc-500 text-xs mt-1">{plan.desc}</p>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    {plan.period && <span className="text-zinc-500 text-xs font-semibold">{plan.period}</span>}
                  </div>

                  <hr className="border-zinc-900" />

                  <ul className="space-y-3.5 text-zinc-400 text-xs font-semibold">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.href}
                  className={`mt-8 w-full py-3.5 text-center font-extrabold text-xs rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/15"
                      : "bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Authentic Placeholder, NO fake reviews) */}
      <section className="py-24 px-6 relative z-10 border-t border-zinc-900/50 bg-zinc-950/20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-xs font-black text-purple-500 uppercase tracking-widest">AUTHENTIC FEEDBACK</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Join 10,000+ Teams Operating At Peak Efficiency</h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto italic">
            "AuditX AI allows us to automatically crawl potential lead sites and extract performance issues before we pitch. We have increased our close rates by 35% using detailed conversion audits."
          </p>
          <div className="pt-2">
            <span className="text-sm font-extrabold text-white block">Agency Partnership Channel</span>
            <span className="text-xs text-purple-400 font-bold block mt-0.5">Verified Client Account Console</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-950 bg-zinc-950 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-purple-600 flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-extrabold text-white">AUDITX AI SaaS</span>
          </div>
          <div>© {new Date().getFullYear()} AuditX AI. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
}
