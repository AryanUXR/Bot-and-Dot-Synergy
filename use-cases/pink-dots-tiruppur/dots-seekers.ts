// Women Requests: hardcoded seeker dots for Pink Dots Tiruppur.
// Fictional women, real localities. lat/lng sit about 400 to 800 m from the locality
// anchors in dots-providers.ts, so seeker and provider dots do not overlap.

import type { PinkDot } from "./dots-providers";

export const TIRUPPUR_SEEKER_DOTS: PinkDot[] = [
  {
    id: 101, type: "seeker", sector: "Women Requests",
    name: "Anita K. · Tailor, from Jharkhand", area: "Anupparpalayam",
    lat: 11.1232, lng: 77.3282, // ~550 m off locality anchor in dots-providers.ts
    org_type: "Needs Hostel + Creche", offers: ["Room for mother and child", "Creche 8 am to 6 pm", "Near Avinashi Road"],
    description: "She works as a tailor in an Anupparpalayam unit and has a 2-year-old son. Her shared room is ending next month and she has no one to mind her son during shifts.",
  },
  {
    id: 102, type: "seeker", sector: "Women Requests",
    name: "Puja M. · Checker, from Odisha", area: "Mudalipalayam",
    lat: 11.0700, lng: 77.3010, // ~700 m off locality anchor in dots-providers.ts
    org_type: "Needs Hostel", offers: ["Ladies hostel", "Under Rs 3,500", "Gate open after 8 pm"],
    description: "She has a checker job in a TEKIC unit with a shift that ends at 8 pm. She lives 12 km away and wants a ladies hostel she can walk to.",
  },
  {
    id: 103, type: "seeker", sector: "Women Requests",
    name: "Reena D. · Helper, from Bihar", area: "Veerapandi",
    lat: 11.0590, lng: 77.3440, // ~750 m off locality anchor in dots-providers.ts
    org_type: "Needs Creche", offers: ["Child aged 3", "Full shift care", "Hindi-speaking carer"],
    description: "She works as a helper in a Palladam Road unit and leaves early each day to collect her daughter. She wants care until 6 pm with someone who speaks Hindi.",
  },
  {
    id: 104, type: "seeker", sector: "Women Requests",
    name: "Sarita Y. · Ironing worker, from Uttar Pradesh", area: "15 Velampalayam",
    lat: 11.1500, lng: 77.3115, // ~670 m off locality anchor in dots-providers.ts
    org_type: "Needs Hostel", offers: ["Women-only room", "Free to leave on Sundays", "Near 15 Velampalayam"],
    description: "She lives in a company hostel where women can go out only once a month. She wants to move to a ladies hostel where she can come and go freely.",
  },
  {
    id: 105, type: "seeker", sector: "Women Requests",
    name: "Mamata N. · Packer, from Odisha", area: "Neruperichal",
    lat: 11.1555, lng: 77.3430, // ~670 m off locality anchor in dots-providers.ts
    org_type: "Needs Creche", offers: ["Baby aged 1", "Creche near home", "Under Rs 2,000"],
    description: "She went back to packing work after her daughter turned one. Her neighbour who minded the baby is moving away next week.",
  },
  {
    id: 106, type: "seeker", sector: "Women Requests",
    name: "Sunita O. · Overlock operator, from Jharkhand", area: "Mannarai",
    lat: 11.1290, lng: 77.3760, // ~620 m off locality anchor in dots-providers.ts
    org_type: "Needs Hostel + Creche", offers: ["Room with a child", "Anganwadi or creche", "Close to work"],
    description: "She is separated from her husband and lives with her 4-year-old son in a room she can no longer afford. She needs a cheaper room and a place for her son during her shift.",
  },
  {
    id: 107, type: "seeker", sector: "Women Requests",
    name: "Kiran P. · Trimmer, from Bihar", area: "Rayapuram",
    lat: 11.1160, lng: 77.3365, // ~560 m off locality anchor in dots-providers.ts
    org_type: "Needs Job", offers: ["Trimmer or checker", "Day shift only", "Walking distance"],
    description: "Her unit near the railway station closed last month. She wants a day-shift trimming or checking job she can reach on foot.",
  },
  {
    id: 108, type: "seeker", sector: "Women Requests",
    name: "Laxmi B. · Tailor, from Uttar Pradesh", area: "Nallur",
    lat: 11.0880, lng: 77.3800, // ~780 m off locality anchor in dots-providers.ts
    org_type: "Needs Creche", offers: ["Twins aged 2", "Care 8 am to 7 pm", "Kangeyam Road side"],
    description: "She has 2-year-old twins and her mother-in-law is going back to the village. She needs day care on Kangeyam Road that takes two children.",
  },
  {
    id: 109, type: "seeker", sector: "Women Requests",
    name: "Asha T. · New arrival, from Jharkhand", area: "Eettiveerampalayam",
    lat: 11.1650, lng: 77.3650, // ~780 m off locality anchor in dots-providers.ts
    org_type: "Needs Job + Hostel", offers: ["First tailoring job", "Ladies hostel", "Hindi-speaking supervisor"],
    description: "She arrived in Tiruppur last week after a 3-month stitching course at home. She is staying with a relative and needs a job and a hostel close together.",
  },
  {
    id: 110, type: "seeker", sector: "Women Requests",
    name: "Geeta S. · Machine operator, from Odisha", area: "Karuvampalayam",
    lat: 11.0940, lng: 77.3215, // ~660 m off locality anchor in dots-providers.ts
    org_type: "Needs Job", offers: ["Flatlock operator", "Monthly salary", "ESI and PF"],
    description: "She is paid by the piece and loses wages when orders are slow. She wants a salaried operator job that registers her for ESI and PF.",
  },
];
