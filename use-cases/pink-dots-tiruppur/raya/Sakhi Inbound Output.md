# Sakhi Inbound — Output Prompt

Runs after every call. Output is always English. Sent to Raya as `output_instructions` and `output_fields`.

## output_instructions

Read the full call transcript and fill every field below. Use only what was said in the call. If a field was not discussed, write "Not discussed". Keep each value under 20 words. Write in English even when the call was in Hindi. Copy provider names exactly as Sakhi said them.

## output_fields

| key | description |
|---|---|
| story | Which demo story the call matched: new-arrival (hostel or job near Mudalipalayam), working-mother (child care near Anupparpalayam), daycare-provider (home day-care in 15 Velampalayam), or None |
| caller_role | Seeker or Provider |
| need_type | Hostel, Child care, Job, Hostel + Child care, Listing or Other |
| area | Area or workplace the caller named |
| need_details | Budget, shift timings, child's age or other details the caller gave |
| providers_suggested | Names of the providers or requests Sakhi suggested, comma separated |
| unverified_flagged | Yes if Sakhi said a suggested hostel or day-care was not checked, No if it suggested one without saying so, NA if none suggested |
| safety_concern | Yes if the caller raised being unsafe, held in a hostel, harassed or unpaid, otherwise No |
| helpline_given | Yes if Sakhi gave 181, the One Stop Centre or 1098, otherwise No |
| next_step | The next step Sakhi gave the caller, in one sentence |
| call_completed | Yes if the call reached the closing line, otherwise No |
| drop_reason | If call_completed is No: why the call ended early |
