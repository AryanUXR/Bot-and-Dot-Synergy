# EkStep prototypes: links and IDs (EkStep only)

The published map links are what visitors open, so they're what `scripts/audit.py --map-url` checks for "opens without a login". Lovable's `id-preview--…` links always need a login, so never share or audit those.

| Programme | Bot (Lovable project) | Published bot | Map (Lovable project) | Published map |
|---|---|---|---|---|
| Green · Nashik | Kisaan Saathi `ed2e96e3` | https://nashik-kisaan-saathi.lovable.app | `49c43ba5` | https://greendotsdiscoverymap.lovable.app |
| Pink · Tiruppur | Sakhi `b405dafa` | https://sakhi-pink-dots-voice.lovable.app | `fcc91ca3` | https://pinkdotstiruppur.lovable.app |
| Red · Guwahati | Sahai Line `2dcccbc9` | https://sahailine-assam.bluedotseconomy.org | `3d87126c` | https://reddotsguwahati.lovable.app |
| Orange · Udupi | Orange Dots Udupi `f7284aee` (bot only) | https://orange-dots-call-me.lovable.app | not built yet | — |
| Golden · Patna | Sahayika `168e5c3b` | https://patna-sahayika-saathi.lovable.app | `d19b8c1c` | https://goldendotspatna.lovable.app |
| Purple · Lucknow | Divya 2.0 `3b35a5d0` | https://divya-purpledots.bluedotseconomy.org | `5329af7a` | https://purpledotslucknow.lovable.app |
| White · Lucknow | Parivar Saathi `d157af22` | https://parivar-opportunity-saathi.lovable.app | `2f44ffbe` | https://whitedotslucknow.lovable.app |

Every bot uses the header in `HEADER.md`.

Audit them all:
```bash
python3 scripts/audit.py <slug> --map-src <map code copy> --bot-src <bot code copy> --map-url <published map>
```

The Purple and Red bots also answer on `divyavoiceconnect.lovable.app` and `sahailineassam.lovable.app`, which redirect to the custom domains above. Republished 12 Nov after the UI consistency and four-checks fixes.
