// src/components/CallForm.tsx
// Copy this file and replace: BOTNAME, country code list, button label, gradient colours.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Persona } from "@/data/personas";
import { personas } from "@/data/personas";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CallFormProps {
  selectedPersona?: Persona;
  gradient: string;
}

// CHANGE: add or remove country codes for your geography
// India-only bots: only keep +91
// South Africa bots: +27 first, then +91, +1
const countryCodes = [
  { code: "+91", flag: "🇮🇳", label: "India" },
  { code: "+27", flag: "🇿🇦", label: "South Africa" },
  { code: "+1",  flag: "🇺🇸", label: "USA / Canada" },
];

const defaultCountryCode = "+91"; // CHANGE: set your primary geography's code

const CallForm = ({ selectedPersona, gradient }: CallFormProps) => {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [persona, setPersona] = useState(selectedPersona?.id || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedPersona) setPersona(selectedPersona.id);
  }, [selectedPersona]);

  const isValid = phone.length >= 4 && /^\d+$/.test(phone) && persona;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("initiate-call", {
        body: { phone, countryCode, personaId: persona },
      });
      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || "Call failed");
      setSuccess(true);
      toast({ title: "Call initiated!", description: "You will receive a call shortly." });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to initiate call. Please try again.");
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl p-6 md:p-8 border-2 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      style={{ background: gradient }}
    >
      {/* CHANGE: replace "BOTNAME" with your bot's name */}
      <h3 className="font-heading font-bold text-2xl md:text-[28px] text-white text-center mb-8 drop-shadow-sm">
        {selectedPersona ? `Experience ${selectedPersona.name}'s Journey` : "Try BOTNAME"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Persona selector */}
        <div>
          <label className="block font-body font-semibold text-sm text-white mb-2.5">
            Call as Persona
          </label>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="w-full bg-white border-2 border-white/30 rounded-[10px] px-4 py-4 font-body text-[15px] text-slate-800 focus:outline-none transition-all duration-300"
          >
            <option value="">Select a persona...</option>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>{p.dropdownLabel}</option>
            ))}
          </select>
        </div>

        {/* Phone number */}
        <div>
          <label className="block font-body font-semibold text-sm text-white mb-2.5">
            Your Phone Number
          </label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-[160px] shrink-0 bg-white border-2 border-white/30 rounded-[10px] px-2 py-4 font-body text-[14px] text-slate-800 focus:outline-none transition-all duration-300"
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {c.flag} {c.label}
                </option>
              ))}
            </select>
            <div className="flex-1 relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                placeholder="Enter mobile number"
                className="w-full bg-white border-2 border-white/30 rounded-[10px] px-4 py-4 font-body text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-300"
              />
              {phone.length >= 4 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-lg">✓</span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-white/20 border border-white/40 px-4 py-3 text-white text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full bg-white font-heading font-bold text-lg py-[18px] rounded-xl shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ color: "var(--primary-dark, #1e3a8a)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connecting...
            </span>
          ) : success ? "✅ Call Initiated!" : "Call BOTNAME →"}
        </button>

        <p className="font-body text-[13px] text-white/80 text-center italic">
          {(() => {
            const active = personas.find((p) => p.id === persona);
            return active
              ? active.experience
              : "Select a persona and receive a call to explore their journey.";
          })()}
        </p>
      </form>
    </motion.div>
  );
};

export default CallForm;
