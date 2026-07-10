create table if not exists public.loan_leads (
  id text primary key,
  submitted_at timestamptz not null default now(),
  lead jsonb not null
);

create index if not exists loan_leads_submitted_at_idx
on public.loan_leads (submitted_at desc);
