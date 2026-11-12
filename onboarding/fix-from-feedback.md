# Fixing a live bot from feedback

For "the team says it ends abruptly"-style reports. The full worked example is LESSONS.md 45–47.

1. **Pull the real calls first.** List recent calls for the agent through the voice platform's API. On Raya, `GET /api/call?agent_id=...` returns them, and the transcript is in `call_transcript`. Read the ones the feedback is about: durations, how each one ended, and the last few turns.
2. **Name the cause from the transcripts,** not from the feedback wording. Separate prompt problems (the bot said Goodbye early) from line problems (the call dropped with no goodbye, voicemail, silence).
3. **Check live against the repo.** Fetch the live prompt and compare it with the local file. If they differ, find out who changed what before you edit.
4. **Snapshot, then fix.** Copy the current prompt into `versions/<bot>/<label>/`. Fix the rule *and* add a worked example; bots copy examples more than they follow rules.
5. **Replay testers.** Write tester personas that do what the real callers did: several follow-up questions, out-of-scope requests. Run those and the original personas as a regression check.
6. **Record.** Add an entry to the bot's CHANGELOG, a lesson if the cause was new, and put your tester's own persona back.
