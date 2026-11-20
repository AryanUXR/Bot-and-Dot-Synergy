// Streams replies through ReplyGate in small chunks, with a fake model, to check what people would see.
// Run: npx jiti sim/guard-test.ts
import { ReplyGate } from "../src/lib/guard";

type Fake = { messages: { create: (args: unknown) => Promise<unknown> } };
const failing: Fake = { messages: { create: async () => { throw new Error("usage limit (fake)"); } } };
const fixing: Fake = { messages: { create: async () => ({ content: [{ type: "text", text: "In Hubli-Dharwad, applications rose 300% once the district promoted the voice number [F23]. Would you like more?" }] }) } };

async function run(name: string, reply: string, client: Fake, expect: (shown: string) => boolean) {
  let shown = "";
  const g = new ReplyGate((t) => { shown += t; }, client as never, "test");
  for (let i = 0; i < reply.length; i += 7) g.push(reply.slice(i, i + 7));
  const r = await g.end();
  const ok = expect(shown);
  console.log(`${ok ? "✓" : "✗"} ${name}${r.corrected ? " (corrected)" : ""}\n    shown: ${JSON.stringify(shown)}`);
  return ok;
}

const results = await Promise.all([
  run("Clean reply streams with readable markers",
    "In Ghaziabad, national portals listed 97 local jobs [F1]. Over 70% of applications went to jobs within 5 km [F3]. Want more?",
    failing, (s) => s.includes("[KD p.7]") && s.includes("[KD p.7; GZ slide 9]") && !s.includes("F1")),
  run("Wrong place, correction fails: the bad sentence is dropped",
    "In Ghaziabad, national portals listed 97 local jobs [F1]. In Ghaziabad, applications rose 300% once the district promoted the number [F23]. Would you like more?",
    failing, (s) => s.includes("97") && !s.includes("300%") && s.includes("Would you like more?")),
  run("Wrong place, correction works: the fixed sentence is shown",
    "In Ghaziabad, applications rose 300% once the district promoted the number [F23]. Would you like more?",
    fixing, (s) => s.includes("Hubli-Dharwad") && !s.includes("Ghaziabad")),
  run("Voice rules fixed in place",
    "Schools can be trusted collection points — and NGOs too. Shall I go on?",
    failing, (s) => s === "Schools can be credible collection points, and NGOs too. Shall I go on?"),
]);
console.log(results.every(Boolean) ? "\nall passing" : "\nsome failing");
