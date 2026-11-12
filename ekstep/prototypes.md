# EkStep prototypes: links and IDs (EkStep only)

The published map links are what visitors open, so they're what `scripts/audit.py --map-url` checks for "opens without a login". Lovable's `id-preview--…` links always need a login, so never share or audit those.

| Programme | Bot (Lovable project) | Map (Lovable project) | Published map |
|---|---|---|---|
| Green · Nashik | Kisaan Saathi `ed2e96e3` | `49c43ba5` | https://greendotsdiscoverymap.lovable.app |
| Pink · Tiruppur | Sakhi `b405dafa` | `fcc91ca3` | https://pinkdotstiruppur.lovable.app |
| Red · Guwahati | Sahai Line `2dcccbc9` | `3d87126c` | https://reddotsguwahati.lovable.app |
| Orange · Udupi | Orange Dots Udupi `f7284aee` (bot only) | not built yet | — |
| Golden · Patna | Sahayika `168e5c3b` | `d19b8c1c` | https://goldendotspatna.lovable.app |
| Purple · Lucknow | Divya 2.0 `3b35a5d0` | `5329af7a` | https://purpledotslucknow.lovable.app |
| White · Lucknow | Parivar Saathi `d157af22` | `2f44ffbe` | https://whitedotslucknow.lovable.app |

Every bot uses the header in `HEADER.md`.

Audit them all:
```bash
python3 scripts/audit.py <slug> --map-src <map code copy> --bot-src <bot code copy> --map-url <published map>
```
