# Bot Prompt 5 — Supabase Call Log Migration

Send after Section 4 builds successfully. Optional — only if you want to log calls.

---

```
## Section 5: Add a Supabase migration for the call log table

Create a new migration file in supabase/migrations/ with the following SQL:

create table if not exists [botname]_calls (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  persona_id text not null,
  phone_country_code text,
  raya_status integer,
  raya_correlation_id text,
  success boolean default false
);

alter table [botname]_calls enable row level security;

create policy "Service role only"
  on [botname]_calls
  for all
  to service_role
  using (true)
  with check (true);
```

Replace [botname] with the lowercase slug of your bot (e.g. siza, saarthi, karigar).
