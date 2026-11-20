import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import { config } from "@/lib/env";
import { session } from "@/lib/session";
import { getProject, saveProject, bump, count, addDailyUsage } from "@/lib/store";
import { ReplyGate } from "@/lib/guard";
import type { Usage } from "@/lib/types";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { TOOLS, TOOL_ASSET, runTool } from "@/lib/tools";
import type { Project, StreamEvent, UiMessage, UiPart } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

type BMsg = Anthropic.Beta.Messages.BetaMessageParam;

// Keep only what the API accepts back. Response-only fields (e.g. tool_use.caller) must not be resent,
// and consecutive user turns (a tool result followed by a new message) are merged into one.
function cleanBlock(b: Record<string, unknown>) {
  switch (b.type) {
    case "thinking": return { type: "thinking", thinking: b.thinking, signature: b.signature };
    case "redacted_thinking": return { type: "redacted_thinking", data: b.data };
    case "text": return { type: "text", text: b.text };
    case "tool_use": return { type: "tool_use", id: b.id, name: b.name, input: b.input };
    default: { const { caller: _c, ...rest } = b; return rest; }
  }
}
function forApi(t: BMsg[]): BMsg[] {
  const out: BMsg[] = [];
  for (const m of t) {
    const content = Array.isArray(m.content)
      ? (m.role === "assistant" ? (m.content as unknown as Record<string, unknown>[]).map(cleanBlock) : m.content)
      : m.content;
    const prev = out[out.length - 1];
    if (prev && prev.role === "user" && m.role === "user") {
      const asArr = (c: BMsg["content"]) => (typeof c === "string" ? [{ type: "text" as const, text: c }] : c);
      prev.content = [...(asArr(prev.content) as unknown[]), ...(asArr(content as BMsg["content"]) as unknown[])] as unknown as Exclude<BMsg["content"], undefined>;
    } else out.push({ role: m.role, content } as BMsg);
  }
  return out;
}

// List prices for Claude Opus 5.5, US$ per million tokens (1-hour cache writes at 2x input).
const PRICE = { input: 4, output: 20, cache_read: 0.2, cache_write: 8 };
const DAILY_LIMIT = Number(process.env.ASSISTANT_DAILY_MESSAGES ?? 60);

function usageOf(u: Anthropic.Beta.Messages.BetaUsage): Usage {
  const input = u.input_tokens ?? 0, cache_read = u.cache_read_input_tokens ?? 0, cache_write = u.cache_creation_input_tokens ?? 0, output = u.output_tokens ?? 0;
  const usd = (input * PRICE.input + cache_read * PRICE.cache_read + cache_write * PRICE.cache_write + output * PRICE.output) / 1e6;
  return { calls: 1, input, cache_read, cache_write, output, usd };
}
function addUsage(a: Usage | undefined, b: Usage): Usage {
  const z = a ?? { calls: 0, input: 0, cache_read: 0, cache_write: 0, output: 0, usd: 0 };
  return { calls: z.calls + b.calls, input: z.input + b.input, cache_read: z.cache_read + b.cache_read, cache_write: z.cache_write + b.cache_write, output: z.output + b.output, usd: Math.round((z.usd + b.usd) * 10000) / 10000 };
}

function titleFrom(text: string) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= 42 ? t : t.slice(0, 40).replace(/\s\S*$/, "") + "…";
}

