// Local server: serves public/ and POST /api/call with the same handler the hosts use.
// Run: node dev-server.mjs   then open http://localhost:5173
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleCall } from "./api/_lib/call.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const env = { ...process.env };
const envFile = path.join(root, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*([^#]*)/);
    if (m && m[2].trim()) env[m[1]] = m[2].trim();
  }
}
const types = { ".html": "text/html", ".json": "application/json", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const port = Number(process.env.PORT || 5173);

http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/call")) {
    const chunks = []; for await (const c of req) chunks.push(c);
    const request = new Request(`http://localhost${req.url}`, { method: req.method, headers: req.headers, body: req.method === "POST" ? Buffer.concat(chunks) : undefined });
    const response = await handleCall(request, env);
    res.writeHead(response.status, { "Content-Type": "application/json" });
    return res.end(await response.text());
  }
  const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
  const file = path.join(root, "public", path.normalize(rel));
  if (!file.startsWith(path.join(root, "public")) || !fs.existsSync(file)) { res.writeHead(404); return res.end("Not found"); }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Dots starter on http://localhost:${port}  (voice: ${env.VOICE_PLATFORM || "raya"})`));
