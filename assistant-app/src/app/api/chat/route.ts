import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import { config } from "@/lib/env";
import { session } from "@/lib/session";
import { getProject, saveProject } from "@/lib/store";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { TOOLS, TOOL_ASSET, runTool } from "@/lib/tools";
import type { Project, StreamEvent, UiMessage, UiPart } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

type BMsg = Anthropic.Beta.Messages.BetaMessageParam;
type BBlock = Anthropic.Beta.Messages.BetaContentBlock;

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

  let project: Project | null = body.projectId ? await getProject(body.projectId) : null;
  if (project && project.workspace !== s.workspace) return Response.json({ error: "Not found." }, { status: 404 });
  if (!project) {
    project = {
      id: body.projectId && /^[\w-]{6,40}$/.test(body.projectId) ? body.projectId : nanoid(12),
      workspace: s.workspace, title: titleFrom(text), created_at: Date.now(), updated_at: Date.now(),
      ui: [], transcript: [], assets: {},
    };
  }
  const p = project;
  const userMsg: UiMessage = { id: nanoid(10), role: "user", parts: [{ type: "text", text }], at: Date.now() };
  p.ui.push(userMsg);
  (p.transcript as BMsg[]).push({ role: "user", content: text });

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
            messages: p.transcript as BMsg[],
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
                lastText().text += ev.delta.text;
                emit({ type: "text", delta: ev.delta.text });
              }
            } else if (ev.type === "content_block_stop" && thinkPart) {
              const seconds = Math.max(1, Math.round((Date.now() - thinkStart) / 1000));
              thinkPart.seconds = seconds;
              emit({ type: "thinking_done", seconds });
              thinkPart = null;
            }
          }

          const msg = await ms.finalMessage();
          (p.transcript as BMsg[]).push({ role: "assistant", content: msg.content as BBlock[] as unknown as Exclude<BMsg["content"], undefined> });

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
            const r = await runTool(u.name, u.input, p, emit);
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
        const msg = e instanceof Anthropic.RateLimitError
          ? "I'm getting a lot of requests right now. Give it a few seconds and send that again."
          : e instanceof Anthropic.APIError
            ? "I couldn't reach the model just now. Send your message again."
            : "Something went wrong on my side. Send your message again.";
        emit({ type: "error", message: msg });
        // Keep the transcript valid: drop a dangling tool_use turn with no results.
        const t = p.transcript as BMsg[];
        const last = t[t.length - 1];
        if (last?.role === "assistant" && Array.isArray(last.content) && last.content.some((b) => (b as { type: string }).type === "tool_use")) t.pop();
      } finally {
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
