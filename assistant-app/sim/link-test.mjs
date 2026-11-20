// Runs sim/link-test.ts with "server-only" stubbed out (it throws outside Next.js).
import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";
const jiti = createJiti(import.meta.url, { alias: { "server-only": fileURLToPath(new URL("./empty.cjs", import.meta.url)) } });
await jiti.import("./link-test.ts");
