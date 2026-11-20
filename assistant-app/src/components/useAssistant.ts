"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AssetKind, Assets, ProjectSummary, StreamEvent, UiMessage, UiPart } from "@/lib/types";
import type { Journey } from "@/lib/journey";

export interface ProjectView { id: string; title: string; ui: UiMessage[]; assets: Assets; journey?: Journey }

const uid = () => Math.random().toString(36).slice(2, 12);

export function useAssistant(initialId: string | null) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [project, setProject] = useState<ProjectView | null>(null);
  const [loading, setLoading] = useState(!!initialId);
  const [streaming, setStreaming] = useState(false);
  const [running, setRunning] = useState<{ name: string; asset?: AssetKind } | null>(null);
  const [fresh, setFresh] = useState<Set<AssetKind>>(new Set());
  const [focus, setFocus] = useState<{ kind: AssetKind; n: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const startedRef = useRef<string | null>(null);

  const refreshList = useCallback(async () => {
    const r = await fetch("/api/projects");
    if (r.ok) { const j = await r.json(); setProjects(j.projects); setName(j.name); }
  }, []);

  const open = useCallback(async (id: string | null) => {
    // The chat this page just started: it's already on screen and streaming, so don't reload it.
    if (id && id === startedRef.current) { startedRef.current = null; return; }
    abortRef.current?.abort();
    setError(null); setFresh(new Set()); setRunning(null); setStreaming(false);
    if (!id) { setProject(null); setLoading(false); window.history.pushState(null, "", "/"); return; }
    setLoading(true);
    const r = await fetch(`/api/projects/${id}`);
    setLoading(false);
    if (!r.ok) { setProject(null); window.history.replaceState(null, "", "/"); return; }
    const { project: p } = await r.json();
    setProject({ id: p.id, title: p.title, ui: p.ui, assets: p.assets, journey: p.journey_view });
    if (window.location.pathname !== `/c/${id}`) window.history.pushState(null, "", `/c/${id}`);
  }, []);

  useEffect(() => { refreshList(); if (initialId) open(initialId); }, [initialId, open, refreshList]);
  useEffect(() => {
    const onPop = () => { const m = window.location.pathname.match(/^\/c\/([\w-]+)/); open(m ? m[1] : null); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open]);

  const patchLast = (fn: (parts: UiPart[]) => UiPart[]) =>
    setProject((p) => {
      if (!p) return p;
      const ui = p.ui.slice();
      const last = ui[ui.length - 1];
      if (!last || last.role !== "assistant") return p;
      ui[ui.length - 1] = { ...last, parts: fn(last.parts.slice()) };
      return { ...p, ui };
    });

  const send = useCallback(async (text: string) => {
    const msg = text.trim();
    if (!msg || streaming) return;
    setError(null);
    const id = project?.id ?? uid() + uid();
    const user: UiMessage = { id: uid(), role: "user", parts: [{ type: "text", text: msg }], at: Date.now() };
    const asst: UiMessage = { id: uid(), role: "assistant", parts: [], at: Date.now() };
    setProject((p) => ({ id, title: p?.title ?? msg.slice(0, 42), ui: [...(p?.ui ?? []), user, asst], assets: p?.assets ?? {} }));
    if (!project) { startedRef.current = id; window.history.pushState(null, "", `/c/${id}`); }
    setStreaming(true);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, message: msg }), signal: ac.signal,
      });
      if (!r.ok || !r.body) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Something went wrong. Try again.");
      }
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n\n")) >= 0) {
          const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
          if (!chunk.startsWith("data: ")) continue;
          handle(JSON.parse(chunk.slice(6)) as StreamEvent);
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setStreaming(false); setRunning(null);
      patchLast((parts) => parts.map((x) => (x.type === "tool" && x.status === "running" ? { ...x, status: "error", summary: "Stopped" } : x)));
      refreshList();
    }

    function handle(e: StreamEvent) {
      switch (e.type) {
        case "thinking":
          patchLast((parts) => {
            const last = parts[parts.length - 1];
            if (last?.type === "thinking" && last.seconds == null) parts[parts.length - 1] = { ...last, text: last.text + e.delta };
            else parts.push({ type: "thinking", text: e.delta });
            return parts;
          });
          break;
        case "thinking_done":
          patchLast((parts) => {
            for (let k = parts.length - 1; k >= 0; k--) {
              const x = parts[k];
              if (x.type === "thinking" && x.seconds == null) { parts[k] = { ...x, seconds: e.seconds }; break; }
            }
            return parts;
          });
          break;
        case "text":
          patchLast((parts) => {
            const last = parts[parts.length - 1];
            if (last?.type === "text") parts[parts.length - 1] = { ...last, text: last.text + e.delta };
            else parts.push({ type: "text", text: e.delta });
            return parts;
          });
          break;
        case "tool_start": {
          const asset = TOOL_ASSET[e.name];
          patchLast((parts) => [...parts, { type: "tool", id: e.id, name: e.name, status: "running", asset }]);
          setRunning({ name: e.name, asset });
          if (asset) setFocus((f) => ({ kind: asset, n: (f?.n ?? 0) + 1 }));
          break;
        }
        case "tool_done":
          patchLast((parts) => parts.map((x) => (x.type === "tool" && x.id === e.id ? { ...x, status: e.status, summary: e.summary } : x)));
          setRunning(null);
          break;
        case "asset":
          setProject((p) => (p ? { ...p, assets: { ...p.assets, [e.kind]: e.data } } : p));
          setFresh((s) => new Set(s).add(e.kind));
          break;
        case "journey":
          setProject((p) => (p ? { ...p, journey: e.data } : p));
          break;
        case "title":
          setProject((p) => (p ? { ...p, title: e.title } : p));
          break;
        case "error":
          setError(e.message);
          break;
      }
    }
  }, [project, streaming, refreshList]);

  const stop = useCallback(() => abortRef.current?.abort(), []);
  const seen = useCallback((k: AssetKind) => setFresh((s) => { if (!s.has(k)) return s; const n = new Set(s); n.delete(k); return n; }), []);
  const setPhoto = useCallback((personaId: string, key: string) =>
    setProject((p) => (p ? { ...p, assets: { ...p.assets, photos: { ...(p.assets.photos ?? {}), [personaId]: key } } } : p)), []);
  const remove = useCallback(async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (project?.id === id) open(null);
    refreshList();
  }, [project, open, refreshList]);

  return { projects, project, loading, streaming, running, fresh, focus, error, name, send, stop, open, seen, setPhoto, remove, setError };
}

export const TOOL_ASSET: Record<string, AssetKind> = {
  record_fit_check: "fit", update_brief: "brief", set_personas: "personas", set_schema: "schema", build_map: "map", create_voice_bot: "bot",
};

export const TOOL_LABEL: Record<string, [string, string]> = {
  record_fit_check: ["Checking the fit", "Fit check"],
  update_brief: ["Writing the brief", "Brief"],
  set_personas: ["Creating personas", "Personas"],
  set_schema: ["Mapping the schema", "Schema"],
  build_map: ["Placing dots on the map", "Map"],
  create_voice_bot: ["Setting up the voice bot", "Voice bot"],
};