export async function POST(req: Request) {
  const s = await session();
  if (!s.ok || !s.workspace) return Response.json({ error: "Enter the access code first." }, { status: 401 });
  if (!config.anthropicKey) return Response.json({ error: "The assistant's API key isn't set up yet." }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { projectId?: string; message?: string };
  const text = (body.message ?? "").trim();
  if (!text) return Response.json({ error: "Write a message first." }, { status: 400 });
  if (text.length > 20000) return Response.json({ error: "That message is too long. Shorten it and try again." }, { status: 400 });

  // A daily cap per person, so one session can't use up the budget.
  const day = new Date().toISOString().slice(0, 10);
  if (DAILY_LIMIT > 0 && (await count(`msgs:${s.workspace}:${day}`)) >= DAILY_LIMIT) {
    return Response.json({ error: `You've reached today's limit of ${DAILY_LIMIT} messages. It resets at midnight UTC. Ask the EkStep team if you need more.` }, { status: 429 });
  }
  await bump(`msgs:${s.workspace}:${day}`);

  let project: Project | null = body.projectId ? await getProject(body.projectId) : null;
  if (project && project.workspace !== s.workspace) return Response.json({ error: "Not found." }, { status: 404 });
  if (!project) {
    project = {
      id: body.projectId && /^[\w-]{6,40}$/.test(body.projectId) ? body.projectId : nanoid(12),
      workspace: s.workspace, owner_name: s.name ?? undefined, title: titleFrom(text), created_at: Date.now(), updated_at: Date.now(),
      ui: [], transcript: [], assets: {},
    };
  }
  const p = project;
  if (s.name && !p.owner_name) p.owner_name = s.name;
  // Simulation runs (local only): build everything except the real voice agent.
  const simulate = process.env.NODE_ENV !== "production" && req.headers.get("x-bd-sim") === "1";
  const userMsg: UiMessage = { id: nanoid(10), role: "user", parts: [{ type: "text", text }], at: Date.now() };
  p.ui.push(userMsg);
  // If the reply checker corrected the last reply, tell the model what the person actually saw.
  const note = p.note ? `(Note for you, not from the person: before your last reply was shown, the checker corrected it: ${p.note} Use the facts table rows and places exactly.)\n\n` : "";
  p.note = undefined;
  (p.transcript as BMsg[]).push({ role: "user", content: note + text });

  const client = new Anthropic({ apiKey: config.anthropicKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const emit = (e: StreamEvent) => {
        if (closed) return;
        try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(e)}\n\n`)); } catch { closed = true; }
      };
      const assistant: UiMessage = { id: nanoid(10), role: "assistant", parts: [], at: Date.now() };
      p.ui.push(assistant);
      const parts = assistant.parts;
      const lastText = (): Extract<UiPart, { type: "text" }> => {
        const last = parts[parts.length - 1];
        if (last?.type === "text") return last;
        const t = { type: "text" as const, text: "" };
        parts.push(t);
        return t;
      };
      const gate = new ReplyGate((t) => { lastText().text += t; emit({ type: "text", delta: t }); }, client, config.model);
      const corrections: string[] = [];
      emit({ type: "start", message_id: assistant.id });
      emit({ type: "title", title: p.title });

      try {
        for (let turn = 0; turn < 12; turn++) {
          const ms = client.beta.messages.stream({
            model: config.model,
            max_tokens: 64000,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            thinking: { type: "adaptive", display: "summarized" },
            output_config: { effort: "medium" },
            system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral", ttl: "1h" } }],
            cache_control: { type: "ephemeral" },
            tools: TOOLS,
            messages: forApi(p.transcript as BMsg[]),
          });

          let thinkStart = 0;
          let thinkPart: Extract<UiPart, { type: "thinking" }> | null = null;
          for await (const ev of ms) {
            if (ev.type === "content_block_start") {
              const b = ev.content_block;
              if (b.type === "thinking") {
                thinkStart = Date.now();
                thinkPart = { type: "thinking", text: "" };
                parts.push(thinkPart);
              } else if (b.type === "tool_use") {
                parts.push({ type: "tool", id: b.id, name: b.name, status: "running", asset: TOOL_ASSET[b.name] });
                emit({ type: "tool_start", id: b.id, name: b.name });
              }
            } else if (ev.type === "content_block_delta") {
              if (ev.delta.type === "thinking_delta") {
                if (thinkPart) thinkPart.text += ev.delta.thinking;
                emit({ type: "thinking", delta: ev.delta.thinking });
              } else if (ev.delta.type === "text_delta") {
                gate.push(ev.delta.text);
              }
            } else if (ev.type === "content_block_stop" && !thinkPart) {
              const r = await gate.end();
              if (r.corrected) corrections.push(...r.issues.map((i) => i.detail));
            } else if (ev.type === "content_block_stop" && thinkPart) {
              const seconds = Math.max(1, Math.round((Date.now() - thinkStart) / 1000));
              thinkPart.seconds = seconds;
              emit({ type: "thinking_done", seconds });
              thinkPart = null;
            }
          }

          const msg = await ms.finalMessage();
          {
            const r = await gate.end();
            if (r.corrected) corrections.push(...r.issues.map((i) => i.detail));
          }
          const u = usageOf(msg.usage);
          p.usage = addUsage(p.usage, u);
          addDailyUsage(u).catch((e) => console.error("[usage]", e));
          console.log(`[usage] ${p.id} turn ${turn}: in ${u.input} cache_read ${u.cache_read} cache_write ${u.cache_write} out ${u.output} $${u.usd.toFixed(4)}`);
          (p.transcript as BMsg[]).push({ role: "assistant", content: (msg.content as unknown as Record<string, unknown>[]).map(cleanBlock) as unknown as Exclude<BMsg["content"], undefined> });

          if (msg.stop_reason === "refusal") {
            const t = lastText();
            const add = (t.text ? "\n\n" : "") + "I can't help with that one. Try asking about Blue Dots, or describe the place and people you have in mind.";
            t.text += add;
            emit({ type: "text", delta: add });
            break;
          }
          if (msg.stop_reason === "pause_turn") continue;
          const uses = msg.content.filter((b): b is Anthropic.Beta.Messages.BetaToolUseBlock => b.type === "tool_use");
          if (msg.stop_reason !== "tool_use" || uses.length === 0) break;
          if (msg.stop_reason === "tool_use" && uses.length === 0) break;

          const results: Anthropic.Beta.Messages.BetaToolResultBlockParam[] = [];
          for (const u of uses) {
            const r = await runTool(u.name, u.input, p, emit, { simulate });
            const part = parts.find((x): x is Extract<UiPart, { type: "tool" }> => x.type === "tool" && x.id === u.id);
            if (part) { part.status = r.ok ? "done" : "error"; part.summary = r.summary; }
            emit({ type: "tool_done", id: u.id, name: u.name, status: r.ok ? "done" : "error", summary: r.summary, asset: TOOL_ASSET[u.name] });
            results.push({ type: "tool_result", tool_use_id: u.id, content: r.result, is_error: !r.ok });
          }
          (p.transcript as BMsg[]).push({ role: "user", content: results });
          await saveProject(p);
        }
      } catch (e) {
        console.error("[chat]", e);
        const limit = e instanceof Anthropic.APIError && /usage limit/i.test(String(e.message));
        const msg = limit
          ? "The assistant has reached its usage limit for now, so it can't reply. This isn't something you did. Please let the EkStep team know, and try again later."
          : e instanceof Anthropic.RateLimitError
          ? "I'm getting a lot of requests right now. Give it a few seconds and send that again."
          : e instanceof Anthropic.APIError
            ? "I couldn't reach the model just now. Send your message again."
            : "Something went wrong on my side. Send your message again.";
        emit({ type: "error", message: msg });
        // Keep the reason in the chat, so a reload doesn't show an empty reply.
        if (!parts.some((x) => x.type === "text" && x.text.trim())) parts.push({ type: "text", text: `*${msg}*` });
        // Keep the transcript valid: drop a dangling tool_use turn with no results.
        const t = p.transcript as BMsg[];
        const last = t[t.length - 1];
        if (last?.role === "assistant" && Array.isArray(last.content) && last.content.some((b) => (b as { type: string }).type === "tool_use")) t.pop();
      } finally {
        if (corrections.length) {
          p.note = [...new Set(corrections)].slice(0, 6).join("; ") + ".";
          console.warn(`[guard] ${p.id}: corrected ${corrections.length} problem(s)`);
        }
        assistant.parts = parts.filter((x) => !(x.type === "text" && !x.text.trim()));
        await saveProject(p).catch((e) => console.error("[save]", e));
        emit({ type: "done" });
        closed = true;
        try { controller.close(); } catch {}
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive", "X-Project-Id": p.id },
  });
}
