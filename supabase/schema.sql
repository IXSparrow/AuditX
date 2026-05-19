-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'agency')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Allow select for all" on public.profiles for select using (true);
create policy "Allow insert for all" on public.profiles for insert with check (true);
create policy "Allow update for all" on public.profiles for update using (true);

-- 2. AUDITS TABLE
create table public.audits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  url text not null,
  domain text not null,
  status text default 'pending' check (status in ('pending', 'crawling', 'analyzing', 'completed', 'failed')),
  overall_score integer check (overall_score between 0 and 100),
  design_score integer check (design_score between 0 and 100),
  seo_score integer check (seo_score between 0 and 100),
  speed_score integer check (speed_score between 0 and 100),
  mobile_score integer check (mobile_score between 0 and 100),
  trust_score integer check (trust_score between 0 and 100),
  conversion_score integer check (conversion_score between 0 and 100),
  desktop_screenshot_url text,
  mobile_screenshot_url text,
  report_json jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for audits
alter table public.audits enable row level security;

-- Policies for audits
create policy "Allow select for all" on public.audits for select using (true);
create policy "Allow insert for all" on public.audits for insert with check (true);
create policy "Allow update for all" on public.audits for update using (true) with check (true);
create policy "Allow delete for all" on public.audits for delete using (true);

-- 3. AUDIT ISSUES TABLE
create table public.audit_issues (
  id uuid default gen_random_uuid() primary key,
  audit_id uuid references public.audits(id) on delete cascade not null,
  category text not null,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  title text not null,
  description text not null,
  recommendation text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for audit_issues
alter table public.audit_issues enable row level security;

-- Policies for audit_issues
create policy "Allow select for all" on public.audit_issues for select using (true);
create policy "Allow insert for all" on public.audit_issues for insert with check (true);
create policy "Allow update for all" on public.audit_issues for update using (true);

-- 4. COMPETITORS TABLE
create table public.competitors (
  id uuid default gen_random_uuid() primary key,
  audit_id uuid references public.audits(id) on delete cascade not null,
  competitor_url text not null,
  competitor_score integer check (competitor_score between 0 and 100),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for competitors
alter table public.competitors enable row level security;

-- Policies for competitors
create policy "Allow select for all" on public.competitors for select using (true);
create policy "Allow insert for all" on public.competitors for insert with check (true);

-- 5. REDESIGN PREVIEWS TABLE
create table public.redesign_previews (
  id uuid default gen_random_uuid() primary key,
  audit_id uuid references public.audits(id) on delete cascade not null,
  prompt text not null,
  preview_url text,
  html_concept text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for redesign_previews
alter table public.redesign_previews enable row level security;

-- Policies for redesign_previews
create policy "Allow select for all" on public.redesign_previews for select using (true);
create policy "Allow insert for all" on public.redesign_previews for insert with check (true);

-- 6. LEADS TABLE
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  business_name text not null,
  email text not null,
  phone text,
  website text not null,
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for leads
alter table public.leads enable row level security;

-- Policies for leads
create policy "Allow select for all" on public.leads for select using (true);
create policy "Allow insert for all" on public.leads for insert with check (true);

-- Performance Indexes
create index idx_audits_user_id on public.audits(user_id);
create index idx_audits_created_at on public.audits(created_at desc);
create index idx_audit_issues_audit_id on public.audit_issues(audit_id);
create index idx_competitors_audit_id on public.competitors(audit_id);
create index idx_redesign_previews_audit_id on public.redesign_previews(audit_id);
create index idx_leads_user_id on public.leads(user_id);

-- Trigger: automatically create a profile when a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
    new.raw_user_meta_data->>'avatar_url',
    'free'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
