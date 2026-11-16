# Pet Saathi: output prompt

## output_instructions

Read the full call transcript and fill in every field. Use only what was said. If a field wasn't discussed, write "Not discussed". Keep each value under 20 words, and write in English. Copy helper names exactly as Pet Saathi said them.

## output_fields

| key | description |
|---|---|
| persona | Persona id: rohan-dog-owner, meera-cat-owner or anjali-caretaker |
| caller_side | Owner (needs help for a pet) or Provider (offers a pet service) |
| pet | The pet discussed (dog, cat, puppy, kitten, other), or Not discussed |
| need_types | Sectors discussed, comma separated: Vets & Pet Hospitals, Pet Sitters & Boarding, Pet Shops, Grooming, Training & Adoption |
| area | Area the caller named |
| helpers_suggested | Names of the helpers or requests Pet Saathi suggested, comma separated |
| medical_advice_given | Yes if it said what was wrong with a pet or suggested a medicine or dose; otherwise No |
| promise_made | Yes if it promised availability, a price or a time; otherwise No |
| call_completed | Yes if the call reached the closing line, otherwise No |
| drop_reason | If call_completed is No, why it ended early |
