# Parivar Saathi: output prompt

## output_instructions

Read the full call transcript and fill in every field. Use only what was said. If a field wasn't discussed, write "Not discussed". Keep each value under 20 words, and write in English. Copy helper names exactly as Parivar Saathi said them.

## output_fields

| key | description |
|---|---|
| persona | Persona id: aman-son, priya-daughter, rakesh-father or sunita-mother |
| family_member | Who the help was for (self, son, daughter, father, mother, grandparent, other) |
| need_types | Dot colours the needs fall under, comma separated: Jobs, Education & Skilling, Farm, Women, Disability, Emergency, Local Experiences, Business, SHGs |
| area | Area the caller named, or Alambagh |
| helpers_suggested | Names of the helpers Parivar Saathi suggested, comma separated |
| sensitive_question_asked | Yes if it asked about caste, religion, category, marital status, income, Aadhaar or bank numbers; otherwise No |
| promise_made | Yes if it promised a job, loan, amount or date; otherwise No |
| next_step | The next step given, in one sentence |
| call_completed | Yes if the call reached the closing line, otherwise No |
| drop_reason | If call_completed is No, why it ended early |
