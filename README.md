# AuditX AI | Premium AI Website Audit SaaS

AuditX AI is an immersive, lightning-fast, premium AI-powered Website Audit SaaS that scans any website domain and extracts actionable diagnostics regarding Design UX, SEO, speed and loading latency, mobile viewports compliance, trust credentials, and conversion bottlenecks. 

It provides detailed checklist timelines, quick actionable wins, executive AI reports, and an interactive **AI Redesign Studio** that renders dynamic custom visual layout upgrades inside sandboxed frames on the fly.

---

## ⚡ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui concepts, Framer Motion transitions, Lucide icons.
- **Backend API Layer**: Next.js App Router Route Handlers (Server Components for data caching).
- **Database**: Supabase PostgreSQL (custom indexing, relational foreign keys, automated sync triggers).
- **Authentication**: Supabase Auth (linking users directly to database `profiles`).
- **Database Security**: Supabase Row-Level Security (RLS) policies enforcing profile boundary protections.
- **Web Crawling**: Lightweight DOM parsing sockets extracting elements, titles, headings, and CTAs in serverless environments.
- **Lighthouse Scoring**: Offical Google PageSpeed Insights REST API.
- **AI Core**: Google Gemini 1.5 Pro / OpenRouter API compatibilities.
- **Deployment**: Vercel-ready serverless bundle optimization.

---

## 📂 Project Directory Structure

```text
├── supabase/
│   └── schema.sql              # Supabase Tables, Triggers, Indexes & RLS Policies
├── src/
│   ├── app/
│   │   ├── api/                # Next.js Route Handlers
│   │   │   ├── audit/
│   │   │   │   ├── create/     # POST: Starts pending audit, triggers background queue
│   │   │   │   ├── run/        # POST: Background worker (crawling + PageSpeed + Gemini)
│   │   │   │   └── [id]/       # GET: Fetches complete report + issues + competitors
│   │   │   ├── redesign/
│   │   │   │   └── generate/   # POST: Triggers Gemini to generate custom Tailwind Concept
│   │   │   ├── report/
│   │   │   │   └── pdf/        # POST: Compiles beautiful print-ready report HTML
│   │   │   └── dashboard/
│   │   │       └── stats/      # GET: Real-time user metrics aggregated from DB
│   │   ├── audit/
│   │   │   ├── new/            # Visual Diagnostic center & LIVE crawler console
│   │   │   └── [id]/           # Immersive Audit Report page & checklists
│   │   ├── seo/                # Google SEO simulator & tag compliance matrices
│   │   ├── ux/                 # Typographic systems, spacing contrast & UX ratings
│   │   ├── mobile/             # Mobile device iframe previewer & responsiveness checks
│   │   ├── competitor/         # Benchmark lab to add & compare competing domains
│   │   ├── redesign/           # AI Redesign spec sandbox & Tailwind copy editor
│   │   ├── billing/            # SaaS tiered subscriptions & active profile sync
│   │   ├── settings/           # Custom local Gemini/PageSpeed API keys console
│   │   ├── login/              # Luxury auth sign in with bypass support
│   │   ├── signup/             # Luxury auth sign up with bypass support
│   │   ├── layout.tsx          # Main html frame, global ambient luxury grids
│   │   ├── globals.css         # Styling directives, HSL variables, luxury scrollbars
│   │   └── page.tsx            # Dark luxury landing page, URL analyzer console
│   ├── lib/
│   │   ├── ai.ts               # Gemini 1.5 Pro / OpenRouter REST integration
│   │   ├── crawler.ts          # Page elements scraper & screenshot generator
│   │   ├── lighthouse.ts       # Google PageSpeed REST auditor & latency fallbacks
│   │   └── supabase.ts         # Server-side and browser Supabase initializers
│   └── types/
│       └── index.ts            # Dynamic TypeScript Interfaces & Types
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## ⚙️ Environment Configurations

Create a `.env.local` file in the root folder containing:

```env
# Supabase Public Settings
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Server-Side Private Key (Required for queue workers to bypass RLS securely)
SUPABASE_SERVICE_ROLE_KEY=ai_worker_service_role_secret_key...

# AI Core Configuration (Supports direct Gemini API key or OpenRouter sk-or- key)
AI_API_KEY=AIzaSyYourGeminiApiKeyOrOpenRouterKey...

# Performance Auditing (Optional - falls back to secure network latency scores if empty)
PAGESPEED_API_KEY=AIzaSyGooglePageSpeedInsightsApiKey...

# SaaS URL (Required to trigger background async route handlers in Vercel/Localhost)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Setup & Execution Instructions

### 1. Database Setup
1. Log in to [Supabase Console](https://supabase.com).
2. Create a new PostgreSQL Database.
3. Open the **SQL Editor** tab.
4. Copy the complete contents of `supabase/schema.sql` and run the script. This creates:
   - All six required tables (`profiles`, `audits`, `audit_issues`, `competitors`, `redesign_previews`, `leads`).
   - Standard performance indexes on high-query parameters (`user_id`, `audit_id`, `created_at`).
   - Strict **Row-Level Security (RLS)** rules securing user boundaries.
   - Triggers to automatically sync Supabase Auth accounts with the public `profiles` table.

### 2. Install Dependencies
```bash
npm install
```

### 3. Local Execution
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser.

### 4. Deployment to Vercel
1. Create a public/private Git Repository and push the codebase.
2. Link your repository in [Vercel](https://vercel.com).
3. Copy all parameters from `.env.local` into the **Environment Variables** panel in Vercel settings. Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://auditx.vercel.app`).
4. Click **Deploy**.

---

## 🔒 Security & Performance Features

1. **Security**:
   - Strictly validates URLs before crawling.
   - Rejects localhost and internal private IP blocks to secure backend infrastructure.
   - Enforces user-locked row security using PostgreSQL RLS policies.
2. **Performance**:
   - Uses caching in Next.js Server Components to minimize database roundtrips.
   - Employs async trigger-worker handlers for crawls, preventing API request timeouts.
   - Features responsive loading skeletons to maintain UI fluidity during background audits.
# AuditX
