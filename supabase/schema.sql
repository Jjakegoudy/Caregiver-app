-- Caregiver App — Supabase schema (Build Order, Phase 1, Step 1)
-- Run this in the Supabase SQL editor after provisioning the project.
-- Mirrors Part 1, Phase 5 (Data Schema & Memory Banks) of the build book.

-- ============================================================
-- 5.1 User & Child Profile
-- ============================================================
create table if not exists profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'paid')),
  location_zip text,
  state_code text, -- derived from location_zip; nationwide from day one
  child_name text,
  child_age_dob text,
  onboarding_context text, -- the open "What's on your mind?" free text
  current_school_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 5.2 The Journal Log Schema
-- ============================================================
create table if not exists journal_logs (
  log_id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  ts timestamptz not null default now(),
  raw_transcript text not null,
  tags_behavior text[] not null default '{}',
  tags_trigger text[] not null default '{}',
  duration_mins integer,
  -- Non-diagnostic pattern flag, if the Triangulation Matrix raised one.
  pattern_flag jsonb,
  created_at timestamptz not null default now()
);

create index if not exists journal_logs_user_ts_idx
  on journal_logs (user_id, ts desc);

-- ============================================================
-- 5.3 The Briefcase Schema (Paid Tier)
-- ============================================================
create table if not exists briefcase_documents (
  doc_id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  doc_type text, -- e.g. 'iep', 'medical', 'insurance', 'agency_letter'
  storage_path text, -- Supabase Storage object for the original upload
  ai_summary_blob jsonb, -- plain-English decode of the document
  extracted_deadlines jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists state_trackers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state_code text not null,
  -- Visual, state-saving progress tracker (1–10) — a changed case manager
  -- never resets the parent's record.
  state_pipeline_stage integer not null default 1
    check (state_pipeline_stage between 1 and 10),
  upcoming_appointments jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 5.4 Library Indexing
-- (content_vector needs the pgvector extension; enable it under
--  Database → Extensions in the Supabase dashboard, then run this.)
-- ============================================================
create extension if not exists vector;

create table if not exists library_chapters (
  chapter_id integer primary key,
  title text not null,
  ordering integer not null
);

create table if not exists library_sections (
  section_id bigint generated always as identity primary key,
  chapter_id integer not null references library_chapters (chapter_id),
  section_header text,
  body text not null,
  content_vector vector(1536) -- embedding for conversational matching
);

-- ============================================================
-- 7.3 Dropship storefront hooks — dormant, unused until Phase 6+
-- ============================================================
create table if not exists products (
  product_id bigint generated always as identity primary key,
  name text,
  affiliate_url text,
  created_at timestamptz not null default now()
);

create table if not exists transaction_history (
  transaction_id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  product_id bigint references products (product_id),
  amount_cents integer,
  created_at timestamptz not null default now()
);

create table if not exists affiliate_click_routing (
  click_id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  product_id bigint references products (product_id),
  clicked_at timestamptz not null default now()
);

-- ============================================================
-- 5.5 Security & Privacy (MVP posture)
-- Supabase encrypts data at rest (AES-256) platform-wide. Row Level
-- Security ensures each family can only ever read their own records.
-- ============================================================
alter table profiles enable row level security;
alter table journal_logs enable row level security;
alter table briefcase_documents enable row level security;
alter table state_trackers enable row level security;

create policy "own profile" on profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own logs" on journal_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own documents" on briefcase_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own tracker" on state_trackers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The Library is free, forever, for everyone — read-only to clients.
alter table library_chapters enable row level security;
alter table library_sections enable row level security;

create policy "library is public" on library_chapters
  for select using (true);

create policy "library sections are public" on library_sections
  for select using (true);
