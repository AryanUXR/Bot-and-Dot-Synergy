// Shared bits for the prototype viewer pages: library fonts, loading and error states, landing page.
import { useEffect } from "react";
import { LOGO_URL } from "@/lib/prototype";

// The Dots library fonts: Titillium Web for headings, Public Sans for body text.
export const HEADING = { fontFamily: "'Titillium Web', sans-serif" } as const;
export const BODY = { fontFamily: "'Public Sans', sans-serif" } as const;
export function useLibraryFonts() {
  useEffect(() => {
    if (document.getElementById("dots-fonts")) return;
    const l = document.createElement("link");
    l.id = "dots-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Titillium+Web:wght@600;700&display=swap";
    document.head.appendChild(l);
  }, []);
}

export function LoadState({ error }: { error: Error | null }) {
  useLibraryFonts();
  const missing = error?.message === "not-found";
  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6 text-center" style={BODY}>
      {error ? (
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-slate-900" style={HEADING}>{missing ? "This prototype isn't here" : "The prototype couldn't load"}</h1>
          <p className="mt-2 text-slate-600">{missing ? "Check the link, or ask the person who shared it for a new one." : "Check your connection and reload the page."}</p>
        </div>
      ) : (
        <p role="status" className="text-slate-600">Loading the prototype…</p>
      )}
    </main>
  );
}

export function Landing() {
  useLibraryFonts();
  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-r from-[#0B63CE] to-[#0A3D8F] p-6 text-center text-white" style={BODY}>
      <div className="max-w-lg">
        <img src={LOGO_URL} alt="Blue Dots AI — Seeded by EkStep" className="h-12 mx-auto" />
        <h1 className="mt-6 text-3xl font-bold" style={HEADING}>Blue Dots prototypes</h1>
        <p className="mt-3 text-white/85">Voice bots and dot maps made with the Blue Dots Assistant. Open a prototype from the link its maker shared with you.</p>
      </div>
    </main>
  );
}
