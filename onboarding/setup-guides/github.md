# GitHub (code storage): tested default

1. **Their own copy.** The user gets this skill from whoever shared it with them. They create a **private** repo on their own GitHub account or organisation and push the skill to it. From then on, their prompts, data and lessons live there.
2. **Credential.** On macOS, git uses the keychain. One fine-grained token that covers *all* the repos they use, with Contents read and write, avoids the repos taking turns failing with 403. A separate token per repo overwrites the last one.
3. **Verify.** Run `python3 scripts/preflight.py --only git`. It runs `git ls-remote` against their `origin` and checks they can push (a dry run).
4. **Private repos:** raw GitHub links return 404, so the agent reads the skill from the local clone (LESSONS.md, "Read the skill from the local clone").
