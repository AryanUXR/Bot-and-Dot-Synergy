# Dot Prompt 6 — Supabase Sync (Optional)

Only needed if:
a) You want the dot map to read live data from Supabase (not the static TS file), OR
b) You want the bot calls to write new dots to the map in realtime

Read `shared/async-sync-architecture.md` first.

```
## Section 6: Switch dot data source from static file to Supabase

In src/pages/LaunchPage.tsx:

1. Add supabase client import:
import { supabase } from "@/integrations/supabase/client";

2. Replace the static LADAKH_DOTS import with a useEffect that fetches from Supabase:

const [dots, setDots] = useState<[Name]Dot[]>([]);

useEffect(() => {
  const load = async () => {
    const { data } = await supabase
      .from("[dots_table_name]")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDots(data.map(row => ({
      id: row.id,
      type: "provider",
      name: row.name,
      area: row.area,
      lat: row.lat,
      lng: row.lng,
      sector: row.sector,
      org_type: row.org_type,
      offers: row.offers ? JSON.parse(row.offers) : [],
      address: row.address,
      contact: row.contact,
      description: row.description,
    })));
  };

  load();

  // Realtime subscription
  const channel = supabase
    .channel("dots_live")
    .on("postgres_changes", { event: "*", schema: "public", table: "[dots_table_name]" }, load)
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, []);

3. In VITE_ environment variables, add the shared Supabase project's URL and anon key.
```

## After this prompt: seed the Supabase table

Export the static dot data from the TS file as a CSV and upload via Supabase's Table Editor (or use a migration with INSERT statements).
