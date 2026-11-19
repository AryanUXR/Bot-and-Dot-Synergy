import { nanoid } from "nanoid";
import { session } from "@/lib/session";
import { saveProject } from "@/lib/store";
import { runTool } from "@/lib/tools";
import type { Project } from "@/lib/types";

// Development only: builds a sample project through the same tools the assistant
// calls, so the canvas, map, photos and voice bot can be tested without the model.
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  const s = await session();
  if (!s.ok || !s.workspace) return Response.json({ error: "no session" }, { status: 401 });
  const { withBot } = (await req.json().catch(() => ({}))) as { withBot?: boolean };
  const p: Project = { id: nanoid(12), workspace: s.workspace, title: "Elder home care in Pune", created_at: Date.now(), updated_at: Date.now(), ui: [], transcript: [], assets: {} };
  const log: string[] = [];
  const run = async (name: string, input: unknown) => { const r = await runTool(name, input, p, () => {}); log.push(`${name}: ${r.ok ? "ok" : "FAIL"} ${r.result}`); };

  await run("record_fit_check", {
    verdict: "fits", summary: "Home care in Pune is a discovery problem: nurses, attendants and day-care centres exist, but families find them through word of mouth, often in a hurry.",
    criteria: [
      { name: "A discovery problem", result: "yes", note: "Supply exists across Kothrud, Baner and Aundh; families can't see it." },
      { name: "Two sides with intent", result: "yes", note: "Families need care; attendants and centres want clients nearby." },
      { name: "Nearness matters", result: "yes", note: "Daily visits only work within a few kilometres." },
      { name: "Personal relevance", result: "yes", note: "The right help depends on the elder's needs and timing." },
      { name: "Fits a short voice call", result: "yes", note: "A need takes under a minute to say." },
      { name: "An institutional anchor", result: "partly", note: "Needs a partner such as the city's social welfare office." },
    ],
    to_make_it_fit: ["Find a local anchor, such as the municipal social welfare department or a senior citizens' federation."],
  });
  await run("update_brief", {
    title: "Elder home care in Pune", colour: "white", place: "Pune, Maharashtra", language: "Hinglish",
    problem: "Families in Pune struggle to find trusted home nurses, attendants and day-care centres for elderly parents, especially at short notice. Caregivers looking for work find clients the same way: through word of mouth.",
    seekers: "Adult children and elders who need home nursing, day attendants or a day-care centre nearby.",
    providers: "Home nurses, attendants, physiotherapists and elder day-care centres looking for clients nearby.",
    why_it_matters: "Care visits happen daily, so only help within a few kilometres works. Many elders are more at ease speaking than typing.",
    bot_name: "Saathi Seva", tagline: "Care for your parents, close to home",
  });
  await run("set_personas", { personas: [
    { id: "arjun-son", name: "Arjun M.", side: "seeker", age: 41, area: "Kothrud", occupation: "IT manager", story: "His father came home from hospital last week and needs a day attendant while Arjun is at work.", need: "A trained day attendant near Kothrud, starting this week", quote: "I just need someone I can trust while I'm at office.", gender: "male", photo_prompt: "Indian man aged 41 in a light formal shirt, standing in a Pune apartment living room, concerned but warm expression" },
    { id: "vimal-elder", name: "Vimal D.", side: "seeker", age: 72, area: "Aundh", occupation: "Retired teacher", story: "She lives alone since her husband passed and feels lonely during the day. Her knees make travel hard.", need: "A day-care centre close to Aundh with company and light activities", quote: "Ghar pe akeli bore ho jaati hoon.", gender: "female", photo_prompt: "Indian woman aged 72 in a cotton saree with grey hair and reading glasses, sitting by a sunny window in Pune, gentle smile" },
    { id: "kavita-attendant", name: "Kavita S.", side: "provider", age: 34, area: "Baner", occupation: "Trained elder-care attendant", story: "She has five years of experience and wants day-shift clients closer to home in Baner.", need: "Families nearby who need a day attendant", quote: "I want work near my children's school.", gender: "female", photo_prompt: "Indian woman aged 34 in a simple salwar kameez with a neat bun, standing outside a residential building in Pune, confident smile" },
  ]});
  await run("set_schema", {
    sectors: [
      { id: "home-nursing", label: "Home nursing", icon: "stethoscope", description: "Nurses for wound care, injections and post-hospital care" },
      { id: "attendants", label: "Attendants", icon: "heart-handshake", description: "Day and night attendants for daily help" },
      { id: "day-care", label: "Day-care centres", icon: "users", description: "Places for company, meals and activities in the day" },
      { id: "physio", label: "Physiotherapy", icon: "accessibility", description: "Home visits and clinics for mobility" },
      { id: "medical-supplies", label: "Medical supplies", icon: "pill", description: "Wheelchairs, beds and supplies on rent or sale" },
    ],
    seeker_fields: [
      { key: "area", label: "Area", example: "Kothrud", visible: "public" },
      { key: "care_needed", label: "Care needed", example: "Day attendant", visible: "public" },
      { key: "timing", label: "When", example: "Weekdays, 9 to 6", visible: "public" },
      { key: "phone", label: "Phone number", example: "Shared after both agree", visible: "after_connect" },
    ],
    provider_fields: [
      { key: "name", label: "Name or centre", example: "Aundh Sukoon Day Centre", visible: "public" },
      { key: "service", label: "Service", example: "Day-care with meals", visible: "public" },
      { key: "area", label: "Area", example: "Aundh", visible: "public" },
      { key: "contact", label: "Contact", example: "Shared after both agree", visible: "after_connect" },
    ],
    notes: "Every dot is listed with consent. Phone numbers are shared only after both sides agree.",
  });
  const areas = [
    { name: "Kothrud", lat: 18.5074, lng: 73.8077 }, { name: "Baner", lat: 18.559, lng: 73.7868 }, { name: "Aundh", lat: 18.5603, lng: 73.8079 },
    { name: "Karve Nagar", lat: 18.4898, lng: 73.8204 }, { name: "Shivajinagar", lat: 18.5308, lng: 73.8475 }, { name: "Pashan", lat: 18.5384, lng: 73.7928 },
    { name: "Erandwane", lat: 18.5103, lng: 73.8318 }, { name: "Wakad", lat: 18.5987, lng: 73.7608 },
  ];
  const D = (name: string, sector: string, area: string, detail: string, kind = "provider", hours?: string) => ({ name, kind, sector, area, detail, hours });
  await run("build_map", { center: { lat: 18.535, lng: 73.81 }, zoom: 12, you_area: "Kothrud", areas, dots: [
    D("Kothrud Care Nurses", "home-nursing", "Kothrud", "Home nurses for post-hospital care and injections", "provider", "8 am to 8 pm"),
    D("Erandwane Home Health", "home-nursing", "Erandwane", "Visiting nurses, wound care and elder check-ups"),
    D("Baner Nursing Bureau", "home-nursing", "Baner", "Day and night nurses on short notice"),
    D("Wakad Care at Home", "home-nursing", "Wakad", "Nurses for elders after surgery"),
    D("Sunita P.", "attendants", "Karve Nagar", "Day attendant, eight years with elders", "provider", "Weekdays"),
    D("Leela R.", "attendants", "Kothrud", "Day attendant, can start this week", "provider", "Weekdays, 9 to 6"),
    D("Pashan Attendant Services", "attendants", "Pashan", "Trained attendants for day or night shifts"),
    D("Shivajinagar Seva Bureau", "attendants", "Shivajinagar", "Male and female attendants, weekly plans"),
    D("Aundh Sukoon Day Centre", "day-care", "Aundh", "Day-care with meals, yoga and company", "provider", "9 am to 5 pm"),
    D("Kothrud Anand Kendra", "day-care", "Kothrud", "Activities, lunch and a quiet room for rest"),
    D("Baner Senior Lounge", "day-care", "Baner", "Day-care with doctor visits twice a week"),
    D("Erandwane Physio Point", "physio", "Erandwane", "Physiotherapy clinic with home visits"),
    D("Aundh Move Well", "physio", "Aundh", "Knee and back physiotherapy at home"),
    D("Karve Nagar Rehab Care", "physio", "Karve Nagar", "Mobility exercises after falls or surgery"),
    D("Shivajinagar Medi Rent", "medical-supplies", "Shivajinagar", "Hospital beds and wheelchairs on rent"),
    D("Kothrud Care Supplies", "medical-supplies", "Kothrud", "Walkers, commodes and adult diapers"),
    D("Baner Health Mart", "medical-supplies", "Baner", "Oxygen concentrators and beds on rent"),
    D("Meera K.", "attendants", "Baner", "Needs a day attendant for her mother, weekdays", "request"),
    D("Rahul T.", "home-nursing", "Kothrud", "Needs a nurse for daily injections for two weeks", "request"),
    D("Shobha V.", "day-care", "Pashan", "Looking for a day-care centre for her father", "request"),
    D("Anil G.", "physio", "Wakad", "Needs home physiotherapy after a knee operation", "request"),
    D("Farida N.", "attendants", "Aundh", "Needs a night attendant for an elderly aunt", "request"),
  ]});
  if (withBot) {
    await run("create_voice_bot", {
      conversation_prompt: "You are Saathi Seva, a warm, patient voice assistant who helps families and elders in Pune find home care nearby. Speak everyday Hinglish, simple words, one short sentence at a time.\n\n# Find out what they need\nAsk what kind of help they need (nurse, attendant, day-care, physiotherapy or supplies) and when. If they are a caregiver looking for work, ask what work and where.\n\n# Answer\nGive the two nearest suitable options from the directory with their area and distance, for example: \"Kothrud mein Leela R. hain, aapke ghar se 1 kilometre, weekdays 9 se 6.\" Then say the full details are on the Blue Dots map.\n\n# Safety\nIf an elder sounds lonely or low, gently mention Elderline 14567.",
      greeting: "Namaste! Main Saathi Seva hoon. Aapko kis tarah ki care chahiye?",
      closing_line: "Dhyan rakhiye, aur Blue Dots map par poori details dekh lijiye. Goodbye",
      overtime_line: "Maaf kijiye, samay khatam ho gaya. Blue Dots map par details dekh lijiye. Goodbye",
      voice_gender: "female",
    });
  }
  p.ui = [
    { id: nanoid(8), role: "user", parts: [{ type: "text", text: "Build a bot and a dot map for elderly people and families in Pune finding home care near them." }], at: Date.now() },
    { id: nanoid(8), role: "assistant", parts: [{ type: "text", text: "Sample project created by the dev seed." }], at: Date.now() },
  ];
  await saveProject(p);
  return Response.json({ id: p.id, log });
}
