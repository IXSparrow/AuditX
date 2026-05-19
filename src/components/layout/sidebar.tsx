"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  SearchCode, 
  Sparkles, 
  Tablet, 
  Crown, 
  History, 
  Settings, 
  CreditCard, 
  LogOut, 
  ShieldCheck,
  PlusCircle,
  TrendingUp,
  BrainCircuit
} from "lucide-react";
import { supabaseClient } from "@/lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "New Audit",
      href: "/audit/new",
      icon: PlusCircle
    },
    {
      name: "SEO Center",
      href: "/seo",
      icon: SearchCode
    },
    {
      name: "UX Intelligence",
      href: "/ux",
      icon: BrainCircuit
    },
    {
      name: "Mobile Inspector",
      href: "/mobile",
      icon: Tablet
    },
    {
      name: "Competitor Lab",
      href: "/competitor",
      icon: Crown
    },
    {
      name: "Redesign Studio",
      href: "/redesign",
      icon: Sparkles
    },
    {
      name: "Billing",
      href: "/billing",
      icon: CreditCard
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 border-r border-zinc-900 bg-zinc-950/60 backdrop-blur-xl h-screen sticky top-0 flex flex-col justify-between p-6 z-30">
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/10">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              AUDITX AI
            </span>
            <span className="text-[9px] font-black text-purple-500 tracking-widest block -mt-1.5 ml-0.5">
              SaaS DASHBOARD
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50 border border-transparent"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 transition-transform group-hover:scale-105 duration-200 ${
                  isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account Action */}
      <div className="pt-4 border-t border-zinc-900/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all duration-200"
        >
          <LogOut className="h-4.5 w-4.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
