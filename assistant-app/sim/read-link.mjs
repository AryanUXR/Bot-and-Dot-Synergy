// Try the link reader on real pages: node sim/read-link.mjs <url> [url...]  (no model calls)
import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";
const jiti = createJiti(import.meta.url, { alias: { "server-only": fileURLToPath(new URL("./empty.cjs", import.meta.url)) } });
const { readLink } = await jiti.import("../src/lib/links.ts");
for (const u of process.argv.slice(2)) {
  const t = Date.now();
  const r = await readLink(u);
  console.log(`${u}\n  ok=${r.ok} via=${r.via ?? "-"} ${r.error ?? ""} ${r.text.length} chars, ${Date.now() - t} ms\n  ${JSON.stringify(r.text.slice(0, 200))}`);
}
