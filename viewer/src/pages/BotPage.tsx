// The bot page of a prototype, built to the Dots library standard (starter/UI-SPEC.md) and
// adapted from the library's Pune bot page: Nav, PersonasSection, PersonaCard, PersonaModal,
// CallForm and Footer, driven by the prototype's data instead of hard-coded files.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { X, Map as MapIcon } from "lucide-react";
import { type Env, type Prototype, type ProtoPersona, usePrototype, placeCall, programmeOf, langCode, LOGO_URL } from "@/lib/prototype";
import { LoadState, useLibraryFonts, HEADING, BODY } from "@/pages/viewerShared";

const INK = "#1F2937";
const SLATE = "#374151";
const CALL_GRADIENT = "linear-gradient(135deg, #1F2937, #374151)";
const COUNTRY_CODES = [{ code: "91", label: "+91 🇮🇳 India" }, { code: "27", label: "+27 🇿🇦 South Africa" }, { code: "1", label: "+1 🇺🇸 USA" }];

export default function BotPage({ env }: { env: Env }) {
  const { id } = useParams();
  const q = usePrototype(env, id);
  useLibraryFonts();
  useEffect(() => { if (q.data) document.title = `${q.data.brief.bot_name} · ${q.data.brief.title}`; }, [q.data]);
  if (!q.data) return <LoadState error={q.error as Error | null} />;
  const p = q.data;
  const base = env === "uat" ? `/uat/p/${p.id}` : `/p/${p.id}`;
  return (
    <div className="min-h-screen bg-white" style={BODY}>
      <Nav p={p} mapHref={p.map ? `${base}/map` : null} />
      <main>
        <PersonasSection p={p} env={env} />
      </main>
      <Footer p={p} />
    </div>
  );
}

