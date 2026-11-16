# Pet Saathi: changelog

- 16 Nov 2026: created (agent a32be3aa). Tests: Rohan PASS, Meera PASS.
- 16 Nov 2026: Anjali test offered Bavdhan Mobile Vet as needing weekend help. Added: only Requests rows are people who need help; name one if only one fits. Closing line no longer assumes a pet.
- 16 Nov 2026: Anjali re-test PASS (e18f7d72). All three personas pass.
- 16 Nov 2026 (17:11 drop, call 63df5fb4): a real caller's first reply wasn't transcribed, the bot waited in silence, and the caller hung up after ~5 s of dead air. Fix: allowed_silence_before_nudge 20 → 5 s, and a prompt rule to re-ask ("आवाज़ ठीक से नहीं आई") instead of staying silent. Test 9171abbc: re-asks on garbled replies, completes normally. Snapshot: versions/PetSaathi/.
