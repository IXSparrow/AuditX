-- ==========================================
-- AUDITX ANONYMOUS MIGRATION & RLS POLICIES
-- ==========================================
-- Run this in your Supabase SQL Editor to resolve all insert/select errors 
-- and fully enable anonymous audits & background crawler operations.

-- 1. Modify audits table user_id column to be NULLABLE (permits anonymous audits)
ALTER TABLE public.audits ALTER COLUMN user_id DROP NOT NULL;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own audits" ON public.audits;
DROP POLICY IF EXISTS "Users can create own audits" ON public.audits;
DROP POLICY IF EXISTS "Users can update own audits" ON public.audits;
DROP POLICY IF EXISTS "Users can delete own audits" ON public.audits;
DROP POLICY IF EXISTS "Users can view issues for own audits" ON public.audit_issues;
DROP POLICY IF EXISTS "Users can insert issues for own audits" ON public.audit_issues;
DROP POLICY IF EXISTS "Users can view competitors for own audits" ON public.competitors;
DROP POLICY IF EXISTS "Users can insert competitors for own audits" ON public.competitors;
DROP POLICY IF EXISTS "Users can view redesign previews for own audits" ON public.redesign_previews;
DROP POLICY IF EXISTS "Users can create redesign previews for own audits" ON public.redesign_previews;
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can create own leads" ON public.leads;

-- Drop new dynamic policies if already present to avoid duplication
DROP POLICY IF EXISTS "Allow select for all" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert for all" ON public.profiles;
DROP POLICY IF EXISTS "Allow update for all" ON public.profiles;
DROP POLICY IF EXISTS "Allow select for all" ON public.audits;
DROP POLICY IF EXISTS "Allow insert for all" ON public.audits;
DROP POLICY IF EXISTS "Allow update for all" ON public.audits;
DROP POLICY IF EXISTS "Allow delete for all" ON public.audits;
DROP POLICY IF EXISTS "Allow select for all" ON public.audit_issues;
DROP POLICY IF EXISTS "Allow insert for all" ON public.audit_issues;
DROP POLICY IF EXISTS "Allow update for all" ON public.audit_issues;
DROP POLICY IF EXISTS "Allow select for all" ON public.competitors;
DROP POLICY IF EXISTS "Allow insert for all" ON public.competitors;
DROP POLICY IF EXISTS "Allow select for all" ON public.redesign_previews;
DROP POLICY IF EXISTS "Allow insert for all" ON public.redesign_previews;
DROP POLICY IF EXISTS "Allow select for all" ON public.leads;
DROP POLICY IF EXISTS "Allow insert for all" ON public.leads;

-- 3. Verify Row Level Security is Enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redesign_previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Establish Global Anon & Auth Access Policies

-- PROFILES
CREATE POLICY "Allow select for all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for all" ON public.profiles FOR UPDATE USING (true);

-- AUDITS
CREATE POLICY "Allow select for all" ON public.audits FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON public.audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for all" ON public.audits FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for all" ON public.audits FOR DELETE USING (true);

-- AUDIT ISSUES
CREATE POLICY "Allow select for all" ON public.audit_issues FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON public.audit_issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for all" ON public.audit_issues FOR UPDATE USING (true);

-- COMPETITORS
CREATE POLICY "Allow select for all" ON public.competitors FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON public.competitors FOR INSERT WITH CHECK (true);

-- REDESIGN PREVIEWS
CREATE POLICY "Allow select for all" ON public.redesign_previews FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON public.redesign_previews FOR INSERT WITH CHECK (true);

-- LEADS
CREATE POLICY "Allow select for all" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON public.leads FOR INSERT WITH CHECK (true);
