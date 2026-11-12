# Sahayika: changelog

## 2026-11-12 — First version
- Created agent 5d13b69c (Hindi, female voice, 5-minute limit, memory on, 12 output fields).

## 2026-11-12 — Fixes from the first bot-to-bot round
- **Bug:**
  - Kiran's "where are buyers" was answered with Requests (other people who need help) read out as a bullet list.
  - On "an agent wants ₹500" it said "be careful" and gave the cyber-fraud line instead of "don't pay" and 1100.
  - It dodged "does caste matter" instead of answering it.
  - It guessed "a few weeks".
  - It added "anything else?" after its own question.
- **Change:**
  - Own-group needs come only from Business Support and SHGs.
  - Speaking rules: no lists, one question per turn, digits in words, with a wrong/right example.
  - Worked examples for the agent-money and caste questions.
  - Rough time estimates banned.
- **Files:** Sahayika Hindi.md. Snapshot in versions/Sahayika/v1.
