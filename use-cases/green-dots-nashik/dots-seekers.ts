// Farmer Requests — hardcoded seeker dots for Green Dots Nashik.
// Fictional farmers, real villages. lat/lng sit about 1 km from the village anchors
// in dots-providers.ts, so seeker and provider dots do not overlap.

import type { GreenDot } from "./dots-providers";

export const NASHIK_SEEKER_DOTS: GreenDot[] = [
  {
    id: 101, type: "seeker", sector: "Farmer Requests",
    name: "Sunita P. · Onion farmer, 3 acres", area: "Vinchur",
    lat: 20.104, lng: 74.2235, // ~1 km off village anchor in dots-providers.ts
    org_type: "Needs Labour", offers: ["15 workers", "4 days", "Onion harvest"],
    description: "Summer onion harvest is due in 6 days. Her usual labour team is busy on grape farms in Pimpalgaon.",
  },
  {
    id: 102, type: "seeker", sector: "Farmer Requests",
    name: "Ganesh S. · Grape farmer, 6 acres", area: "Mohadi",
    lat: 20.146, lng: 73.879, // ~1 km off village anchor in dots-providers.ts
    org_type: "Needs Mechanic", offers: ["Tractor hydraulic", "On-farm repair", "Within 2 days"],
    description: "Tractor hydraulic lift failed during the spraying season. The next downy mildew spray is due in 2 days.",
  },
  {
    id: 103, type: "seeker", sector: "Farmer Requests",
    name: "Vilas K. · Onion farmer, 5 acres", area: "Lasalgaon",
    lat: 20.143, lng: 74.229, // ~1 km off village anchor in dots-providers.ts
    org_type: "Needs Storage", offers: ["300 quintal onion", "6-8 weeks", "Kanda chawl"],
    description: "Mandi prices dropped below his cost this week. He wants to hold 300 quintals for 6 to 8 weeks.",
  },
  {
    id: 104, type: "seeker", sector: "Farmer Requests",
    name: "Manisha J. · Tomato farmer, 2 acres", area: "Pimpalgaon Baswant",
    lat: 20.166, lng: 74.001, // ~1 km off village anchor in dots-providers.ts
    org_type: "Needs Labour", offers: ["6 pickers", "Daily for 3 weeks", "Tomato picking"],
    description: "Her tomatoes need picking every day for the next 3 weeks. She has found 2 workers out of the 6 she needs.",
  },
  {
    id: 105, type: "seeker", sector: "Farmer Requests",
    name: "Sandeep D. · Wheat farmer, 4 acres", area: "Sinnar",
    lat: 19.853, lng: 73.995, // ~1 km off village anchor in dots-providers.ts
    org_type: "Needs Harvester", offers: ["Combine harvester", "4 acres wheat", "Next week"],
    description: "His wheat is ready next week. The harvester owner he used last year has moved to Ahmednagar district.",
  },
  {
    id: 106, type: "seeker", sector: "Farmer Requests",
    name: "Ashok B. · Grape farmer, 4 acres", area: "Kasbe Sukene",
    lat: 20.083, lng: 74.02, // ~1 km off village anchor in dots-providers.ts
    org_type: "Needs Mechanic", offers: ["Drip line repair", "Pump motor", "This week"],
    description: "His drip pump motor burnt out and two drip lines leak. Vines need water every 2 days in this heat.",
  },
  {
    id: 107, type: "seeker", sector: "Farmer Requests",
    name: "Rekha T. · Grape farmer, 3 acres", area: "Dindori",
    lat: 20.205, lng: 73.835, // ~1 km off village anchor in dots-providers.ts
    org_type: "Needs Cold Storage", offers: ["Pre-cooling", "Export grapes", "2 tonnes"],
    description: "She has 2 tonnes of export-grade grapes ready to cut. She needs a pack house with pre-cooling within 10 km.",
  },
  {
    id: 108, type: "seeker", sector: "Farmer Requests",
    name: "Kailas M. · Onion farmer, 2 acres", area: "Chandwad",
    lat: 20.326, lng: 74.24, // ~1 km off village anchor in dots-providers.ts
    org_type: "Needs Rental", offers: ["Rotavator", "1 day", "Field preparation"],
    description: "He needs a rotavator for one day to prepare his field for kharif onion. He does not own a tractor.",
  },
  {
    id: 109, type: "seeker", sector: "Farmer Requests",
    name: "Prakash G. · Grape farmer, 5 acres", area: "Ozar",
    lat: 20.092, lng: 73.923, // ~1 km off village anchor in dots-providers.ts
    org_type: "Needs Labour", offers: ["10 workers", "Grape cutting", "Next 5 days"],
    description: "His export buyer wants grapes cut and packed in 5 days. He needs 10 trained grape cutters.",
  },
  {
    id: 110, type: "seeker", sector: "Farmer Requests",
    name: "Savita N. · Onion and wheat, 3 acres", area: "Niphad",
    lat: 20.076, lng: 74.103, // ~1 km off village anchor in dots-providers.ts
    org_type: "Needs Finance", offers: ["KCC renewal", "Crop insurance", "Onion storage loan"],
    description: "Her Kisan Credit Card limit expired last month. She needs it renewed before buying seed for the next crop.",
  },
];
