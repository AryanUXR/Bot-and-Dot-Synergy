# Async Bot-Dot Data Sync Architecture

The bot and dot are separate Lovable projects but share a single Supabase project. Data flows one way: the bot call writes to Supabase, the dot map reads from those same tables in realtime.

## Why this matters

The dot map is not manually curated. Over time, real callers who go through the bot become real dots on the map — their data surfaces as discoverable providers or seekers for future visitors. The prototypes demonstrate this loop even when seeded with initial data.

## Architecture diagram

```
Visitor (Bot)                        Visitor (Dot)
     |                                    |
     | picks persona, enters phone        | opens map (no login)
     |                                    |
     v                                    v
[Lovable Bot Frontend]           [Lovable Dot Frontend]
     |                                    |
     | POST /initiate-call                | SELECT * from dots table
     v                                    |   (realtime subscription)
[Supabase Edge Function]                  |
     |                                    |
     | calls Raya API                     |
     v                                    |
[Raya Voice AI]  ←─── call ──→  [Phone]  |
     |                                    |
     | tool call: write_caller_data       |
     v                                    |
[Supabase DB] ──────────────────────────→|
  (shared between both projects)
```

## Setting it up

Both Lovable projects must point to the **same Supabase project**.

In each Lovable project's environment variables:
```
VITE_SUPABASE_URL = [same URL for both]
VITE_SUPABASE_ANON_KEY = [same anon key for both]
```

The dot frontend uses the anon key for reads. The Raya tool calls use the service role key (set in the Raya agent config or edge function secrets) for writes.

## Table design

The dot map reads from whatever table the Raya tool call writes to. Name the table consistently:

| Use case | Table name |
|----------|-----------|
| Job seekers | `seeker_dots` |
| MSMEs / businesses | `msme_dots` or `provider_dots` |
| Service providers | `provider_dots` |
| Artisans | `artisan_dots` |

Minimum columns for any dot table:
```sql
id uuid primary key default gen_random_uuid(),
created_at timestamptz default now(),
name text not null,
area text,
lat float8 not null default 0,
lng float8 not null default 0,
contact text,
description text,
sector text,         -- matches filter categories in dot prototype
verified text default 'Unverified'
```

Add domain-specific columns per use case (e.g. `skills`, `experience_years`, `business_type`).

## RLS — critical

The dot map uses the anon key. Provider/dot tables MUST allow anon reads:

```sql
alter table [dots_table] enable row level security;
create policy "Public read" on [dots_table]
  for select to anon, authenticated using (true);
create policy "Service role write" on [dots_table]
  for all to service_role using (true) with check (true);
```

Setting `to authenticated` only will break the dot map for all users — dots will not load.

## Realtime subscription (dot frontend)

```typescript
const channel = supabase
  .channel("dots_realtime")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "[dots_table]",
  }, () => { loadDots(); })
  .subscribe();

return () => { supabase.removeChannel(channel); };
```

## Seeding initial data

Before any real callers exist, seed the table with research-verified real organisations and mock expert personas. See `dot/dot-schema.md` for the seeding guide.

The bot prototype can be live (taking calls) while the dot is seeded with initial data. As calls happen, the Raya tool call adds rows to the table. New rows appear on the map without any manual action.

## Raya tool call — write_caller_data

In the Raya system prompt, define a tool that fires at the end of a successful call:

```
Tool: write_caller_data
Description: Saves the caller's information to the database after the conversation.
Parameters:
  - name: string — caller's name as given during the call
  - area: string — caller's neighbourhood or area
  - sector: string — the sector they operate in, from the allowed list
  - contact: string — caller's phone number (passed automatically from call metadata)
  - description: string — one sentence summary of their situation
  - lat: number — 0.0 (will be geocoded later by admin)
  - lng: number — 0.0
```

The tool call should POST to a Supabase edge function `save-caller` which inserts the row using the service role key.