function Nav({ p, mapHref }: { p: Prototype; mapHref: string | null }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-gradient-to-r from-[#0B63CE] to-[#0A3D8F] border-b border-white/10 shadow-sm">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10 lg:px-[60px] h-20 gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <img src={LOGO_URL} alt="Blue Dots AI — Seeded by EkStep" className="h-9 sm:h-12 w-auto shrink-0" />
          <span className="h-7 sm:h-9 w-px bg-white/25 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <span className="block font-bold text-lg sm:text-2xl text-white truncate" style={HEADING}>{p.brief.bot_name}</span>
            <p className="text-xs text-white/80 -mt-0.5 truncate">{p.brief.tagline}</p>
          </div>
        </div>
        {mapHref && (
          <Link to={mapHref} className="shrink-0 flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 px-3 py-2 text-sm font-semibold text-white">
            <MapIcon size={16} aria-hidden="true" /> <span className="hidden sm:inline">See the map</span><span className="sm:hidden">Map</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

function PersonasSection({ p, env }: { p: Prototype; env: Env }) {
  const [open, setOpen] = useState<string | null>(null);
  const current = p.personas.find((x) => x.id === open) ?? null;
  const { colour } = programmeOf(p);
  return (
    <section className="relative overflow-x-clip pt-28 md:pt-32 pb-20 md:pb-24 px-5 md:px-10 lg:px-[60px] min-h-screen">
      <div className="max-w-[1400px] mx-auto relative z-10">
        <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-normal animate-in fade-in duration-700" style={{ ...HEADING, color: INK }}>{p.brief.heading}</h1>
        <p className="text-lg md:text-xl leading-relaxed max-w-[700px] mt-4 animate-in fade-in duration-700" style={{ color: SLATE }}>{p.brief.subheading}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
          {p.personas.map((persona, i) => (
            <PersonaCard key={persona.id} persona={persona} colour={colour} index={i} onClick={() => setOpen(persona.id)} />
          ))}
        </div>
      </div>
      {current && <PersonaModal p={p} env={env} persona={current} colour={colour} onClose={() => setOpen(null)} />}
    </section>
  );
}

const chipLabel = (x: ProtoPersona) => `${x.occupation} · ${x.area}`;

function Photo({ persona, colour, className }: { persona: ProtoPersona; colour: string; className: string }) {
  const [failed, setFailed] = useState(false);
  if (persona.photo_url && !failed) {
    return <img src={persona.photo_url} alt={`Portrait of ${persona.name} (generated)`} className={`${className} object-cover`} loading="lazy" onError={() => setFailed(true)} />;
  }
  return (
    <div className={`${className} grid place-items-center text-white text-6xl font-bold`} style={{ background: `linear-gradient(135deg, ${colour}, #0A3D8F)`, ...HEADING }} aria-hidden="true">
      {persona.name.charAt(0)}
    </div>
  );
}

function PersonaCard({ persona, colour, index, onClick }: { persona: ProtoPersona; colour: string; index: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={`Open ${persona.name} persona`}
      className="group w-full h-full flex flex-col text-left bg-white rounded-[20px] overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2937] focus-visible:ring-offset-4 transition-shadow duration-[400ms] animate-in fade-in"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}>
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${colour}, #0A3D8F)` }} />
      <div className="relative h-[280px] overflow-hidden">
        <Photo persona={persona} colour={colour} className="w-full h-full group-hover:scale-[1.08] transition-transform duration-[600ms] ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
      </div>
      <div className="p-7 flex-1">
        <h2 className="font-bold text-[28px] tracking-normal mb-2" style={{ ...HEADING, color: INK }}>{persona.name}</h2>
        <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-5" style={{ backgroundColor: `${colour}1F`, color: INK }}>
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: colour }} />
          {chipLabel(persona)}
        </p>
        <ul className="space-y-2">
          {persona.traits.map((t, i) => (
            <li key={i} className="relative pl-6 text-[15px] leading-relaxed" style={{ color: SLATE }}>
              <span className="absolute left-0 font-semibold" style={{ color: "#94A3B8" }} aria-hidden="true">→</span>
              <span className="block">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}

function PersonaModal({ p, env, persona, colour, onClose }: { p: Prototype; env: Env; persona: ProtoPersona; colour: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);
  const about = [persona.story, persona.quote ? `“${persona.quote}”` : ""].filter(Boolean);
  const questions = persona.questions;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true" aria-label={persona.name}>
      <div onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300" />
      <div className="relative bg-white rounded-3xl max-w-[1100px] w-full max-h-[90vh] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.24)] animate-in fade-in duration-500">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100/80 backdrop-blur-md flex items-center justify-center hover:bg-slate-200 hover:rotate-90 transition-all duration-300 z-20" style={{ color: INK }}>
          <X size={20} />
        </button>
        <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden">
          <div className="md:w-[55%] md:overflow-y-auto">
            <div className="relative h-[200px] md:h-[220px] overflow-hidden">
              <Photo persona={persona} colour={colour} className="w-full h-full blur-[2px] scale-105" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colour}, #0A3D8F)`, opacity: 0.9 }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <h2 className="font-bold text-3xl md:text-4xl tracking-normal drop-shadow-md w-fit rounded px-1" style={{ ...HEADING, background: INK }}>{persona.name}</h2>
                <p className="w-fit text-sm rounded px-1 uppercase tracking-[0.05em] mt-1" style={{ background: INK }}>{chipLabel(persona)}</p>
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-8">
              <div>
                <h3 className="font-semibold text-xl border-l-4 pl-4 mb-4" style={{ ...HEADING, color: INK, borderColor: INK }}>About {persona.name}</h3>
                {about.map((t, i) => <p key={i} className="text-sm leading-[1.8] mb-3" style={{ color: SLATE }}>{t}</p>)}
              </div>
              {questions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-xl border-l-4 pl-4 mb-4" style={{ ...HEADING, color: INK, borderColor: "#94A3B8" }}>Questions they might ask</h3>
                  <div className="rounded-xl p-6 bg-slate-100" style={{ borderLeft: `4px solid ${colour}` }}>
                    <ul lang={langCode(p.bot?.language ?? p.brief.language)}>
                      {questions.map((q, i) => (
                        <li key={i} className="relative pl-6 py-2.5 text-sm border-b border-slate-200 last:border-0" style={{ color: SLATE }}>
                          <span className="absolute left-0 top-2.5 font-semibold text-xs" style={{ color: "#94A3B8" }} aria-hidden="true">▸</span>{q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="md:w-[45%] md:border-l border-t md:border-t-0 border-slate-200 flex flex-col justify-center p-6 md:p-8 bg-slate-100/30">
            <CallForm p={p} env={env} persona={persona} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CallForm({ p, env, persona }: { p: Prototype; env: Env; persona: ProtoPersona }) {
  const [phone, setPhone] = useState("");
  const [cc, setCc] = useState("91");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [msg, setMsg] = useState("");
  const bot = p.bot?.name ?? p.brief.bot_name;
  const valid = phone.length >= 8 && /^\d+$/.test(phone);
  const live = !!p.bot?.live;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || state === "loading") return;
    setState("loading"); setMsg("");
    const r = await placeCall(env, p.id, persona.id, phone, cc);
    if (r.ok) { setState("done"); setMsg(`${bot} will call you in a few seconds.`); }
    else { setState("idle"); setMsg(r.message ?? "The call couldn't be placed. Try again in a moment."); }
  };

  return (
    <div className="rounded-2xl p-6 md:p-8 border-2 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)]" style={{ background: CALL_GRADIENT }}>
      <h3 className="font-bold text-2xl md:text-[28px] text-white text-center mb-8 drop-shadow-sm" style={HEADING}>Call as {persona.name}</h3>
      {!live ? (
        <p className="text-sm text-white/90 text-center">{bot}'s phone line is being set up. Check back soon.</p>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label htmlFor="viewer-phone" className="block w-fit font-semibold text-sm text-white rounded px-1 mb-2.5" style={{ background: INK }}>Your phone number</label>
            <div className="flex flex-col lg:flex-row gap-2">
              <select aria-label="Country code" value={cc} onChange={(e) => setCc(e.target.value)}
                className="w-[170px] shrink-0 bg-white border-2 border-white/30 rounded-[10px] px-2 py-4 text-[14px] outline-none focus:ring-2 focus:ring-white" style={{ color: INK }}>
                {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
              <input id="viewer-phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 13))} placeholder="Enter mobile number"
                className="flex-1 min-w-0 bg-white border-2 border-white/30 rounded-[10px] px-4 py-4 text-[14px] placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-white" style={{ color: INK }} />
            </div>
          </div>
          <button type="submit" disabled={!valid || state === "loading"}
            className="w-full bg-white font-bold text-lg py-[18px] rounded-xl shadow-[0_6px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            style={{ ...HEADING, color: INK }}>
            {state === "loading" ? "Connecting…" : state === "done" ? "Calling you now" : "Call me →"}
          </button>
          <p role="status" aria-live="polite" className="text-[13px] text-white rounded px-2 py-1 text-center italic" style={{ background: INK }}>
            {msg || `${bot} will call you in ${p.bot?.language ?? p.brief.language}. Talk as this person for 2 to 3 minutes.`}
          </p>
          <p className="text-[12px] text-white/80 text-center">Your number is used only to place this call. Everyone in this prototype is fictional.</p>
        </form>
      )}
    </div>
  );
}

function Footer({ p }: { p: Prototype }) {
  const { label } = programmeOf(p);
  const areas = p.map?.areas.slice(0, 4).map((a) => a.name).join(", ");
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between px-6 md:px-10 lg:px-[60px] py-4 gap-3 sm:gap-0 text-sm" style={{ color: SLATE }}>
        <p>{label} · {areas ? `${areas} and nearby` : p.brief.place}</p>
        <p>Voice AI powered by Raya · Made with the Blue Dots Assistant</p>
      </div>
    </footer>
  );
}
