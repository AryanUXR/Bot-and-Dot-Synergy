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

## User guide (Google Doc)

[Bot-and-Dot Synergy: user guide](https://docs.google.com/document/d/1kzllQxQm6kvReyakTGQqQHSLCDU4FXiRpuMfG0wRu7o/edit), file id `1kzllQxQm6kvReyakTGQqQHSLCDU4FXiRpuMfG0wRu7o`, owned by Aryan.

- It has the same content as `GUIDE.md`. When one changes, update the other the same day.
- Shared with the service account `blue-dots-admin@blue-dots-project.iam.gserviceaccount.com` as Editor (15 Nov 2026).
- Edit it with `python3 scripts/gdocs.py get <id> --out doc.json`, then `python3 scripts/gdocs.py batch <id> requests.json`. Each batch is guarded by the doc's current revision.
- Formatting set 15 Nov 2026:
  - body paragraphs 6 pt above and below, line spacing 1.15;
  - H2 headings 22 pt above, H3 headings 14 pt above, all kept with the next paragraph;
  - table columns sized to their content, and table rows never split across pages;
  - section 4 starts on a new page, so its table header never sits alone.
- Re-check the layout after big content changes.
