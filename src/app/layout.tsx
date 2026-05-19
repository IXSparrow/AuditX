import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuditX AI | Premium AI Website Audit SaaS",
  description: "Identify design vulnerabilities, SEO failures, speed bottlenecks and conversion leakages instantly with the next-generation AI auditor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen relative overflow-x-hidden`}>
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none z-0"></div>
        
        {/* Ambient Glowing Orbs */}
        <div className="radial-glows">
          <div className="glow-orb-1"></div>
          <div className="glow-orb-2"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
