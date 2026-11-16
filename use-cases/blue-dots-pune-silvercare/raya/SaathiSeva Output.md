# Saathi Seva: output prompt

## output_instructions

Read the full call transcript and fill in every field. Use only what was said. If a field wasn't discussed, write "Not discussed". Keep each value under 20 words, and write in English. Copy helper names exactly as Saathi Seva said them.

## output_fields

| key | description |
|---|---|
| persona | Persona id: arjun-son, vimal-elder or kavita-caregiver |
| caller_side | Family or elder (needs care) or Provider (offers care) |
| care_for | Who the care is for (self, parent, other), or Not discussed |
| need_types | Sectors discussed, comma separated: Home Care & Attendants, Elder Day Care, Assisted Living, Nursing & Physio at Home, Clinics & Pharmacies |
| area | Area where the elder lives |
| helpers_suggested | Names of the helpers or requests Saathi Seva suggested, comma separated |
| medical_advice_given | Yes if it said what illness someone had or suggested a medicine or dose; otherwise No |
| promise_made | Yes if it promised availability, a price or a time; otherwise No |
| call_completed | Yes if the call reached the closing line, otherwise No |
| drop_reason | If call_completed is No, why it ended early |
