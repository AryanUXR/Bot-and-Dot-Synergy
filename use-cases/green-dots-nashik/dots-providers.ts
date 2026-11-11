// All rows are fictional sample data for this prototype. Names, people and requests are made up;
// only national helplines (108, 112, 181, 1098, 1033, 1077) are real numbers.
// Green Dots Nashik: provider dots.

export const SECTORS = [
  "Farm Labour",
  "Equipment Repair",
  "Machinery Rental",
  "Cold Storage & Warehousing",
  "Mandi & Market Access",
  "Finance & Insurance",
  "Government & Training",
  "Experts & Agents",
  "Farmer Requests",
] as const;

export interface GreenDot {
  id: number;
  type: "provider" | "seeker";
  name: string;
  area: string;
  lat: number;
  lng: number;
  sector: string;
  org_type?: string;
  offers?: string[];
  address?: string;
  contact?: string;
  description: string;
  verified?: string; // "Unverified" on fictional expert rows
}

export const NASHIK_PROVIDER_DOTS: GreenDot[] = [
  // ───────────── Mandi & Market Access ─────────────
  {
    id: 1, type: "provider", sector: "Mandi & Market Access",
    name: "Hirwa Shivar Market Yard",
    area: "Station Road, Lasalgaon",
    lat: 20.1503, lng: 74.2330,
    org_type: "Market Yard",
    offers: ["Onion auction", "Daily price discovery", "Government onion procurement"],
    description: "Market yard serving Station Road, Lasalgaon.",
  },
  {
    id: 2, type: "provider", sector: "Mandi & Market Access",
    name: "Hirwa Shivar Sub-Yard, Vinchur",
    area: "Vinchur",
    lat: 20.1080, lng: 74.2280,
    org_type: "Market Sub-Yard",
    offers: ["Onion auction", "Government procurement centre"],
    description: "Market sub-yard serving Vinchur.",
  },
  {
    id: 3, type: "provider", sector: "Mandi & Market Access",
    name: "Navdhan Market Yard",
    area: "Mumbai-Agra Highway, Pimpalgaon Baswant",
    lat: 20.1700, lng: 73.9930,
    org_type: "Market Yard",
    offers: ["Onion auction", "Tomato auction", "Grape trade"],
    description: "Market yard serving Mumbai-Agra Highway, Pimpalgaon Baswant.",
  },
  {
    id: 4, type: "provider", sector: "Mandi & Market Access",
    name: "Godakath Market Yard",
    area: "Peth Road, Makhmalabad",
    lat: 20.0294, lng: 73.7927,
    org_type: "Market Yard",
    offers: ["Vegetable auction", "Fruit wholesale", "Daily market"],
    description: "Market yard serving Peth Road, Makhmalabad.",
  },
  {
    id: 5, type: "provider", sector: "Mandi & Market Access",
    name: "Shetkari Market Yard, Chandwad",
    area: "Chandwad",
    lat: 20.3250, lng: 74.2430,
    org_type: "Market Yard",
    offers: ["Onion auction", "Maize auction"],
    description: "Market yard serving Chandwad.",
  },
  {
    id: 6, type: "provider", sector: "Mandi & Market Access",
    name: "Green Valley Farmers' Company",
    area: "Mohadi, Dindori",
    lat: 20.1520, lng: 73.8850,
    org_type: "Farmer Producer Company",
    offers: ["Grape export buying", "Tomato processing", "Pack house", "FPC membership"],
    description: "Farmer Producer Company serving Mohadi, Dindori.",
  },

  // ───────────── Cold Storage & Warehousing ─────────────
  {
    id: 7, type: "provider", sector: "Cold Storage & Warehousing",
    name: "Sheetal Onion Storage Centre",
    area: "Lasalgaon",
    lat: 20.1555, lng: 74.2455,
    org_type: "Government Facility",
    offers: ["Onion irradiation", "Onion cold storage (250 t)"],
    description: "Government Facility serving Lasalgaon.",
  },
  {
    id: 8, type: "provider", sector: "Cold Storage & Warehousing",
    name: "Surakshit Warehouse",
    area: "Lasalgaon-Manmad Road, Lasalgaon",
    lat: 20.1630, lng: 74.2425,
    org_type: "Warehouse",
    offers: ["Bulk onion storage", "Buffer stock godown", "Warehouse receipts"],
    description: "Warehouse serving Lasalgaon-Manmad Road, Lasalgaon.",
  },
  {
    id: 9, type: "provider", sector: "Cold Storage & Warehousing",
    name: "Morning Dew Pack House",
    area: "Pimpalgaon Baswant",
    lat: 20.1785, lng: 73.9815,
    org_type: "Pack House",
    offers: ["Grape packing", "Pomegranate packing", "Pre-cooling"],
    description: "Pack House serving Pimpalgaon Baswant.",
  },
  {
    id: 10, type: "provider", sector: "Cold Storage & Warehousing",
    name: "Blue Hill Pack House",
    area: "Pimpalgaon-Vani Road, Pimpalgaon Baswant",
    lat: 20.1905, lng: 73.9780,
    org_type: "Pack House",
    offers: ["Grape packing", "Pomegranate packing", "Cold storage"],
    description: "Pack House serving Pimpalgaon-Vani Road, Pimpalgaon Baswant.",
  },
  {
    id: 11, type: "provider", sector: "Cold Storage & Warehousing",
    name: "Fresh Vine Pack House",
    area: "Pimpalgaon-Vani Road, Pimpalgaon Baswant",
    lat: 20.2010, lng: 73.9720,
    org_type: "Pack House",
    offers: ["Grape pre-cooling", "Cold storage", "Export buying"],
    description: "Pack House serving Pimpalgaon-Vani Road, Pimpalgaon Baswant.",
  },

  // ───────────── Equipment Repair ─────────────
  {
    id: 12, type: "provider", sector: "Equipment Repair",
    name: "Shetmitra Tractor Service",
    area: "Rasulpur, Niphad",
    lat: 20.0870, lng: 74.0950,
    org_type: "Tractor Dealer & Workshop",
    offers: ["Tractor service", "Spare parts", "Harvester service"],
    description: "Tractor Dealer & Workshop serving Rasulpur, Niphad.",
  },
  {
    id: 13, type: "provider", sector: "Equipment Repair",
    name: "Pimpalgaon Tractor Works",
    area: "Zopul Road, Pimpalgaon Baswant",
    lat: 20.1610, lng: 73.9920,
    org_type: "Tractor Dealer & Workshop",
    offers: ["Tractor service", "Implement repair", "Spare parts"],
    description: "Tractor Dealer & Workshop serving Zopul Road, Pimpalgaon Baswant.",
  },
  {
    id: 14, type: "provider", sector: "Equipment Repair",
    name: "Tractor Point, Ozar",
    area: "Tilak Nagar, Ozar",
    lat: 20.0960, lng: 73.9300,
    org_type: "Tractor Dealer & Workshop",
    offers: ["Tractor service", "Spare parts"],
    description: "Tractor Dealer & Workshop serving Tilak Nagar, Ozar.",
  },
  {
    id: 15, type: "provider", sector: "Equipment Repair",
    name: "Dindori Farm Machines",
    area: "Dindori-Kalwan Road, Dindori",
    lat: 20.2120, lng: 73.8420,
    org_type: "Tractor Dealer & Workshop",
    offers: ["Tractor service", "Spare parts"],
    description: "Tractor Dealer & Workshop serving Dindori-Kalwan Road, Dindori.",
  },
  {
    id: 16, type: "provider", sector: "Equipment Repair",
    name: "Jaulke Tractor Works",
    area: "Jaulke Phata, Dindori",
    lat: 20.1700, lng: 73.8500,
    org_type: "Tractor Dealer & Workshop",
    offers: ["Tractor service", "Farm implement repair", "Spare parts"],
    description: "Tractor Dealer & Workshop serving Jaulke Phata, Dindori.",
  },

  // ───────────── Finance & Insurance ─────────────
  {
    id: 17, type: "provider", sector: "Finance & Insurance",
    name: "Kisan Gramin Bank, Lasalgaon",
    area: "Near S.T. Stand, Lasalgaon",
    lat: 20.1460, lng: 74.2380,
    org_type: "Bank",
    offers: ["Kisan Credit Card", "Crop loan", "PMFBY enrolment"],
    description: "Bank serving Near S.T. Stand, Lasalgaon.",
  },
  {
    id: 18, type: "provider", sector: "Finance & Insurance",
    name: "Shetkari Sahakari Bank, Pimpalgaon",
    area: "Pimpalgaon Baswant",
    lat: 20.1650, lng: 73.9880,
    org_type: "Bank",
    offers: ["Kisan Credit Card", "Agri gold loan", "PMFBY enrolment"],
    description: "Bank serving Pimpalgaon Baswant.",
  },
  {
    id: 19, type: "provider", sector: "Finance & Insurance",
    name: "District Farmers' Co-operative Bank",
    area: "Dwarka Circle, Agra Road",
    lat: 19.9925, lng: 73.8040,
    org_type: "Co-operative Bank",
    offers: ["Crop loan via PACS", "Kisan Credit Card", "Loan restructuring"],
    description: "Co-operative Bank serving Dwarka Circle, Agra Road.",
  },

  // ───────────── Government & Training ─────────────
  {
    id: 20, type: "provider", sector: "Government & Training",
    name: "Farm Science Training Centre",
    area: "Dnyangangotri, Gangapur Dam",
    lat: 20.0230, lng: 73.6950,
    org_type: "Krishi Vigyan Kendra",
    offers: ["Farmer training", "Soil testing", "Crop advisory"],
    description: "Krishi Vigyan Kendra serving Dnyangangotri, Gangapur Dam.",
  },
  {
    id: 21, type: "provider", sector: "Government & Training",
    name: "Onion Research Farm, Chitegaon",
    area: "Chitegaon Phata, Niphad",
    lat: 20.0520, lng: 73.9750,
    org_type: "Research Station",
    offers: ["Onion seed", "Onion storage advice", "Farmer training"],
    description: "Research Station serving Chitegaon Phata, Niphad.",
  },
  {
    id: 22, type: "provider", sector: "Government & Training",
    name: "Wheat and Grape Research Farm, Niphad",
    area: "Kundewadi, Niphad",
    lat: 20.0950, lng: 74.1180,
    org_type: "Research Station",
    offers: ["Wheat seed", "Crop advisory", "Field demonstrations"],
    description: "Research Station serving Kundewadi, Niphad.",
  },
  {
    id: 23, type: "provider", sector: "Government & Training",
    name: "Grape Advice Centre, Pimpalgaon",
    area: "Wani Chowphuli, Pimpalgaon Baswant",
    lat: 20.1715, lng: 73.9845,
    org_type: "Research Station",
    offers: ["Grape disease advisory", "Onion variety advice", "Farmer training"],
    description: "Research Station serving Wani Chowphuli, Pimpalgaon Baswant.",
  },

  // ───────────── Experts & Agents (fictional personas) ─────────────
  {
    id: 24, type: "provider", sector: "Farm Labour",
    name: "Dnyaneshwar G.",
    area: "Khedgaon, Dindori",
    lat: 20.2365, lng: 73.9605,
    org_type: "Labour Contractor",
    offers: ["Grape harvest teams", "Bunch cutting", "20-40 workers"],
    description: "Grape harvest mukadam with 14 years of experience, running teams of 20 to 40 cutters from February to April. Works for export grape growers in Dindori and Pimpalgaon who need packing-grade cutting.",
  },
  {
    id: 25, type: "provider", sector: "Farm Labour",
    name: "Balasaheb S.",
    area: "Ugaon, Niphad",
    lat: 20.1235, lng: 74.1397,
    org_type: "Labour Contractor",
    offers: ["Onion harvest labour", "Onion grading", "Daily-wage teams"],
    description: "Onion harvest mukadam with 11 years of experience who gathers workers at the Ugaon and Niphad nakas each morning. Supplies teams of 10 to 25 for small onion farmers around Vinchur and Lasalgaon.",
  },
  {
    id: 26, type: "provider", sector: "Farm Labour",
    name: "Kavita A.",
    area: "Pandhurli, Sinnar",
    lat: 19.8305, lng: 73.8555,
    org_type: "Labour Group Leader",
    offers: ["Onion transplanting", "Weeding", "Women's labour group"],
    description: "Leads a group of 15 women farm workers, with 8 years of experience in onion transplanting and weeding. Takes bookings from Sinnar and Nashik taluka farmers who need hands for 2 to 5 days.",
  },
  {
    id: 27, type: "provider", sector: "Experts & Agents",
    name: "Sandip K.",
    area: "Kasabe Sukene, Niphad",
    lat: 20.0780, lng: 74.0140,
    org_type: "Tractor Mechanic",
    offers: ["Hydraulic lift repair", "On-farm visits", "All tractor brands"],
    description: "Tractor hydraulic mechanic with 16 years of experience who repairs lift and pump faults on the farm. Serves grape growers between Ozar and Niphad whose tractors stop in the spray season.",
  },
  {
    id: 28, type: "provider", sector: "Experts & Agents",
    name: "Nitin B.",
    area: "Niphad",
    lat: 20.0810, lng: 74.1090,
    org_type: "Spray Pump Mechanic",
    offers: ["HTP pump repair", "Air-blast sprayer repair", "Nozzle replacement"],
    description: "Spray pump and blower repair mechanic with 9 years of experience, working from a shop near Niphad market. Grape and onion farmers get same-day repair on HTP pumps and tractor-mounted sprayers.",
  },
  {
    id: 29, type: "provider", sector: "Experts & Agents",
    name: "Santosh J.",
    area: "Vani, Dindori",
    lat: 20.3306, lng: 73.8895,
    org_type: "Drip Irrigation Technician",
    offers: ["Drip line repair", "Filter cleaning", "Venturi and fertigation setup"],
    description: "Drip irrigation repair technician with 10 years of experience. Fixes clogged laterals and filters for grape and tomato farmers in Vani and Dindori.",
  },
  {
    id: 30, type: "provider", sector: "Experts & Agents",
    name: "Prakash T.",
    area: "Vadner Bhairav, Chandwad",
    lat: 20.2610, lng: 74.0960,
    org_type: "Kanda Chawl Builder",
    offers: ["Kanda chawl construction", "Ventilated storage design", "Chawl subsidy paperwork"],
    description: "Builds ventilated onion storage sheds (kanda chawl) and has 13 years of experience. Helps farmers holding 25 to 500 tonnes file for the state kanda chawl subsidy.",
  },
  {
    id: 31, type: "provider", sector: "Machinery Rental",
    name: "Vikas S.",
    area: "Sinnar",
    lat: 19.8470, lng: 74.0010,
    org_type: "Harvester Operator",
    offers: ["Combine harvester hire", "Wheat harvest", "Soybean harvest"],
    description: "Owns and operates a combine harvester, with 12 years of experience, charging per acre. Takes wheat and soybean bookings from Sinnar and Niphad farmers.",
  },
  {
    id: 32, type: "provider", sector: "Machinery Rental",
    name: "Amol K.",
    area: "Talegaon Dindori",
    lat: 20.1475, lng: 73.8195,
    org_type: "Tractor Hire Operator",
    offers: ["Rotavator hire", "Ploughing", "Onion bed making"],
    description: "Hires out a tractor with rotavator and plough at hourly rates, with 7 years of experience. Prepares onion and tomato beds for small farmers in Dindori who do not own a tractor.",
  },
  {
    id: 33, type: "provider", sector: "Experts & Agents",
    name: "Yogesh P.",
    area: "Chandwad",
    lat: 20.3300, lng: 74.2490,
    org_type: "Crop Insurance Agent",
    offers: ["PMFBY claim filing", "7/12 extract", "Crop loss intimation"],
    description: "Runs a Common Service Centre counter and has 6 years of experience filing PMFBY crop insurance claims. Helps non-loanee onion farmers report unseasonal rain loss within the 72-hour window.",
  },
];
