# Supabase — RLS, Migrations, and Realtime Patterns

## RLS — the rule that must never be broken

Provider/dot tables must allow `anon` reads. The dot map uses the anon key. Setting a table to `authenticated` only breaks the map for all visitors.

```sql
-- Correct RLS for any dot table
alter table [dots_table] enable row level security;

create policy "Public read"
  on [dots_table] for select
  to anon, authenticated
  using (true);

create policy "Service role write"
  on [dots_table] for all
  to service_role
  using (true) with check (true);
```

Never: `to authenticated using (true)` — this looks right but breaks anon reads.

## RLS audit query

Run after every migration to verify policies:

```sql
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where tablename in ('[dots_table]', 'connections', 'sheet_configs')
order by tablename, cmd;
```

Verify:
- `[dots_table]` SELECT: roles contains both `anon` and `authenticated`
- `[dots_table]` INSERT/UPDATE/DELETE: service_role only

## Standard dot table

```sql
create table [dots_table] (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  area text,
  lat float8 not null default 0,
  lng float8 not null default 0,
  sector text,
  org_type text,
  offers jsonb,            -- stored as JSON array of strings
  address text,
  contact text,
  description text,
  verified text default 'Unverified'
  -- add domain-specific columns below this line
);
```

## Standard call log table (bot)

```sql
create table [botname]_calls (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  persona_id text not null,
  phone_country_code text,
  raya_status integer,
  raya_correlation_id text,
  success boolean default false
);

alter table [botname]_calls enable row level security;
create policy "Service role only" on [botname]_calls
  for all to service_role using (true) with check (true);
```

## Realtime subscription (dot frontend)

```typescript
const channel = supabase
  .channel("dots_live")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "[dots_table]",
  }, () => { loadDots(); })
  .subscribe();

return () => { supabase.removeChannel(channel); };
```

## Offers field — JSON array

The `offers` column stores a JSON array of strings. When reading in the frontend:

```typescript
offers: row.offers ? (Array.isArray(row.offers) ? row.offers : JSON.parse(row.offers)) : [],
```

## Seeding initial data

After creating the table, seed it:
1. Export the static TypeScript data as CSV (or write a migration with INSERT statements)
2. Use Supabase Table Editor to import the CSV, or run the migration
3. Verify rows appear in the Supabase table viewer before switching the frontend to Supabase reads
