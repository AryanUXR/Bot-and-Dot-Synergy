# Bot Prototype — Environment Variables Checklist

Set all vars in: Supabase project → Settings → Edge Functions → Secrets.

## Every bot (required)

```
RAYA_API_KEY           = [team Raya API key — remixes keep it; local copy in raya/.env as RAYA_API_TOKEN]
RAYA_AGENT_ID_[BOTNAME] = [uuid from POST /api/agent — optional, the edge function falls back to the uuid in code]

VITE_SUPABASE_URL      = [Supabase project URL]
VITE_SUPABASE_ANON_KEY = [Supabase anon/public key]
```

BOTNAME = uppercase slug of your bot e.g. SIZA, SAARTHI, KARIGAR, SAFAR.

## Multi-language bots

Replace the single `RAYA_AGENT_ID_[BOTNAME]` with:

```
RAYA_AGENT_ID_[BOTNAME]_HINDI     = [Hindi agent ID]
RAYA_AGENT_ID_[BOTNAME]_KANNADA   = [Kannada agent ID]
RAYA_AGENT_ID_[BOTNAME]_ENGLISH   = [English agent ID]
```

Add only the languages your bot supports.

## VITE_ vars

VITE_ prefixed vars are used by the Lovable frontend (Vite). Set these in Lovable's project settings → Environment Variables in addition to Supabase secrets.

Non-VITE_ vars (like RAYA_API_KEY and RAYA_AGENT_ID) are only used by Supabase edge functions and go only in Supabase secrets — never expose them to the frontend.
