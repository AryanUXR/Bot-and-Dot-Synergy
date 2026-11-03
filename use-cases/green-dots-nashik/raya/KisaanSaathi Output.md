# Kisaan Saathi — Output Prompt

Runs after every call. Output is always English. Sent to Raya as `output_instructions` and `output_fields`.

## output_instructions

Read the full call transcript and fill every field below. Use only what was said in the call. If a field was not discussed, write "Not discussed". Keep each value under 20 words. Write in English even when the call was in Hindi or Marathi. Copy provider names exactly as Kisaan Saathi said them.

## output_fields

| key | description |
|---|---|
| persona | Persona id the caller played: sunita-onion-farmer, ganesh-grape-farmer or rahul-tractor-mechanic |
| caller_role | Seeker or Provider |
| need_type | Labour, Repair, Rental, Storage, Mandi, Finance, Government, Listing or Other |
| village | Village or town the caller named |
| need_details | Quantity and timing the caller gave, for example "15 workers, 4 days, in 6 days" |
| providers_suggested | Names of the providers Kisaan Saathi suggested, comma separated |
| match_found | Yes if at least one suggested provider fits the need, otherwise No |
| next_step | The next step Kisaan Saathi gave the caller, in one sentence |
| call_completed | Yes if the call reached the closing line, otherwise No |
| drop_reason | If call_completed is No: why the call ended early |
| language_issue | Yes if the caller had trouble understanding Kisaan Saathi or switched language, otherwise No |
