// Offline-ish checks for link reading (no model calls): address safety, reading, and the checker.
import { makeChecker } from "../src/lib/factcheck";
import { FACTS } from "../src/generated/facts";

const mod = await import("../src/lib/links");
const { readLink } = mod;
let fail = 0;
const ok = (c: boolean, m: string) => { console.log(c ? "ok  " : "FAIL", m); if (!c) fail++; };

for (const bad of ["http://localhost:3100", "http://127.0.0.1/", "http://169.254.169.254/latest/meta-data", "http://10.0.0.1/", "file:///etc/passwd", "ftp://example.com", "http://user:pw@example.com/", "http://example.com:8080/"]) {
  const r = await readLink(bad);
  ok(!r.ok, `refuses ${bad} (${r.error})`);
}
const ex = await readLink("https://example.com/");
ok(ex.ok && /Example Domain/i.test(ex.text + ex.title), `reads example.com (${ex.via}, ${ex.text.length} chars)`);
const pm = await readLink("https://pminternship.mca.gov.in/");
ok(pm.ok && pm.via === "known", `PMIS uses the captured source (${pm.via})`);

const links = [{ text: "There are 1,234 open roles and fees rose 45% this year." }];
const check = makeChecker(FACTS, () => links);
ok(check("The site lists 1,234 open roles [Link: example.org].").issues.length === 0, "page figure with [Link] passes");
ok(check("The site lists 4,321 open roles [Link: example.org].").issues.length === 1, "figure not on the page is flagged");
ok(check("Fees rose 45% [Link: example.org].").issues.length === 0, "page percentage passes");
ok(makeChecker(FACTS)("The site lists 1,234 roles [Link: example.org].").issues.length === 1, "no page read: flagged");
ok(check("Interns get ₹9,000 a month under the PM Internship Scheme [F133].").issues.length === 0, "PMIS fact passes");
ok(check("Call the PMIS helpline on 1800 11 6090 [F137].").issues.length === 0, "helpline number passes");
console.log(fail ? `${fail} failed` : "all passed");
process.exit(fail ? 1 : 0);
