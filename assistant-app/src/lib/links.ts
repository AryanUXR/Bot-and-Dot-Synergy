import "server-only";
import crypto from "node:crypto";
import dns from "node:dns/promises";
import net from "node:net";

// Reading a web page someone shares in the chat.
// 1. Only public http(s) addresses: localhost, private and cloud-metadata addresses are refused,
//    checked again on every redirect.
// 2. A plain fetch first. If the page is a script-heavy app with almost no text, a page-rendering
//    service (Jina Reader) renders it; that service sees the address, never anything else.
// 3. The text is cut to about 12,000 characters and handed to the model as untrusted content.
// Some government sites (like the PM Internship portal) only answer Indian addresses, so the
// fetch runs in the Mumbai region (app/api/link/route.ts).

export interface LinkResult { ok: boolean; url: string; domain: string; title?: string; text: string; via?: "direct" | "rendered" | "known"; error?: string }

const MAX_CHARS = 12000;
const THIN = 800;
const TIMEOUT = 15000;

// Sites the assistant already has a captured, checked source for.
const KNOWN: Record<string, string> = {
  "pminternship.mca.gov.in":
    "This is the official PM Internship Scheme portal. It is a script-heavy app, so its pages carry little readable text, but you already have its content: the PMIS source (portal home, Candidate FAQ, Company FAQ and State FAQ, captured 20 Nov 2026) in section 9 of your knowledge and facts F130 to F137. Answer from those and cite [PMIS: ...] markers or the fact ids. Say that live listings change daily and are best checked on the portal itself.",
};

export function linkKey(): string {
  return crypto.createHash("sha256").update(`bd-link:${process.env.AUTH_SECRET ?? process.env.KV_SECRET ?? "local-dev-only"}`).digest("hex").slice(0, 32);
}

function privateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const v = ip.toLowerCase();
  if (v.startsWith("::ffff:")) return privateIp(v.slice(7));
  return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80");
}

async function safeUrl(raw: string): Promise<URL> {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { throw new Error("That doesn't look like a web address."); }
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("Only http and https links can be read.");
  if (u.username || u.password) throw new Error("Links with a username or password can't be read.");
  if (u.port && !["80", "443"].includes(u.port)) throw new Error("Only standard web ports can be read.");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(host)) throw new Error("Local addresses can't be read.");
  const ips = net.isIP(host) ? [host] : (await dns.lookup(host, { all: true })).map((r) => r.address);
  if (!ips.length || ips.some(privateIp)) throw new Error("That address isn't on the public web.");
  return u;
}

async function fetchPublic(raw: string): Promise<{ url: URL; body: string; type: string }> {
  let url = await safeUrl(raw);
  for (let hop = 0; hop < 4; hop++) {
    const r = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT),
      headers: { "user-agent": "Mozilla/5.0 (compatible; BlueDotsAssistant/1.0)", accept: "text/html,text/plain,application/xhtml+xml;q=0.9,*/*;q=0.5" },
    });
    if (r.status >= 300 && r.status < 400 && r.headers.get("location")) {
      url = await safeUrl(new URL(r.headers.get("location")!, url).toString());
      continue;
    }
    if (!r.ok) throw new Error(`The site answered with an error (${r.status}).`);
    const type = r.headers.get("content-type") ?? "";
    if (!/text\/|html|xml|json/i.test(type)) throw new Error("That link isn't a web page (it may be a file or image).");
    const buf = await r.arrayBuffer();
    return { url, body: new TextDecoder().decode(buf.slice(0, 2_000_000)), type };
  }
  throw new Error("Too many redirects.");
}

const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—", hellip: "…", rupee: "₹" };
function decode(s: string) {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") { const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1)); return Number.isFinite(n) ? String.fromCodePoint(n) : m; }
    return ENT[e.toLowerCase()] ?? m;
  });
}

export function htmlToText(html: string): { title?: string; text: string } {
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim() || undefined;
  // Prefer the page's main content when it marks one.
  const main = html.match(/<main\b[\s\S]*<\/main>/i)?.[0] ?? html.match(/<article\b[\s\S]*<\/article>/i)?.[0];
  const t = (main && main.replace(/<[^>]+>/g, "").trim().length > 400 ? main : html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|template|iframe|canvas)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(head)\b[\s\S]*?<\/head>/i, " ")
    .replace(/<\/?(p|div|section|article|header|footer|main|nav|aside|li|ul|ol|tr|table|h[1-6]|br|hr|dd|dt|blockquote|figcaption|form|label|button)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  const lines = decode(t).replace(/[ \t\f\v\r]+/g, " ").split("\n").map((l) => l.trim()).filter((l) => l.length > 2 || /\d/.test(l));
  const text = lines.filter((l, i) => l !== lines[i - 1]).join("\n");
  return { title, text };
}

async function rendered(url: string): Promise<string> {
  const r = await fetch(`https://r.jina.ai/${url}`, { signal: AbortSignal.timeout(25000), headers: { accept: "text/plain", "x-return-format": "markdown" } });
  if (!r.ok) throw new Error(`rendering service ${r.status}`);
  const t = await r.text();
  if (/^Warning: Target URL returned error/m.test(t)) throw new Error("rendered page was an error");
  return t.replace(/^Title:.*\n|^URL Source:.*\n|^Markdown Content:\s*\n/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\((?:[^()]|\([^)]*\))*\)/g, "$1") // links: keep the words
    .split("\n").map((l) => l.trimEnd()).filter((l, i, a) => l.replace(/[\s|*#-]/g, "") || (a[i - 1] ?? "").trim()).join("\n").trim();
}

export async function readLink(raw: string): Promise<LinkResult> {
  let domain = "";
  try {
    const first = await safeUrl(raw);
    domain = first.hostname.replace(/^www\./, "");
    let title: string | undefined, text = "", via: LinkResult["via"] = "direct", finalUrl = first.toString();
    try {
      const page = await fetchPublic(first.toString());
      finalUrl = page.url.toString();
      if (/html|xml/i.test(page.type)) ({ title, text } = htmlToText(page.body));
      else text = page.body;
    } catch (e) {
      if (!KNOWN[domain]) throw e;
    }
    if (text.length < THIN && !KNOWN[domain]) {
      try { const r = await rendered(finalUrl); if (r.length > text.length) { text = r; via = "rendered"; } } catch (e) { console.warn("[link] render failed", e instanceof Error ? e.message : e); }
    }
    if (KNOWN[domain] && text.length < THIN * 4) return { ok: true, url: finalUrl, domain, title, text: KNOWN[domain], via: "known" };
    if (text.length < 80) return { ok: false, url: finalUrl, domain, title, text: "", error: "The page has almost no readable text (it may need a sign-in or block automated reading)." };
    if (text.length > MAX_CHARS) text = text.slice(0, MAX_CHARS) + "\n[…page cut here]";
    return { ok: true, url: finalUrl, domain, title, text, via };
  } catch (e) {
    return { ok: false, url: raw, domain, text: "", error: e instanceof Error ? e.message : "The page couldn't be read." };
  }
}
