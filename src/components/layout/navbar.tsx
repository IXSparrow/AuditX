"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Shield, Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { supabaseClient } from "@/lib/supabase";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Check initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/75 border-b border-zinc-900/50 backdrop-blur-md py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-all duration-300">
            <Shield className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
              AUDITX
            </span>
            <span className="text-[10px] font-black text-purple-400 tracking-widest block -mt-1.5 ml-0.5">
              AI ENGINE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors duration-200">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-white transition-colors duration-200">
            Pricing
          </Link>
          <Link href="#demo" className="hover:text-white transition-colors duration-200">
            Platform Demo
          </Link>
          <span className="h-4 w-px bg-zinc-800"></span>
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all duration-300 shadow-md shadow-purple-500/10 flex items-center gap-1.5 group glow-btn"
            >
              Dashboard
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-white transition-colors duration-200">
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 font-bold transition-all duration-300 shadow-sm flex items-center gap-1.5 group glow-btn"
              >
                Sign Up
                <Sparkles className="h-4 w-4 text-purple-400 group-hover:animate-bounce" />
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-900 px-6 py-8 flex flex-col gap-6 md:hidden animate-fade-in backdrop-blur-lg">
          <Link
            href="#features"
            onClick={() => setIsOpen(false)}
            className="text-zinc-300 hover:text-white text-lg font-medium"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="text-zinc-300 hover:text-white text-lg font-medium"
          >
            Pricing
          </Link>
          <Link
            href="#demo"
            onClick={() => setIsOpen(false)}
            className="text-zinc-300 hover:text-white text-lg font-medium"
          >
            Platform Demo
          </Link>
          <div className="h-px bg-zinc-900 my-2"></div>
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-4 bg-purple-600 rounded-xl font-bold text-white shadow-lg"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-4 border border-zinc-850 hover:bg-zinc-900 rounded-xl font-bold text-zinc-300"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-4 bg-zinc-900 border border-zinc-800 rounded-xl font-bold text-white shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
